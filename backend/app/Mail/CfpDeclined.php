<?php

namespace App\Mail;

use App\Models\Event;
use App\Models\SpeakerApplication;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CfpDeclined extends Mailable
{
    use SerializesModels;

    public function __construct(
        public SpeakerApplication $application,
        public Event $event,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Sobre tu postulación — {$this->event->name}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.cfp-declined',
            with: [
                'application' => $this->application,
                'event' => $this->event,
                'participant' => $this->application->participant,
            ],
        );
    }
}
