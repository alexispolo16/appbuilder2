<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Certificado</title>
    <style>
        @page { size: landscape; margin: 0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            margin: 0;
            padding: 0;
            width: 297mm;
            height: 210mm;
            font-family: 'Helvetica', 'Arial', sans-serif;
            position: relative;
        }
        .cert-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 297mm;
            height: 210mm;
            z-index: 0;
        }
        .cert-content {
            position: absolute;
            top: 0;
            left: 0;
            width: 297mm;
            height: 210mm;
            z-index: 1;
            text-align: center;
        }
        .cert-title {
            position: absolute;
            top: 38mm;
            left: 30mm;
            right: 30mm;
            font-size: 18pt;
            font-weight: 700;
            letter-spacing: 4px;
            text-transform: uppercase;
        }
        .cert-body {
            position: absolute;
            top: 65mm;
            left: 40mm;
            right: 40mm;
            font-size: 12pt;
            line-height: 1.6;
        }
        .cert-participant {
            position: absolute;
            top: 82mm;
            left: 30mm;
            right: 30mm;
            font-size: 28pt;
            font-weight: 700;
            line-height: 1.2;
        }
        .cert-participant-line {
            position: absolute;
            top: 100mm;
            left: 80mm;
            right: 80mm;
            border-top: 2px solid #ccc;
        }
        .cert-participation {
            position: absolute;
            top: 106mm;
            left: 40mm;
            right: 40mm;
            font-size: 12pt;
            line-height: 1.6;
        }
        .cert-event-name {
            position: absolute;
            top: 118mm;
            left: 30mm;
            right: 30mm;
            font-size: 16pt;
            font-weight: 700;
        }
        .cert-details {
            position: absolute;
            top: 132mm;
            left: 40mm;
            right: 40mm;
            font-size: 10pt;
            line-height: 1.8;
        }
        .cert-signers {
            position: absolute;
            bottom: 22mm;
            left: 20mm;
            right: 20mm;
        }
        .cert-signers table {
            width: 100%;
            border-collapse: collapse;
        }
        .cert-signers td {
            text-align: center;
            vertical-align: bottom;
            padding: 0 15mm;
        }
        .signer-line {
            width: 50mm;
            border-top: 1px solid #555;
            margin: 0 auto 3mm;
        }
        .signer-name {
            font-size: 10pt;
            font-weight: 700;
        }
        .signer-role {
            font-size: 9pt;
            margin-top: 1mm;
        }
    </style>
</head>
<body>
    @if($backgroundBase64)
        <img src="{{ $backgroundBase64 }}" class="cert-bg" />
    @endif

    <div class="cert-content">
        <div class="cert-title" style="color: {{ $config['text_color'] ?? '#1a1a2e' }}">
            {{ $config['title_text'] ?? 'CERTIFICADO DE PARTICIPACION' }}
        </div>

        <div class="cert-body" style="color: {{ $config['text_color'] ?? '#1a1a2e' }}">
            {{ $config['body_text'] ?? 'Se confiere este certificado de participacion a' }}
        </div>

        <div class="cert-participant" style="color: {{ $config['name_color'] ?? '#0972d3' }}">
            {{ $participantName }}
        </div>

        <div class="cert-participant-line"></div>

        <div class="cert-participation" style="color: {{ $config['text_color'] ?? '#1a1a2e' }}">
            {{ $config['participation_text'] ?? 'por haber participado en' }}
        </div>

        <div class="cert-event-name" style="color: {{ $config['text_color'] ?? '#1a1a2e' }}">
            {{ $eventName }}
        </div>

        <div class="cert-details" style="color: {{ $config['text_color'] ?? '#1a1a2e' }}">
            @if(($config['show_dates'] ?? true) && $eventDates)
                {{ $eventDates }}
                <br>
            @endif
            @if(($config['show_location'] ?? true) && $eventLocation)
                {{ $eventLocation }}
            @endif
        </div>

        @if(! empty($config['signers']))
            <div class="cert-signers">
                <table>
                    <tr>
                        @foreach($config['signers'] as $idx => $signer)
                            <td>
                                @if(! empty($signatureImages[$idx]))
                                    <img src="{{ $signatureImages[$idx] }}" style="height: 18mm; max-width: 50mm; object-fit: contain; margin-bottom: 2mm;" />
                                @endif
                                <div class="signer-line"></div>
                                <div class="signer-name" style="color: {{ $config['text_color'] ?? '#1a1a2e' }}">
                                    {{ $signer['name'] }}
                                </div>
                                <div class="signer-role" style="color: {{ $config['text_color'] ?? '#1a1a2e' }}; opacity: 0.7;">
                                    {{ $signer['role'] }}
                                </div>
                            </td>
                        @endforeach
                    </tr>
                </table>
            </div>
        @endif
    </div>
</body>
</html>
