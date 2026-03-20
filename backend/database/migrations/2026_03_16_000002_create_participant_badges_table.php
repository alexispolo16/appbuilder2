<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('participant_badges', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('participant_id')->constrained()->cascadeOnDelete();
            $table->foreignUlid('badge_id')->constrained()->cascadeOnDelete();
            $table->timestamp('awarded_at');
            $table->foreignUlid('awarded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('verification_token', 32)->unique();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['participant_id', 'badge_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('participant_badges');
    }
};
