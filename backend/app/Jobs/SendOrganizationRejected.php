<?php

namespace App\Jobs;

use App\Mail\OrganizationRejected;
use App\Models\Organization;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendOrganizationRejected implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(
        public Organization $organization,
    ) {}

    public function handle(): void
    {
        $users = $this->organization->users()->get();

        foreach ($users as $user) {
            Mail::to($user->email)
                ->send(new OrganizationRejected($this->organization));
        }
    }
}
