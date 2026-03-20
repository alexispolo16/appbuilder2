/**
 * BuilderApp - Screenshot Capture Script
 * Captures all major pages for the CEO brochure PDF
 */
import puppeteer from 'puppeteer-core';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = join(__dirname, '..', 'storage', 'app', 'screenshots');
const BASE = 'http://127.0.0.1:8001';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// Credentials
const ORG_ADMIN = { email: 'admin@builderapp.app', password: 'password' };
const SUPER_ADMIN = { email: 'superadmin@builderapp.app', password: 'password' };
const PARTICIPANT = { email: 'jo-teran@hotmail.com', password: 'password' };

// Event data
const EVENT_SLUG = 'devfest-ecuador-2026';
const EVENT_ID = '01kk25d7wrhdy7xv75njkkbgcj';
const PARTICIPANT_CODE = 'EJQDDYNA';

async function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function screenshot(page, name, opts = {}) {
    const path = join(SCREENSHOTS_DIR, `${name}.png`);
    await delay(800); // Wait for renders
    await page.screenshot({ path, fullPage: opts.fullPage ?? true, ...opts });
    console.log(`  ✓ ${name}`);
    return path;
}

async function login(page, creds) {
    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2', timeout: 15000 });
    await delay(500);

    // Clear and fill email
    const emailInput = await page.$('input[type="email"], input[name="email"]');
    if (emailInput) {
        await emailInput.click({ clickCount: 3 });
        await emailInput.type(creds.email);
    }

    // Clear and fill password
    const passwordInput = await page.$('input[type="password"], input[name="password"]');
    if (passwordInput) {
        await passwordInput.click({ clickCount: 3 });
        await passwordInput.type(creds.password);
    }

    // Submit
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
        await submitBtn.click();
    }

    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
    await delay(1000);
}

async function loginOrganizer(page, creds) {
    await page.goto(`${BASE}/organizer/login`, { waitUntil: 'networkidle2', timeout: 15000 });
    await delay(500);

    const emailInput = await page.$('input[type="email"], input[name="email"]');
    if (emailInput) {
        await emailInput.click({ clickCount: 3 });
        await emailInput.type(creds.email);
    }

    const passwordInput = await page.$('input[type="password"], input[name="password"]');
    if (passwordInput) {
        await passwordInput.click({ clickCount: 3 });
        await passwordInput.type(creds.password);
    }

    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) await submitBtn.click();

    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
    await delay(1000);
}

