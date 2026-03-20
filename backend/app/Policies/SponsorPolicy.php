<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\Sponsor;
use App\Models\User;

class SponsorPolicy
{
    public function viewAny(User $user, Event $event): bool
    {
        return $user->can('sponsors.view') && $this->belongsToOrg($user, $event);
    }

    public function create(User $user, Event $event): bool
    {
        return $user->can('sponsors.create') && $this->belongsToOrg($user, $event);
    }

    public function update(User $user, Sponsor $sponsor): bool
    {
        return $user->can('sponsors.update')
            && $this->belongsToOrg($user, $sponsor->event);
    }

    public function delete(User $user, Sponsor $sponsor): bool
    {
        return $user->can('sponsors.delete')
            && $this->belongsToOrg($user, $sponsor->event);
    }

    private function belongsToOrg(User $user, Event $event): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->currentOrganizationId() === $event->organization_id;
    }
}
