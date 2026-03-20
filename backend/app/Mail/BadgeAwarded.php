<?php

namespace App\Mail;

use App\Models\Badge;
use App\Models\Event;
use App\Models\Participant;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BadgeAwarded extends Mailable
{
    use SerializesModels;

    public function __construct(
        public Participant $participant,
        public Badge $badge,
        public Event $event,
        public string $verificationToken,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Obtuviste una insignia — {$this->badge->name}",
        );
    }

    public function content(): Content
    {
        $verifyUrl = url("/badge/{$this->verificationToken}");
        $portfolioUrl = url("/e/{$this->event->slug}/badges/{$this->participant->registration_code}");
        $downloadUrl = url("/badge/{$this->verificationToken}/download");
        $linkedInUrl = "https://www.linkedin.com/sharing/share-offsite/?url=" . urlencode($verifyUrl);

        return new Content(
            view: 'emails.badge-awarded',
            with: [
                'participant' => $this->participant,
                'badge' => $this->badge,
                'event' => $this->event,
                'verifyUrl' => $verifyUrl,
                'portfolioUrl' => $portfolioUrl,
                'downloadUrl' => $downloadUrl,
                'linkedInUrl' => $linkedInUrl,
            ],
        );
    }
}
