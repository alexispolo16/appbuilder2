<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    public function up(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'cfp.manage',
            'cfp.review',
        ];

        foreach ($permissions as $permName) {
            Permission::firstOrCreate(['name' => $permName]);
        }

        // Grant to org_admin
        $orgAdmin = Role::findByName('org_admin');
        if ($orgAdmin) {
            $orgAdmin->givePermissionTo($permissions);
        }

        // Grant to super_admin
        $superAdmin = Role::findByName('super_admin');
        if ($superAdmin) {
            $superAdmin->givePermissionTo($permissions);
        }
    }

    public function down(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Permission::where('name', 'like', 'cfp.%')->delete();
    }
};
