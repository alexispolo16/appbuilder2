<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifica tu correo - BuilderApp</title>
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
                                BuilderApp
                            </p>
                            <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; line-height: 1.3;">
                                Verifica tu correo electronico
                            </h1>
                        </td>
                    </tr>

                    {{-- BODY --}}
                    <tr>
                        <td style="padding: 32px 36px 0;">
                            <p style="margin: 0 0 6px; color: #16191f; font-size: 18px; font-weight: 700;">
                                Hola {{ $user->first_name }}!
                            </p>
                            <p style="margin: 0 0 24px; color: #687078; font-size: 14px; line-height: 1.6;">
                                Gracias por registrarte. Para completar tu cuenta y acceder a todas las funcionalidades, verifica tu correo electronico haciendo clic en el boton de abajo.
                            </p>
                        </td>
                    </tr>

                    {{-- ICON --}}
                    <tr>
                        <td style="padding: 0 36px 24px; text-align: center;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fb; border-radius: 14px; border: 1px solid #e9ebed;">
                                <tr>
                                    <td style="padding: 28px 24px; text-align: center;">
                                        <div style="width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #0972d3 0%, #065fad 100%); display: inline-block; line-height: 56px; text-align: center; margin-bottom: 14px;">
                                            <span style="font-size: 26px; color: #ffffff;">&#9993;</span>
                                        </div>
                                        <p style="margin: 0 0 4px; font-size: 15px; font-weight: 700; color: #16191f;">
                                            Un paso mas
                                        </p>
                                        <p style="margin: 0; font-size: 13px; color: #687078; line-height: 1.5;">
                                            Confirma que este correo te pertenece para activar tu cuenta.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- CTA --}}
                    <tr>
                        <td style="padding: 0 36px 24px; text-align: center;">
                            <a href="{{ $verificationUrl }}" style="display: inline-block; background: #0972d3; background: linear-gradient(135deg, #0972d3, #065fad); color: #ffffff; text-decoration: none; padding: 14px 44px; border-radius: 12px; font-size: 15px; font-weight: 600;">
                                Verificar correo electronico
                            </a>
                        </td>
                    </tr>

                    {{-- FALLBACK --}}
                    <tr>
                        <td style="padding: 0 36px 28px;">
                            <p style="margin: 0 0 8px; font-size: 12px; color: #9ba7b6; line-height: 1.5;">
                                Si el boton no funciona, copia y pega este enlace en tu navegador:
                            </p>
                            <p style="margin: 0; font-size: 11px; color: #0972d3; word-break: break-all; line-height: 1.5;">
                                {{ $verificationUrl }}
                            </p>
                        </td>
                    </tr>

                    {{-- NOTE --}}
                    <tr>
                        <td style="padding: 0 36px 24px;">
                            <p style="margin: 0; font-size: 13px; color: #687078; line-height: 1.5;">
                                Si no creaste una cuenta en BuilderApp, puedes ignorar este correo.
                            </p>
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
