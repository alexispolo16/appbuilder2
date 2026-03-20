<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\Speaker;
use App\Models\User;

class SpeakerPolicy
{
    public function viewAny(User $user, Event $event): bool
    {
        return $user->can('speakers.view') && $this->belongsToOrg($user, $event);
    }

    public function create(User $user, Event $event): bool
    {
        return $user->can('speakers.create') && $this->belongsToOrg($user, $event);
    }

    public function update(User $user, Speaker $speaker): bool
    {
        return $user->can('speakers.update')
            && $this->belongsToOrg($user, $speaker->event);
    }

    public function delete(User $user, Speaker $speaker): bool
    {
        return $user->can('speakers.delete')
            && $this->belongsToOrg($user, $speaker->event);
    }

    private function belongsToOrg(User $user, Event $event): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->currentOrganizationId() === $event->organization_id;
    }
}
