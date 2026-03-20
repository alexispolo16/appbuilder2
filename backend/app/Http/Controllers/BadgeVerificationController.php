<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Participant;
use App\Models\ParticipantBadge;
use Carbon\Carbon;

class BadgeVerificationController extends Controller
{
    /**
     * Public badge verification page.
     * Uses Blade (not Inertia) so OG meta tags are server-rendered for LinkedIn crawler.
     */
    public function verify(string $token)
    {
        $pb = ParticipantBadge::where('verification_token', $token)
            ->with(['badge.event', 'participant'])
            ->first();

        if (!$pb) {
            abort(404);
        }

        $event = $pb->badge->event;

        $badge = $pb->badge;
        $isExpired = $badge->valid_until && now()->greaterThan($badge->valid_until);

        return view('public.badge-verification', [
            'badge' => $badge,
            'participant' => $pb->participant,
            'event' => $event,
            'awardedAt' => $pb->awarded_at,
            'verificationToken' => $pb->verification_token,
            'isExpired' => $isExpired,
        ]);
    }

    /**
     * Download badge as PNG image (renders a clean card and auto-captures via Canvas).
     */
    public function download(string $token)
    {
        $pb = ParticipantBadge::where('verification_token', $token)
            ->with(['badge.event', 'participant'])
            ->first();

        if (!$pb) {
            abort(404);
        }

        $event = $pb->badge->event;
        $badge = $pb->badge;
        $isExpired = $badge->valid_until && now()->greaterThan($badge->valid_until);

        return view('public.badge-download', [
            'badge' => $badge,
            'participant' => $pb->participant,
            'event' => $event,
            'awardedAt' => $pb->awarded_at,
            'verificationToken' => $pb->verification_token,
            'isExpired' => $isExpired,
        ]);
    }

    /**
     * Public participant badge portfolio - all badges earned for an event.
     */
    public function portfolio(string $slug, string $registrationCode)
    {
        $event = Event::where('slug', $slug)->firstOrFail();

        $participant = Participant::where('event_id', $event->id)
            ->where('registration_code', $registrationCode)
            ->firstOrFail();

        $badges = $participant->badges()
            ->where('badges.event_id', $event->id)
            ->get()
            ->map(fn ($b) => [
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

        return view('public.badge-portfolio', [
            'event' => $event,
            'participant' => $participant,
            'badges' => $badges,
        ]);
    }
}
