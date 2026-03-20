<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminOrganizationController;
use App\Http\Controllers\Admin\AdminSettingsController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\ImpersonationController;
use App\Http\Controllers\Auth\AttendeeRegisterController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\AttendeePortalController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AgendaItemController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\SpeakerApplicationController;
use App\Http\Controllers\SpeakerController;
use App\Http\Controllers\SponsorController;
use App\Http\Controllers\SponsorLevelController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\NetworkingController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\PublicCfpController;
use App\Http\Controllers\PublicEventController;
use App\Http\Controllers\PublicHomeController;
use App\Http\Controllers\PublicPageController;
use App\Http\Controllers\PublicSurveyController;
use App\Http\Controllers\CommunicationController;
use App\Http\Controllers\BadgeController;
use App\Http\Controllers\BadgeVerificationController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\ScannerController;
use App\Http\Controllers\SessionAttendanceController;
use App\Http\Controllers\SurveyController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Route;

// Public home (landing page)
Route::get('/', [PublicHomeController::class, 'index'])->name('home');

// Static pages
Route::get('/about', [PublicPageController::class, 'about'])->name('about');
Route::get('/privacy', [PublicPageController::class, 'privacy'])->name('privacy');
Route::get('/terms', [PublicPageController::class, 'terms'])->name('terms');

// Public event pages (no auth required)
Route::get('/e/{slug}', [PublicEventController::class, 'show'])->name('public.event');
Route::get('/e/{slug}/register', [PublicEventController::class, 'showRegistrationForm'])->name('public.event.register');
Route::post('/e/{slug}/register', [PublicEventController::class, 'register'])->name('public.event.register.store');
Route::get('/e/{slug}/registered/{registration_code}', [PublicEventController::class, 'registrationSuccess'])->name('public.event.registered');
Route::get('/e/{slug}/waitlist/{registration_code}', [PublicEventController::class, 'waitlistSuccess'])->name('public.event.waitlisted');

// Public CFP (Call for Proposals)
Route::get('/e/{slug}/cfp', [PublicCfpController::class, 'show'])->name('public.cfp');
Route::post('/e/{slug}/cfp', [PublicCfpController::class, 'store'])->name('public.cfp.store');

// Calendar exports (iCal)
Route::get('/e/{slug}/event.ics', [CalendarController::class, 'downloadEvent'])->name('public.event.ical');
Route::get('/e/{slug}/agenda.ics', [CalendarController::class, 'downloadAgenda'])->name('public.event.agenda.ical');

// Public surveys
Route::get('/e/{slug}/survey/{survey}', [PublicSurveyController::class, 'show'])->name('public.survey.show');
Route::post('/e/{slug}/survey/{survey}', [PublicSurveyController::class, 'submit'])->name('public.survey.submit');
Route::get('/e/{slug}/survey/{survey}/thanks', [PublicSurveyController::class, 'thanks'])->name('public.survey.thanks');

// Public session attendance (QR scan by participant)
Route::get('/e/{slug}/session/{attendanceCode}', [SessionAttendanceController::class, 'showPublic'])->name('public.session.show');
Route::post('/e/{slug}/session/{attendanceCode}', [SessionAttendanceController::class, 'recordPublic'])->name('public.session.record');

// Public session feedback
Route::get('/e/{slug}/session/{attendanceCode}/feedback', [\App\Http\Controllers\SessionFeedbackController::class, 'showPublic'])->name('public.session.feedback');
Route::post('/e/{slug}/session/{attendanceCode}/feedback', [\App\Http\Controllers\SessionFeedbackController::class, 'submitPublic'])->name('public.session.feedback.submit');

// Public badge verification (Blade for OG tags)
Route::get('/badge/{token}', [BadgeVerificationController::class, 'verify'])->name('public.badge.verify');
Route::get('/badge/{token}/download', [BadgeVerificationController::class, 'download'])->name('public.badge.download');

// Public participant badge portfolio
Route::get('/e/{slug}/badges/{registration_code}', [BadgeVerificationController::class, 'portfolio'])->name('public.badge.portfolio');

