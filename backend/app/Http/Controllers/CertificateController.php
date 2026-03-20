<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Participant;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use ZipArchive;

class CertificateController extends Controller
{
    public function index(Event $event): Response
    {
        $this->authorize('update', $event);

        $config = $event->settings['certificate_config'] ?? null;
        $backgroundUrl = null;

        if ($config && ! empty($config['background_image_path'])) {
            $backgroundUrl = Storage::disk('public')->url($config['background_image_path']);
        }

        // Build signer signatures map (index => url)
        $signerSignatures = [];
        $signers = $config['signers'] ?? [];
        foreach ($signers as $i => $signer) {
            if (! empty($signer['signature_path']) && Storage::disk('public')->exists($signer['signature_path'])) {
                $signerSignatures[$i] = Storage::disk('public')->url($signer['signature_path']);
            }
        }

        return Inertia::render('Events/Certificates/Index', [
            'event' => $event,
            'certificateConfig' => $config,
            'backgroundUrl' => $backgroundUrl,
            'signerSignatures' => (object) $signerSignatures,
        ]);
    }

    public function updateConfig(Request $request, Event $event)
    {
        $this->authorize('update', $event);

        $validated = $request->validate([
            'enabled' => ['boolean'],
            'title_text' => ['required', 'string', 'max:100'],
            'body_text' => ['required', 'string', 'max:200'],
            'participation_text' => ['required', 'string', 'max:200'],
            'signers' => ['required', 'array', 'min:1', 'max:5'],
            'signers.*.name' => ['required', 'string', 'max:100'],
            'signers.*.role' => ['required', 'string', 'max:100'],
            'show_dates' => ['boolean'],
            'show_location' => ['boolean'],
            'text_color' => ['required', 'string', 'max:20'],
            'name_color' => ['required', 'string', 'max:20'],
        ]);

        $settings = $event->settings ?? [];
        $existing = $settings['certificate_config'] ?? [];
        $settings['certificate_config'] = array_merge($existing, $validated);
        $event->update(['settings' => $settings]);

        return back()->with('success', 'Configuracion del certificado guardada correctamente.');
    }

    public function uploadBackground(Request $request, Event $event)
    {
        $this->authorize('update', $event);

        $request->validate([
            'background' => ['required', 'image', 'max:8192'],
        ]);

        $config = $event->settings['certificate_config'] ?? [];

        if (! empty($config['background_image_path'])) {
            Storage::disk('public')->delete($config['background_image_path']);
        }

        $path = $request->file('background')->store(
            "events/{$event->id}/certificates",
            'public'
        );

        $settings = $event->settings ?? [];
        $settings['certificate_config'] = array_merge($config, [
            'background_image_path' => $path,
        ]);
        $event->update(['settings' => $settings]);

        return back()->with('success', 'Imagen de fondo del certificado actualizada.');
    }

    public function removeBackground(Event $event)
    {
        $this->authorize('update', $event);

        $config = $event->settings['certificate_config'] ?? [];

        if (! empty($config['background_image_path'])) {
            Storage::disk('public')->delete($config['background_image_path']);
        }

        $settings = $event->settings ?? [];
        $settings['certificate_config'] = array_merge($config, [
            'background_image_path' => null,
        ]);
        $event->update(['settings' => $settings]);

        return back()->with('success', 'Imagen de fondo eliminada.');
    }

    public function preview(Event $event)
    {
        $this->authorize('update', $event);

        $config = $this->getConfig($event);
        $data = $this->buildPdfData($event, $config, 'Maria Garcia Lopez');

        $pdf = Pdf::loadView('pdf.certificate', $data)
            ->setPaper('a4', 'landscape');

        return $pdf->stream('certificado-preview.pdf');
    }

    public function downloadForParticipant(Event $event, Participant $participant)
    {
        $this->authorize('view', $event);

        if ($participant->event_id !== $event->id) {
            abort(404);
        }

        $config = $this->getConfig($event);
        $participantName = trim($participant->first_name . ' ' . $participant->last_name);
        $data = $this->buildPdfData($event, $config, $participantName);

        $pdf = Pdf::loadView('pdf.certificate', $data)
            ->setPaper('a4', 'landscape');

        return $pdf->download("certificado-{$participant->registration_code}.pdf");
    }

