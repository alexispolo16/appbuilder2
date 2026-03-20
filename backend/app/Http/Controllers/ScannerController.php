<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Participant;
use App\Models\ParticipantScan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ScannerController extends Controller
{
    public function show(Event $event): Response
    {
        $this->authorize('view', $event);

        if (! request()->user()->can('participants.checkin')) {
            abort(403);
        }

        $scanTypes = $event->settings['scan_types'] ?? [
            ['key' => 'checkin', 'label' => 'Check-in', 'enabled' => true],
        ];

        $enabledTypes = collect($scanTypes)->where('enabled', true)->values();

        return Inertia::render('Events/Scanner', [
            'event' => $event,
            'scanTypes' => $enabledTypes,
            'stats' => $this->getStats($event),
        ]);
    }

    public function scan(Request $request, Event $event): JsonResponse
    {
        $this->authorize('view', $event);

        if (! $request->user()->can('participants.checkin')) {
            abort(403);
        }

        $request->validate([
            'registration_code' => ['required', 'string'],
            'scan_type' => ['required', 'string'],
        ]);

        $participant = Participant::where('event_id', $event->id)
            ->where('registration_code', $request->registration_code)
            ->first();

        if (! $participant) {
            return response()->json([
                'status' => 'not_found',
                'message' => 'Participante no encontrado.',
            ], 404);
        }

        if ($participant->status === 'cancelled') {
            return response()->json([
                'status' => 'cancelled',
                'message' => 'Este registro fue cancelado.',
                'participant' => $this->formatParticipant($participant),
            ], 422);
        }

        // Check for duplicate scan
        $existingScan = ParticipantScan::where('participant_id', $participant->id)
            ->where('event_id', $event->id)
            ->where('scan_type', $request->scan_type)
            ->first();

        if ($existingScan) {
            // If participant status was manually reset, allow re-scanning
            if ($request->scan_type === 'checkin' && $participant->status !== 'attended') {
                $existingScan->delete();
            } else {
                return response()->json([
                    'status' => 'duplicate',
                    'message' => 'El participante ya fue registrado anteriormente.',
                    'participant' => $this->formatParticipant($participant),
                ], 409);
            }
        }

        // Create scan record
        ParticipantScan::create([
            'participant_id' => $participant->id,
            'event_id' => $event->id,
            'scan_type' => $request->scan_type,
            'scanned_by' => $request->user()->id,
            'scanned_at' => now(),
        ]);

        // If checkin type, update participant status
        if ($request->scan_type === 'checkin') {
            $participant->update([
                'status' => 'attended',
                'checked_in_at' => now(),
            ]);
        }

        // Check auto-badges
        (new \App\Services\BadgeAwardService())->checkAndAwardAutoBadges($participant, $event);

        return response()->json([
            'status' => 'success',
            'message' => 'Participante registrado correctamente.',
            'participant' => $this->formatParticipant($participant->fresh()),
        ]);
    }

    public function stats(Event $event): JsonResponse
    {
        $this->authorize('view', $event);

        return response()->json($this->getStats($event));
    }

    public function reports(Event $event): Response
    {
        $this->authorize('view', $event);

        try {
            return $this->buildReportsResponse($event);
        } catch (\Throwable $e) {
            \Log::error('ScanReports error: ' . $e->getMessage(), [
                'event_id' => $event->id,
                'trace' => $e->getTraceAsString(),
            ]);

            // Return page with empty data + error message
            return Inertia::render('Events/Reports/ScanReports', [
                'event' => [
                    'id' => $event->id,
                    'name' => $event->name,
                    'slug' => $event->slug,
                    'status' => $event->status,
                    'date_start' => $event->date_start,
                    'date_end' => $event->date_end,
                    'location' => $event->location,
                    'venue' => $event->venue,
                ],
                'scanTypeLabels' => [],
                'summary' => [
                    'total_participants' => 0,
                    'total_scans' => 0,
                    'unique_scanned' => 0,
                    'checkin_rate' => 0,
                ],
                'scansByType' => [],
                'scansByHour' => [],
                'scansByTicketType' => [],
                'recentScans' => [],
                'error' => 'Error al cargar reportes: ' . $e->getMessage(),
            ]);
        }
    }

    private function buildReportsResponse(Event $event): Response
    {
        $scanTypes = collect($event->settings['scan_types'] ?? [
            ['key' => 'checkin', 'label' => 'Check-in', 'enabled' => true],
        ]);

        $scanTypeLabels = $scanTypes->pluck('label', 'key')->toArray();

        $totalParticipants = $event->participants()
            ->where('status', '!=', 'cancelled')
            ->count();

        $totalScans = DB::table('participant_scans')
            ->where('event_id', $event->id)
            ->count();

        $uniqueScanned = (int) DB::table('participant_scans')
            ->where('event_id', $event->id)
            ->distinct()
            ->count('participant_id');

        // Scans by type
        $scansByType = DB::table('participant_scans')
            ->where('event_id', $event->id)
            ->selectRaw('scan_type, count(*) as total')
            ->groupBy('scan_type')
            ->pluck('total', 'scan_type')
            ->map(fn ($v) => (int) $v)
            ->toArray();

        // Scans by hour
        $scansByHourRaw = DB::table('participant_scans')
            ->where('event_id', $event->id)
            ->whereNotNull('scanned_at')
            ->selectRaw("to_char(scanned_at, 'HH24:00') as hour, scan_type, count(*) as total")
            ->groupBy('hour', 'scan_type')
            ->orderBy('hour')
            ->get();

        $scansByHour = [];
        foreach ($scansByHourRaw as $row) {
            $scansByHour[$row->scan_type][$row->hour] = (int) $row->total;
        }

        // Scans by ticket type
        $scansByTicketType = DB::table('participant_scans')
            ->where('participant_scans.event_id', $event->id)
            ->join('participants', 'participants.id', '=', 'participant_scans.participant_id')
            ->selectRaw('participants.ticket_type, count(*) as total')
            ->groupBy('participants.ticket_type')
            ->pluck('total', 'ticket_type')
            ->map(fn ($v) => (int) $v)
            ->toArray();

        // Recent scans
        $recentScansRaw = DB::table('participant_scans')
            ->where('participant_scans.event_id', $event->id)
            ->leftJoin('participants', 'participants.id', '=', 'participant_scans.participant_id')
            ->leftJoin('users', 'users.id', '=', 'participant_scans.scanned_by')
            ->select([
                'participant_scans.id',
                'participant_scans.scan_type',
                'participant_scans.scanned_at',
                'participants.first_name',
                'participants.last_name',
                'participants.email as participant_email',
                'participants.company as participant_company',
                'participants.ticket_type as participant_ticket_type',
                DB::raw("concat(users.first_name, ' ', users.last_name) as scanner_name"),
            ])
            ->orderByDesc('participant_scans.scanned_at')
            ->limit(50)
            ->get();

        $recentScans = $recentScansRaw->map(fn ($scan) => [
            'id' => $scan->id,
            'scan_type' => $scan->scan_type,
            'scanned_at' => $scan->scanned_at
                ? \Carbon\Carbon::parse($scan->scanned_at)->format('d/m/Y H:i:s')
                : '-',
            'participant_name' => trim(($scan->first_name ?? '') . ' ' . ($scan->last_name ?? '')) ?: '-',
            'participant_email' => $scan->participant_email ?? '-',
            'participant_company' => $scan->participant_company,
            'participant_ticket_type' => $scan->participant_ticket_type,
            'scanner_name' => $scan->scanner_name ?? '-',
        ]);

        return Inertia::render('Events/Reports/ScanReports', [
            'event' => [
                'id' => $event->id,
                'name' => $event->name,
                'slug' => $event->slug,
                'status' => $event->status,
                'date_start' => $event->date_start,
                'date_end' => $event->date_end,
                'location' => $event->location,
                'venue' => $event->venue,
            ],
            'scanTypeLabels' => $scanTypeLabels,
            'summary' => [
                'total_participants' => $totalParticipants,
                'total_scans' => $totalScans,
                'unique_scanned' => $uniqueScanned,
                'checkin_rate' => $totalParticipants > 0
                    ? round(($scansByType['checkin'] ?? 0) / $totalParticipants * 100, 1)
                    : 0,
            ],
            'scansByType' => $scansByType,
            'scansByHour' => $scansByHour,
            'scansByTicketType' => $scansByTicketType,
            'recentScans' => $recentScans,
        ]);
    }

    private function getStats(Event $event): array
    {
        $totalParticipants = $event->participants()
            ->where('status', '!=', 'cancelled')
            ->count();

        $scanCounts = ParticipantScan::where('event_id', $event->id)
            ->selectRaw('scan_type, count(*) as count')
            ->groupBy('scan_type')
            ->pluck('count', 'scan_type')
            ->toArray();

        return [
            'total_participants' => $totalParticipants,
            'scan_counts' => $scanCounts,
        ];
    }

    private function formatParticipant(Participant $participant): array
    {
        return [
            'id' => $participant->id,
            'full_name' => $participant->full_name,
            'email' => $participant->email,
            'company' => $participant->company,
            'job_title' => $participant->job_title,
            'ticket_type' => $participant->ticket_type,
            'status' => $participant->status,
            'registration_code' => $participant->registration_code,
        ];
    }
}
