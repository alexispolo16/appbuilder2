<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agenda_item_speaker', function (Blueprint $table) {
            $table->foreignUlid('agenda_item_id')->constrained('agenda_items')->cascadeOnDelete();
            $table->foreignUlid('speaker_id')->constrained('speakers')->cascadeOnDelete();
            $table->primary(['agenda_item_id', 'speaker_id']);
        });

        // Migrate existing speaker_id data to pivot table
        DB::statement('
            INSERT INTO agenda_item_speaker (agenda_item_id, speaker_id)
            SELECT id, speaker_id FROM agenda_items
            WHERE speaker_id IS NOT NULL AND deleted_at IS NULL
        ');

        Schema::table('agenda_items', function (Blueprint $table) {
            $table->dropForeign(['speaker_id']);
            $table->dropIndex(['speaker_id']);
            $table->dropColumn('speaker_id');
        });
    }

    public function down(): void
    {
        Schema::table('agenda_items', function (Blueprint $table) {
            $table->foreignUlid('speaker_id')->nullable()->after('event_id')->constrained('speakers')->nullOnDelete();
            $table->index('speaker_id');
        });

        // Migrate first speaker back
        DB::statement('
            UPDATE agenda_items SET speaker_id = (
                SELECT speaker_id FROM agenda_item_speaker
                WHERE agenda_item_speaker.agenda_item_id = agenda_items.id
                LIMIT 1
            )
        ');

        Schema::dropIfExists('agenda_item_speaker');
    }
};