// Public networking (no auth required)
Route::get('/e/{slug}/networking/{registration_code}', [NetworkingController::class, 'show'])->name('public.networking');
Route::post('/e/{slug}/networking/{registration_code}/pin', [NetworkingController::class, 'updatePin'])->name('public.networking.pin');
Route::post('/e/{slug}/networking/{registration_code}/search', [NetworkingController::class, 'searchByCode'])->name('public.networking.search');
Route::post('/e/{slug}/networking/{registration_code}/verify-pin', [NetworkingController::class, 'verifyPinAndConnect'])->name('public.networking.verify-pin');
Route::post('/e/{slug}/networking/{registration_code}/profile', [NetworkingController::class, 'updateProfile'])->name('public.networking.profile.update');
Route::post('/e/{slug}/networking/{registration_code}/photo', [NetworkingController::class, 'uploadPhoto'])->name('public.networking.photo');
Route::get('/e/{slug}/networking/{registration_code}/profile', [NetworkingController::class, 'profile'])->name('public.networking.profile');
Route::get('/e/{slug}/networking/{registration_code}/directory', [NetworkingController::class, 'directory'])->name('public.networking.directory');
Route::get('/e/{slug}/networking/{registration_code}/contacts', [NetworkingController::class, 'myContacts'])->name('public.networking.contacts');
Route::post('/e/{slug}/networking/{registration_code}/contacts/save', [NetworkingController::class, 'saveContact'])->name('public.networking.contacts.save');
Route::post('/e/{slug}/networking/{registration_code}/contacts/accept', [NetworkingController::class, 'acceptContact'])->name('public.networking.contacts.accept');
Route::post('/e/{slug}/networking/{registration_code}/contacts/reject', [NetworkingController::class, 'rejectContact'])->name('public.networking.contacts.reject');
Route::post('/e/{slug}/networking/{registration_code}/contacts/remove', [NetworkingController::class, 'removeContact'])->name('public.networking.contacts.remove');
Route::post('/e/{slug}/networking/{registration_code}/contacts/connect-with-pin', [NetworkingController::class, 'connectWithPin'])->name('public.networking.contacts.connect-with-pin');

// Guest routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->middleware('throttle:5,1');

    // Attendee registration
    Route::get('/register', [AttendeeRegisterController::class, 'create'])->name('register');
    Route::post('/register', [AttendeeRegisterController::class, 'store'])->middleware('throttle:5,1');

    // Forgot & reset password
    Route::get('/forgot-password', [ForgotPasswordController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [ForgotPasswordController::class, 'store'])->name('password.email')->middleware('throttle:5,1');
    Route::get('/reset-password/{token}', [ResetPasswordController::class, 'create'])->name('password.reset');
    Route::post('/reset-password', [ResetPasswordController::class, 'store'])->name('password.update')->middleware('throttle:5,1');

    // Organizer login & registration
    Route::get('/organizer/login', fn () => \Inertia\Inertia::render('Auth/LoginOrganizer'))->name('organizer.login');
    Route::post('/organizer/login', [LoginController::class, 'store'])->middleware('throttle:5,1');
    Route::get('/organizer/register', [RegisterController::class, 'create'])->name('organizer.register');
    Route::post('/organizer/register', [RegisterController::class, 'store'])->middleware('throttle:5,1');
});

// Authenticated routes (shared)
Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
    Route::get('/logout', [LoginController::class, 'destroy']);

    // Email verification
    Route::get('/email/verify', function () {
        return \Inertia\Inertia::render('Auth/VerifyEmail');
    })->name('verification.notice');

    Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
        $request->fulfill();

        return redirect()->route('dashboard');
    })->middleware('signed')->name('verification.verify');

    Route::post('/email/verification-notification', function () {
        request()->user()->sendEmailVerificationNotification();

        return back()->with('success', 'Se ha reenviado el enlace de verificación.');
    })->middleware('throttle:6,1')->name('verification.send');

    // Pending approval page (for orgs awaiting approval)
    Route::get('/pending-approval', function () {
        $user = auth()->user();
        $org = $user->organization;

        if (! $org || $org->isApproved()) {
            return redirect()->route('dashboard');
        }

        return \Inertia\Inertia::render('Auth/PendingApproval', [
            'organization' => [
                'name' => $org->name,
                'approval_status' => $org->approval_status,
                'rejection_reason' => $org->rejection_reason,
            ],
        ]);
    })->name('pending-approval');
});

