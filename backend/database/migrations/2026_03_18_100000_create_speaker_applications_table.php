<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('speaker_applications', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('event_id')->constrained('events')->cascadeOnDelete();
            $table->foreignUlid('participant_id')->constrained('participants')->cascadeOnDelete();
            $table->string('proposed_topic');
            $table->text('topic_description')->nullable();
            $table->text('bio');
            $table->string('photo_path')->nullable();
            $table->jsonb('social_links')->nullable();
            $table->enum('status', ['pending', 'accepted', 'changes_requested', 'declined'])->default('pending');
            $table->text('reviewer_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['event_id', 'participant_id']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('speaker_applications');
    }
};
