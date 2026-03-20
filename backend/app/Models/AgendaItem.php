<?php

namespace App\Models;

use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class AgendaItem extends Model
{
    use HasFactory, HasUlid, SoftDeletes;

    protected $fillable = [
        'event_id',
        'title',
        'description',
        'date',
        'start_time',
        'end_time',
        'location_detail',
        'type',
        'sort_order',
        'attendance_code',
    ];

    protected static function booted(): void
    {
        static::saving(function (AgendaItem $item) {
            if (empty($item->attendance_code)) {
                $item->attendance_code = strtoupper(Str::random(12));
            }
        });
    }

    /**
     * Ensure attendance_code is always present (backfill for legacy items).
     */
    public function ensureAttendanceCode(): self
    {
        if (empty($this->attendance_code)) {
            $this->attendance_code = strtoupper(Str::random(12));
            $this->saveQuietly();
        }

        return $this;
    }

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function speakers(): BelongsToMany
    {
        return $this->belongsToMany(Speaker::class, 'agenda_item_speaker');
    }

    public function sessionAttendances(): HasMany
    {
        return $this->hasMany(SessionAttendance::class);
    }

    public function sessionFeedbacks(): HasMany
    {
        return $this->hasMany(SessionFeedback::class);
    }
}
