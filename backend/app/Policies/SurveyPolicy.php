<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\Survey;
use App\Models\User;

class SurveyPolicy
{
    public function viewAny(User $user, Event $event): bool
    {
        return $user->can('events.view') && $this->belongsToOrg($user, $event);
    }

    public function view(User $user, Survey $survey): bool
    {
        return $user->can('events.view')
            && $this->belongsToOrg($user, $survey->event);
    }

    public function create(User $user, Event $event): bool
    {
        return $user->can('events.update') && $this->belongsToOrg($user, $event);
    }

    public function update(User $user, Survey $survey): bool
    {
        return $user->can('events.update')
            && $this->belongsToOrg($user, $survey->event);
    }

    public function delete(User $user, Survey $survey): bool
    {
        return $user->can('events.update')
            && $this->belongsToOrg($user, $survey->event);
    }

    private function belongsToOrg(User $user, Event $event): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->currentOrganizationId() === $event->organization_id;
    }
}
