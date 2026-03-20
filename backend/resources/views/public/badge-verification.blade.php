<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $participant->full_name }} - {{ $badge->name }} | {{ $event->name }}</title>

    <!-- OG Meta Tags for social sharing -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="{{ $participant->full_name }} obtuvo la insignia &quot;{{ $badge->name }}&quot;">
    <meta property="og:description" content="Otorgada en {{ $event->name }}. {{ $badge->description }}">
    <meta property="og:site_name" content="{{ config('app.name', 'BuilderApp') }}">
    <meta property="og:url" content="{{ url()->current() }}">
    @if($badge->image_url)
        <meta property="og:image" content="{{ $badge->image_url }}">
        <meta property="og:image:width" content="600">
        <meta property="og:image:height" content="600">
    @elseif($event->event_image_url)
        <meta property="og:image" content="{{ $event->event_image_url }}">
    @endif
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $participant->full_name }} obtuvo la insignia &quot;{{ $badge->name }}&quot;">
    <meta name="twitter:description" content="Otorgada en {{ $event->name }}. {{ $badge->description }}">
    @if($badge->image_url)
        <meta name="twitter:image" content="{{ $badge->image_url }}">
    @endif

    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0f1b2d 0%, #1a2940 50%, #0f1b2d 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }
        .badge-card {
            background: #fff;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05);
            max-width: 480px;
            width: 100%;
            overflow: hidden;
        }
        .badge-header {
            padding: 48px 32px 32px;
            text-align: center;
        }
        .badge-header--gradient {
            background: linear-gradient(135deg, {{ $badge->color }}ee, {{ $badge->color }}88);
            color: #fff;
        }
        .badge-header--image {
            background: linear-gradient(135deg, #f8f9fa, #eef1f5);
        }
        .badge-icon {
            font-size: 80px;
            margin-bottom: 20px;
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));
        }
        .badge-image {
            width: 180px;
            height: 180px;
            object-fit: contain;
            margin-bottom: 20px;
            filter: drop-shadow(0 4px 16px rgba(0,0,0,0.1));
        }
        .badge-name {
            font-size: 26px;
            font-weight: 800;
            margin-bottom: 8px;
            letter-spacing: -0.02em;
        }
        .badge-name--dark { color: #16191f; }
        .badge-event {
            font-size: 14px;
            opacity: 0.85;
            font-weight: 500;
        }
        .badge-event--dark {
            color: {{ $badge->color }};
            font-weight: 700;
            opacity: 1;
        }
        .badge-body { padding: 32px; }
        .badge-recipient {
            display: flex;
            align-items: center;
            gap: 14px;
            margin-bottom: 20px;
        }
        .badge-avatar {
            width: 52px;
            height: 52px;
            border-radius: 50%;
            background: linear-gradient(135deg, {{ $badge->color }}, {{ $badge->color }}aa);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-weight: 700;
            font-size: 20px;
            flex-shrink: 0;
        }
        .badge-participant {
            font-size: 20px;
            font-weight: 700;
            color: #16191f;
            line-height: 1.2;
        }
        .badge-participant-sub {
            font-size: 13px;
            color: #7d8998;
            margin-top: 2px;
        }
        .badge-description {
            color: #5f6b7a;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 20px;
            padding: 16px;
            background: #f8f9fa;
            border-radius: 12px;
        }
        .badge-meta {
            display: flex;
            gap: 24px;
            margin-bottom: 24px;
        }
        .badge-meta-item { flex: 1; }
        .badge-meta-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #7d8998;
            margin-bottom: 4px;
            font-weight: 600;
        }
        .badge-meta-value {
            font-size: 14px;
            color: #16191f;
            font-weight: 600;
        }
        .badge-verified {
            padding: 16px 20px;
            border-radius: 12px;
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            display: flex;
            align-items: center;
            gap: 10px;
            color: #15803d;
            font-size: 14px;
            font-weight: 600;
        }
        .badge-verified svg {
            width: 20px;
            height: 20px;
            fill: #15803d;
            flex-shrink: 0;
        }
        .badge-expired {
            padding: 16px 20px;
            border-radius: 12px;
            background: #fef2f2;
            border: 1px solid #fecaca;
            display: flex;
            align-items: center;
            gap: 10px;
            color: #dc2626;
            font-size: 14px;
            font-weight: 600;
            margin-top: 12px;
        }
        .badge-expired svg {
            width: 20px;
            height: 20px;
            fill: #dc2626;
            flex-shrink: 0;
        }
        .portfolio-link {
            display: block;
            text-align: center;
            margin-top: 20px;
            padding: 12px 24px;
            color: {{ $badge->color }};
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            border-radius: 12px;
            transition: background 0.2s;
        }
        .portfolio-link:hover { background: #f4f4f4; }
        .badge-actions { padding: 0 32px 28px; }
        .badge-actions-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #7d8998;
            font-weight: 600;
            margin-bottom: 12px;
            text-align: center;
        }
        .badge-actions-row {
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
        }
        .btn-social {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            text-decoration: none;
            transition: transform 0.2s, box-shadow 0.2s;
            border: none;
            cursor: pointer;
        }
        .btn-social:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .btn-social svg { width: 20px; height: 20px; fill: #fff; }
        .btn-linkedin { background: #0a66c2; }
        .btn-twitter { background: #000; }
        .btn-twitter svg { width: 16px; height: 16px; }
        .btn-facebook { background: #1877f2; }
        .btn-whatsapp { background: #25d366; }
        .btn-download { background: #5f6b7a; }
        .credential-id {
            text-align: center;
            padding: 0 32px 20px;
            font-size: 11px;
            color: #b0b8c4;
            font-family: 'SF Mono', 'Fira Code', monospace;
        }
        .powered-by {
            text-align: center;
            padding: 20px 32px;
            border-top: 1px solid #e9ebed;
            font-size: 12px;
            color: #7d8998;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        .powered-by strong { color: #414d5c; font-weight: 700; }
    </style>
</head>
<body>
    <div class="badge-card">
        @if($badge->image_url)
            <div class="badge-header badge-header--image">
                <img src="{{ $badge->image_url }}" alt="{{ $badge->name }}" class="badge-image">
                <div class="badge-name badge-name--dark">{{ $badge->name }}</div>
                <div class="badge-event badge-event--dark">{{ $event->name }}</div>
            </div>
        @else
            <div class="badge-header badge-header--gradient">
                <div class="badge-icon">{{ $badge->icon }}</div>
                <div class="badge-name">{{ $badge->name }}</div>
                <div class="badge-event">{{ $event->name }}</div>
            </div>
        @endif

        <div class="badge-body">
            <div class="badge-recipient">
                <div class="badge-avatar">
                    {{ strtoupper(substr($participant->first_name, 0, 1)) }}
                </div>
                <div>
                    <div class="badge-participant">{{ $participant->full_name }}</div>
                    @if($participant->company)
                        <div class="badge-participant-sub">{{ $participant->company }}</div>
                    @endif
                </div>
            </div>

            @if($badge->description)
                <div class="badge-description">{{ $badge->description }}</div>
            @endif

            @if($badge->skills)
                <div style="margin-bottom: 20px;">
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #9ba7b6; font-weight: 600; margin-bottom: 8px;">Skills validados</div>
                    <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                        @foreach(explode(',', $badge->skills) as $skill)
                            <span style="display: inline-block; background: {{ $badge->color }}15; color: {{ $badge->color }}; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; border: 1px solid {{ $badge->color }}30;">
                                {{ trim($skill) }}
                            </span>
                        @endforeach
                    </div>
                </div>
            @endif

            <div class="badge-meta">
                <div class="badge-meta-item">
                    <div class="badge-meta-label">Fecha de emision</div>
                    <div class="badge-meta-value">{{ $awardedAt->format('d/m/Y') }}</div>
                </div>
                @if($badge->valid_until)
                    <div class="badge-meta-item">
                        <div class="badge-meta-label">Valida hasta</div>
                        <div class="badge-meta-value" @if($isExpired) style="color: #dc2626;" @endif>
                            {{ \Carbon\Carbon::parse($badge->valid_until)->format('d/m/Y') }}
                        </div>
                    </div>
                @endif
                <div class="badge-meta-item">
                    <div class="badge-meta-label">Emisor</div>
                    <div class="badge-meta-value">{{ $event->name }}</div>
                </div>
            </div>

            <div class="badge-verified">
                <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                Credencial verificada
            </div>

            @if($isExpired)
                <div class="badge-expired">
                    <svg viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
                    Esta credencial ha expirado
                </div>
            @endif

            <a href="/e/{{ $event->slug }}/badges/{{ $participant->registration_code }}" class="portfolio-link">
                Ver todas las insignias de {{ $participant->first_name }} &rarr;
            </a>
        </div>

        <div class="badge-actions">
            <div class="badge-actions-label">Compartir credencial</div>
            <div class="badge-actions-row">
                <a href="https://www.linkedin.com/sharing/share-offsite/?url={{ urlencode(url()->current()) }}" target="_blank" class="btn-social btn-linkedin" title="LinkedIn">
                    <svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="https://x.com/intent/tweet?text={{ urlencode($participant->full_name . ' obtuvo la insignia "' . $badge->name . '" en ' . $event->name) }}&url={{ urlencode(url()->current()) }}" target="_blank" class="btn-social btn-twitter" title="X (Twitter)">
                    <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://www.facebook.com/sharer/sharer.php?u={{ urlencode(url()->current()) }}" target="_blank" class="btn-social btn-facebook" title="Facebook">
                    <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://wa.me/?text={{ urlencode($participant->full_name . ' obtuvo la insignia "' . $badge->name . '" en ' . $event->name . ' ' . url()->current()) }}" target="_blank" class="btn-social btn-whatsapp" title="WhatsApp">
                    <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
                <a href="/badge/{{ $verificationToken }}/download" class="btn-social btn-download" title="Descargar PNG">
                    <svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                </a>
            </div>
        </div>

        <div class="credential-id">
            ID: {{ strtoupper(substr($verificationToken, 0, 8)) }}-{{ strtoupper(substr($verificationToken, 8, 4)) }}-{{ strtoupper(substr($verificationToken, 12, 4)) }}
        </div>

        <div class="powered-by">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#7d8998"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
            Verificado por <strong>{{ config('app.name', 'BuilderApp') }}</strong>
        </div>
    </div>
</body>
</html>
