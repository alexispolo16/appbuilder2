<?php

namespace App\Mail;

use App\Models\Communication;
use App\Models\Event;
use App\Models\Participant;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EventCommunication extends Mailable
{
    use SerializesModels;

    public function __construct(
        public Communication $communication,
        public Event $event,
        public Participant $participant,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "{$this->communication->subject} — {$this->event->name}",
        );
    }

    public function content(): Content
    {
        $this->communication->loadMissing('sender:id,first_name,last_name,photo_path');

        $credentialDesign = $this->event->settings['credential_design'] ?? [];
        $headerBgStart = $credentialDesign['header_bg_start'] ?? '#0972d3';
        $headerBgEnd = $credentialDesign['header_bg_end'] ?? '#033160';

        return new Content(
            view: 'emails.event-communication',
            with: [
                'communication' => $this->communication,
                'event' => $this->event,
                'participant' => $this->participant,
                'body' => $this->communication->body,
                'headerBgStart' => $headerBgStart,
                'headerBgEnd' => $headerBgEnd,
            ],
        );
    }
}
