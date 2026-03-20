<?php

namespace App\Http\Middleware;

use App\Models\Organization;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class EnsureHasOrganization
{
    private const IMPERSONATION_TTL_SECONDS = 4 * 60 * 60; // 4 hours

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        // Expire impersonation after TTL
        if (session()->has('impersonating_started_at')) {
            $startedAt = session('impersonating_started_at');
            if (now()->timestamp - $startedAt > self::IMPERSONATION_TTL_SECONDS) {
                $orgName = session('impersonating_organization_name');

                session()->forget([
                    'impersonating_organization_id',
                    'impersonating_organization_name',
                    'impersonating_started_at',
                ]);

                Log::channel('single')->info('Impersonation expired', [
                    'admin_id' => $user->id,
                    'organization_name' => $orgName,
                ]);

                return redirect()->route('admin.dashboard')
                    ->with('warning', 'La sesión de impersonación ha expirado (límite: 4 horas).');
            }
        }

        // Super admin: always allowed (sees all orgs)
        if ($user->hasRole('super_admin')) {
            return $next($request);
        }

        // Regular user without organization
        if (! $user->organization_id && ! session()->has('impersonating_organization_id')) {
            abort(403, 'No perteneces a ninguna organización.');
        }

        // Check organization approval status
        if ($user->organization_id) {
            $org = $user->organization;
            if ($org && ! $org->isApproved()) {
                return redirect()->route('pending-approval');
            }
        }

        return $next($request);
    }
}
