<?php

namespace App\Http\Controllers;

use App\Http\Requests\PublicRegisterParticipantRequest;
use App\Jobs\SendAttendeeWelcome;
use App\Jobs\SendRegistrationConfirmation;
use App\Mail\WaitlistConfirmation;
use App\Models\Event;
use App\Models\Participant;
use App\Services\AttendeeAccountService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class PublicEventController extends Controller
{
    public function show(Request $request, string $slug): Response
    {
        $event = Event::findBySlugPublic($slug);

        if (! $event) {
            throw new NotFoundHttpException;
        }

        $isPublic = $event->status === 'active';
        $canPreview = $request->hasValidSignature()
            || (auth()->check() && auth()->user()->can('update', $event));

        if (! $isPublic && ! $canPreview) {
            throw new NotFoundHttpException;
        }

        // Only show preview banner when the event is NOT publicly visible
        $isPreview = ! $isPublic && $canPreview;

        $event->load([
            'speakers' => fn ($q) => $q->where('status', 'confirmed')->orderBy('sort_order'),
            'sponsors' => fn ($q) => $q->whereIn('status', ['confirmed', 'paid'])
                ->with('sponsorLevel')
                ->orderBy('sort_order'),
            'agendaItems' => fn ($q) => $q->with('speakers')->orderBy('date')->orderBy('start_time'),
            'sponsorLevels' => fn ($q) => $q->orderBy('sort_order'),
            'communities' => fn ($q) => $q->orderBy('sort_order'),
        ]);

        return Inertia::render('Public/EventShow', [
            'event' => [
                'name' => $event->name,
                'slug' => $event->slug,
                'description' => $event->description,
                'date_start' => $event->date_start,
                'date_end' => $event->date_end,
                'location' => $event->location,
                'venue' => $event->venue,
                'capacity' => $event->capacity,
                'registration_type' => $event->registration_type,
                'status' => $event->status,
                'cover_image_url' => $event->cover_image_url,
                'event_image_url' => $event->event_image_url,
                'latitude' => $event->latitude,
                'longitude' => $event->longitude,
            ],
            'registeredCount' => $event->registeredCount(),
            'speakers' => $event->speakers->map(fn ($s) => [
                'id' => $s->id,
                'first_name' => $s->first_name,
                'last_name' => $s->last_name,
                'full_name' => $s->full_name,
                'company' => $s->company,
                'job_title' => $s->job_title,
                'bio' => $s->bio,
                'photo_url' => $s->photo_url,
                'social_links' => $s->social_links,
            ]),
            'sponsors' => $event->sponsors->map(fn ($sp) => [
                'id' => $sp->id,
                'company_name' => $sp->company_name,
                'logo_url' => $sp->logo_url,
                'website' => $sp->website,
                'description' => $sp->description,
                'sponsor_level' => $sp->sponsorLevel ? [
                    'id' => $sp->sponsorLevel->id,
                    'name' => $sp->sponsorLevel->name,
                    'sort_order' => $sp->sponsorLevel->sort_order,
                ] : null,
            ]),
            'agendaItems' => $event->agendaItems->map(fn ($item) => [
                'id' => $item->id,
                'title' => $item->title,
                'description' => $item->description,
                'date' => $item->date,
                'start_time' => $item->start_time,
                'end_time' => $item->end_time,
                'location_detail' => $item->location_detail,
                'type' => $item->type,
                'speakers' => $item->speakers->map(fn ($s) => [
                    'full_name' => $s->full_name,
                ])->values(),
            ]),
            'sponsorLevels' => $event->sponsorLevels->map(fn ($level) => [
                'id' => $level->id,
                'name' => $level->name,
                'sort_order' => $level->sort_order,
            ]),
            'communities' => $event->communities->map(fn ($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'url' => $c->url,
                'logo_url' => $c->logo_url,
                'description' => $c->description,
            ]),
            'isPreview' => $isPreview,
            'cfpEnabled' => (bool) ($event->settings['cfp_enabled'] ?? false),
        ]);
    }

    public function showRegistrationForm(string $slug): Response
    {
        $event = $this->findPublicOpenEvent($slug);

        $user = auth()->user();
        $authUser = null;
        $alreadyRegistered = null;

        if ($user) {
            $existing = Participant::where('event_id', $event->id)
                ->where('email', $user->email)
                ->first();

            if ($existing) {
                $alreadyRegistered = [
                    'registration_code' => $existing->registration_code,
                    'status' => $existing->status,
                ];
            }

            $authUser = [
                'first_name' => $user->first_name ?? '',
                'last_name' => $user->last_name ?? '',
                'email' => $user->email ?? '',
                'phone' => $user->phone ?? '',
            ];
        }

        return Inertia::render('Public/EventRegister', [
            'event' => [
                'name' => $event->name,
                'slug' => $event->slug,
                'description' => $event->description,
                'date_start' => $event->date_start,
                'date_end' => $event->date_end,
                'location' => $event->location,
                'venue' => $event->venue,
                'cover_image_url' => $event->cover_image_url,
                'capacity' => $event->capacity,
            ],
            'spotsLeft' => $event->spotsLeft(),
            'registeredCount' => $event->registeredCount(),
            'authUser' => $authUser,
            'alreadyRegistered' => $alreadyRegistered,
        ]);
    }

    public function register(PublicRegisterParticipantRequest $request, string $slug): RedirectResponse
    {
        $event = $this->findPublicOpenEvent($slug);

        // Check for existing registration with same email
        $existing = Participant::where('event_id', $event->id)
            ->where('email', $request->email)
            ->first();

        if ($existing) {
            if ($existing->status === 'waitlisted') {
                return redirect()->route('public.event.waitlisted', [
                    'slug' => $event->slug,
                    'registration_code' => $existing->registration_code,
                ]);
            }

            return redirect()->route('public.event.registered', [
                'slug' => $event->slug,
                'registration_code' => $existing->registration_code,
            ]);
        }

        // If event is full, add to waitlist
        $isWaitlisted = $event->isFull();

        $participant = Participant::create([
            'event_id' => $event->id,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'company' => $request->company,
            'job_title' => $request->job_title,
            'country' => $request->country,
            'city' => $request->city,
            'ticket_type' => 'general',
            'status' => $isWaitlisted ? 'waitlisted' : 'confirmed',
        ]);

        // Create or link user account for the attendee portal
        $accountService = app(AttendeeAccountService::class);
        $result = $accountService->findOrCreateUser($participant);

        if ($result['password']) {
            SendAttendeeWelcome::dispatch($participant, $event, $result['password']);
        }

        if ($isWaitlisted) {
            Mail::to($participant->email)->send(new WaitlistConfirmation($participant, $event));

            return redirect()->route('public.event.waitlisted', [
                'slug' => $event->slug,
                'registration_code' => $participant->registration_code,
            ]);
        }

        SendRegistrationConfirmation::dispatch($participant, $event);

        return redirect()->route('public.event.registered', [
            'slug' => $event->slug,
            'registration_code' => $participant->registration_code,
        ]);
    }

    public function registrationSuccess(string $slug, string $registrationCode): Response
    {
        $event = Event::findBySlugPublic($slug);

        if (! $event || $event->status !== 'active') {
            throw new NotFoundHttpException;
        }

        $participant = Participant::where('event_id', $event->id)
            ->where('registration_code', $registrationCode)
            ->firstOrFail();

        $networkingUrl = route('public.networking', [
            'slug' => $event->slug,
            'registration_code' => $participant->registration_code,
        ]);

        return Inertia::render('Public/EventRegistrationSuccess', [
            'event' => [
                'name' => $event->name,
                'slug' => $event->slug,
                'date_start' => $event->date_start,
                'date_end' => $event->date_end,
                'location' => $event->location,
                'venue' => $event->venue,
            ],
            'participant' => [
                'first_name' => $participant->first_name,
                'full_name' => $participant->full_name,
                'email' => $participant->email,
                'registration_code' => $participant->registration_code,
            ],
            'networkingUrl' => $networkingUrl,
            'credentialDesign' => $event->settings['credential_design'] ?? null,
            'sponsors' => $event->sponsors()
                ->whereNotNull('logo_path')
                ->whereIn('status', ['confirmed', 'paid'])
                ->orderBy('sort_order')
                ->get()
                ->map(fn ($s) => ['company_name' => $s->company_name, 'logo_url' => $s->logo_url])
                ->values(),
        ]);
    }

    public function waitlistSuccess(string $slug, string $registrationCode): Response
    {
        $event = Event::findBySlugPublic($slug);

        if (! $event || $event->status !== 'active') {
            throw new NotFoundHttpException;
        }

        $participant = Participant::where('event_id', $event->id)
            ->where('registration_code', $registrationCode)
            ->where('status', 'waitlisted')
            ->firstOrFail();

        $position = Participant::where('event_id', $event->id)
            ->where('status', 'waitlisted')
            ->where('created_at', '<=', $participant->created_at)
            ->count();

        return Inertia::render('Public/EventWaitlist', [
            'event' => [
                'name' => $event->name,
                'slug' => $event->slug,
                'date_start' => $event->date_start,
                'date_end' => $event->date_end,
                'location' => $event->location,
                'venue' => $event->venue,
            ],
            'participant' => [
                'first_name' => $participant->first_name,
                'full_name' => $participant->full_name,
                'email' => $participant->email,
                'registration_code' => $participant->registration_code,
            ],
            'position' => $position,
        ]);
    }


    private function findPublicOpenEvent(string $slug): Event
    {
        $event = Event::findBySlugPublic($slug);

        if (! $event || $event->status !== 'active') {
            throw new NotFoundHttpException;
        }

        if ($event->registration_type !== 'open') {
            throw new NotFoundHttpException;
        }

        return $event;
    }
}
