<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Descargando {{ $badge->name }}...</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f4f4f4;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 24px;
        }
        .loading-text {
            margin-top: 24px;
            color: #5f6b7a;
            font-size: 16px;
            font-weight: 500;
        }
        /* Badge card for capture */
        #badge-capture {
            width: 600px;
            background: #fff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }
        .dl-header {
            padding: 48px 40px 36px;
            text-align: center;
        }
        .dl-header--gradient {
            background: linear-gradient(135deg, {{ $badge->color }}ee, {{ $badge->color }}88);
            color: #fff;
        }
        .dl-header--image {
            background: linear-gradient(135deg, #f8f9fa, #eef1f5);
        }
        .dl-icon { font-size: 96px; margin-bottom: 16px; }
        .dl-image {
            width: 200px;
            height: 200px;
            object-fit: contain;
            margin-bottom: 16px;
        }
        .dl-name {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.02em;
        }
        .dl-name--dark { color: #16191f; }
        .dl-event { font-size: 15px; opacity: 0.85; margin-top: 8px; font-weight: 500; }
        .dl-event--dark { color: {{ $badge->color }}; font-weight: 700; opacity: 1; }
        .dl-body { padding: 36px 40px; }
        .dl-recipient {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 24px;
        }
        .dl-avatar {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, {{ $badge->color }}, {{ $badge->color }}aa);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-weight: 700;
            font-size: 22px;
            flex-shrink: 0;
        }
        .dl-participant-name {
            font-size: 22px;
            font-weight: 700;
            color: #16191f;
        }
        .dl-participant-company {
            font-size: 14px;
            color: #7d8998;
            margin-top: 2px;
        }
        .dl-description {
            color: #5f6b7a;
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 24px;
            padding: 16px 20px;
            background: #f8f9fa;
            border-radius: 12px;
        }
        .dl-meta {
            display: flex;
            gap: 32px;
            margin-bottom: 24px;
        }
        .dl-meta-item { flex: 1; }
        .dl-meta-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #7d8998;
            margin-bottom: 4px;
            font-weight: 600;
        }
        .dl-meta-value { font-size: 15px; color: #16191f; font-weight: 600; }
        .dl-footer {
            padding: 20px 40px;
            border-top: 1px solid #e9ebed;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .dl-verified {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #15803d;
            font-size: 13px;
            font-weight: 600;
        }
        .dl-verified svg { width: 18px; height: 18px; fill: #15803d; }
        .dl-credential-id {
            font-size: 11px;
            color: #b0b8c4;
            font-family: monospace;
        }
        .dl-brand {
            font-size: 12px;
            color: #7d8998;
        }
        .dl-brand strong { color: #414d5c; }
    </style>
</head>
<body>
    <div id="badge-capture">
        @if($badge->image_url)
            <div class="dl-header dl-header--image">
                <img src="{{ $badge->image_url }}" alt="{{ $badge->name }}" class="dl-image" crossorigin="anonymous">
                <div class="dl-name dl-name--dark">{{ $badge->name }}</div>
                <div class="dl-event dl-event--dark">{{ $event->name }}</div>
            </div>
        @else
            <div class="dl-header dl-header--gradient">
                <div class="dl-icon">{{ $badge->icon }}</div>
                <div class="dl-name">{{ $badge->name }}</div>
                <div class="dl-event">{{ $event->name }}</div>
            </div>
        @endif

        <div class="dl-body">
            <div class="dl-recipient">
                <div class="dl-avatar">{{ strtoupper(substr($participant->first_name, 0, 1)) }}</div>
                <div>
                    <div class="dl-participant-name">{{ $participant->full_name }}</div>
                    @if($participant->company)
                        <div class="dl-participant-company">{{ $participant->company }}</div>
                    @endif
                </div>
            </div>

            @if($badge->description)
                <div class="dl-description">{{ $badge->description }}</div>
            @endif

            @if($badge->skills)
                <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 24px;">
                    @foreach(explode(',', $badge->skills) as $skill)
                        <span style="display: inline-block; background: {{ $badge->color }}15; color: {{ $badge->color }}; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; border: 1px solid {{ $badge->color }}30;">
                            {{ trim($skill) }}
                        </span>
                    @endforeach
                </div>
            @endif

            <div class="dl-meta">
                <div class="dl-meta-item">
                    <div class="dl-meta-label">Fecha de emision</div>
                    <div class="dl-meta-value">{{ $awardedAt->format('d/m/Y') }}</div>
                </div>
                @if($badge->valid_until)
                    <div class="dl-meta-item">
                        <div class="dl-meta-label">Valida hasta</div>
                        <div class="dl-meta-value" @if($isExpired) style="color: #dc2626;" @endif>
                            {{ \Carbon\Carbon::parse($badge->valid_until)->format('d/m/Y') }}
                        </div>
                    </div>
                @endif
                <div class="dl-meta-item">
                    <div class="dl-meta-label">Verificar en</div>
                    <div class="dl-meta-value" style="font-size: 12px;">{{ url('/badge/' . $verificationToken) }}</div>
                </div>
            </div>
        </div>

        <div class="dl-footer">
            <div class="dl-verified">
                <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                Credencial verificada
            </div>
            <div class="dl-credential-id">
                ID: {{ strtoupper(substr($verificationToken, 0, 8)) }}-{{ strtoupper(substr($verificationToken, 8, 4)) }}
            </div>
            <div class="dl-brand">
                <strong>{{ config('app.name', 'BuilderApp') }}</strong>
            </div>
        </div>
    </div>

    <div class="loading-text" id="status">Generando imagen...</div>

    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    <script>
        window.onload = function() {
            setTimeout(function() {
                var el = document.getElementById('badge-capture');
                html2canvas(el, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    borderRadius: 24,
                }).then(function(canvas) {
                    var link = document.createElement('a');
                    link.download = '{{ \Illuminate\Support\Str::slug($badge->name . '-' . $participant->full_name) }}.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                    document.getElementById('status').textContent = 'Descarga completada. Puedes cerrar esta ventana.';
                }).catch(function() {
                    document.getElementById('status').textContent = 'Error al generar la imagen. Intenta con una captura de pantalla.';
                });
            }, 500);
        };
    </script>
</body>
</html>
