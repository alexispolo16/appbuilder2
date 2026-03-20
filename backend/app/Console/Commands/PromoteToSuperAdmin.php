<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class PromoteToSuperAdmin extends Command
{
    protected $signature = 'user:promote-super-admin {email}';

    protected $description = 'Promote a user to super_admin role';

    public function handle(): int
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();

        if (! $user) {
            $this->error("User with email '{$email}' not found.");

            return self::FAILURE;
        }

        if ($user->hasRole('super_admin')) {
            $this->info("{$user->first_name} {$user->last_name} already has the super_admin role.");

            return self::SUCCESS;
        }

        $user->update(['organization_id' => null]);
        $user->syncRoles(['super_admin']);

        $this->info("User {$user->first_name} {$user->last_name} ({$email}) has been promoted to super_admin.");

        return self::SUCCESS;
    }
}
