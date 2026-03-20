<?php

namespace App\Http\Controllers;

use App\Models\AgendaItem;
use App\Models\Event;
use App\Models\Participant;
use App\Models\SessionAttendance;
use App\Services\BadgeAwardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SessionAttendanceController extends Controller
{
    /**
     * Public: show the session attendance form (participant scans QR).
     * If the user is logged in and has a participant record, auto-detect them.
     */
    public function showPublic(Request $request, string $slug, string $attendanceCode): Response
    {
        $event = Event::findBySlugPublic($slug);
        abort_unless($event, 404);

        // Guard against null/invalid attendance codes
        abort_if($attendanceCode === 'null' || strlen($attendanceCode) < 6, 404);

        $agendaItem = AgendaItem::where('attendance_code', $attendanceCode)
            ->where('event_id', $event->id)
            ->firstOrFail();

        $autoParticipant = null;
        $autoStatus = null;

        if ($user = $request->user()) {
            $participant = Participant::where('event_id', $event->id)
                ->where('user_id', $user->id)
                ->first();

            if ($participant && $participant->status !== 'cancelled') {
                $already = SessionAttendance::where('participant_id', $participant->id)
                    ->where('agenda_item_id', $agendaItem->id)
                    ->exists();

                if ($already) {
                    $autoStatus = 'duplicate';
                } else {
                    SessionAttendance::create([
                        'participant_id' => $participant->id,
                        'agenda_item_id' => $agendaItem->id,
                        'event_id' => $event->id,
                        'scanned_at' => now(),
                        'scan_method' => 'qr_public',
                    ]);

                    $service = new BadgeAwardService();
                    $service->checkAndAwardAutoBadges($participant, $event);

                    $autoStatus = 'success';
                }

                $autoParticipant = [
                    'name' => $participant->full_name,
                    'registration_code' => $participant->registration_code,
                ];
            }
        }

        return Inertia::render('Public/SessionAttendance', [
            'event' => [
                'name' => $event->name,
                'slug' => $event->slug,
            ],
            'session' => [
                'title' => $agendaItem->title,
                'date' => $agendaItem->date,
                'start_time' => $agendaItem->start_time,
                'end_time' => $agendaItem->end_time,
                'speakers' => $agendaItem->speakers->pluck('full_name')->values()->all(),
            ],
            'attendanceCode' => $attendanceCode,
            'autoParticipant' => $autoParticipant,
            'autoStatus' => $autoStatus,
        ]);
    }

    /**
     * Public: record attendance (participant submits registration_code).
     */
    public function recordPublic(Request $request, string $slug, string $attendanceCode): JsonResponse
    {
        $event = Event::findBySlugPublic($slug);
        abort_unless($event, 404);

        $agendaItem = AgendaItem::where('attendance_code', $attendanceCode)
            ->where('event_id', $event->id)
            ->firstOrFail();

        $request->validate([
            'registration_code' => ['required', 'string', 'size:8'],
        ]);

        $participant = Participant::where('event_id', $event->id)
            ->where('registration_code', strtoupper($request->registration_code))
            ->first();

        if (!$participant) {
            return response()->json([
                'status' => 'not_found',
                'message' => 'Codigo de registro no encontrado.',
            ], 404);
        }

        if ($participant->status === 'cancelled') {
            return response()->json([
                'status' => 'cancelled',
                'message' => 'Tu registro fue cancelado.',
            ], 422);
        }

        // Check duplicate
        $exists = SessionAttendance::where('participant_id', $participant->id)
            ->where('agenda_item_id', $agendaItem->id)
            ->exists();

        if ($exists) {
            return response()->json([
                'status' => 'duplicate',
                'message' => 'Ya registraste tu asistencia a esta sesion.',
            ], 409);
        }

        SessionAttendance::create([
            'participant_id' => $participant->id,
            'agenda_item_id' => $agendaItem->id,
            'event_id' => $event->id,
            'scanned_at' => now(),
            'scan_method' => 'qr_public',
        ]);

        // Check auto-badges
        $service = new BadgeAwardService();
        $newBadges = $service->checkAndAwardAutoBadges($participant, $event);

        $badgeNames = collect($newBadges)->pluck('name')->toArray();

        return response()->json([
            'status' => 'success',
            'message' => 'Asistencia registrada correctamente.',
            'participant_name' => $participant->full_name,
            'new_badges' => $badgeNames,
        ]);
    }

    /**
     * Admin: fullscreen QR projection for a session.
     */
    public function attendanceQR(Event $event, AgendaItem $agendaItem): Response
    {
        $this->authorize('view', $event);

        // Backfill attendance_code for legacy agenda items
        $agendaItem->ensureAttendanceCode();

        $attended = SessionAttendance::where('agenda_item_id', $agendaItem->id)->count();

        return Inertia::render('Events/Agenda/AttendanceQR', [
            'event' => [
                'id' => $event->id,
                'name' => $event->name,
                'slug' => $event->slug,
            ],
            'agendaItem' => [
                'id' => $agendaItem->id,
                'title' => $agendaItem->title,
                'attendance_code' => $agendaItem->attendance_code,
                'date' => $agendaItem->date,
                'start_time' => $agendaItem->start_time,
                'end_time' => $agendaItem->end_time,
            ],
            'attended' => $attended,
        ]);
    }

    /**
     * Admin: live attendees list for QR projection (polling endpoint).
     */
    public function attendanceQRLive(Event $event, AgendaItem $agendaItem): JsonResponse
    {
        $this->authorize('view', $event);

        $attendees = SessionAttendance::where('agenda_item_id', $agendaItem->id)
            ->with('participant:id,first_name,last_name')
            ->orderByDesc('scanned_at')
            ->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'name' => $a->participant->full_name,
                'scanned_at' => $a->scanned_at->format('H:i:s'),
            ]);

        return response()->json([
            'attended' => $attendees->count(),
            'attendees' => $attendees,
        ]);
    }

    /**
     * Admin: attendance dashboard for the event.
     */
    public function index(Event $event): Response
    {
        $this->authorize('view', $event);

        $agendaItems = $event->agendaItems()
            ->withCount('sessionAttendances')
            ->with('speakers')
            ->orderBy('date')
            ->orderBy('start_time')
            ->get();

        // Backfill attendance_code for legacy agenda items
        $agendaItems->each(fn ($item) => $item->ensureAttendanceCode());

        $totalParticipants = $event->participants()
            ->where('status', '!=', 'cancelled')
            ->count();

        // Per-participant attendance counts
        $participantAttendance = SessionAttendance::where('event_id', $event->id)
            ->selectRaw('participant_id, count(*) as sessions_attended')
            ->groupBy('participant_id')
            ->get();

        $attendanceSummary = [
            'total_sessions' => $agendaItems->count(),
            'total_participants' => $totalParticipants,
            'total_attendances' => SessionAttendance::where('event_id', $event->id)->count(),
            'participants_with_attendance' => $participantAttendance->count(),
            'avg_sessions_per_participant' => $participantAttendance->count() > 0
                ? round($participantAttendance->avg('sessions_attended'), 1)
                : 0,
        ];

        return Inertia::render('Events/Attendance/Index', [
            'event' => $event,
            'agendaItems' => $agendaItems->map(fn ($item) => [
                'id' => $item->id,
                'title' => $item->title,
                'date' => $item->date,
                'start_time' => $item->start_time,
                'end_time' => $item->end_time,
                'type' => $item->type,
                'attendance_code' => $item->attendance_code,
                'session_attendances_count' => $item->session_attendances_count,
                'speakers' => $item->speakers->map(fn ($s) => [
                    'full_name' => $s->full_name,
                ])->values(),
            ]),
            'summary' => $attendanceSummary,
        ]);
    }
}
