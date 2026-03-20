<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreOrganizationRequest;
use App\Http\Requests\Admin\UpdateOrganizationRequest;
use App\Jobs\SendOrganizationApproved;
use App\Jobs\SendOrganizationRejected;
use App\Models\Organization;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminOrganizationController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Organization::withCount(['users', 'events']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($request->has('is_active') && $request->input('is_active') !== '') {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->has('approval_status') && $request->input('approval_status') !== '') {
            $query->where('approval_status', $request->input('approval_status'));
        }

        $organizations = $query->latest()->paginate(15)->withQueryString();

        $pendingCount = Organization::where('approval_status', Organization::APPROVAL_PENDING)->count();

        return Inertia::render('Admin/Organizations/Index', [
            'organizations' => $organizations,
            'filters' => $request->only(['search', 'is_active', 'approval_status']),
            'pendingCount' => $pendingCount,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Organizations/Create');
    }

    public function store(StoreOrganizationRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['name']);

        Organization::create($data);

        return redirect()->route('admin.organizations.index')
            ->with('success', 'Organización creada exitosamente.');
    }

    public function show(Organization $organization): Response
    {
        $organization->loadCount(['users', 'events']);
        $organization->load([
            'users' => fn ($q) => $q->with('roles:id,name')->latest()->limit(10),
            'events' => fn ($q) => $q->withoutGlobalScope('organization')->latest()->limit(10),
        ]);

        return Inertia::render('Admin/Organizations/Show', [
            'organization' => $organization,
        ]);
    }

    public function edit(Organization $organization): Response
    {
        return Inertia::render('Admin/Organizations/Edit', [
            'organization' => $organization,
        ]);
    }

    public function update(UpdateOrganizationRequest $request, Organization $organization): RedirectResponse
    {
        $organization->update($request->validated());

        return redirect()->route('admin.organizations.index')
            ->with('success', 'Organización actualizada exitosamente.');
    }

    public function toggleActive(Organization $organization): RedirectResponse
    {
        $organization->update(['is_active' => ! $organization->is_active]);

        $status = $organization->is_active ? 'activada' : 'desactivada';

        return back()->with('success', "Organización {$status} exitosamente.");
    }

    public function approve(Organization $organization): RedirectResponse
    {
        $organization->update([
            'approval_status' => Organization::APPROVAL_APPROVED,
            'approved_at' => now(),
            'is_active' => true,
            'rejection_reason' => null,
        ]);

        SendOrganizationApproved::dispatch($organization);

        return back()->with('success', "Organización '{$organization->name}' aprobada exitosamente.");
    }

    public function reject(Request $request, Organization $organization): RedirectResponse
    {
        $request->validate([
            'rejection_reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $organization->update([
            'approval_status' => Organization::APPROVAL_REJECTED,
            'is_active' => false,
            'rejection_reason' => $request->input('rejection_reason'),
        ]);

        SendOrganizationRejected::dispatch($organization);

        return back()->with('success', "Organización '{$organization->name}' rechazada.");
    }

    public function destroy(Organization $organization): RedirectResponse
    {
        $organization->delete();

        return redirect()->route('admin.organizations.index')
            ->with('success', 'Organización eliminada exitosamente.');
    }
}
