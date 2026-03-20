<?php

namespace App\Http\Controllers;

use App\Models\AgendaItem;
use App\Models\Event;
use App\Models\Participant;
use App\Models\SessionFeedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SessionFeedbackController extends Controller
{
    /**
     * Public: show the session feedback form (after attendance).
     */
    public function showPublic(Request $request, string $slug, string $attendanceCode): Response
    {
        $event = Event::findBySlugPublic($slug);
        abort_unless($event, 404);

        $agendaItem = AgendaItem::where('attendance_code', $attendanceCode)
            ->where('event_id', $event->id)
            ->firstOrFail();

        $autoParticipant = null;

        // Auto-detect logged-in participant
        if ($user = $request->user()) {
            $participant = Participant::where('event_id', $event->id)
                ->where('user_id', $user->id)
                ->first();

            if ($participant && $participant->status !== 'cancelled') {
                $autoParticipant = [
                    'name' => $participant->full_name,
                    'registration_code' => $participant->registration_code,
                ];
            }
        }

        // Or use code from query param (passed from attendance page)
        if (! $autoParticipant && $request->query('code')) {
            $participant = Participant::where('event_id', $event->id)
                ->where('registration_code', strtoupper($request->query('code')))
                ->first();

            if ($participant && $participant->status !== 'cancelled') {
                $autoParticipant = [
                    'name' => $participant->full_name,
                    'registration_code' => $participant->registration_code,
                ];
            }
        }

        return Inertia::render('Public/SessionFeedback', [
            'event' => [
                'name' => $event->name,
                'slug' => $event->slug,
            ],
            'session' => [
                'title' => $agendaItem->title,
                'speakers' => $agendaItem->speakers->pluck('full_name')->values()->all(),
                'start_time' => $agendaItem->start_time,
                'end_time' => $agendaItem->end_time,
            ],
            'attendanceCode' => $attendanceCode,
            'autoParticipant' => $autoParticipant,
        ]);
    }

    /**
     * Public: submit feedback for a session.
     */
    public function submitPublic(Request $request, string $slug, string $attendanceCode): JsonResponse
    {
        try {
            $event = Event::findBySlugPublic($slug);
            abort_unless($event, 404);

            $agendaItem = AgendaItem::where('attendance_code', $attendanceCode)
                ->where('event_id', $event->id)
                ->firstOrFail();

            $request->validate([
                'registration_code' => ['required', 'string', 'size:8'],
                'rating' => ['required', 'in:happy,neutral,sad'],
                'want_more' => ['required', 'boolean'],
            ]);

            $participant = Participant::where('event_id', $event->id)
                ->where('registration_code', strtoupper($request->registration_code))
                ->first();

            if (! $participant) {
                return response()->json([
                    'message' => 'Codigo de registro no encontrado.',
                ], 404);
            }

            $exists = SessionFeedback::where('agenda_item_id', $agendaItem->id)
                ->where('participant_id', $participant->id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'Ya enviaste tu feedback para esta sesion.',
                ], 409);
            }

            SessionFeedback::create([
                'agenda_item_id' => $agendaItem->id,
                'participant_id' => $participant->id,
                'event_id' => $event->id,
                'rating' => $request->rating,
                'want_more' => $request->want_more,
            ]);

            return response()->json([
                'message' => 'Gracias por tu feedback!',
                'participant_name' => $participant->full_name,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => collect($e->errors())->flatten()->first(),
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin: feedback results for a specific session.
     */
    public function results(Event $event, AgendaItem $agendaItem): Response
    {
        $this->authorize('view', $event);

        $feedbacks = SessionFeedback::where('agenda_item_id', $agendaItem->id)->get();
        $total = $feedbacks->count();

        $ratingCounts = [
            'happy' => $feedbacks->where('rating', 'happy')->count(),
            'neutral' => $feedbacks->where('rating', 'neutral')->count(),
            'sad' => $feedbacks->where('rating', 'sad')->count(),
        ];

        $wantMoreCount = $feedbacks->where('want_more', true)->count();

        $attendanceCount = $agendaItem->sessionAttendances()->count();

        return Inertia::render('Events/Agenda/FeedbackResults', [
            'event' => [
                'id' => $event->id,
                'name' => $event->name,
            ],
            'agendaItem' => [
                'id' => $agendaItem->id,
                'title' => $agendaItem->title,
                'date' => $agendaItem->date,
                'start_time' => $agendaItem->start_time,
                'end_time' => $agendaItem->end_time,
                'attendance_code' => $agendaItem->attendance_code,
                'speakers' => $agendaItem->speakers->map(fn ($s) => [
                    'full_name' => $s->full_name,
                    'photo_url' => $s->photo_url,
                ])->values(),
            ],
            'feedback' => [
                'total' => $total,
                'ratings' => $ratingCounts,
                'want_more' => $wantMoreCount,
                'attendance' => $attendanceCount,
            ],
        ]);
    }
}
