<?php

namespace App\Http\Controllers;

use App\Jobs\SendCfpReceived;
use App\Models\Event;
use App\Models\Participant;
use App\Models\SpeakerApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class PublicCfpController extends Controller
{
    public function show(string $slug): Response
    {
        $event = $this->findCfpEvent($slug);

        $user = auth()->user();
        $participant = null;
        $existingApplication = null;

        if ($user) {
            $participant = Participant::where('event_id', $event->id)
                ->where('email', $user->email)
                ->first();

            if ($participant) {
                $existing = SpeakerApplication::where('event_id', $event->id)
                    ->where('participant_id', $participant->id)
                    ->first();

                if ($existing) {
                    $existingApplication = [
                        'id' => $existing->id,
                        'proposed_topic' => $existing->proposed_topic,
                        'topic_description' => $existing->topic_description,
                        'bio' => $existing->bio,
                        'photo_url' => $existing->photo_url,
                        'social_links' => $existing->social_links,
                        'status' => $existing->status,
                        'reviewer_notes' => $existing->reviewer_notes,
                        'created_at' => $existing->created_at,
                    ];
                }
            }
        }

        return Inertia::render('Public/CfpApply', [
            'event' => [
                'name' => $event->name,
                'slug' => $event->slug,
                'description' => $event->description,
                'date_start' => $event->date_start,
                'date_end' => $event->date_end,
                'location' => $event->location,
                'venue' => $event->venue,
                'cover_image_url' => $event->cover_image_url,
            ],
            'participant' => $participant ? [
                'id' => $participant->id,
                'first_name' => $participant->first_name,
                'last_name' => $participant->last_name,
                'email' => $participant->email,
                'company' => $participant->company,
                'job_title' => $participant->job_title,
                'social_links' => $participant->social_links,
            ] : null,
            'existingApplication' => $existingApplication,
        ]);
    }

    public function store(Request $request, string $slug): RedirectResponse
    {
        $event = $this->findCfpEvent($slug);

        $user = auth()->user();
        if (! $user) {
            return redirect()->route('login')
                ->with('error', 'Debes iniciar sesión para postularte como speaker.');
        }

        $participant = Participant::where('event_id', $event->id)
            ->where('email', $user->email)
            ->first();

        if (! $participant) {
            return redirect()->route('public.event.register', $slug)
                ->with('error', 'Primero debes registrarte en el evento para postularte como speaker.');
        }

        // Check if already has an application
        $existing = SpeakerApplication::where('event_id', $event->id)
            ->where('participant_id', $participant->id)
            ->first();

        if ($existing && $existing->status !== 'changes_requested') {
            return back()->with('error', 'Ya tienes una postulación para este evento.');
        }

        // Photo is required for new applications, optional for updates (already have one)
        $photoRequired = ! $existing || ! $existing->photo_path;

        $validated = $request->validate([
            'proposed_topic' => ['required', 'string', 'max:255'],
            'topic_description' => ['nullable', 'string', 'max:5000'],
            'bio' => ['required', 'string', 'max:3000'],
            'photo' => [$photoRequired ? 'required' : 'nullable', 'image', 'max:2048'],
            'social_links' => ['nullable', 'array'],
            'social_links.twitter' => ['nullable', 'string', 'max:255'],
            'social_links.linkedin' => ['nullable', 'string', 'max:255'],
            'social_links.instagram' => ['nullable', 'string', 'max:255'],
            'social_links.github' => ['nullable', 'string', 'max:255'],
            'social_links.website' => ['nullable', 'string', 'max:255'],
        ]);

        $photoPath = $existing->photo_path ?? null;
        if ($request->hasFile('photo')) {
            if ($photoPath) {
                Storage::disk('public')->delete($photoPath);
            }
            $photoPath = $request->file('photo')->store(
                "events/{$event->id}/cfp",
                'public'
            );
        }

        $data = [
            'event_id' => $event->id,
            'participant_id' => $participant->id,
            'proposed_topic' => $validated['proposed_topic'],
            'topic_description' => $validated['topic_description'] ?? null,
            'bio' => $validated['bio'],
            'photo_path' => $photoPath,
            'social_links' => $validated['social_links'] ?? null,
            'status' => 'pending',
        ];

        if ($existing) {
            $existing->update($data);
            $application = $existing;
        } else {
            $application = SpeakerApplication::create($data);
        }

        SendCfpReceived::dispatch($application, $event);

        return redirect()->route('public.cfp', $slug)
            ->with('success', 'Tu postulación ha sido enviada correctamente. Te notificaremos por correo sobre el resultado.');
    }

    private function findCfpEvent(string $slug): Event
    {
        $event = Event::findBySlugPublic($slug);

        if (! $event || $event->status !== 'active') {
            throw new NotFoundHttpException;
        }

        $cfpEnabled = $event->settings['cfp_enabled'] ?? false;
        if (! $cfpEnabled) {
            throw new NotFoundHttpException;
        }

        return $event;
    }
}
