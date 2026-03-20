<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva insignia - {{ $badge->name }}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0f2f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f2f5; padding: 40px 16px;">
        <tr>
            <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

                    {{-- HEADER --}}
                    <tr>
                        <td style="background: {{ $badge->color }}; background: linear-gradient(135deg, {{ $badge->color }}ee 0%, {{ $badge->color }}88 100%); padding: 40px 36px; text-align: center;">
                            <p style="margin: 0 0 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.6); font-weight: 700;">
                                Nueva Insignia Obtenida
                            </p>
                            @if($badge->image_url)
                                <img src="{{ $badge->image_url }}" alt="{{ $badge->name }}" width="120" height="120" style="display: block; margin: 0 auto 16px; object-fit: contain;">
                            @else
                                <p style="margin: 0 0 16px; font-size: 64px; line-height: 1;">{{ $badge->icon }}</p>
                            @endif
                            <h1 style="margin: 0 0 8px; color: #ffffff; font-size: 24px; font-weight: 800; line-height: 1.3;">
                                {{ $badge->name }}
                            </h1>
                            <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.8); font-weight: 500;">
                                {{ $event->name }}
                            </p>
                        </td>
                    </tr>

                    {{-- BODY --}}
                    <tr>
                        <td style="padding: 32px 36px;">
                            <p style="margin: 0 0 8px; color: #16191f; font-size: 18px; font-weight: 700;">
                                Felicidades {{ $participant->first_name }}!
                            </p>
                            <p style="margin: 0 0 24px; color: #687078; font-size: 14px; line-height: 1.6;">
                                Has obtenido la insignia <strong style="color: {{ $badge->color }};">{{ $badge->name }}</strong> en {{ $event->name }}.
                            </p>

                            @if($badge->description)
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                    <tr>
                                        <td style="background: #f8f9fa; border-radius: 12px; padding: 16px 20px;">
                                            <p style="margin: 0; color: #5f6b7a; font-size: 14px; line-height: 1.6;">
                                                {{ $badge->description }}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            @endif

                            @if($badge->skills)
                                <p style="margin: 0 0 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #9ba7b6; font-weight: 600;">
                                    Skills validados
                                </p>
                                <table cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                    <tr>
                                        @foreach(explode(',', $badge->skills) as $skill)
                                            <td style="padding: 0 8px 8px 0;">
                                                <span style="display: inline-block; background: {{ $badge->color }}15; color: {{ $badge->color }}; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 20px; border: 1px solid {{ $badge->color }}30;">
                                                    {{ trim($skill) }}
                                                </span>
                                            </td>
                                        @endforeach
                                    </tr>
                                </table>
                            @endif

                            {{-- CTA buttons --}}
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                                <tr>
                                    <td align="center" style="padding-bottom: 12px;">
                                        <a href="{{ $verifyUrl }}" style="display: inline-block; background: {{ $badge->color }}; color: #ffffff; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 10px; text-decoration: none;">
                                            Ver mi credencial
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <table cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 0 6px;">
                                                    <a href="{{ $linkedInUrl }}" style="display: inline-block; background: #0a66c2; color: #ffffff; font-size: 13px; font-weight: 600; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
                                                        Compartir en LinkedIn
                                                    </a>
                                                </td>
                                                <td style="padding: 0 6px;">
                                                    <a href="{{ $downloadUrl }}" style="display: inline-block; background: #f0f2f5; color: #414d5c; font-size: 13px; font-weight: 600; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
                                                        Descargar PNG
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    @if($badge->valid_until)
                    <tr>
                        <td style="padding: 0 36px 24px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 12px 16px;">
                                        <p style="margin: 0; color: #92400e; font-size: 13px;">
                                            Esta credencial es valida hasta el <strong>{{ \Carbon\Carbon::parse($badge->valid_until)->format('d/m/Y') }}</strong>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    @endif

                    {{-- FOOTER --}}
                    <tr>
                        <td style="padding: 20px 36px; border-top: 1px solid #e9ebed; text-align: center;">
                            <p style="margin: 0 0 4px; color: #9ba7b6; font-size: 12px;">
                                Verificado por <strong style="color: #687078;">{{ config('app.name', 'BuilderApp') }}</strong>
                            </p>
                            <p style="margin: 0; color: #b0b8c4; font-size: 11px;">
                                <a href="{{ $portfolioUrl }}" style="color: {{ $badge->color }}; text-decoration: none;">Ver todas mis insignias</a>
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
