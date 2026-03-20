<?php

namespace App\Mail;

use App\Models\Event;
use App\Models\SpeakerApplication;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CfpChangesRequested extends Mailable
{
    use SerializesModels;

    public function __construct(
        public SpeakerApplication $application,
        public Event $event,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Cambios solicitados en tu postulación — {$this->event->name}",
        );
    }

    public function content(): Content
    {
        $cfpUrl = url("/e/{$this->event->slug}/cfp");

        return new Content(
            view: 'emails.cfp-changes-requested',
            with: [
                'application' => $this->application,
                'event' => $this->event,
                'participant' => $this->application->participant,
                'cfpUrl' => $cfpUrl,
            ],
        );
    }
}
