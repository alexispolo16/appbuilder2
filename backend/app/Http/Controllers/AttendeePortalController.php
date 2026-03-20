<?php

namespace App\Http\Controllers;

use App\Models\AgendaItem;
use App\Models\Communication;
use App\Models\Event;
use App\Models\Participant;
use App\Models\ParticipantConnection;
use App\Models\SessionFeedback;
use App\Models\Survey;
use App\Models\SurveyResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AttendeePortalController extends Controller
{
    public function profile(): Response
    {
        $user = auth()->user();

        $participants = $user->participants()
            ->with(['event' => fn ($q) => $q->withoutGlobalScopes()])
            ->whereHas('event', fn ($q) => $q->withoutGlobalScopes())
            ->get();

        $eventPins = $participants->map(function (Participant $p) {
            $contacts = $p->savedContacts()
                ->where('status', ParticipantConnection::STATUS_ACCEPTED)
                ->with('connectedParticipant')
                ->get()
                ->map(fn ($conn) => [
                    'id' => $conn->connectedParticipant->id,
                    'full_name' => $conn->connectedParticipant->full_name,
                    'email' => $conn->connectedParticipant->email,
                    'company' => $conn->connectedParticipant->company,
                    'job_title' => $conn->connectedParticipant->job_title,
                    'social_links' => $conn->connectedParticipant->social_links ?? [],
                ])->values();

            return [
                'event_id' => $p->event->id,
                'event_name' => $p->event->name,
                'event_slug' => $p->event->slug,
                'registration_code' => $p->registration_code,
                'networking_pin' => $p->networking_pin,
                'networking_visible' => $p->networking_visible,
                'social_links' => $p->social_links ?? [],
                'contacts' => $contacts,
            ];
        })->values();

        return Inertia::render('Portal/Profile', [
            'profile' => [
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
            ],
            'eventPins' => $eventPins,
        ]);
    }

    public function updateProfileData(Request $request): \Illuminate\Http\RedirectResponse
    {
        $user = auth()->user();

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
        ]);

        $user->update($validated);

        return back()->with('success', 'Perfil actualizado correctamente.');
    }

    public function updatePassword(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()],
        ]);

        auth()->user()->update([
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Contrasena actualizada correctamente.');
    }

    public function dashboard(): Response
    {
        $participants = auth()->user()->participants()
            ->with(['event' => fn ($q) => $q->withoutGlobalScopes()])
            ->whereHas('event', fn ($q) => $q->withoutGlobalScopes())
            ->get();

        $events = $participants->map(fn (Participant $p) => [
            'id' => $p->event->id,
            'name' => $p->event->name,
            'slug' => $p->event->slug,
            'date_start' => $p->event->date_start,
            'date_end' => $p->event->date_end,
            'location' => $p->event->location,
            'venue' => $p->event->venue,
            'cover_image_url' => $p->event->cover_image_url,
            'status' => $p->event->status,
            'is_past' => in_array($p->event->status, ['completed', 'cancelled']),
            'participant_status' => $p->status,
            'registration_code' => $p->registration_code,
            'ticket_type' => $p->ticket_type,
        ])->values();

        return Inertia::render('Portal/Dashboard', [
            'events' => $events,
        ]);
    }

    public function ticket(string $eventId): Response
    {
        [$event, $participant] = $this->resolveEventAndParticipant($eventId);

        return Inertia::render('Portal/Ticket', [
            'event' => [
                'id' => $event->id,
                'name' => $event->name,
                'slug' => $event->slug,
                'date_start' => $event->date_start,
                'date_end' => $event->date_end,
                'location' => $event->location,
                'venue' => $event->venue,
                'cover_image_url' => $event->cover_image_url,
            ],
            'participant' => [
                'first_name' => $participant->first_name,
                'full_name' => $participant->full_name,
                'email' => $participant->email,
                'company' => $participant->company,
                'job_title' => $participant->job_title,
                'ticket_type' => $participant->ticket_type,
                'registration_code' => $participant->registration_code,
                'status' => $participant->status,
            ],
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

    public function agenda(string $eventId): Response
    {
        [$event] = $this->resolveEventAndParticipant($eventId);

        $event->load([
            'agendaItems' => fn ($q) => $q->with('speakers')->orderBy('date')->orderBy('start_time'),
        ]);

        return Inertia::render('Portal/Agenda', [
            'event' => [
                'id' => $event->id,
                'name' => $event->name,
                'slug' => $event->slug,
            ],
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
                    'photo_url' => $s->photo_url,
                ])->values(),
            ]),
        ]);
    }

    public function speakers(string $eventId): Response
    {
        [$event] = $this->resolveEventAndParticipant($eventId);

        $event->load([
            'speakers' => fn ($q) => $q->where('status', 'confirmed')->orderBy('sort_order'),
        ]);

        return Inertia::render('Portal/Speakers', [
            'event' => [
                'id' => $event->id,
                'name' => $event->name,
                'slug' => $event->slug,
            ],
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
        ]);
    }

    public function sponsors(string $eventId): Response
    {
        [$event] = $this->resolveEventAndParticipant($eventId);

        $event->load([
            'sponsors' => fn ($q) => $q->whereIn('status', ['confirmed', 'paid'])
                ->with('sponsorLevel')
                ->orderBy('sort_order'),
            'sponsorLevels' => fn ($q) => $q->orderBy('sort_order'),
        ]);

        return Inertia::render('Portal/Sponsors', [
            'event' => [
                'id' => $event->id,
                'name' => $event->name,
                'slug' => $event->slug,
            ],
            'sponsors' => $event->sponsors->map(fn ($sp) => [
                'id' => $sp->id,
                'company_name' => $sp->company_name,
                'logo_url' => $sp->logo_url,
                'website' => $sp->website,
                'description' => $sp->description,
                'sponsor_level' => $sp->sponsorLevel ? [
                    'id' => $sp->sponsorLevel->id,
                    'name' => $sp->sponsorLevel->name,
                ] : null,
            ]),
            'sponsorLevels' => $event->sponsorLevels->map(fn ($l) => [
                'id' => $l->id,
                'name' => $l->name,
            ]),
        ]);
    }

    public function networking(string $eventId): Response
    {
        [$event, $participant] = $this->resolveEventAndParticipant($eventId);

        $savedContactIds = $participant->savedContacts()->pluck('connected_participant_id')->toArray();

        return Inertia::render('Portal/Networking', [
            'event' => [
                'id' => $event->id,
                'name' => $event->name,
                'slug' => $event->slug,
            ],
            'participant' => [
                'first_name' => $participant->first_name,
                'full_name' => $participant->full_name,
                'registration_code' => $participant->registration_code,
                'networking_pin' => $participant->networking_pin,
                'social_links' => $participant->social_links ?? [],
                'networking_visible' => $participant->networking_visible,
                'photo_url' => $participant->photo_url,
            ],
            'savedContactIds' => $savedContactIds,
        ]);
    }

    public function directory(string $eventId): Response
    {
        [$event, $participant] = $this->resolveEventAndParticipant($eventId);

        $search = request()->query('search');

        $query = Participant::where('event_id', $event->id)
            ->networkingVisible()
            ->whereIn('status', ['confirmed', 'attended'])
            ->whereNull('deleted_at')
            ->where('id', '!=', $participant->id);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%");
            });
        }

        $participants = $query->orderBy('first_name')
            ->paginate(20)
            ->withQueryString();

        $savedContactIds = $participant->savedContacts()->pluck('connected_participant_id')->toArray();

        return Inertia::render('Portal/Directory', [
            'event' => [
                'id' => $event->id,
                'name' => $event->name,
                'slug' => $event->slug,
            ],
            'participants' => $participants->through(fn ($p) => [
                'id' => $p->id,
                'full_name' => $p->full_name,
                'first_name' => $p->first_name,
                'company' => $p->company,
                'job_title' => $p->job_title,
                'registration_code' => $p->registration_code,
            ]),
            'savedContactIds' => $savedContactIds,
            'search' => $search ?? '',
        ]);
    }

    public function contacts(string $eventId): Response
    {
        [$event, $participant] = $this->resolveEventAndParticipant($eventId);

        $connections = $participant->savedContacts()
            ->with('connectedParticipant')
            ->get();

        $contacts = $connections->map(fn ($conn) => [
            'id' => $conn->connectedParticipant->id,
            'full_name' => $conn->connectedParticipant->full_name,
            'first_name' => $conn->connectedParticipant->first_name,
            'email' => $conn->connectedParticipant->email,
            'company' => $conn->connectedParticipant->company,
            'job_title' => $conn->connectedParticipant->job_title,
            'social_links' => $conn->connectedParticipant->social_links ?? [],
            'registration_code' => $conn->connectedParticipant->registration_code,
            'saved_at' => $conn->created_at->toISOString(),
            'status' => $conn->status,
        ])->values();

        $incomingRequests = ParticipantConnection::where('connected_participant_id', $participant->id)
            ->where('status', ParticipantConnection::STATUS_PENDING)
            ->with('participant')
            ->get()
            ->map(fn ($conn) => [
                'id' => $conn->participant->id,
                'full_name' => $conn->participant->full_name,
                'first_name' => $conn->participant->first_name,
                'company' => $conn->participant->company,
                'job_title' => $conn->participant->job_title,
                'registration_code' => $conn->participant->registration_code,
                'requested_at' => $conn->created_at->toISOString(),
            ])->values();

        return Inertia::render('Portal/Contacts', [
            'event' => [
                'id' => $event->id,
                'name' => $event->name,
                'slug' => $event->slug,
            ],
            'contacts' => $contacts,
            'requests' => $incomingRequests,
            'participant' => [
                'first_name' => $participant->first_name,
                'full_name' => $participant->full_name,
            ],
        ]);
    }

    public function surveys(string $eventId): Response
    {
        [$event, $participant] = $this->resolveEventAndParticipant($eventId);

        $surveys = $event->surveys()
            ->withoutGlobalScopes()
            ->where('status', 'active')
            ->withCount('questions')
            ->get();

        $respondedSurveyIds = SurveyResponse::whereIn('survey_id', $surveys->pluck('id'))
            ->where('participant_id', $participant->id)
            ->pluck('survey_id')
            ->unique()
            ->toArray();

        return Inertia::render('Portal/Surveys', [
            'event' => [
                'id' => $event->id,
                'name' => $event->name,
                'slug' => $event->slug,
            ],
            'surveys' => $surveys->map(fn ($s) => [
                'id' => $s->id,
                'title' => $s->title,
                'description' => $s->description,
                'questions_count' => $s->questions_count,
                'responded' => in_array($s->id, $respondedSurveyIds),
            ]),
            'registrationCode' => $participant->registration_code,
        ]);
    }

    public function badges(string $eventId): Response
    {
        [$event, $participant] = $this->resolveEventAndParticipant($eventId);

        $badges = $participant->badges()
            ->where('badges.event_id', $event->id)
            ->get()
            ->map(fn ($b) => [
                'id' => $b->id,
                'name' => $b->name,
                'description' => $b->description,
                'skills' => $b->skills,
                'icon' => $b->icon,
                'image_url' => $b->image_url,
                'color' => $b->color,
                'awarded_at' => $b->pivot->awarded_at,
                'verification_token' => $b->pivot->verification_token,
                'valid_until' => $b->valid_until?->format('Y-m-d'),
            ]);

        $sessionAttendanceCount = \App\Models\SessionAttendance::where('participant_id', $participant->id)
            ->where('event_id', $event->id)
            ->count();

        $totalSessions = $event->agendaItems()->count();

        return Inertia::render('Portal/Badges', [
            'event' => [
                'id' => $event->id,
                'name' => $event->name,
                'slug' => $event->slug,
            ],
            'badges' => $badges,
            'attendanceStats' => [
                'sessions_attended' => $sessionAttendanceCount,
                'total_sessions' => $totalSessions,
            ],
        ]);
    }

    public function announcements(string $eventId): Response
    {
        [$event] = $this->resolveEventAndParticipant($eventId);

        $communications = Communication::where('event_id', $event->id)
            ->where('status', 'sent')
            ->orderByDesc('sent_at')
            ->get();

        return Inertia::render('Portal/Announcements', [
            'event' => [
                'id' => $event->id,
                'name' => $event->name,
                'slug' => $event->slug,
            ],
            'announcements' => $communications->map(fn ($c) => [
                'id' => $c->id,
                'subject' => $c->subject,
                'body' => $c->body,
                'sent_at' => $c->sent_at?->toISOString(),
            ]),
        ]);
    }

    public function exportContacts(string $eventId)
    {
        [$event, $participant] = $this->resolveEventAndParticipant($eventId);

        $connections = $participant->savedContacts()
            ->where('status', ParticipantConnection::STATUS_ACCEPTED)
            ->with('connectedParticipant')
            ->get();

        $csv = "Nombre,Email,Empresa,Cargo,LinkedIn,GitHub,Instagram,Website,WhatsApp\n";

        foreach ($connections as $conn) {
            $c = $conn->connectedParticipant;
            $links = $c->social_links ?? [];
            $csv .= implode(',', [
                '"' . str_replace('"', '""', $c->full_name) . '"',
                '"' . ($c->email ?? '') . '"',
                '"' . str_replace('"', '""', $c->company ?? '') . '"',
                '"' . str_replace('"', '""', $c->job_title ?? '') . '"',
                '"' . ($links['linkedin'] ?? '') . '"',
                '"' . ($links['github'] ?? '') . '"',
                '"' . ($links['instagram'] ?? '') . '"',
                '"' . ($links['website'] ?? '') . '"',
                '"' . ($links['whatsapp'] ?? '') . '"',
            ]) . "\n";
        }

        $filename = "contactos-{$event->slug}.csv";

        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    // ── Actions ──

    public function searchByCode(Request $request, string $eventId): JsonResponse
    {
        [$event, $participant] = $this->resolveEventAndParticipant($eventId);

        $request->validate(['registration_code' => ['required', 'string', 'size:8']]);

        $code = strtoupper($request->input('registration_code'));

        $found = Participant::where('event_id', $event->id)
            ->where('registration_code', $code)
            ->where('id', '!=', $participant->id)
            ->whereIn('status', ['confirmed', 'attended'])
            ->whereNull('deleted_at')
            ->first();

        if (! $found) {
            return response()->json(['found' => false]);
        }

        return response()->json([
            'found' => true,
            'participant' => [
                'id' => $found->id,
                'full_name' => $found->full_name,
            ],
        ]);
    }

    public function verifyPinAndConnect(Request $request, string $eventId): JsonResponse
    {
        [$event, $participant] = $this->resolveEventAndParticipant($eventId);

        $validated = $request->validate([
            'target_participant_id' => ['required', 'string'],
            'pin' => ['required', 'string', 'size:6'],
        ]);

        $target = Participant::where('event_id', $event->id)
            ->where('id', $validated['target_participant_id'])
            ->whereIn('status', ['confirmed', 'attended'])
            ->whereNull('deleted_at')
            ->first();

        if (! $target || $target->id === $participant->id) {
            return response()->json(['message' => 'Participante no encontrado.'], 422);
        }

        if (! $target->networking_pin || strtoupper($target->networking_pin) !== strtoupper($validated['pin'])) {
            return response()->json(['message' => 'El PIN ingresado es incorrecto.'], 422);
        }

        ParticipantConnection::updateOrCreate(
            ['participant_id' => $participant->id, 'connected_participant_id' => $target->id],
            ['status' => ParticipantConnection::STATUS_ACCEPTED]
        );

        ParticipantConnection::updateOrCreate(
            ['participant_id' => $target->id, 'connected_participant_id' => $participant->id],
            ['status' => ParticipantConnection::STATUS_ACCEPTED]
        );

        return response()->json([
            'connected' => true,
            'contact' => [
                'id' => $target->id,
                'full_name' => $target->full_name,
                'company' => $target->company,
                'job_title' => $target->job_title,
                'email' => $target->email,
                'phone' => $target->phone,
                'social_links' => $target->social_links ?? [],
                'registration_code' => $target->registration_code,
            ],
        ]);
    }

    public function updatePin(Request $request, string $eventId): JsonResponse
    {
        [$event, $participant] = $this->resolveEventAndParticipant($eventId);

        $validated = $request->validate([
            'networking_pin' => ['required', 'string', 'size:6', 'regex:/^[A-Z0-9]{6}$/'],
        ]);

        $pin = strtoupper($validated['networking_pin']);

        $exists = Participant::where('event_id', $event->id)
            ->where('networking_pin', $pin)
            ->where('id', '!=', $participant->id)
            ->whereNull('deleted_at')
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Este PIN ya esta en uso por otro participante.',
                'errors' => ['networking_pin' => ['Este PIN ya esta en uso.']],
            ], 422);
        }

        $data = ['networking_pin' => $pin];
        if (! $participant->networking_visible) {
            $data['networking_visible'] = true;
        }

        $participant->update($data);

        return response()->json([
            'networking_pin' => $participant->networking_pin,
            'networking_visible' => $participant->networking_visible,
            'message' => 'PIN actualizado correctamente.',
        ]);
    }

    public function updateProfile(Request $request, string $eventId): JsonResponse
    {
        [, $participant] = $this->resolveEventAndParticipant($eventId);

        $validated = $request->validate([
            'social_links' => ['nullable', 'array'],
            'social_links.linkedin' => ['nullable', 'string', 'max:500'],
            'social_links.github' => ['nullable', 'string', 'max:500'],
            'social_links.instagram' => ['nullable', 'string', 'max:500'],
            'social_links.website' => ['nullable', 'string', 'max:500'],
            'social_links.whatsapp' => ['nullable', 'string', 'max:500'],
            'networking_visible' => ['sometimes', 'boolean'],
        ]);

        $participant->update([
            'social_links' => $validated['social_links'] ?? [],
            'networking_visible' => $validated['networking_visible'] ?? $participant->networking_visible,
        ]);

        return response()->json([
            'message' => 'Perfil actualizado.',
            'social_links' => $participant->social_links,
            'networking_visible' => $participant->networking_visible,
        ]);
    }

    public function uploadPhoto(Request $request, string $eventId): JsonResponse
    {
        [$event, $participant] = $this->resolveEventAndParticipant($eventId);

        $request->validate([
            'photo' => ['required', 'image', 'max:2048'],
        ]);

        if ($participant->photo_path) {
            Storage::disk('public')->delete($participant->photo_path);
        }

        $path = $request->file('photo')->store(
            "events/{$event->id}/participants",
            'public'
        );

        $participant->update(['photo_path' => $path]);

        return response()->json([
            'message' => 'Foto actualizada correctamente.',
            'photo_url' => $participant->photo_url,
        ]);
    }

    public function saveContact(Request $request, string $eventId): JsonResponse
    {
        [$event, $participant] = $this->resolveEventAndParticipant($eventId);

        $validated = $request->validate(['connected_participant_id' => ['required', 'string']]);

        $target = Participant::where('event_id', $event->id)
            ->where('id', $validated['connected_participant_id'])
            ->whereNull('deleted_at')
            ->first();

        if (! $target || $target->id === $participant->id) {
            return response()->json(['message' => 'Participante no valido.'], 422);
        }

        ParticipantConnection::firstOrCreate(
            [
                'participant_id' => $participant->id,
                'connected_participant_id' => $target->id,
            ],
            ['status' => ParticipantConnection::STATUS_PENDING]
        );

        return response()->json(['saved' => true, 'status' => 'pending']);
    }

    public function acceptContact(Request $request, string $eventId): JsonResponse
    {
        [, $participant] = $this->resolveEventAndParticipant($eventId);

        $validated = $request->validate(['requester_participant_id' => ['required', 'string']]);

        $connection = ParticipantConnection::where('participant_id', $validated['requester_participant_id'])
            ->where('connected_participant_id', $participant->id)
            ->where('status', ParticipantConnection::STATUS_PENDING)
            ->first();

        if (! $connection) {
            return response()->json(['message' => 'Solicitud no encontrada.'], 404);
        }

        $connection->update(['status' => ParticipantConnection::STATUS_ACCEPTED]);

        ParticipantConnection::firstOrCreate(
            [
                'participant_id' => $participant->id,
                'connected_participant_id' => $validated['requester_participant_id'],
            ],
            ['status' => ParticipantConnection::STATUS_ACCEPTED]
        );

        return response()->json(['accepted' => true]);
    }

    public function rejectContact(Request $request, string $eventId): JsonResponse
    {
        [, $participant] = $this->resolveEventAndParticipant($eventId);

        $validated = $request->validate(['requester_participant_id' => ['required', 'string']]);

        ParticipantConnection::where('participant_id', $validated['requester_participant_id'])
            ->where('connected_participant_id', $participant->id)
            ->where('status', ParticipantConnection::STATUS_PENDING)
            ->delete();

        return response()->json(['rejected' => true]);
    }

    public function removeContact(Request $request, string $eventId): JsonResponse
    {
        [, $participant] = $this->resolveEventAndParticipant($eventId);

        $validated = $request->validate(['connected_participant_id' => ['required', 'string']]);

        ParticipantConnection::where('participant_id', $participant->id)
            ->where('connected_participant_id', $validated['connected_participant_id'])
            ->delete();

        return response()->json(['removed' => true]);
    }

    public function connectWithPin(Request $request, string $eventId): JsonResponse
    {
        [$event, $participant] = $this->resolveEventAndParticipant($eventId);

        $validated = $request->validate([
            'target_participant_id' => ['required'],
            'pin' => ['required', 'string', 'size:6'],
        ]);

        $target = Participant::where('event_id', $event->id)
            ->where('id', $validated['target_participant_id'])
            ->whereIn('status', ['confirmed', 'attended'])
            ->whereNull('deleted_at')
            ->first();

        if (! $target || $target->id === $participant->id) {
            return response()->json(['message' => 'Participante no valido.'], 422);
        }

        if (strtoupper($target->networking_pin) !== strtoupper($validated['pin'])) {
            return response()->json(['message' => 'El PIN ingresado es incorrecto.'], 422);
        }

        ParticipantConnection::updateOrCreate(
            ['participant_id' => $participant->id, 'connected_participant_id' => $target->id],
            ['status' => ParticipantConnection::STATUS_ACCEPTED]
        );

        ParticipantConnection::updateOrCreate(
            ['participant_id' => $target->id, 'connected_participant_id' => $participant->id],
            ['status' => ParticipantConnection::STATUS_ACCEPTED]
        );

        return response()->json(['connected' => true]);
    }

    public function speakerDashboard(string $eventId): Response
    {
        [$event, $participant] = $this->resolveEventAndParticipant($eventId);

        // Find agenda items linked to a speaker with the same email
        $speakerIds = $event->speakers()
            ->where('email', $participant->email)
            ->pluck('id');

        $agendaItems = AgendaItem::where('event_id', $event->id)
            ->whereHas('speakers', fn ($q) => $q->whereIn('speakers.id', $speakerIds))
            ->with('speakers')
            ->withCount('sessionAttendances')
            ->orderBy('date')
            ->orderBy('start_time')
            ->get();

        $sessions = $agendaItems->map(function ($item) {
            $feedbacks = SessionFeedback::where('agenda_item_id', $item->id)->get();
            $total = $feedbacks->count();

            return [
                'id' => $item->id,
                'title' => $item->title,
                'description' => $item->description,
                'date' => $item->date?->format('Y-m-d'),
                'start_time' => $item->start_time,
                'end_time' => $item->end_time,
                'location_detail' => $item->location_detail,
                'type' => $item->type,
                'attendance' => $item->session_attendances_count,
                'feedback' => [
                    'total' => $total,
                    'ratings' => [
                        'happy' => $feedbacks->where('rating', 'happy')->count(),
                        'neutral' => $feedbacks->where('rating', 'neutral')->count(),
                        'sad' => $feedbacks->where('rating', 'sad')->count(),
                    ],
                    'want_more' => $feedbacks->where('want_more', true)->count(),
                ],
            ];
        });

        return Inertia::render('Portal/SpeakerDashboard', [
            'event' => [
                'id' => $event->id,
                'name' => $event->name,
                'slug' => $event->slug,
            ],
            'participant' => [
                'full_name' => $participant->full_name,
                'ticket_type' => $participant->ticket_type,
            ],
            'sessions' => $sessions,
        ]);
    }

    public function downloadCertificate(string $eventId)
    {
        [$event, $participant] = $this->resolveEventAndParticipant($eventId);

        $config = $event->settings['certificate_config'] ?? [];

        if (empty($config['enabled'])) {
            abort(404, 'Los certificados no estan habilitados para este evento.');
        }

        if ($participant->status !== 'attended') {
            abort(403, 'Tu asistencia no ha sido confirmada para este evento.');
        }

        $certificateController = app(CertificateController::class);

        return $certificateController->downloadForParticipant($event, $participant);
    }

    // ── Helpers ──

    private function resolveEventAndParticipant(string $eventId): array
    {
        $event = Event::withoutGlobalScopes()->findOrFail($eventId);

        $participant = auth()->user()->participants()
            ->where('event_id', $event->id)
            ->firstOrFail();

        $certConfig = $event->settings['certificate_config'] ?? [];
        $certificateAvailable = ! empty($certConfig['enabled']) && $participant->status === 'attended';

        Inertia::share('portalMeta', [
            'ticket_type' => $participant->ticket_type,
            'certificate_available' => $certificateAvailable,
        ]);

        return [$event, $participant];
    }
}
