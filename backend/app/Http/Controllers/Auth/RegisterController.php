<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Jobs\SendAdminNewRegistration;
use App\Models\Organization;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    public function create(): Response
    {
        if (! Setting::organizerRegistrationEnabled()) {
            return Inertia::render('Auth/RegistrationDisabled');
        }

        return Inertia::render('Auth/RegisterOrganizer');
    }

    public function store(Request $request)
    {
        if (! Setting::organizerRegistrationEnabled()) {
            return redirect()->route('home');
        }

        $request->validate([
            'organization_name' => ['required', 'string', 'max:255'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = DB::transaction(function () use ($request) {
            $organization = Organization::create([
                'name' => $request->organization_name,
                'slug' => Str::slug($request->organization_name) . '-' . Str::random(5),
                'email' => $request->email,
                'approval_status' => Organization::APPROVAL_PENDING,
                'is_active' => false,
            ]);

            $user = User::create([
                'organization_id' => $organization->id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $user->assignRole('org_admin');

            return $user;
        });

        event(new Registered($user));

        SendAdminNewRegistration::dispatch($user);

        Auth::login($user);

        return redirect()->route('pending-approval');
    }
}
