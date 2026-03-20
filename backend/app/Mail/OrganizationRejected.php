<?php

namespace App\Mail;

use App\Models\Organization;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrganizationRejected extends Mailable
{
    use SerializesModels;

    public function __construct(
        public Organization $organization,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Actualizacion sobre tu solicitud — {$this->organization->name}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.organization-rejected',
            with: [
                'organization' => $this->organization,
            ],
        );
    }
}
