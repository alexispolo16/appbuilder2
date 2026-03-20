<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tu acceso al portal - {{ $event->name }}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0f2f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f2f5; padding: 40px 16px;">
        <tr>
            <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

                    {{-- HEADER --}}
                    <tr>
                        <td style="background: #0972d3; background: linear-gradient(135deg, #0972d3 0%, #033160 100%); padding: 32px 36px 28px; text-align: center;">
                            <p style="margin: 0 0 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.55); font-weight: 700;">
                                Portal del Asistente
                            </p>
                            <h1 style="margin: 0 0 14px; color: #ffffff; font-size: 22px; font-weight: 700; line-height: 1.3;">
                                {{ $event->name }}
                            </h1>
                            @if($event->date_start)
                            <p style="margin: 0 0 4px; font-size: 13px; color: rgba(255,255,255,0.75);">
                                {{ $event->date_start->translatedFormat('l, d \\d\\e F \\d\\e Y · H:i') }}
                            </p>
                            @endif
                        </td>
                    </tr>

                    {{-- BODY --}}
                    <tr>
                        <td style="padding: 32px 36px 0;">
                            <p style="margin: 0 0 6px; color: #16191f; font-size: 18px; font-weight: 700;">
                                Hola {{ $participant->first_name }}!
                            </p>
                            <p style="margin: 0 0 24px; color: #687078; font-size: 14px; line-height: 1.6;">
                                Se ha creado tu cuenta para acceder al <strong>Portal del Asistente</strong>, donde podras ver tu entrada digital, hacer networking y conectar con otros participantes.
                            </p>
                        </td>
                    </tr>

                    {{-- CREDENTIALS BOX --}}
                    <tr>
                        <td style="padding: 0 36px 24px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fb; border-radius: 14px; border: 1px solid #e9ebed;">
                                <tr>
                                    <td style="padding: 24px 24px 8px; text-align: center;">
                                        <p style="margin: 0 0 4px; font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px; color: #9ba7b6; font-weight: 600;">
                                            Tus credenciales de acceso
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 24px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 0 0 12px;">
                                                    <p style="margin: 0 0 3px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: #9ba7b6; font-weight: 600;">Correo electronico</p>
                                                    <p style="margin: 0; font-size: 15px; color: #16191f; font-weight: 600;">{{ $participant->email }}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 0 0 12px;">
                                                    <p style="margin: 0 0 3px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: #9ba7b6; font-weight: 600;">Contrasena</p>
                                                    <p style="margin: 0; font-size: 18px; color: #0972d3; font-weight: 700; letter-spacing: 2px; font-family: 'SF Mono', 'Fira Code', Consolas, monospace;">{{ $plainPassword }}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- FEATURES --}}
                    <tr>
                        <td style="padding: 0 36px 24px;">
                            <p style="margin: 0 0 14px; font-size: 14px; font-weight: 700; color: #16191f;">Que puedes hacer en el portal?</p>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding: 0 0 10px;">
                                        <table cellpadding="0" cellspacing="0"><tr>
                                            <td style="width: 26px; height: 26px; background-color: #eef1f4; border-radius: 50%; text-align: center; vertical-align: middle; font-size: 12px; font-weight: 700; color: #0972d3;">1</td>
                                            <td style="padding-left: 10px; font-size: 14px; color: #414d5c;"><strong>Entrada digital</strong> — Accede a tu ticket con QR</td>
                                        </tr></table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 0 0 10px;">
                                        <table cellpadding="0" cellspacing="0"><tr>
                                            <td style="width: 26px; height: 26px; background-color: #eef1f4; border-radius: 50%; text-align: center; vertical-align: middle; font-size: 12px; font-weight: 700; color: #0972d3;">2</td>
                                            <td style="padding-left: 10px; font-size: 14px; color: #414d5c;"><strong>Networking</strong> — Conecta con otros asistentes</td>
                                        </tr></table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 0;">
                                        <table cellpadding="0" cellspacing="0"><tr>
                                            <td style="width: 26px; height: 26px; background-color: #eef1f4; border-radius: 50%; text-align: center; vertical-align: middle; font-size: 12px; font-weight: 700; color: #0972d3;">3</td>
                                            <td style="padding-left: 10px; font-size: 14px; color: #414d5c;"><strong>Contactos</strong> — Guarda y gestiona tus conexiones</td>
                                        </tr></table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- CTA --}}
                    <tr>
                        <td style="padding: 0 36px 28px; text-align: center;">
                            <a href="{{ $loginUrl }}" style="display: inline-block; background: #0972d3; background: linear-gradient(135deg, #0972d3, #065fad); color: #ffffff; text-decoration: none; padding: 14px 44px; border-radius: 12px; font-size: 15px; font-weight: 600;">
                                Acceder al Portal
                            </a>
                        </td>
                    </tr>

                    {{-- FOOTER --}}
                    <tr>
                        <td style="padding: 18px 36px 22px; border-top: 1px solid #f2f3f3; text-align: center;">
                            <p style="margin: 0; color: #b8bfc7; font-size: 11px; line-height: 1.6;">
                                Generado por BuilderApp
                                <br>
                                <span style="color: #d0d5db;">Este correo fue enviado automaticamente. No responda a este mensaje.</span>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