// Attendee Portal routes (authenticated participants)
Route::middleware(['auth', 'verified', 'attendee'])->prefix('portal')->name('portal.')->group(function () {
    Route::get('/', [AttendeePortalController::class, 'dashboard'])->name('dashboard');
    Route::get('/profile', [AttendeePortalController::class, 'profile'])->name('profile');
    Route::put('/profile', [AttendeePortalController::class, 'updateProfileData'])->name('profile.update');
    Route::put('/profile/password', [AttendeePortalController::class, 'updatePassword'])->name('profile.password');
    Route::get('/events/{event}/ticket', [AttendeePortalController::class, 'ticket'])->name('ticket');
    Route::get('/events/{event}/agenda', [AttendeePortalController::class, 'agenda'])->name('agenda');
    Route::get('/events/{event}/speakers', [AttendeePortalController::class, 'speakers'])->name('speakers');
    Route::get('/events/{event}/sponsors', [AttendeePortalController::class, 'sponsors'])->name('sponsors');
    Route::get('/events/{event}/networking', [AttendeePortalController::class, 'networking'])->name('networking');
    Route::get('/events/{event}/directory', [AttendeePortalController::class, 'directory'])->name('directory');
    Route::get('/events/{event}/contacts', [AttendeePortalController::class, 'contacts'])->name('contacts');
    Route::get('/events/{event}/contacts/export', [AttendeePortalController::class, 'exportContacts'])->name('contacts.export');
    Route::get('/events/{event}/surveys', [AttendeePortalController::class, 'surveys'])->name('surveys');
    Route::get('/events/{event}/announcements', [AttendeePortalController::class, 'announcements'])->name('announcements');
    Route::get('/events/{event}/badges', [AttendeePortalController::class, 'badges'])->name('badges');
    Route::get('/events/{event}/speaker-dashboard', [AttendeePortalController::class, 'speakerDashboard'])->name('speaker-dashboard');
    Route::get('/events/{event}/certificate/download', [AttendeePortalController::class, 'downloadCertificate'])->name('certificate.download');

    // Actions
    Route::post('/events/{event}/networking/search', [AttendeePortalController::class, 'searchByCode'])->name('networking.search');
    Route::post('/events/{event}/networking/verify-pin', [AttendeePortalController::class, 'verifyPinAndConnect'])->name('networking.verify-pin');
    Route::post('/events/{event}/networking/pin', [AttendeePortalController::class, 'updatePin'])->name('networking.pin');
    Route::post('/events/{event}/networking/profile', [AttendeePortalController::class, 'updateProfile'])->name('networking.profile');
    Route::post('/events/{event}/networking/photo', [AttendeePortalController::class, 'uploadPhoto'])->name('networking.photo');
    Route::post('/events/{event}/contacts/save', [AttendeePortalController::class, 'saveContact'])->name('contacts.save');
    Route::post('/events/{event}/contacts/accept', [AttendeePortalController::class, 'acceptContact'])->name('contacts.accept');
    Route::post('/events/{event}/contacts/reject', [AttendeePortalController::class, 'rejectContact'])->name('contacts.reject');
    Route::post('/events/{event}/contacts/remove', [AttendeePortalController::class, 'removeContact'])->name('contacts.remove');
    Route::post('/events/{event}/contacts/connect-with-pin', [AttendeePortalController::class, 'connectWithPin'])->name('contacts.connect-with-pin');
});

