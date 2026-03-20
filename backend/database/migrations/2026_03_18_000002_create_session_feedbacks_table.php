<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('session_feedbacks', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('agenda_item_id')->constrained('agenda_items')->cascadeOnDelete();
            $table->foreignUlid('participant_id')->constrained('participants')->cascadeOnDelete();
            $table->foreignUlid('event_id')->constrained('events')->cascadeOnDelete();
            $table->enum('rating', ['happy', 'neutral', 'sad']);
            $table->boolean('want_more')->default(false);
            $table->timestamps();

            $table->unique(['agenda_item_id', 'participant_id']);
            $table->index('event_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('session_feedbacks');
    }
};
