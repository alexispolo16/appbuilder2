<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PublicPageController extends Controller
{
    public function about(): Response
    {
        return Inertia::render('Public/About');
    }

    public function privacy(): Response
    {
        return Inertia::render('Public/PrivacyPolicy');
    }

    public function terms(): Response
    {
        return Inertia::render('Public/TermsConditions');
    }
}
