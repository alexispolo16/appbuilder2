<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminNewRegistration extends Mailable
{
    use SerializesModels;

    public function __construct(
        public User $registeredUser,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Nueva solicitud de organizacion — {$this->registeredUser->organization->name}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.admin-new-registration',
            with: [
                'registeredUser' => $this->registeredUser,
                'organization' => $this->registeredUser->organization,
                'adminUrl' => url('/admin/organizations'),
            ],
        );
    }
}