// Admin routes (super_admin only)
Route::middleware(['auth', 'verified', 'super_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', AdminDashboardController::class)->name('dashboard');

    // Organizations CRUD
    Route::resource('organizations', AdminOrganizationController::class);
    Route::patch('organizations/{organization}/toggle-active', [AdminOrganizationController::class, 'toggleActive'])
        ->name('organizations.toggle-active');
    Route::patch('organizations/{organization}/approve', [AdminOrganizationController::class, 'approve'])
        ->name('organizations.approve');
    Route::patch('organizations/{organization}/reject', [AdminOrganizationController::class, 'reject'])
        ->name('organizations.reject');

    // Users management
    Route::resource('users', AdminUserController::class)->except(['show']);
    Route::patch('users/{user}/toggle-active', [AdminUserController::class, 'toggleActive'])
        ->withTrashed()
        ->name('users.toggle-active');

    // Impersonation
    Route::post('impersonate/{organization}', [ImpersonationController::class, 'start'])
        ->name('impersonate.start');
    Route::delete('impersonate', [ImpersonationController::class, 'stop'])
        ->name('impersonate.stop');

    // Settings
    Route::get('settings', [AdminSettingsController::class, 'edit'])->name('settings');
    Route::put('settings', [AdminSettingsController::class, 'update'])->name('settings.update');
    Route::post('settings/test-smtp', [AdminSettingsController::class, 'testConnection'])->name('settings.test-smtp');
    Route::post('settings/toggle-organizer-registration', [AdminSettingsController::class, 'toggleOrganizerRegistration'])->name('settings.toggle-organizer-registration');
});

