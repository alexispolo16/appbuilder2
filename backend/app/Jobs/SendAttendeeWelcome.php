<?php

namespace App\Jobs;

use App\Mail\AttendeeWelcome;
use App\Models\Event;
use App\Models\Participant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendAttendeeWelcome implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(
        public Participant $participant,
        public Event $event,
        public string $plainPassword,
    ) {}

    public function handle(): void
    {
        Mail::to($this->participant->email)
            ->send(new AttendeeWelcome($this->participant, $this->event, $this->plainPassword));
    }
}
