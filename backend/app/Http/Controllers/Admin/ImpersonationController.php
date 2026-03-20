<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ImpersonationController extends Controller
{
    public function start(Request $request, Organization $organization): RedirectResponse
    {
        if (! $organization->is_active) {
            return back()->with('error', 'No se puede impersonar una organización inactiva.');
        }

        $request->session()->put('impersonating_organization_id', $organization->id);
        $request->session()->put('impersonating_organization_name', $organization->name);
        $request->session()->put('impersonating_started_at', now()->timestamp);

        Log::channel('single')->info('Impersonation started', [
            'admin_id' => $request->user()->id,
            'admin_email' => $request->user()->email,
            'organization_id' => $organization->id,
            'organization_name' => $organization->name,
            'ip' => $request->ip(),
        ]);

        return redirect()->route('dashboard')
            ->with('success', "Ahora estás operando como {$organization->name}.");
    }

    public function stop(Request $request): RedirectResponse
    {
        $orgName = $request->session()->get('impersonating_organization_name');
        $orgId = $request->session()->get('impersonating_organization_id');

        $request->session()->forget([
            'impersonating_organization_id',
            'impersonating_organization_name',
            'impersonating_started_at',
        ]);

        Log::channel('single')->info('Impersonation stopped', [
            'admin_id' => $request->user()->id,
            'admin_email' => $request->user()->email,
            'organization_id' => $orgId,
            'organization_name' => $orgName,
            'ip' => $request->ip(),
        ]);

        return redirect()->route('admin.dashboard')
            ->with('success', 'Has dejado de impersonar la organización.');
    }
}
