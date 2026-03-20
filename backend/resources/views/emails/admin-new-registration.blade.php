<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva solicitud de registro</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0f2f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f2f5; padding: 40px 16px;">
        <tr>
            <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #0972d3 0%, #033160 100%); padding: 32px 36px 28px; text-align: center;">
                            <p style="margin: 0 0 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.55); font-weight: 700;">
                                Accion requerida
                            </p>
                            <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700;">Nueva solicitud de registro</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 32px 36px;">
                            <p style="margin: 0 0 24px; color: #687078; font-size: 14px; line-height: 1.6;">
                                Una nueva organizacion se ha registrado y requiere tu aprobacion.
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fb; border-radius: 14px; border: 1px solid #e9ebed; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 20px 24px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 0 0 12px;">
                                                    <p style="margin: 0 0 3px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: #9ba7b6; font-weight: 600;">Organizacion</p>
                                                    <p style="margin: 0; font-size: 15px; color: #16191f; font-weight: 600;">{{ $organization->name }}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 0 0 12px;">
                                                    <p style="margin: 0 0 3px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: #9ba7b6; font-weight: 600;">Solicitante</p>
                                                    <p style="margin: 0; font-size: 15px; color: #16191f; font-weight: 600;">{{ $registeredUser->first_name }} {{ $registeredUser->last_name }}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <p style="margin: 0 0 3px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: #9ba7b6; font-weight: 600;">Email</p>
                                                    <p style="margin: 0; font-size: 15px; color: #16191f;">{{ $registeredUser->email }}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <div style="text-align: center;">
                                <a href="{{ $adminUrl }}" style="display: inline-block; background: #0972d3; color: #ffffff; text-decoration: none; padding: 14px 44px; border-radius: 12px; font-size: 15px; font-weight: 600;">
                                    Revisar solicitud
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
