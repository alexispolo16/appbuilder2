<?php

namespace App\Services;

use App\Models\Participant;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AttendeeAccountService
{
    /**
     * Find or create a user account for a participant.
     *
     * @return array{user: User, password: string|null} password is null when linking to existing user
     */
    public function findOrCreateUser(Participant $participant): array
    {
        $existingUser = User::where('email', $participant->email)->first();

        if ($existingUser) {
            $participant->update(['user_id' => $existingUser->id]);

            if (! $existingUser->hasRole('participant')) {
                $existingUser->assignRole('participant');
            }

            return ['user' => $existingUser, 'password' => null];
        }

        $plainPassword = Str::random(10);

        $user = User::create([
            'organization_id' => null,
            'first_name' => $participant->first_name,
            'last_name' => $participant->last_name,
            'email' => $participant->email,
            'phone' => $participant->phone,
            'password' => Hash::make($plainPassword),
            'email_verified_at' => now(),
        ]);

        $user->assignRole('participant');

        $participant->update(['user_id' => $user->id]);

        return ['user' => $user, 'password' => $plainPassword];
    }
}
