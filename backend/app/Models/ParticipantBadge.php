<?php

namespace App\Models;

use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ParticipantBadge extends Model
{
    use HasUlid;

    protected $fillable = [
        'participant_id',
        'badge_id',
        'awarded_at',
        'awarded_by',
        'verification_token',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'awarded_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (ParticipantBadge $pb) {
            if (empty($pb->verification_token)) {
                $pb->verification_token = Str::random(32);
            }
            if (empty($pb->awarded_at)) {
                $pb->awarded_at = now();
            }
        });
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }

    public function badge(): BelongsTo
    {
        return $this->belongsTo(Badge::class);
    }

    public function awardedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'awarded_by');
    }
}
