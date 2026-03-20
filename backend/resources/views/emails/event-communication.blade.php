<!DOCTYPE html>
<html lang="es" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>{{ $communication->subject }} - {{ $event->name }}</title>
    <style>
        /* Force color scheme support */
        :root { color-scheme: light dark; supported-color-schemes: light dark; }

        /* Email client resets */
        body, table, td { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0; mso-table-rspace: 0; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }

        .email-body p { margin: 0 0 12px; }
        .email-body h2 { font-size: 18px; font-weight: 700; color: #16191f; margin: 20px 0 8px; }
        .email-body h3 { font-size: 16px; font-weight: 600; color: #16191f; margin: 16px 0 6px; }
        .email-body ul, .email-body ol { padding-left: 20px; margin: 8px 0 12px; }
        .email-body li { margin-bottom: 4px; }
        .email-body a { color: #4da3e8; text-decoration: underline; }
        .email-body blockquote { border-left: 3px solid #d1d5db; padding-left: 14px; margin: 12px 0; color: #5f6b7a; }
        .email-body hr { border: none; border-top: 1px solid #e9ebed; margin: 16px 0; }
        .email-body strong { color: #16191f; }

        /* Responsive */
        @media only screen and (max-width: 580px) {
            .email-card { width: 100% !important; border-radius: 0 !important; }
            .email-pad { padding-left: 20px !important; padding-right: 20px !important; }
            .email-pad-inner { padding-left: 16px !important; padding-right: 16px !important; }
            .email-header-title { font-size: 19px !important; }
            .email-header-meta { font-size: 12px !important; }
            .email-outer { padding: 0 !important; }
        }

        /* ═══ Dark mode — for clients that support prefers-color-scheme ═══ */
        @media (prefers-color-scheme: dark) {
            body, .email-bg { background-color: #1a1a2e !important; }

            .email-card { background-color: #232340 !important; }

            /* Greeting & subject text */
            .dm-heading { color: #e8edf2 !important; }
            .dm-subtext { color: #9ba7b6 !important; }

            /* Subject banner */
            .dm-banner { background-color: #2a2a4a !important; }
            .dm-banner-label { color: #7d8998 !important; }
            .dm-banner-title { color: #e8edf2 !important; }

            /* Body content */
            .dm-body-text { color: #c5cdd8 !important; }

            /* Divider */
            .dm-divider { border-top-color: #3a3a5a !important; }

            /* Sender info */
            .dm-avatar-bg { background-color: #2a2a4a !important; }
            .dm-sender-name { color: #e8edf2 !important; }
            .dm-sender-role { color: #7d8998 !important; }

            /* Footer */
            .dm-footer { color: #5f6b7a !important; }
            .dm-footer-sub { color: #4a5568 !important; }

            /* Body rich text overrides */
            .email-body h2, .email-body h3, .email-body strong { color: #e8edf2 !important; }
            .email-body blockquote { border-left-color: #4a5568 !important; color: #9ba7b6 !important; }
            .email-body hr { border-top-color: #3a3a5a !important; }
            .email-body a { color: #6db8f2 !important; }
        }
    </style>
</head>
<body class="email-bg" style="margin: 0; padding: 0; background-color: #f0f2f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table width="100%" cellpadding="0" cellspacing="0" class="email-bg" style="background-color: #f0f2f5;">
        <tr>
            <td align="center" class="email-outer" style="padding: 40px 16px;">
                {{-- Outer card --}}
                <table cellpadding="0" cellspacing="0" class="email-card" style="width: 100%; max-width: 540px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

                    {{-- ═══ HEADER — gradient (not inverted in dark mode) ═══ --}}
                    <tr>
                        <td class="email-pad" style="background: {{ $headerBgStart }}; background: -webkit-linear-gradient(135deg, {{ $headerBgStart }} 0%, {{ $headerBgEnd }} 100%); background: linear-gradient(135deg, {{ $headerBgStart }} 0%, {{ $headerBgEnd }} 100%); padding: 32px 36px 28px; text-align: center;">
                            <p style="margin: 0 0 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.55); font-weight: 700;">
                                Comunicado Oficial
                            </p>
                            <h1 class="email-header-title" style="margin: 0 0 14px; color: #ffffff; font-size: 22px; font-weight: 700; line-height: 1.3;">
                                {{ $event->name }}
                            </h1>
                            @if($event->date_start)
                            <p class="email-header-meta" style="margin: 0 0 4px; font-size: 13px; color: rgba(255,255,255,0.75);">
                                {{ $event->date_start->locale('es')->translatedFormat('l, d \\d\\e F \\d\\e Y') }}
                            </p>
                            @endif
                            @if($event->location || $event->venue)
                            <p class="email-header-meta" style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.60);">
                                {{ implode(', ', array_filter([$event->venue, $event->location])) }}
                            </p>
                            @endif
                        </td>
                    </tr>

                    {{-- ═══ GREETING + SUBJECT ═══ --}}
                    <tr>
                        <td class="email-pad" style="padding: 28px 36px 0;">
                            <p class="dm-heading" style="margin: 0 0 6px; color: #16191f; font-size: 18px; font-weight: 700;">
                                Hola {{ $participant->first_name }}!
                            </p>
                            <p class="dm-subtext" style="margin: 0 0 20px; color: #687078; font-size: 14px; line-height: 1.5;">
                                Tienes un nuevo comunicado del equipo organizador.
                            </p>
                        </td>
                    </tr>

                    {{-- ═══ SUBJECT BANNER ═══ --}}
                    <tr>
                        <td class="email-pad" style="padding: 0 36px;">
                            <table width="100%" cellpadding="0" cellspacing="0" class="dm-banner" style="background-color: #f8f9fb; border-radius: 12px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 4px 0 0; background: {{ $headerBgStart }}; border-radius: 12px 12px 0 0;"></td>
                                </tr>
                                <tr>
                                    <td class="email-pad-inner" style="padding: 18px 24px;">
                                        <p class="dm-banner-label" style="margin: 0 0 4px; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #9ba7b6; font-weight: 600;">
                                            Asunto
                                        </p>
                                        <p class="dm-banner-title" style="margin: 0; font-size: 17px; font-weight: 700; color: #16191f; line-height: 1.3;">
                                            {{ $communication->subject }}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- ═══ BODY CONTENT ═══ --}}
                    <tr>
                        <td class="email-pad" style="padding: 24px 36px 8px;">
                            <div class="dm-body-text" style="color: #414d5c; font-size: 14px; line-height: 1.75;">
                                <div class="email-body">
                                    {!! $body !!}
                                </div>
                            </div>
                        </td>
                    </tr>

                    {{-- ═══ DIVIDER ═══ --}}
                    <tr>
                        <td class="email-pad" style="padding: 8px 36px 0;">
                            <div class="dm-divider" style="border-top: 1px solid #f2f3f3;"></div>
                        </td>
                    </tr>

                    {{-- ═══ SENDER INFO ═══ --}}
                    @if($communication->sender)
                    <tr>
                        <td class="email-pad" style="padding: 18px 36px 0;">
                            <table cellpadding="0" cellspacing="0">
                                <tr>
                                    @if($communication->sender->photo_url)
                                    <td style="width: 36px; height: 36px; vertical-align: middle;">
                                        <img src="{{ $communication->sender->photo_url }}" alt="{{ $communication->sender->first_name }}" width="36" height="36" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; display: block;">
                                    </td>
                                    @else
                                    <td class="dm-avatar-bg" style="width: 36px; height: 36px; background-color: #eef1f4; border-radius: 50%; text-align: center; vertical-align: middle;">
                                        <span style="font-size: 14px; font-weight: 700; color: #4da3e8;">
                                            {{ strtoupper(substr($communication->sender->first_name, 0, 1)) }}{{ strtoupper(substr($communication->sender->last_name, 0, 1)) }}
                                        </span>
                                    </td>
                                    @endif
                                    <td style="padding-left: 12px; vertical-align: middle;">
                                        <p class="dm-sender-name" style="margin: 0 0 2px; font-size: 13px; font-weight: 600; color: #16191f;">
                                            {{ $communication->sender->first_name }} {{ $communication->sender->last_name }}
                                        </p>
                                        <p class="dm-sender-role" style="margin: 0; font-size: 12px; color: #9ba7b6;">
                                            Equipo organizador
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    @endif

                    {{-- ═══ FOOTER ═══ --}}
                    <tr>
                        <td class="email-pad" style="padding: 22px 36px 24px; text-align: center;">
                            <p class="dm-footer" style="margin: 0; color: #b8bfc7; font-size: 11px; line-height: 1.6;">
                                Generado por BuilderApp
                                <br>
                                <span class="dm-footer-sub" style="color: #d0d5db;">Este correo fue enviado automaticamente. No responda a este mensaje.</span>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
