<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('session_attendances', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('participant_id')->constrained()->cascadeOnDelete();
            $table->foreignUlid('agenda_item_id')->constrained()->cascadeOnDelete();
            $table->foreignUlid('event_id')->constrained()->cascadeOnDelete();
            $table->timestamp('scanned_at');
            $table->enum('scan_method', ['qr_public', 'qr_scanner', 'manual'])->default('qr_public');
            $table->timestamps();

            $table->unique(['participant_id', 'agenda_item_id']);
            $table->index(['event_id', 'participant_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('session_attendances');
    }
};
