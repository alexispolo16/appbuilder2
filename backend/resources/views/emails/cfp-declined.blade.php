<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sobre tu postulación - {{ $event->name }}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0f2f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f2f5; padding: 40px 16px;">
        <tr>
            <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #5f6b7a 0%, #414d5c 100%); padding: 36px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800;">
                                Sobre tu postulación
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 32px 36px;">
                            <p style="margin: 0 0 8px; color: #16191f; font-size: 18px; font-weight: 700;">
                                Hola {{ $participant->first_name }},
                            </p>
                            <p style="margin: 0 0 20px; color: #687078; font-size: 14px; line-height: 1.6;">
                                Gracias por tu interes en participar como speaker en <strong>{{ $event->name }}</strong>. Despues de revisar las postulaciones, lamentablemente no hemos podido aceptar tu propuesta en esta ocasión.
                            </p>

                            @if($application->reviewer_notes)
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                    <tr>
                                        <td style="background: #f8f9fa; border-radius: 12px; padding: 16px 20px;">
                                            <p style="margin: 0 0 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #9ba7b6; font-weight: 600;">
                                                Comentarios
                                            </p>
                                            <p style="margin: 0; color: #5f6b7a; font-size: 14px; line-height: 1.6;">
                                                {{ $application->reviewer_notes }}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            @endif

                            <p style="margin: 0; color: #687078; font-size: 14px; line-height: 1.6;">
                                Te invitamos a seguir participando como asistente y a postularte en futuros eventos. Gracias por tu comprensión!
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
