<?php

namespace App\Http\Controllers;

use App\Jobs\SendCfpAccepted;
use App\Jobs\SendCfpChangesRequested;
use App\Jobs\SendCfpDeclined;
use App\Models\Event;
use App\Models\Speaker;
use App\Models\SpeakerApplication;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SpeakerApplicationController extends Controller
{
    public function index(Event $event): Response
    {
        $this->authorize('view', $event);

        $applications = $event->speakerApplications()
            ->with('participant')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (SpeakerApplication $app) => [
                'id' => $app->id,
                'proposed_topic' => $app->proposed_topic,
                'topic_description' => $app->topic_description,
                'bio' => $app->bio,
                'photo_url' => $app->photo_url,
                'social_links' => $app->social_links,
                'status' => $app->status,
                'reviewer_notes' => $app->reviewer_notes,
                'created_at' => $app->created_at,
                'participant' => [
                    'id' => $app->participant->id,
                    'full_name' => $app->participant->full_name,
                    'first_name' => $app->participant->first_name,
                    'last_name' => $app->participant->last_name,
                    'email' => $app->participant->email,
                    'company' => $app->participant->company,
                    'job_title' => $app->participant->job_title,
                ],
            ]);

        return Inertia::render('Events/Cfp/Index', [
            'event' => $event,
            'applications' => $applications,
        ]);
    }

    public function show(Event $event, SpeakerApplication $application): Response
    {
        $this->authorize('view', $event);

        $application->load('participant');

        return Inertia::render('Events/Cfp/Review', [
            'event' => $event,
            'application' => [
                'id' => $application->id,
                'proposed_topic' => $application->proposed_topic,
                'topic_description' => $application->topic_description,
                'bio' => $application->bio,
                'photo_url' => $application->photo_url,
                'social_links' => $application->social_links,
                'status' => $application->status,
                'reviewer_notes' => $application->reviewer_notes,
                'created_at' => $application->created_at,
                'participant' => [
                    'id' => $application->participant->id,
                    'full_name' => $application->participant->full_name,
                    'first_name' => $application->participant->first_name,
                    'last_name' => $application->participant->last_name,
                    'email' => $application->participant->email,
                    'phone' => $application->participant->phone,
                    'company' => $application->participant->company,
                    'job_title' => $application->participant->job_title,
                ],
            ],
        ]);
    }

    public function updateStatus(Request $request, Event $event, SpeakerApplication $application)
    {
        $this->authorize('update', $event);

        $validated = $request->validate([
            'status' => ['required', Rule::in(['accepted', 'changes_requested', 'declined'])],
            'reviewer_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $application->update($validated);

        if ($validated['status'] === 'accepted') {
            $this->promoteToSpeaker($event, $application);
            SendCfpAccepted::dispatch($application, $event);

            return redirect()->route('events.cfp.index', $event)
                ->with('success', 'Postulación aceptada. Se creó el perfil de speaker automáticamente.');
        }

        if ($validated['status'] === 'changes_requested') {
            SendCfpChangesRequested::dispatch($application, $event);

            return redirect()->route('events.cfp.index', $event)
                ->with('success', 'Se solicitaron cambios al postulante.');
        }

        if ($validated['status'] === 'declined') {
            SendCfpDeclined::dispatch($application, $event);

            return redirect()->route('events.cfp.index', $event)
                ->with('success', 'Postulación declinada.');
        }

        return redirect()->route('events.cfp.index', $event);
    }

    public function toggleCfp(Request $request, Event $event)
    {
        $this->authorize('update', $event);

        $settings = $event->settings ?? [];
        $settings['cfp_enabled'] = ! ($settings['cfp_enabled'] ?? false);
        $event->update(['settings' => $settings]);

        $status = $settings['cfp_enabled'] ? 'activada' : 'desactivada';

        return back()->with('success', "Convocatoria de speakers {$status}.");
    }

    private function promoteToSpeaker(Event $event, SpeakerApplication $application): void
    {
        $participant = $application->participant;

        // Update participant ticket_type to speaker
        $participant->update(['ticket_type' => 'speaker']);

        // Create speaker profile from application data
        Speaker::create([
            'event_id' => $event->id,
            'first_name' => $participant->first_name,
            'last_name' => $participant->last_name,
            'email' => $participant->email,
            'phone' => $participant->phone,
            'company' => $participant->company,
            'job_title' => $participant->job_title,
            'bio' => $application->bio,
            'photo_path' => $application->photo_path,
            'social_links' => $application->social_links,
            'status' => 'confirmed',
            'sort_order' => ($event->speakers()->max('sort_order') ?? 0) + 1,
        ]);
    }
}
