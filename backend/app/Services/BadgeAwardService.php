<?php

namespace App\Services;

use App\Jobs\SendBadgeAwarded;
use App\Models\Badge;
use App\Models\Event;
use App\Models\Participant;
use App\Models\ParticipantBadge;
use App\Models\SessionAttendance;
use App\Models\SurveyResponse;
use App\Models\User;

class BadgeAwardService
{
    /**
     * Check and award all automatic badges for a participant in an event.
     * Called after recording session attendance.
     *
     * @return array<Badge> Newly awarded badges
     */
    public function checkAndAwardAutoBadges(Participant $participant, Event $event): array
    {
        $autoBadges = $event->badges()
            ->where('type', 'automatic')
            ->where('is_active', true)
            ->get();

        $awarded = [];

        foreach ($autoBadges as $badge) {
            if ($this->evaluateRule($badge, $participant, $event)) {
                $pb = $this->award($badge, $participant);
                if ($pb) {
                    $awarded[] = $badge;
                }
            }
        }

        return $awarded;
    }

    /**
     * Award a badge manually to a participant.
     */
    public function awardManually(Badge $badge, Participant $participant, ?User $awardedBy = null): ?ParticipantBadge
    {
        return $this->award($badge, $participant, $awardedBy);
    }

    /**
     * Revoke a badge from a participant.
     */
    public function revoke(Badge $badge, Participant $participant): bool
    {
        return ParticipantBadge::where('badge_id', $badge->id)
            ->where('participant_id', $participant->id)
            ->delete() > 0;
    }

    /**
     * Award a badge if not already awarded.
     */
    private function award(Badge $badge, Participant $participant, ?User $awardedBy = null): ?ParticipantBadge
    {
        $exists = ParticipantBadge::where('badge_id', $badge->id)
            ->where('participant_id', $participant->id)
            ->exists();

        if ($exists) {
            return null;
        }

        $pb = ParticipantBadge::create([
            'participant_id' => $participant->id,
            'badge_id' => $badge->id,
            'awarded_by' => $awardedBy?->id,
        ]);

        if ($participant->email) {
            $event = $badge->event;
            SendBadgeAwarded::dispatch($participant, $badge, $event, $pb->verification_token);
        }

        return $pb;
    }

    /**
     * Evaluate an automatic badge's rule against a participant.
     */
    private function evaluateRule(Badge $badge, Participant $participant, Event $event): bool
    {
        $rule = $badge->auto_rule;

        if (!$rule || !isset($rule['type'])) {
            return false;
        }

        return match ($rule['type']) {
            'session_attendance' => $this->evaluateSessionAttendanceRule($rule, $participant, $event),
            'event_checkin' => $this->evaluateEventCheckinRule($participant),
            'survey_completion' => $this->evaluateSurveyCompletionRule($rule, $participant, $event),
            default => false,
        };
    }

    /**
     * Rule: participant must have attended >= min_sessions sessions.
     */
    private function evaluateSessionAttendanceRule(array $rule, Participant $participant, Event $event): bool
    {
        $minSessions = $rule['min_sessions'] ?? 1;

        $count = SessionAttendance::where('participant_id', $participant->id)
            ->where('event_id', $event->id)
            ->count();

        return $count >= $minSessions;
    }

    /**
     * Rule: participant must have checked in to the event (status = attended or checked_in_at not null).
     */
    private function evaluateEventCheckinRule(Participant $participant): bool
    {
        return $participant->checked_in_at !== null || $participant->status === 'attended';
    }

    /**
     * Rule: participant must have completed at least min_surveys surveys for the event.
     */
    private function evaluateSurveyCompletionRule(array $rule, Participant $participant, Event $event): bool
    {
        $minSurveys = $rule['min_surveys'] ?? 1;

        $count = SurveyResponse::where('participant_id', $participant->id)
            ->whereHas('survey', fn ($q) => $q->where('event_id', $event->id))
            ->distinct('survey_id')
            ->count('survey_id');

        return $count >= $minSurveys;
    }
}
