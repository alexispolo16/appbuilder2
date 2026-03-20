<?php

namespace App\Jobs;

use App\Mail\BadgeAwarded;
use App\Models\Badge;
use App\Models\Event;
use App\Models\Participant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendBadgeAwarded implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(
        public Participant $participant,
        public Badge $badge,
        public Event $event,
        public string $verificationToken,
    ) {}

    public function handle(): void
    {
        Mail::to($this->participant->email)
            ->send(new BadgeAwarded(
                $this->participant,
                $this->badge,
                $this->event,
                $this->verificationToken,
            ));
    }
}
