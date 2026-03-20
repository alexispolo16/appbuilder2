<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Postulación recibida - {{ $event->name }}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0f2f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f2f5; padding: 40px 16px;">
        <tr>
            <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #0972d3 0%, #0054b0 100%); padding: 36px; text-align: center;">
                            <p style="margin: 0 0 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.6); font-weight: 700;">
                                Convocatoria de Speakers
                            </p>
                            <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800;">
                                Postulación recibida
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 32px 36px;">
                            <p style="margin: 0 0 8px; color: #16191f; font-size: 18px; font-weight: 700;">
                                Hola {{ $participant->first_name }}!
                            </p>
                            <p style="margin: 0 0 20px; color: #687078; font-size: 14px; line-height: 1.6;">
                                Hemos recibido tu postulación como speaker para <strong>{{ $event->name }}</strong>.
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td style="background: #f8f9fa; border-radius: 12px; padding: 16px 20px;">
                                        <p style="margin: 0 0 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #9ba7b6; font-weight: 600;">
                                            Tema propuesto
                                        </p>
                                        <p style="margin: 0; color: #16191f; font-size: 15px; font-weight: 600;">
                                            {{ $application->proposed_topic }}
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 8px; color: #687078; font-size: 14px; line-height: 1.6;">
                                Nuestro equipo revisará tu propuesta y te notificaremos el resultado por correo electrónico.
                            </p>
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
