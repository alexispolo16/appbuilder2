<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Actualizacion sobre tu solicitud</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0f2f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f2f5; padding: 40px 16px;">
        <tr>
            <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #d91515 0%, #a11010 100%); padding: 32px 36px 28px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700;">Solicitud no aprobada</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 32px 36px;">
                            <p style="margin: 0 0 16px; color: #16191f; font-size: 16px; font-weight: 700;">
                                {{ $organization->name }}
                            </p>
                            <p style="margin: 0 0 16px; color: #687078; font-size: 14px; line-height: 1.6;">
                                Lamentamos informarte que tu solicitud de registro no ha sido aprobada en esta ocasion.
                            </p>
                            @if($organization->rejection_reason)
                            <div style="background-color: #fef7f0; border-left: 4px solid #d91515; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 16px;">
                                <p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; color: #9ba7b6; font-weight: 600;">Motivo</p>
                                <p style="margin: 0; font-size: 14px; color: #414d5c;">{{ $organization->rejection_reason }}</p>
                            </div>
                            @endif
                            <p style="margin: 0; color: #687078; font-size: 14px; line-height: 1.6;">
                                Si crees que esto es un error, puedes contactarnos para revisar tu solicitud.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 18px 36px 22px; border-top: 1px solid #f2f3f3; text-align: center;">
                            <p style="margin: 0; color: #b8bfc7; font-size: 11px;">Generado por BuilderApp</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
