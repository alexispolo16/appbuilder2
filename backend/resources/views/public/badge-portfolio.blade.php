<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $participant->full_name }} - Insignias | {{ $event->name }}</title>

    <meta property="og:type" content="profile">
    <meta property="og:title" content="Insignias de {{ $participant->full_name }} en {{ $event->name }}">
    <meta property="og:description" content="{{ $participant->full_name }} ha obtenido {{ count($badges) }} insignia(s) en {{ $event->name }}.">
    <meta property="og:site_name" content="{{ config('app.name', 'BuilderApp') }}">
    <meta property="og:url" content="{{ url()->current() }}">
    @if($event->event_image_url)
        <meta property="og:image" content="{{ $event->event_image_url }}">
    @endif

    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0f1b2d 0%, #1a2940 50%, #0f1b2d 100%);
            min-height: 100vh;
            padding: 40px 24px;
        }
        .container { max-width: 720px; margin: 0 auto; }
        .profile-header {
            text-align: center;
            margin-bottom: 40px;
            color: #fff;
        }
        .profile-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, #0972d3, #0972d3aa);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-weight: 700;
            font-size: 32px;
            margin-bottom: 16px;
            box-shadow: 0 8px 24px rgba(9,114,211,0.3);
        }
        .profile-name {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.02em;
            margin-bottom: 4px;
        }
        .profile-company {
            font-size: 15px;
            opacity: 0.7;
            margin-bottom: 8px;
        }
        .profile-event {
            font-size: 14px;
            opacity: 0.5;
        }
        .profile-count {
            display: inline-block;
            margin-top: 16px;
            padding: 8px 20px;
            background: rgba(255,255,255,0.1);
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
        }
        .badges-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 20px;
        }
        .badge-card {
            background: #fff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            transition: transform 0.2s;
        }
        .badge-card:hover { transform: translateY(-4px); }
        .badge-visual {
            padding: 32px 24px;
            text-align: center;
            min-height: 160px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            position: relative;
        }
        .badge-icon { font-size: 64px; }
        .badge-img {
            width: 120px;
            height: 120px;
            object-fit: contain;
        }
        .badge-info {
            padding: 20px 24px;
            text-align: center;
        }
        .badge-name {
            font-size: 18px;
            font-weight: 700;
            color: #16191f;
            margin-bottom: 4px;
        }
        .badge-desc {
            font-size: 13px;
            color: #5f6b7a;
            line-height: 1.5;
            margin-bottom: 12px;
        }
        .badge-date {
            font-size: 12px;
            color: #7d8998;
            margin-bottom: 16px;
        }
        .badge-actions {
            border-top: 1px solid #e9ebed;
            padding: 12px 24px;
            display: flex;
            gap: 8px;
            justify-content: center;
        }
        .btn-sm {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            text-decoration: none;
            transition: transform 0.2s;
            border: none;
            cursor: pointer;
        }
        .btn-sm:hover { transform: scale(1.1); }
        .btn-sm svg { width: 16px; height: 16px; fill: #fff; }
        .expired-tag {
            position: absolute;
            top: 12px;
            right: 12px;
            background: #dc2626;
            color: #fff;
            font-size: 11px;
            font-weight: 600;
            padding: 3px 10px;
            border-radius: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            color: rgba(255,255,255,0.4);
            font-size: 12px;
        }
        .empty-state {
            text-align: center;
            color: rgba(255,255,255,0.6);
            padding: 60px 24px;
            background: rgba(255,255,255,0.05);
            border-radius: 20px;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="profile-header">
            <div class="profile-avatar">{{ strtoupper(substr($participant->first_name, 0, 1)) }}</div>
            <div class="profile-name">{{ $participant->full_name }}</div>
            @if($participant->company)
                <div class="profile-company">{{ $participant->company }}</div>
            @endif
            <div class="profile-event">{{ $event->name }}</div>
            <div class="profile-count">{{ count($badges) }} insignia{{ count($badges) !== 1 ? 's' : '' }} obtenida{{ count($badges) !== 1 ? 's' : '' }}</div>
        </div>

        @if(count($badges) > 0)
            <div class="badges-grid">
                @foreach($badges as $badge)
                    @php
                        $isExpired = !empty($badge['valid_until']) && now()->greaterThan($badge['valid_until']);
                        $verifyUrl = url('/badge/' . $badge['verification_token']);
                        $shareText = urlencode($participant->full_name . ' obtuvo "' . $badge['name'] . '" en ' . $event->name);
                        $shareUrl = urlencode($verifyUrl);
                    @endphp
                    <div class="badge-card" @if($isExpired) style="opacity: 0.6;" @endif>
                        <div class="badge-visual" style="background: {{ $badge['image_url'] ? 'linear-gradient(135deg, #f8f9fa, #eef1f5)' : 'linear-gradient(135deg, ' . $badge['color'] . 'ee, ' . $badge['color'] . '88)' }};">
                            @if($badge['image_url'])
                                <img src="{{ $badge['image_url'] }}" alt="{{ $badge['name'] }}" class="badge-img">
                            @else
                                <div class="badge-icon">{{ $badge['icon'] }}</div>
                            @endif
                            @if($isExpired)
                                <div class="expired-tag">Expirada</div>
                            @endif
                        </div>
                        <div class="badge-info">
                            <div class="badge-name">{{ $badge['name'] }}</div>
                            @if($badge['description'])
                                <div class="badge-desc">{{ $badge['description'] }}</div>
                            @endif
                            @if(!empty($badge['skills']))
                                <div style="display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; margin-bottom: 12px;">
                                    @foreach(explode(',', $badge['skills']) as $skill)
                                        <span style="display: inline-block; background: {{ $badge['color'] }}15; color: {{ $badge['color'] }}; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; border: 1px solid {{ $badge['color'] }}30;">
                                            {{ trim($skill) }}
                                        </span>
                                    @endforeach
                                </div>
                            @endif
                            <div class="badge-date">
                                Obtenida el {{ \Carbon\Carbon::parse($badge['awarded_at'])->format('d/m/Y') }}
                                @if($badge['valid_until'])
                                    &middot; {{ $isExpired ? 'Expirada' : 'Valida hasta ' . \Carbon\Carbon::parse($badge['valid_until'])->format('d/m/Y') }}
                                @endif
                            </div>
                        </div>
                        <div class="badge-actions">
                            <a href="{{ $verifyUrl }}" class="btn-sm" style="background: #414d5c;" title="Verificar">
                                <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                            </a>
                            <a href="https://www.linkedin.com/sharing/share-offsite/?url={{ $shareUrl }}" target="_blank" class="btn-sm" style="background: #0a66c2;" title="LinkedIn">
                                <svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                            </a>
                            <a href="https://x.com/intent/tweet?text={{ $shareText }}&url={{ $shareUrl }}" target="_blank" class="btn-sm" style="background: #000;" title="X (Twitter)">
                                <svg viewBox="0 0 24 24" style="width:14px;height:14px;"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                            </a>
                            <a href="https://wa.me/?text={{ urlencode($participant->full_name . ' obtuvo "' . $badge['name'] . '" en ' . $event->name . ' ' . $verifyUrl) }}" target="_blank" class="btn-sm" style="background: #25d366;" title="WhatsApp">
                                <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            </a>
                        </div>
                    </div>
                @endforeach
            </div>
        @else
            <div class="empty-state">
                {{ $participant->first_name }} aun no ha obtenido insignias en este evento.
            </div>
        @endif

        <div class="footer">
            Verificado por {{ config('app.name', 'BuilderApp') }}
        </div>
    </div>
</body>
</html>
