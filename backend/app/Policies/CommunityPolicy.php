<?php

namespace App\Policies;

use App\Models\Community;
use App\Models\Event;
use App\Models\User;

class CommunityPolicy
{
    public function viewAny(User $user, Event $event): bool
    {
        return $user->can('communities.view') && $this->belongsToOrg($user, $event);
    }

    public function create(User $user, Event $event): bool
    {
        return $user->can('communities.create') && $this->belongsToOrg($user, $event);
    }

    public function update(User $user, Community $community): bool
    {
        return $user->can('communities.update')
            && $this->belongsToOrg($user, $community->event);
    }

    public function delete(User $user, Community $community): bool
    {
        return $user->can('communities.delete')
            && $this->belongsToOrg($user, $community->event);
    }

    private function belongsToOrg(User $user, Event $event): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->currentOrganizationId() === $event->organization_id;
    }
}
