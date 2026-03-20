<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Convert any existing 'published' events to 'active'
        DB::table('events')->where('status', 'published')->update(['status' => 'active']);

        // Update the enum constraint (PostgreSQL)
        DB::statement("ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check");
        DB::statement("ALTER TABLE events ADD CONSTRAINT events_status_check CHECK (status IN ('draft', 'active', 'completed', 'cancelled'))");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check");
        DB::statement("ALTER TABLE events ADD CONSTRAINT events_status_check CHECK (status IN ('draft', 'published', 'active', 'completed', 'cancelled'))");
    }
};
