<?php

namespace App\Jobs;

use App\Mail\AdminNewRegistration;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendAdminNewRegistration implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(
        public User $registeredUser,
    ) {}

    public function handle(): void
    {
        $superAdmins = User::role('super_admin')->get();

        foreach ($superAdmins as $admin) {
            Mail::to($admin->email)
                ->send(new AdminNewRegistration($this->registeredUser));
        }
    }
}
