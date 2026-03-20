<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cambios solicitados - {{ $event->name }}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0f2f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f2f5; padding: 40px 16px;">
        <tr>
            <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #f9a825 0%, #e08600 100%); padding: 36px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800;">
                                Cambios sugeridos
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 32px 36px;">
                            <p style="margin: 0 0 8px; color: #16191f; font-size: 18px; font-weight: 700;">
                                Hola {{ $participant->first_name }}!
                            </p>
                            <p style="margin: 0 0 20px; color: #687078; font-size: 14px; line-height: 1.6;">
                                El equipo organizador de <strong>{{ $event->name }}</strong> ha revisado tu postulación y te sugiere algunos cambios.
                            </p>

                            @if($application->reviewer_notes)
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                    <tr>
                                        <td style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px 20px;">
                                            <p style="margin: 0 0 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #92400e; font-weight: 600;">
                                                Comentarios del organizador
                                            </p>
                                            <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.6;">
                                                {{ $application->reviewer_notes }}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            @endif

                            <p style="margin: 0 0 20px; color: #687078; font-size: 14px; line-height: 1.6;">
                                Puedes actualizar tu postulación haciendo clic en el boton de abajo.
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <a href="{{ $cfpUrl }}" style="display: inline-block; background: #f9a825; color: #ffffff; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 10px; text-decoration: none;">
                                            Actualizar mi postulación
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
