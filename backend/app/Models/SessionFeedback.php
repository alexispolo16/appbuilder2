<?php

namespace App\Models;

use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SessionFeedback extends Model
{
    use HasUlid;

    protected $table = 'session_feedbacks';

    protected $fillable = [
        'agenda_item_id',
        'participant_id',
        'event_id',
        'rating',
        'want_more',
    ];

    protected function casts(): array
    {
        return [
            'want_more' => 'boolean',
        ];
    }

    public function agendaItem(): BelongsTo
    {
        return $this->belongsTo(AgendaItem::class);
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
