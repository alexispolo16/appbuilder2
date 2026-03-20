<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Organizacion aprobada</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0f2f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f2f5; padding: 40px 16px;">
        <tr>
            <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #037f0c 0%, #025a08 100%); padding: 32px 36px 28px; text-align: center;">
                            <p style="margin: 0 0 10px; font-size: 36px;">&#10003;</p>
                            <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700;">Solicitud aprobada!</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 32px 36px;">
                            <p style="margin: 0 0 16px; color: #16191f; font-size: 16px; font-weight: 700;">
                                {{ $organization->name }}
                            </p>
                            <p style="margin: 0 0 24px; color: #687078; font-size: 14px; line-height: 1.6;">
                                Tu organizacion ha sido aprobada por el equipo de BuilderApp. Ya puedes acceder a la plataforma y comenzar a crear y gestionar tus eventos.
                            </p>
                            <div style="text-align: center; padding: 16px 0;">
                                <a href="{{ $loginUrl }}" style="display: inline-block; background: #037f0c; color: #ffffff; text-decoration: none; padding: 14px 44px; border-radius: 12px; font-size: 15px; font-weight: 600;">
                                    Acceder a la plataforma
                                </a>
                            </div>
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
