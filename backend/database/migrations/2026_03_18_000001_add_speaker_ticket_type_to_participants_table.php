<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE participants DROP CONSTRAINT IF EXISTS participants_ticket_type_check");
        DB::statement("ALTER TABLE participants ADD CONSTRAINT participants_ticket_type_check CHECK (ticket_type IN ('general', 'vip', 'student', 'speaker'))");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE participants DROP CONSTRAINT IF EXISTS participants_ticket_type_check");
        DB::statement("ALTER TABLE participants ADD CONSTRAINT participants_ticket_type_check CHECK (ticket_type IN ('general', 'vip', 'student'))");
    }
};