// Organization-level routes (requires org context)
Route::middleware(['auth', 'verified', 'has_organization'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    // Organization settings
    Route::get('/organization', [OrganizationController::class, 'edit'])->name('organization.edit');
    Route::put('/organization', [OrganizationController::class, 'update'])->name('organization.update');
    Route::post('/organization/logo', [OrganizationController::class, 'updateLogo'])->name('organization.logo');

    // Reports
    Route::get('/reports', [\App\Http\Controllers\ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export/pdf', [\App\Http\Controllers\ReportExportController::class, 'organizationReport'])->name('reports.export.pdf');

    // Events
    Route::resource('events', EventController::class);
    Route::post('events/{event}/cover', [EventController::class, 'updateCover'])->name('events.cover');
    Route::post('events/{event}/event-image', [EventController::class, 'updateEventImage'])->name('events.event-image');
    Route::get('events/{event}/credential-designer', [EventController::class, 'credentialDesigner'])->name('events.credential-designer');
    Route::put('events/{event}/credential-design', [EventController::class, 'updateCredentialDesign'])->name('events.credential-design.update');
    Route::patch('events/{event}/status', [EventController::class, 'updateStatus'])->name('events.status');

    // Event nested resources
    Route::prefix('events/{event}')->name('events.')->group(function () {
        // Sponsor Levels
        Route::get('sponsor-levels', [SponsorLevelController::class, 'index'])->name('sponsor-levels.index');
        Route::post('sponsor-levels', [SponsorLevelController::class, 'store'])->name('sponsor-levels.store');
        Route::put('sponsor-levels/{sponsorLevel}', [SponsorLevelController::class, 'update'])->name('sponsor-levels.update');
        Route::delete('sponsor-levels/{sponsorLevel}', [SponsorLevelController::class, 'destroy'])->name('sponsor-levels.destroy');
        Route::post('sponsor-levels/reorder', [SponsorLevelController::class, 'reorder'])->name('sponsor-levels.reorder');

        // Participants
        Route::get('participants', [ParticipantController::class, 'index'])->name('participants.index');
        Route::get('participants/create', [ParticipantController::class, 'create'])->name('participants.create');
        Route::get('participants/export', [ParticipantController::class, 'exportCsv'])->name('participants.export');
        Route::get('participants/export/pdf', [\App\Http\Controllers\ReportExportController::class, 'participantsList'])->name('participants.export.pdf');
        Route::get('report/pdf', [\App\Http\Controllers\ReportExportController::class, 'eventReport'])->name('report.pdf');
        Route::post('participants/import', [ParticipantController::class, 'bulkImport'])->name('participants.import');
        Route::post('participants', [ParticipantController::class, 'store'])->name('participants.store');
        Route::get('participants/{participant}/edit', [ParticipantController::class, 'edit'])->name('participants.edit');
        Route::put('participants/{participant}', [ParticipantController::class, 'update'])->name('participants.update');
        Route::delete('participants/{participant}', [ParticipantController::class, 'destroy'])->name('participants.destroy');
        Route::post('participants/{participant}/check-in', [ParticipantController::class, 'checkIn'])->name('participants.check-in');
        Route::get('participants/{participant}/credential', [ParticipantController::class, 'credential'])->name('participants.credential');

        // Speakers
        Route::get('speakers', [SpeakerController::class, 'index'])->name('speakers.index');
        Route::get('speakers/create', [SpeakerController::class, 'create'])->name('speakers.create');
        Route::post('speakers/reorder', [SpeakerController::class, 'reorder'])->name('speakers.reorder');
        Route::post('speakers', [SpeakerController::class, 'store'])->name('speakers.store');
        Route::get('speakers/{speaker}/edit', [SpeakerController::class, 'edit'])->name('speakers.edit');
        Route::put('speakers/{speaker}', [SpeakerController::class, 'update'])->name('speakers.update');
        Route::delete('speakers/{speaker}', [SpeakerController::class, 'destroy'])->name('speakers.destroy');
        Route::post('speakers/{speaker}/photo', [SpeakerController::class, 'updatePhoto'])->name('speakers.photo');

        // Sponsors
        Route::get('sponsors', [SponsorController::class, 'index'])->name('sponsors.index');
        Route::get('sponsors/create', [SponsorController::class, 'create'])->name('sponsors.create');
        Route::post('sponsors/reorder', [SponsorController::class, 'reorder'])->name('sponsors.reorder');
        Route::post('sponsors', [SponsorController::class, 'store'])->name('sponsors.store');
        Route::get('sponsors/{sponsor}/edit', [SponsorController::class, 'edit'])->name('sponsors.edit');
        Route::put('sponsors/{sponsor}', [SponsorController::class, 'update'])->name('sponsors.update');
        Route::delete('sponsors/{sponsor}', [SponsorController::class, 'destroy'])->name('sponsors.destroy');
        Route::post('sponsors/{sponsor}/logo', [SponsorController::class, 'updateLogo'])->name('sponsors.logo');

        // Communities
        Route::get('communities', [CommunityController::class, 'index'])->name('communities.index');
        Route::get('communities/create', [CommunityController::class, 'create'])->name('communities.create');
        Route::post('communities/reorder', [CommunityController::class, 'reorder'])->name('communities.reorder');
        Route::post('communities', [CommunityController::class, 'store'])->name('communities.store');
        Route::get('communities/{community}/edit', [CommunityController::class, 'edit'])->name('communities.edit');
        Route::put('communities/{community}', [CommunityController::class, 'update'])->name('communities.update');
        Route::delete('communities/{community}', [CommunityController::class, 'destroy'])->name('communities.destroy');
        Route::post('communities/{community}/logo', [CommunityController::class, 'updateLogo'])->name('communities.logo');

        // Scanner
        Route::get('scanner', [ScannerController::class, 'show'])->name('scanner.show');
        Route::post('scanner/scan', [ScannerController::class, 'scan'])->name('scanner.scan');
        Route::get('scanner/stats', [ScannerController::class, 'stats'])->name('scanner.stats');
        Route::get('scanner/reports', [ScannerController::class, 'reports'])->name('scanner.reports');

        // Agenda
        Route::get('agenda', [AgendaItemController::class, 'index'])->name('agenda.index');
        Route::get('agenda/create', [AgendaItemController::class, 'create'])->name('agenda.create');
        Route::post('agenda/reorder', [AgendaItemController::class, 'reorder'])->name('agenda.reorder');
        Route::patch('agenda/{agendaItem}/move', [AgendaItemController::class, 'move'])->name('agenda.move');
        Route::post('agenda', [AgendaItemController::class, 'store'])->name('agenda.store');
        Route::get('agenda/{agendaItem}/edit', [AgendaItemController::class, 'edit'])->name('agenda.edit');
        Route::put('agenda/{agendaItem}', [AgendaItemController::class, 'update'])->name('agenda.update');
        Route::delete('agenda/{agendaItem}', [AgendaItemController::class, 'destroy'])->name('agenda.destroy');

        // Communications
        Route::get('communications', [CommunicationController::class, 'index'])->name('communications.index');
        Route::get('communications/create', [CommunicationController::class, 'create'])->name('communications.create');
        Route::post('communications', [CommunicationController::class, 'store'])->name('communications.store');
        Route::get('communications/{communication}', [CommunicationController::class, 'show'])->name('communications.show');
        Route::delete('communications/{communication}', [CommunicationController::class, 'destroy'])->name('communications.destroy');

        // Surveys
        Route::get('surveys', [SurveyController::class, 'index'])->name('surveys.index');
        Route::get('surveys/create', [SurveyController::class, 'create'])->name('surveys.create');
        Route::post('surveys', [SurveyController::class, 'store'])->name('surveys.store');
        Route::get('surveys/{survey}/edit', [SurveyController::class, 'edit'])->name('surveys.edit');
        Route::put('surveys/{survey}', [SurveyController::class, 'update'])->name('surveys.update');
        Route::delete('surveys/{survey}', [SurveyController::class, 'destroy'])->name('surveys.destroy');
        Route::get('surveys/{survey}/results', [SurveyController::class, 'results'])->name('surveys.results');

        // Badges
        Route::get('badges', [BadgeController::class, 'index'])->name('badges.index');
        Route::get('badges/create', [BadgeController::class, 'create'])->name('badges.create');
        Route::post('badges', [BadgeController::class, 'store'])->name('badges.store');
        Route::get('badges/{badge}/edit', [BadgeController::class, 'edit'])->name('badges.edit');
        Route::put('badges/{badge}', [BadgeController::class, 'update'])->name('badges.update');
        Route::delete('badges/{badge}', [BadgeController::class, 'destroy'])->name('badges.destroy');
        Route::post('badges/{badge}/award', [BadgeController::class, 'award'])->name('badges.award');
        Route::post('badges/{badge}/revoke', [BadgeController::class, 'revoke'])->name('badges.revoke');
        Route::get('badges/{badge}/participants', [BadgeController::class, 'participants'])->name('badges.participants');
        Route::get('badges-analytics', [BadgeController::class, 'analytics'])->name('badges.analytics');

        // CFP (Call for Proposals)
        Route::get('cfp', [SpeakerApplicationController::class, 'index'])->name('cfp.index');
        Route::post('cfp/toggle', [SpeakerApplicationController::class, 'toggleCfp'])->name('cfp.toggle');
        Route::get('cfp/{application}', [SpeakerApplicationController::class, 'show'])->name('cfp.show');
        Route::patch('cfp/{application}/status', [SpeakerApplicationController::class, 'updateStatus'])->name('cfp.status');

        // Session Attendance
        Route::get('attendance', [SessionAttendanceController::class, 'index'])->name('attendance.index');
        Route::get('agenda/{agendaItem}/attendance-qr', [SessionAttendanceController::class, 'attendanceQR'])->name('agenda.attendance-qr');
        Route::get('agenda/{agendaItem}/attendance-qr/live', [SessionAttendanceController::class, 'attendanceQRLive'])->name('agenda.attendance-qr.live');

        // Session Feedback
        Route::get('agenda/{agendaItem}/feedback', [\App\Http\Controllers\SessionFeedbackController::class, 'results'])->name('agenda.feedback');

        // Certificates
        Route::get('certificates', [CertificateController::class, 'index'])->name('certificates.index');
        Route::put('certificates/config', [CertificateController::class, 'updateConfig'])->name('certificates.config.update');
        Route::post('certificates/background', [CertificateController::class, 'uploadBackground'])->name('certificates.background');
        Route::delete('certificates/background', [CertificateController::class, 'removeBackground'])->name('certificates.background.remove');
        Route::post('certificates/signature', [CertificateController::class, 'uploadSignature'])->name('certificates.signature');
        Route::delete('certificates/signature/{index}', [CertificateController::class, 'removeSignature'])->name('certificates.signature.remove');
        Route::get('certificates/preview', [CertificateController::class, 'preview'])->name('certificates.preview');
        Route::get('certificates/download-all', [CertificateController::class, 'downloadBulkZip'])->name('certificates.download-all');
        Route::get('certificates/download-all-pdf', [CertificateController::class, 'downloadBulkPdf'])->name('certificates.download-all-pdf');
        Route::get('certificates/{participant}/download', [CertificateController::class, 'downloadForParticipant'])->name('certificates.download');
    });
});