async function logout(page) {
    await page.goto(`${BASE}/logout`, { waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
    await delay(500);
}

async function main() {
    await mkdir(SCREENSHOTS_DIR, { recursive: true });

    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
        defaultViewport: { width: 1440, height: 900 },
    });

    const page = await browser.newPage();
    page.setDefaultTimeout(12000);
    const files = [];

    try {
        // ============================================
        // SECTION 1: PUBLIC PAGES
        // ============================================
        console.log('\n📸 PAGINAS PUBLICAS');

        await page.goto(`${BASE}/`, { waitUntil: 'networkidle2' });
        await delay(1000);
        files.push(await screenshot(page, '01-landing-home'));

        await page.goto(`${BASE}/e/${EVENT_SLUG}`, { waitUntil: 'networkidle2' });
        await delay(1000);
        files.push(await screenshot(page, '02-evento-publico'));

        await page.goto(`${BASE}/e/${EVENT_SLUG}/register`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '03-registro-evento'));

        await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '04-login-asistente'));

        await page.goto(`${BASE}/register`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '05-registro-asistente'));

        await page.goto(`${BASE}/organizer/login`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '06-login-organizador'));

        await page.goto(`${BASE}/organizer/register`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '07-registro-organizador'));

        // Public networking
        await page.goto(`${BASE}/e/${EVENT_SLUG}/networking/${PARTICIPANT_CODE}`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '08-networking-publico'));

        await page.goto(`${BASE}/e/${EVENT_SLUG}/networking/${PARTICIPANT_CODE}/directory`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '09-directorio-publico'));

        // ============================================
        // SECTION 2: ATTENDEE PORTAL
        // ============================================
        console.log('\n📸 PORTAL DEL ASISTENTE');

        await login(page, PARTICIPANT);
        files.push(await screenshot(page, '10-portal-dashboard'));

        await page.goto(`${BASE}/portal/events/${EVENT_ID}/ticket`, { waitUntil: 'networkidle2' });
        await delay(1000);
        files.push(await screenshot(page, '11-portal-ticket'));

        await page.goto(`${BASE}/portal/events/${EVENT_ID}/agenda`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '12-portal-agenda'));

        await page.goto(`${BASE}/portal/events/${EVENT_ID}/speakers`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '13-portal-speakers'));

        await page.goto(`${BASE}/portal/events/${EVENT_ID}/sponsors`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '14-portal-sponsors'));

        await page.goto(`${BASE}/portal/events/${EVENT_ID}/networking`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '15-portal-networking'));

        await page.goto(`${BASE}/portal/events/${EVENT_ID}/directory`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '16-portal-directorio'));

        await page.goto(`${BASE}/portal/events/${EVENT_ID}/contacts`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '17-portal-contactos'));

        await page.goto(`${BASE}/portal/events/${EVENT_ID}/surveys`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '18-portal-encuestas'));

        await page.goto(`${BASE}/portal/events/${EVENT_ID}/announcements`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '19-portal-anuncios'));

        await page.goto(`${BASE}/portal/profile`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '20-portal-perfil'));

        await logout(page);

        // ============================================
        // SECTION 3: ORGANIZER DASHBOARD
        // ============================================
        console.log('\n📸 DASHBOARD ORGANIZADOR');

        await loginOrganizer(page, ORG_ADMIN);
        files.push(await screenshot(page, '21-org-dashboard'));

        // Events list
        await page.goto(`${BASE}/events`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '22-org-eventos'));

        // Event detail
        await page.goto(`${BASE}/events/${EVENT_ID}`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '23-org-evento-detalle'));

        // Participants
        await page.goto(`${BASE}/events/${EVENT_ID}/participants`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '24-org-participantes'));

        // Speakers
        await page.goto(`${BASE}/events/${EVENT_ID}/speakers`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '25-org-speakers'));

        // Sponsors
        await page.goto(`${BASE}/events/${EVENT_ID}/sponsors`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '26-org-sponsors'));

        // Agenda
        await page.goto(`${BASE}/events/${EVENT_ID}/agenda`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '27-org-agenda'));

        // Communications
        await page.goto(`${BASE}/events/${EVENT_ID}/communications`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '28-org-comunicaciones'));

        // Surveys
        await page.goto(`${BASE}/events/${EVENT_ID}/surveys`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '29-org-encuestas'));

        // Communities
        await page.goto(`${BASE}/events/${EVENT_ID}/communities`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '30-org-comunidades'));

        // Scanner
        await page.goto(`${BASE}/events/${EVENT_ID}/scanner`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '31-org-scanner'));

        // Credential designer
        await page.goto(`${BASE}/events/${EVENT_ID}/credential-designer`, { waitUntil: 'networkidle2' });
        await delay(1000);
        files.push(await screenshot(page, '32-org-credential-designer'));

        // Reports
        await page.goto(`${BASE}/reports`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '33-org-reportes'));

        // Organization settings
        await page.goto(`${BASE}/organization`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '34-org-configuracion'));

        await logout(page);

        // ============================================
        // SECTION 4: SUPER ADMIN
        // ============================================
        console.log('\n📸 SUPER ADMIN');

        await loginOrganizer(page, SUPER_ADMIN);

        // Admin may redirect differently, go directly
        await page.goto(`${BASE}/admin/dashboard`, { waitUntil: 'networkidle2' });
        await delay(1000);
        files.push(await screenshot(page, '35-admin-dashboard'));

        await page.goto(`${BASE}/admin/organizations`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '36-admin-organizaciones'));

        await page.goto(`${BASE}/admin/users`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '37-admin-usuarios'));

        await page.goto(`${BASE}/admin/settings`, { waitUntil: 'networkidle2' });
        await delay(500);
        files.push(await screenshot(page, '38-admin-configuracion'));

        console.log(`\n✅ ${files.length} screenshots captured in ${SCREENSHOTS_DIR}`);

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await browser.close();
    }
}

main();
