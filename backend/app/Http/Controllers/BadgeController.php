<?php

namespace App\Http\Controllers;

use App\Models\Badge;
use App\Models\Event;
use App\Models\Participant;
use App\Models\ParticipantBadge;
use App\Services\BadgeAwardService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BadgeController extends Controller
{
    public function index(Event $event): Response
    {
        $this->authorize('view', $event);

        $badges = $event->badges()
            ->withCount('participantBadges')
            ->orderBy('sort_order')
            ->get();

        $totalParticipants = $event->participants()
            ->where('status', '!=', 'cancelled')
            ->count();

        return Inertia::render('Events/Badges/Index', [
            'event' => $event,
            'badges' => $badges->map(fn (Badge $b) => [
                'id' => $b->id,
                'name' => $b->name,
                'description' => $b->description,
                'skills' => $b->skills,
                'icon' => $b->icon,
                'image_url' => $b->image_url,
                'color' => $b->color,
                'type' => $b->type,
                'auto_rule' => $b->auto_rule,
                'is_active' => $b->is_active,
                'sort_order' => $b->sort_order,
                'valid_until' => $b->valid_until?->format('Y-m-d'),
                'awarded_count' => $b->participant_badges_count,
            ]),
            'totalParticipants' => $totalParticipants,
        ]);
    }

    public function create(Event $event): Response
    {
        $this->authorize('view', $event);

        return Inertia::render('Events/Badges/Create', [
            'event' => $event,
        ]);
    }

    public function store(Request $request, Event $event): RedirectResponse
    {
        $this->authorize('view', $event);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'skills' => ['nullable', 'string', 'max:1000'],
            'icon' => ['nullable', 'string', 'max:10'],
            'image' => ['nullable', 'image', 'max:2048'],
            'color' => ['nullable', 'string', 'max:7'],
            'type' => ['required', 'in:manual,automatic'],
            'auto_rule' => ['nullable', 'array'],
            'auto_rule.type' => ['required_if:type,automatic', 'string', 'nullable', 'in:session_attendance,event_checkin,survey_completion'],
            'auto_rule.min_sessions' => ['required_if:auto_rule.type,session_attendance', 'integer', 'min:1', 'nullable'],
            'auto_rule.min_surveys' => ['required_if:auto_rule.type,survey_completion', 'integer', 'min:1', 'nullable'],
            'valid_until' => ['nullable', 'date'],
        ]);

        $validated['event_id'] = $event->id;
        $validated['sort_order'] = $event->badges()->count();

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store("badges/{$event->id}", 'public');
        }
        unset($validated['image']);

        Badge::create($validated);

        return redirect()->route('events.badges.index', $event)
            ->with('success', 'Insignia creada correctamente.');
    }

    public function edit(Event $event, Badge $badge): Response
    {
        $this->authorize('view', $event);

        $participants = $badge->participants()
            ->get()
            ->map(fn (Participant $p) => [
                'id' => $p->id,
                'full_name' => $p->full_name,
                'email' => $p->email,
                'company' => $p->company,
                'awarded_at' => $p->pivot->awarded_at,
                'verification_token' => $p->pivot->verification_token,
            ]);

        return Inertia::render('Events/Badges/Edit', [
            'event' => $event,
            'badge' => [
                'id' => $badge->id,
                'name' => $badge->name,
                'description' => $badge->description,
                'skills' => $badge->skills,
                'icon' => $badge->icon,
                'image_url' => $badge->image_url,
                'color' => $badge->color,
                'type' => $badge->type,
                'auto_rule' => $badge->auto_rule,
                'is_active' => $badge->is_active,
                'valid_until' => $badge->valid_until?->format('Y-m-d'),
            ],
            'awardedParticipants' => $participants,
        ]);
    }

    public function update(Request $request, Event $event, Badge $badge): RedirectResponse
    {
        $this->authorize('view', $event);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'skills' => ['nullable', 'string', 'max:1000'],
            'icon' => ['nullable', 'string', 'max:10'],
            'image' => ['nullable', 'image', 'max:2048'],
            'remove_image' => ['nullable', 'boolean'],
            'color' => ['nullable', 'string', 'max:7'],
            'type' => ['required', 'in:manual,automatic'],
            'auto_rule' => ['nullable', 'array'],
            'auto_rule.type' => ['required_if:type,automatic', 'string', 'nullable', 'in:session_attendance,event_checkin,survey_completion'],
            'auto_rule.min_sessions' => ['required_if:auto_rule.type,session_attendance', 'integer', 'min:1', 'nullable'],
            'auto_rule.min_surveys' => ['required_if:auto_rule.type,survey_completion', 'integer', 'min:1', 'nullable'],
            'valid_until' => ['nullable', 'date'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if ($request->hasFile('image')) {
            if ($badge->image_path) {
                Storage::disk('public')->delete($badge->image_path);
            }
            $validated['image_path'] = $request->file('image')->store("badges/{$event->id}", 'public');
        } elseif ($request->boolean('remove_image') && $badge->image_path) {
            Storage::disk('public')->delete($badge->image_path);
            $validated['image_path'] = null;
        }
        unset($validated['image'], $validated['remove_image']);

        $badge->update($validated);

        return redirect()->route('events.badges.edit', [$event, $badge])
            ->with('success', 'Insignia actualizada correctamente.');
    }

    public function destroy(Event $event, Badge $badge): RedirectResponse
    {
        $this->authorize('view', $event);

        if ($badge->image_path) {
            Storage::disk('public')->delete($badge->image_path);
        }

        $badge->delete();

        return redirect()->route('events.badges.index', $event)
            ->with('success', 'Insignia eliminada correctamente.');
    }

    public function award(Request $request, Event $event, Badge $badge): RedirectResponse
    {
        $this->authorize('view', $event);

        $validated = $request->validate([
            'participant_ids' => ['required', 'array', 'min:1'],
            'participant_ids.*' => ['required', 'string'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $service = new BadgeAwardService();

        $awarded = 0;
        foreach ($validated['participant_ids'] as $participantId) {
            $participant = Participant::where('event_id', $event->id)
                ->where('id', $participantId)
                ->first();

            if ($participant) {
                $pb = $service->awardManually($badge, $participant, $request->user());
                if ($pb && !empty($validated['notes'])) {
                    $pb->update(['notes' => $validated['notes']]);
                }
                if ($pb) {
                    $awarded++;
                }
            }
        }

        return back()->with('success', "Insignia asignada a {$awarded} participante(s).");
    }

    public function revoke(Request $request, Event $event, Badge $badge): RedirectResponse
    {
        $this->authorize('view', $event);

        $validated = $request->validate([
            'participant_id' => ['required', 'string'],
        ]);

        $participant = Participant::where('event_id', $event->id)
            ->where('id', $validated['participant_id'])
            ->firstOrFail();

        $service = new BadgeAwardService();
        $service->revoke($badge, $participant);

        return back()->with('success', 'Insignia revocada correctamente.');
    }

    public function participants(Event $event, Badge $badge)
    {
        $this->authorize('view', $event);

        $available = $event->participants()
            ->where('status', '!=', 'cancelled')
            ->whereDoesntHave('participantBadges', fn ($q) => $q->where('badge_id', $badge->id))
            ->get()
            ->map(fn (Participant $p) => [
                'id' => $p->id,
                'full_name' => $p->full_name,
                'email' => $p->email,
                'company' => $p->company,
            ]);

        return response()->json(['participants' => $available]);
    }

    public function analytics(Event $event): Response
    {
        $this->authorize('view', $event);

        $badges = $event->badges()
            ->withCount('participantBadges')
            ->orderBy('sort_order')
            ->get();

        $totalParticipants = $event->participants()
            ->where('status', '!=', 'cancelled')
            ->count();

        $totalAwarded = ParticipantBadge::whereIn('badge_id', $badges->pluck('id'))->count();

        $uniqueRecipients = ParticipantBadge::whereIn('badge_id', $badges->pluck('id'))
            ->distinct('participant_id')
            ->count('participant_id');

        // Badges awarded per day (last 30 days)
        $dailyTrend = ParticipantBadge::whereIn('badge_id', $badges->pluck('id'))
            ->where('awarded_at', '>=', now()->subDays(30))
            ->selectRaw("DATE(awarded_at) as date, COUNT(*) as count")
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => ['date' => $row->date, 'count' => $row->count]);

        // Per-badge stats
        $badgeStats = $badges->map(fn (Badge $b) => [
            'id' => $b->id,
            'name' => $b->name,
            'icon' => $b->icon,
            'image_url' => $b->image_url,
            'color' => $b->color,
            'type' => $b->type,
            'skills' => $b->skills,
            'awarded_count' => $b->participant_badges_count,
            'rate' => $totalParticipants > 0
                ? round(($b->participant_badges_count / $totalParticipants) * 100, 1)
                : 0,
        ]);

        // Top earners (participants with most badges)
        $topEarners = ParticipantBadge::whereIn('badge_id', $badges->pluck('id'))
            ->select('participant_id', DB::raw('COUNT(*) as badge_count'))
            ->groupBy('participant_id')
            ->orderByDesc('badge_count')
            ->limit(10)
            ->with('participant')
            ->get()
            ->map(fn ($row) => [
                'full_name' => $row->participant->full_name,
                'email' => $row->participant->email,
                'company' => $row->participant->company,
                'badge_count' => $row->badge_count,
            ]);

        // Skill frequency
        $skillFrequency = [];
        foreach ($badges as $b) {
            if ($b->skills) {
                foreach (explode(',', $b->skills) as $skill) {
                    $s = trim($skill);
                    if ($s) {
                        $skillFrequency[$s] = ($skillFrequency[$s] ?? 0) + $b->participant_badges_count;
                    }
                }
            }
        }
        arsort($skillFrequency);
        $topSkills = collect($skillFrequency)->take(15)->map(fn ($count, $name) => [
            'name' => $name,
            'count' => $count,
        ])->values();

        return Inertia::render('Events/Badges/Analytics', [
            'event' => $event,
            'summary' => [
                'total_badges' => $badges->count(),
                'total_awarded' => $totalAwarded,
                'unique_recipients' => $uniqueRecipients,
                'total_participants' => $totalParticipants,
                'earning_rate' => $totalParticipants > 0
                    ? round(($uniqueRecipients / $totalParticipants) * 100, 1)
                    : 0,
            ],
            'badgeStats' => $badgeStats,
            'dailyTrend' => $dailyTrend,
            'topEarners' => $topEarners,
            'topSkills' => $topSkills,
        ]);
    }
}
