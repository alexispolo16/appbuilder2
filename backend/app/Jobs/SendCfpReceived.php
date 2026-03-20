<?php

namespace App\Jobs;

use App\Mail\CfpReceived;
use App\Models\Event;
use App\Models\SpeakerApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendCfpReceived implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(
        public SpeakerApplication $application,
        public Event $event,
    ) {}

    public function handle(): void
    {
        Mail::to($this->application->participant->email)
            ->send(new CfpReceived($this->application, $this->event));
    }
}
