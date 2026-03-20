<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Postulación aceptada - {{ $event->name }}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0f2f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f2f5; padding: 40px 16px;">
        <tr>
            <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #1e8e3e 0%, #137333 100%); padding: 36px; text-align: center;">
                            <p style="margin: 0 0 12px; font-size: 48px; line-height: 1;">🎉</p>
                            <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800;">
                                Felicidades! Fuiste aceptado/a
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 32px 36px;">
                            <p style="margin: 0 0 8px; color: #16191f; font-size: 18px; font-weight: 700;">
                                Hola {{ $participant->first_name }}!
                            </p>
                            <p style="margin: 0 0 20px; color: #687078; font-size: 14px; line-height: 1.6;">
                                Tu postulación como speaker para <strong>{{ $event->name }}</strong> ha sido <strong style="color: #1e8e3e;">aceptada</strong>.
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td style="background: #e6f4ea; border-radius: 12px; padding: 16px 20px;">
                                        <p style="margin: 0 0 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #137333; font-weight: 600;">
                                            Tu charla
                                        </p>
                                        <p style="margin: 0; color: #0d652d; font-size: 15px; font-weight: 600;">
                                            {{ $application->proposed_topic }}
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 20px; color: #687078; font-size: 14px; line-height: 1.6;">
                                Tu perfil de speaker ya fue creado automaticamente. El equipo organizador se pondra en contacto contigo para coordinar los detalles de tu participación.
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <a href="{{ url('/e/' . $event->slug) }}" style="display: inline-block; background: #1e8e3e; color: #ffffff; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 10px; text-decoration: none;">
                                            Ver el evento
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 36px; border-top: 1px solid #e9ebed; text-align: center;">
                            <p style="margin: 0; color: #9ba7b6; font-size: 12px;">
                                {{ config('app.name', 'BuilderApp') }} — {{ $event->name }}
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