    public function downloadBulkZip(Event $event)
    {
        $this->authorize('update', $event);

        $config = $this->getConfig($event);
        $participants = $event->participants()
            ->where('status', 'attended')
            ->orderBy('last_name')
            ->get();

        if ($participants->isEmpty()) {
            return back()->with('error', 'No hay participantes con asistencia confirmada.');
        }

        $tempDir = storage_path('app/temp');
        if (! is_dir($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        $zipPath = $tempDir . '/certificados-' . $event->slug . '.zip';
        $zip = new ZipArchive();

        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            return back()->with('error', 'No se pudo crear el archivo ZIP.');
        }

        foreach ($participants as $participant) {
            $participantName = trim($participant->first_name . ' ' . $participant->last_name);
            $data = $this->buildPdfData($event, $config, $participantName);

            $pdf = Pdf::loadView('pdf.certificate', $data)
                ->setPaper('a4', 'landscape');

            $zip->addFromString(
                "certificado-{$participant->registration_code}.pdf",
                $pdf->output()
            );
        }

        $zip->close();

        return response()->download($zipPath, "certificados-{$event->slug}.zip")
            ->deleteFileAfterSend(true);
    }

    public function downloadBulkPdf(Event $event)
    {
        $this->authorize('update', $event);

        $config = $this->getConfig($event);
        $participants = $event->participants()
            ->where('status', 'attended')
            ->orderBy('last_name')
            ->get();

        if ($participants->isEmpty()) {
            return back()->with('error', 'No hay participantes con asistencia confirmada.');
        }

        $html = '';
        foreach ($participants as $index => $participant) {
            $participantName = trim($participant->first_name . ' ' . $participant->last_name);
            $data = $this->buildPdfData($event, $config, $participantName);
            $data['pageBreak'] = $index < $participants->count() - 1;

            $html .= view('pdf.certificate-page', $data)->render();
        }

        $pdf = Pdf::loadHTML($this->wrapMultiPageHtml($html))
            ->setPaper('a4', 'landscape');

        return $pdf->download("certificados-{$event->slug}.pdf");
    }

    public function uploadSignature(Request $request, Event $event)
    {
        $this->authorize('update', $event);

        $request->validate([
            'signature' => ['required', 'image', 'max:2048'],
            'signer_index' => ['required', 'integer', 'min:0', 'max:4'],
        ]);

        $index = (int) $request->input('signer_index');
        $config = $event->settings['certificate_config'] ?? [];
        $signers = $config['signers'] ?? [];

        if (! isset($signers[$index])) {
            return back()->withErrors(['signer_index' => 'Firmante no encontrado.']);
        }

        // Delete old signature if exists
        if (! empty($signers[$index]['signature_path'])) {
            Storage::disk('public')->delete($signers[$index]['signature_path']);
        }

        $path = $request->file('signature')->store(
            "events/{$event->id}/certificates/signatures",
            'public'
        );

        $signers[$index]['signature_path'] = $path;
        $config['signers'] = $signers;

        $settings = $event->settings ?? [];
        $settings['certificate_config'] = $config;
        $event->update(['settings' => $settings]);

        return back()->with('success', 'Firma digital actualizada.');
    }

    public function removeSignature(Event $event, int $index)
    {
        $this->authorize('update', $event);

        $config = $event->settings['certificate_config'] ?? [];
        $signers = $config['signers'] ?? [];

        if (! isset($signers[$index])) {
            return back()->withErrors(['signer_index' => 'Firmante no encontrado.']);
        }

        if (! empty($signers[$index]['signature_path'])) {
            Storage::disk('public')->delete($signers[$index]['signature_path']);
        }

        $signers[$index]['signature_path'] = null;
        $config['signers'] = $signers;

        $settings = $event->settings ?? [];
        $settings['certificate_config'] = $config;
        $event->update(['settings' => $settings]);

        return back()->with('success', 'Firma digital eliminada.');
    }

    // ── Helpers ──

    private function getConfig(Event $event): array
    {
        return array_merge([
            'enabled' => false,
            'background_image_path' => null,
            'title_text' => 'CERTIFICADO DE PARTICIPACION',
            'body_text' => 'Se confiere este certificado de participacion a',
            'participation_text' => 'por haber participado en',
            'signers' => [],
            'show_dates' => true,
            'show_location' => true,
            'text_color' => '#1a1a2e',
            'name_color' => '#0972d3',
        ], $event->settings['certificate_config'] ?? []);
    }

    private function buildPdfData(Event $event, array $config, string $participantName): array
    {
        $backgroundBase64 = null;

        if (! empty($config['background_image_path'])) {
            $disk = Storage::disk('public');
            if ($disk->exists($config['background_image_path'])) {
                $content = $disk->get($config['background_image_path']);
                $mime = $disk->mimeType($config['background_image_path']);
                $backgroundBase64 = 'data:' . $mime . ';base64,' . base64_encode($content);
            }
        }

        $eventDates = '';
        if ($event->date_start) {
            $eventDates = $event->date_start->format('d/m/Y');
            if ($event->date_end && $event->date_end->format('Y-m-d') !== $event->date_start->format('Y-m-d')) {
                $eventDates .= ' - ' . $event->date_end->format('d/m/Y');
            }
        }

        $eventLocation = implode(', ', array_filter([$event->venue, $event->location]));

        // Build signature base64 map
        $signatureImages = [];
        $disk = Storage::disk('public');
        foreach ($config['signers'] ?? [] as $i => $signer) {
            if (! empty($signer['signature_path']) && $disk->exists($signer['signature_path'])) {
                $content = $disk->get($signer['signature_path']);
                $mime = $disk->mimeType($signer['signature_path']);
                $signatureImages[$i] = 'data:' . $mime . ';base64,' . base64_encode($content);
            }
        }

        return [
            'config' => $config,
            'backgroundBase64' => $backgroundBase64,
            'participantName' => $participantName,
            'eventName' => $event->name,
            'eventDates' => $eventDates,
            'eventLocation' => $eventLocation,
            'signatureImages' => $signatureImages,
        ];
    }

    private function wrapMultiPageHtml(string $pagesHtml): string
    {
        return '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>'
            . '@page { size: landscape; margin: 0; }'
            . 'body { margin: 0; padding: 0; }'
            . '</style></head><body>' . $pagesHtml . '</body></html>';
    }
}
