<?php

namespace App\Mail;

use App\Models\Event;
use App\Models\Participant;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AttendeeWelcome extends Mailable
{
    use SerializesModels;

    public function __construct(
        public Participant $participant,
        public Event $event,
        public string $plainPassword,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Tu acceso al portal — {$this->event->name}",
        );
    }

    public function content(): Content
    {
        $loginUrl = url('/login');

        return new Content(
            view: 'emails.attendee-welcome',
            with: [
                'event' => $this->event,
                'participant' => $this->participant,
                'plainPassword' => $this->plainPassword,
                'loginUrl' => $loginUrl,
            ],
        );
    }
}
