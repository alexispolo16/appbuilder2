<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>Restablecer contrasena - BuilderApp</title>
    <style>
        :root { color-scheme: light dark; supported-color-schemes: light dark; }
        body, table, td { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0; mso-table-rspace: 0; }

        @media only screen and (max-width: 520px) {
            .email-card { width: 100% !important; border-radius: 0 !important; }
            .email-pad { padding-left: 20px !important; padding-right: 20px !important; }
            .email-outer { padding: 0 !important; }
            .email-header-title { font-size: 19px !important; }
        }

        @media (prefers-color-scheme: dark) {
            body, .email-bg { background-color: #1a1a2e !important; }
            .email-card { background-color: #232340 !important; }
            .dm-heading { color: #e8edf2 !important; }
            .dm-subtext { color: #9ba7b6 !important; }
            .dm-card-bg { background-color: #2a2a4a !important; border-color: #3a3a5a !important; }
            .dm-card-title { color: #e8edf2 !important; }
            .dm-card-desc { color: #9ba7b6 !important; }
            .dm-note { color: #7d8998 !important; }
            .dm-link { color: #6db8f2 !important; }
            .dm-divider { border-top-color: #3a3a5a !important; }
            .dm-footer { color: #5f6b7a !important; }
            .dm-footer-sub { color: #4a5568 !important; }
            .dm-fallback-label { color: #7d8998 !important; }
        }
    </style>
</head>
<body class="email-bg" style="margin: 0; padding: 0; background-color: #f0f2f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table width="100%" cellpadding="0" cellspacing="0" class="email-bg" style="background-color: #f0f2f5;">
        <tr>
            <td align="center" class="email-outer" style="padding: 40px 16px;">
                <table cellpadding="0" cellspacing="0" class="email-card" style="width: 100%; max-width: 480px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

                    {{-- ═══ HEADER ═══ --}}
                    <tr>
                        <td class="email-pad" style="background: #0972d3; background: linear-gradient(135deg, #0972d3 0%, #033160 100%); padding: 32px 36px 28px; text-align: center;">
                            <p style="margin: 0 0 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.55); font-weight: 700;">
                                BuilderApp
                            </p>
                            <h1 class="email-header-title" style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; line-height: 1.3;">
                                Restablecer contrasena
                            </h1>
                        </td>
                    </tr>

                    {{-- ═══ GREETING ═══ --}}
                    <tr>
                        <td class="email-pad" style="padding: 32px 36px 0;">
                            <p class="dm-heading" style="margin: 0 0 6px; color: #16191f; font-size: 18px; font-weight: 700;">
                                Hola {{ $user->first_name }}!
                            </p>
                            <p class="dm-subtext" style="margin: 0 0 24px; color: #687078; font-size: 14px; line-height: 1.6;">
                                Recibimos una solicitud para restablecer la contrasena de tu cuenta. Haz clic en el boton de abajo para crear una nueva contrasena.
                            </p>
                        </td>
                    </tr>

                    {{-- ═══ ICON CARD ═══ --}}
                    <tr>
                        <td class="email-pad" style="padding: 0 36px 24px; text-align: center;">
                            <table width="100%" cellpadding="0" cellspacing="0" class="dm-card-bg" style="background-color: #f8f9fb; border-radius: 14px; border: 1px solid #e9ebed;">
                                <tr>
                                    <td style="padding: 28px 24px; text-align: center;">
                                        <div style="width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #0972d3 0%, #065fad 100%); display: inline-block; line-height: 56px; text-align: center; margin-bottom: 14px;">
                                            <span style="font-size: 26px; color: #ffffff;">&#128274;</span>
                                        </div>
                                        <p class="dm-card-title" style="margin: 0 0 4px; font-size: 15px; font-weight: 700; color: #16191f;">
                                            Cambio de contrasena
                                        </p>
                                        <p class="dm-card-desc" style="margin: 0; font-size: 13px; color: #687078; line-height: 1.5;">
                                            Este enlace expirara en 60 minutos por seguridad.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- ═══ CTA ═══ --}}
                    <tr>
                        <td class="email-pad" style="padding: 0 36px 24px; text-align: center;">
                            <a href="{{ $url }}" style="display: inline-block; background: #0972d3; background: linear-gradient(135deg, #0972d3, #065fad); color: #ffffff; text-decoration: none; padding: 14px 44px; border-radius: 12px; font-size: 15px; font-weight: 600;">
                                Restablecer contrasena
                            </a>
                        </td>
                    </tr>

                    {{-- ═══ FALLBACK URL ═══ --}}
                    <tr>
                        <td class="email-pad" style="padding: 0 36px 28px;">
                            <p class="dm-fallback-label" style="margin: 0 0 8px; font-size: 12px; color: #9ba7b6; line-height: 1.5;">
                                Si el boton no funciona, copia y pega este enlace en tu navegador:
                            </p>
                            <p style="margin: 0; font-size: 11px; color: #0972d3; word-break: break-all; line-height: 1.5;">
                                <a class="dm-link" href="{{ $url }}" style="color: #0972d3; text-decoration: none;">{{ $url }}</a>
                            </p>
                        </td>
                    </tr>

                    {{-- ═══ NOTE ═══ --}}
                    <tr>
                        <td class="email-pad" style="padding: 0 36px 24px;">
                            <p class="dm-note" style="margin: 0; font-size: 13px; color: #687078; line-height: 1.5;">
                                Si no solicitaste restablecer tu contrasena, puedes ignorar este correo. Tu contrasena no sera modificada.
                            </p>
                        </td>
                    </tr>

                    {{-- ═══ FOOTER ═══ --}}
                    <tr>
                        <td class="email-pad dm-divider" style="padding: 18px 36px 22px; border-top: 1px solid #f2f3f3; text-align: center;">
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
