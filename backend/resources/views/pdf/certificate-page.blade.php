<div style="position: relative; width: 297mm; height: 210mm; overflow: hidden;{{ $pageBreak ?? false ? ' page-break-after: always;' : '' }}">
    @if($backgroundBase64)
        <img src="{{ $backgroundBase64 }}" style="position: absolute; top: 0; left: 0; width: 297mm; height: 210mm; z-index: 0;" />
    @endif

    <div style="position: absolute; top: 0; left: 0; width: 297mm; height: 210mm; z-index: 1; text-align: center;">
        <div style="position: absolute; top: 38mm; left: 30mm; right: 30mm; font-size: 18pt; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: {{ $config['text_color'] ?? '#1a1a2e' }}; font-family: Helvetica, Arial, sans-serif;">
            {{ $config['title_text'] ?? 'CERTIFICADO DE PARTICIPACION' }}
        </div>

        <div style="position: absolute; top: 65mm; left: 40mm; right: 40mm; font-size: 12pt; line-height: 1.6; color: {{ $config['text_color'] ?? '#1a1a2e' }}; font-family: Helvetica, Arial, sans-serif;">
            {{ $config['body_text'] ?? 'Se confiere este certificado de participacion a' }}
        </div>

        <div style="position: absolute; top: 82mm; left: 30mm; right: 30mm; font-size: 28pt; font-weight: 700; line-height: 1.2; color: {{ $config['name_color'] ?? '#0972d3' }}; font-family: Helvetica, Arial, sans-serif;">
            {{ $participantName }}
        </div>

        <div style="position: absolute; top: 100mm; left: 80mm; right: 80mm; border-top: 2px solid #ccc;"></div>

        <div style="position: absolute; top: 106mm; left: 40mm; right: 40mm; font-size: 12pt; line-height: 1.6; color: {{ $config['text_color'] ?? '#1a1a2e' }}; font-family: Helvetica, Arial, sans-serif;">
            {{ $config['participation_text'] ?? 'por haber participado en' }}
        </div>

        <div style="position: absolute; top: 118mm; left: 30mm; right: 30mm; font-size: 16pt; font-weight: 700; color: {{ $config['text_color'] ?? '#1a1a2e' }}; font-family: Helvetica, Arial, sans-serif;">
            {{ $eventName }}
        </div>

        <div style="position: absolute; top: 132mm; left: 40mm; right: 40mm; font-size: 10pt; line-height: 1.8; color: {{ $config['text_color'] ?? '#1a1a2e' }}; font-family: Helvetica, Arial, sans-serif;">
            @if(($config['show_dates'] ?? true) && $eventDates)
                {{ $eventDates }}<br>
            @endif
            @if(($config['show_location'] ?? true) && $eventLocation)
                {{ $eventLocation }}
            @endif
        </div>

        @if(! empty($config['signers']))
            <div style="position: absolute; bottom: 22mm; left: 20mm; right: 20mm;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        @foreach($config['signers'] as $idx => $signer)
                            <td style="text-align: center; vertical-align: bottom; padding: 0 15mm;">
                                @if(! empty($signatureImages[$idx]))
                                    <img src="{{ $signatureImages[$idx] }}" style="height: 18mm; max-width: 50mm; object-fit: contain; margin-bottom: 2mm;" />
                                @endif
                                <div style="width: 50mm; border-top: 1px solid #555; margin: 0 auto 3mm;"></div>
                                <div style="font-size: 10pt; font-weight: 700; color: {{ $config['text_color'] ?? '#1a1a2e' }}; font-family: Helvetica, Arial, sans-serif;">
                                    {{ $signer['name'] }}
                                </div>
                                <div style="font-size: 9pt; margin-top: 1mm; color: {{ $config['text_color'] ?? '#1a1a2e' }}; opacity: 0.7; font-family: Helvetica, Arial, sans-serif;">
                                    {{ $signer['role'] }}
                                </div>
                            </td>
                        @endforeach
                    </tr>
                </table>
            </div>
        @endif
    </div>
</div>
