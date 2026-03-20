<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\Participant;
use App\Models\User;

class ParticipantPolicy
{
    public function viewAny(User $user, Event $event): bool
    {
        return $user->can('participants.view') && $this->belongsToOrg($user, $event);
    }

    public function view(User $user, Participant $participant): bool
    {
        return $user->can('participants.view')
            && $this->belongsToOrg($user, $participant->event);
    }

    public function create(User $user, Event $event): bool
    {
        return $user->can('participants.create') && $this->belongsToOrg($user, $event);
    }

    public function update(User $user, Participant $participant): bool
    {
        return $user->can('participants.update')
            && $this->belongsToOrg($user, $participant->event);
    }

    public function delete(User $user, Participant $participant): bool
    {
        return $user->can('participants.update')
            && $this->belongsToOrg($user, $participant->event);
    }

    public function checkIn(User $user, Participant $participant): bool
    {
        return $user->can('participants.checkin')
            && $this->belongsToOrg($user, $participant->event);
    }

    private function belongsToOrg(User $user, Event $event): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->currentOrganizationId() === $event->organization_id;
    }
}
