<?php

namespace App\Http\Controllers;

use App\Jobs\SendEventCommunication;
use App\Models\Communication;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommunicationController extends Controller
{
    public function index(Request $request, Event $event): Response
    {
        $this->authorize('view', $event);

        $communications = $event->communications()
            ->with('sender:id,first_name,last_name')
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Events/Communications/Index', [
            'event' => $event,
            'communications' => $communications,
        ]);
    }

    public function create(Event $event): Response
    {
        $this->authorize('update', $event);

        $recipientsCount = $event->participants()
            ->whereIn('status', ['registered', 'confirmed', 'attended'])
            ->count();

        return Inertia::render('Events/Communications/Create', [
            'event' => $event,
            'recipientsCount' => $recipientsCount,
        ]);
    }

    public function store(Request $request, Event $event)
    {
        $this->authorize('update', $event);

        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'body' => 'required|string|max:10000',
        ]);

        $cleanBody = strip_tags(
            $validated['body'],
            '<p><br><strong><em><s><h2><h3><ul><ol><li><a><hr><blockquote>'
        );

        $recipientsCount = $event->participants()
            ->whereIn('status', ['registered', 'confirmed', 'attended'])
            ->count();

        if ($recipientsCount === 0) {
            return back()->withErrors(['recipients' => 'No hay participantes activos a quienes enviar la comunicacion.']);
        }

        $communication = $event->communications()->create([
            'organization_id' => $event->organization_id,
            'sent_by' => $request->user()->id,
            'subject' => $validated['subject'],
            'body' => $cleanBody,
            'recipients_count' => $recipientsCount,
            'status' => 'draft',
        ]);

        SendEventCommunication::dispatch($communication, $event);

        return redirect()->route('events.communications.index', $event)
            ->with('success', "Comunicacion enviada a {$recipientsCount} participantes.");
    }

    public function show(Event $event, Communication $communication): Response
    {
        $this->authorize('view', $event);

        $communication->load('sender:id,first_name,last_name');

        return Inertia::render('Events/Communications/Show', [
            'event' => $event,
            'communication' => $communication,
        ]);
    }

    public function destroy(Event $event, Communication $communication)
    {
        $this->authorize('update', $event);

        $communication->delete();

        return redirect()->route('events.communications.index', $event)
            ->with('success', 'Comunicacion eliminada.');
    }
}
