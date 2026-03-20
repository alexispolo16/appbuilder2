<?php

namespace App\Models;

use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Badge extends Model
{
    use HasUlid, SoftDeletes;

    protected $appends = ['image_url'];

    protected $fillable = [
        'event_id',
        'name',
        'description',
        'skills',
        'icon',
        'image_path',
        'color',
        'type',
        'auto_rule',
        'is_active',
        'sort_order',
        'valid_until',
    ];

    protected function casts(): array
    {
        return [
            'auto_rule' => 'array',
            'is_active' => 'boolean',
            'valid_until' => 'date',
        ];
    }

    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image_path) {
            return null;
        }

        return Storage::disk('public')->url($this->image_path);
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function participantBadges(): HasMany
    {
        return $this->hasMany(ParticipantBadge::class);
    }

    public function participants()
    {
        return $this->belongsToMany(Participant::class, 'participant_badges')
            ->withPivot('awarded_at', 'awarded_by', 'verification_token', 'notes')
            ->withTimestamps();
    }

    public function isAutomatic(): bool
    {
        return $this->type === 'automatic';
    }
}
