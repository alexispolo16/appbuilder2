/**
 * BuilderApp - PDF Brochure Generator
 * Generates a professional PDF with screenshots for CEO review
 */
import puppeteer from 'puppeteer-core';
import { readdir, readFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = join(__dirname, '..', 'storage', 'app', 'screenshots');
const OUTPUT_DIR = join(__dirname, '..', 'storage', 'app');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const sections = [
    {
        title: 'Paginas Publicas',
        subtitle: 'Experiencia del visitante antes de registrarse',
        screens: [
            { file: '01-landing-home.png', label: 'Pagina Principal', desc: 'Landing page con listado de eventos publicados, busqueda y acceso rapido a registro.' },
            { file: '02-evento-publico.png', label: 'Pagina del Evento', desc: 'Detalle publico del evento con speakers, sponsors, agenda y boton de registro.' },
            { file: '03-registro-evento.png', label: 'Formulario de Registro', desc: 'Formulario de inscripcion con datos del participante y validacion de capacidad.' },
            { file: '04-login-asistente.png', label: 'Login de Asistentes', desc: 'Acceso al portal del participante con credenciales enviadas por email.' },
            { file: '05-registro-asistente.png', label: 'Registro de Asistentes', desc: 'Creacion de cuenta para asistentes que quieren gestionar sus eventos.' },
            { file: '06-login-organizador.png', label: 'Login de Organizadores', desc: 'Acceso independiente para organizadores de eventos.' },
            { file: '07-registro-organizador.png', label: 'Registro de Organizacion', desc: 'Registro de nuevas organizaciones con flujo de aprobacion.' },
            { file: '08-networking-publico.png', label: 'Networking Publico', desc: 'Hub de networking con busqueda por PIN y conexion entre participantes.' },
            { file: '09-directorio-publico.png', label: 'Directorio Publico', desc: 'Directorio de asistentes visibles para networking y contacto.' },
        ],
    },
    {
        title: 'Portal del Asistente',
        subtitle: 'Experiencia completa del participante registrado',
        screens: [
            { file: '10-portal-dashboard.png', label: 'Dashboard del Asistente', desc: 'Vista de todos los eventos registrados con estados y acceso rapido.' },
            { file: '11-portal-ticket.png', label: 'Entrada Digital', desc: 'Ticket con codigo QR, codigo de registro, descarga PNG y pantalla completa.' },
            { file: '12-portal-agenda.png', label: 'Agenda del Evento', desc: 'Programa completo organizado por dia con horarios y speakers.' },
            { file: '13-portal-speakers.png', label: 'Speakers', desc: 'Perfiles de ponentes con foto, bio, empresa y redes sociales.' },
            { file: '14-portal-sponsors.png', label: 'Sponsors', desc: 'Patrocinadores organizados por nivel con logos y descripcion.' },
            { file: '15-portal-networking.png', label: 'Networking', desc: 'Busqueda por PIN, conexion rapida y gestion de contactos profesionales.' },
            { file: '16-portal-directorio.png', label: 'Directorio', desc: 'Busqueda de otros asistentes con filtros por nombre y empresa.' },
            { file: '17-portal-contactos.png', label: 'Mis Contactos', desc: 'Contactos guardados con exportacion CSV y gestion de solicitudes.' },
            { file: '18-portal-encuestas.png', label: 'Encuestas', desc: 'Encuestas asignadas por evento con estado de respuesta.' },
            { file: '19-portal-anuncios.png', label: 'Anuncios', desc: 'Comunicaciones enviadas por los organizadores del evento.' },
            { file: '20-portal-perfil.png', label: 'Mi Perfil', desc: 'Datos personales, contrasena y networking por evento con PIN y contactos.' },
        ],
    },
    {
        title: 'Panel del Organizador',
        subtitle: 'Herramientas completas para gestionar eventos',
        screens: [
            { file: '21-org-dashboard.png', label: 'Dashboard', desc: 'Metricas, graficos de participantes, estados de eventos y actividad reciente.' },
            { file: '22-org-eventos.png', label: 'Gestion de Eventos', desc: 'Listado con busqueda, filtros por estado, creacion y edicion de eventos.' },
            { file: '23-org-evento-detalle.png', label: 'Detalle del Evento', desc: 'Vista general con contadores de participantes, speakers, sponsors y agenda.' },
            { file: '24-org-participantes.png', label: 'Participantes', desc: 'Gestion completa: registro manual, importacion CSV, filtros, exportacion PDF/CSV.' },
            { file: '25-org-speakers.png', label: 'Speakers', desc: 'Gestion de ponentes con fotos, bios, redes sociales y orden personalizable.' },
            { file: '26-org-sponsors.png', label: 'Sponsors', desc: 'Patrocinadores por niveles (Oro, Plata, Bronce), logos y seguimiento de pagos.' },
            { file: '27-org-agenda.png', label: 'Agenda', desc: 'Constructor de agenda con sesiones, breaks, asignacion de speakers y reordenamiento.' },
            { file: '28-org-comunicaciones.png', label: 'Comunicaciones', desc: 'Envio masivo de emails a participantes con historial y seguimiento.' },
            { file: '29-org-encuestas.png', label: 'Encuestas', desc: 'Creador de encuestas (texto, rating, opcion multiple) con dashboard de resultados.' },
            { file: '30-org-comunidades.png', label: 'Comunidades', desc: 'Gestion de comunidades asociadas al evento con logos y enlaces.' },
            { file: '31-org-scanner.png', label: 'Scanner de Check-in', desc: 'Escaneo QR con feedback audiovisual, prevencion de duplicados y estadisticas.' },
            { file: '32-org-credential-designer.png', label: 'Disenador de Credenciales', desc: 'Editor visual de entradas: colores, gradientes, logos de sponsors y vista previa.' },
            { file: '33-org-reportes.png', label: 'Reportes', desc: 'Analitica: participantes por evento, tasas de check-in, tendencias y exportacion PDF.' },
            { file: '34-org-configuracion.png', label: 'Configuracion', desc: 'Datos de la organizacion, logo, colores de marca y configuracion general.' },
        ],
    },
    {
        title: 'Administracion de Plataforma',
        subtitle: 'Control total del ecosistema (Super Admin)',
        screens: [
            { file: '35-admin-dashboard.png', label: 'Dashboard Global', desc: 'Metricas de toda la plataforma: organizaciones, usuarios, eventos y crecimiento.' },
            { file: '36-admin-organizaciones.png', label: 'Organizaciones', desc: 'Gestion completa: aprobacion, rechazo, activacion e impersonacion.' },
            { file: '37-admin-usuarios.png', label: 'Usuarios', desc: 'Gestion de todos los usuarios de la plataforma con roles y estados.' },
            { file: '38-admin-configuracion.png', label: 'Configuracion SMTP', desc: 'Servidor de correo: host, puerto, cifrado, prueba de conexion.' },
        ],
    },
];

function buildHTML(screenshotDataMap) {
    let html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
    @page { size: A4 landscape; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #16191f; }

    .cover {
        width: 100%; height: 100vh;
        background: linear-gradient(135deg, #0972d3 0%, #033160 100%);
        display: flex; flex-direction: column;
        justify-content: center; align-items: center;
        color: white; text-align: center;
        page-break-after: always;
    }
    .cover h1 { font-size: 64px; font-weight: 800; margin-bottom: 16px; letter-spacing: -1px; }
    .cover h2 { font-size: 28px; font-weight: 400; opacity: 0.9; margin-bottom: 40px; }
    .cover .tagline { font-size: 18px; opacity: 0.7; max-width: 600px; line-height: 1.6; }
    .cover .date { position: absolute; bottom: 40px; font-size: 14px; opacity: 0.5; }

    .section-cover {
        width: 100%; height: 100vh;
        background: linear-gradient(135deg, #f0f3f8 0%, #d1e3f8 100%);
        display: flex; flex-direction: column;
        justify-content: center; align-items: center;
        text-align: center;
        page-break-after: always;
    }
    .section-cover .number { font-size: 120px; font-weight: 900; color: #0972d3; opacity: 0.15; }
    .section-cover h2 { font-size: 44px; font-weight: 700; color: #033160; margin-top: -30px; }
    .section-cover p { font-size: 20px; color: #5f6b7a; margin-top: 12px; }

    .page {
        width: 100%; min-height: 100vh;
        padding: 40px 50px;
        page-break-after: always;
        display: flex; flex-direction: column;
    }
    .page-header {
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 20px; padding-bottom: 12px;
        border-bottom: 3px solid #0972d3;
    }
    .page-header h3 { font-size: 26px; color: #033160; }
    .page-header .badge {
        background: #0972d3; color: white;
        padding: 4px 16px; border-radius: 20px;
        font-size: 12px; font-weight: 600; text-transform: uppercase;
    }
    .page-desc {
        font-size: 15px; color: #5f6b7a; margin-bottom: 20px; line-height: 1.5;
    }
    .screenshot-container {
        flex: 1; display: flex; justify-content: center; align-items: flex-start;
        background: #f4f4f4; border-radius: 12px; padding: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        overflow: hidden;
    }
    .screenshot-container img {
        max-width: 100%; max-height: 580px;
        object-fit: contain; border-radius: 6px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    }
    .footer-bar {
        margin-top: 16px; text-align: right;
        font-size: 11px; color: #9ba7b6;
    }

    .summary-page {
        width: 100%; min-height: 100vh;
        padding: 60px;
        page-break-after: always;
    }
    .summary-page h2 { font-size: 36px; color: #033160; margin-bottom: 30px; text-align: center; }
    .features-grid {
        display: grid; grid-template-columns: 1fr 1fr;
        gap: 20px; margin-top: 20px;
    }
    .feature-card {
        background: #f0f3f8; border-radius: 12px; padding: 24px;
        border-left: 4px solid #0972d3;
    }
    .feature-card h4 { font-size: 16px; color: #033160; margin-bottom: 8px; }
    .feature-card p { font-size: 13px; color: #5f6b7a; line-height: 1.5; }
    .feature-card .count { font-size: 28px; font-weight: 800; color: #0972d3; }

    .back-cover {
        width: 100%; height: 100vh;
        background: linear-gradient(135deg, #033160 0%, #0972d3 100%);
        display: flex; flex-direction: column;
        justify-content: center; align-items: center;
        color: white; text-align: center;
    }
    .back-cover h2 { font-size: 40px; font-weight: 700; margin-bottom: 20px; }
    .back-cover p { font-size: 18px; opacity: 0.8; line-height: 1.6; max-width: 500px; }
</style>
</head>
<body>

<!-- COVER -->
<div class="cover">
    <h1>BuilderApp</h1>
    <h2>Plataforma SaaS de Gestion de Eventos</h2>
    <div class="tagline">
        Solución integral para crear, administrar y potenciar eventos profesionales.
        Registro, check-in, networking, encuestas, comunicaciones y analitica en una sola plataforma.
    </div>
    <div class="date">Documento confidencial — Marzo 2026</div>
</div>

<!-- SUMMARY PAGE -->
<div class="summary-page">
    <h2>Resumen de Capacidades</h2>
    <div class="features-grid">
        <div class="feature-card">
            <div class="count">70+</div>
            <h4>Pantallas Funcionales</h4>
            <p>Paginas interactivas para asistentes, organizadores y administradores de plataforma.</p>
        </div>
        <div class="feature-card">
            <div class="count">18</div>
            <h4>Modelos de Datos</h4>
            <p>Estructura robusta: Eventos, Participantes, Speakers, Sponsors, Encuestas, Comunicaciones y mas.</p>
        </div>
        <div class="feature-card">
            <div class="count">6</div>
            <h4>Roles de Usuario</h4>
            <p>Super Admin, Org Admin, Colaborador, Participante, Speaker, Sponsor con permisos granulares.</p>
        </div>
        <div class="feature-card">
            <div class="count">10</div>
            <h4>Emails Automaticos</h4>
            <p>Bienvenida, confirmacion, lista de espera, comunicaciones, encuestas, aprobacion de organizaciones.</p>
        </div>
        <div class="feature-card">
            <div class="count">4</div>
            <h4>Portales Independientes</h4>
            <p>Paginas publicas, Portal del Asistente, Dashboard del Organizador, Panel de Super Admin.</p>
        </div>
        <div class="feature-card">
            <div class="count">3</div>
            <h4>Formatos de Exportacion</h4>
            <p>PDF profesional, CSV para datos y iCal (.ics) para calendarios.</p>
        </div>
        <div class="feature-card">
            <div class="count">API</div>
            <h4>API REST v1</h4>
            <p>Endpoints publicos para integracion mobile y terceros con rate limiting.</p>
        </div>
        <div class="feature-card">
            <div class="count">QR</div>
            <h4>Check-in Inteligente</h4>
            <p>Scanner QR con feedback audiovisual, prevencion de duplicados y estadisticas en tiempo real.</p>
        </div>
    </div>
</div>
`;

    let sectionNum = 0;
    for (const section of sections) {
        sectionNum++;
        html += `
<!-- SECTION: ${section.title} -->
<div class="section-cover">
    <div class="number">${String(sectionNum).padStart(2, '0')}</div>
    <h2>${section.title}</h2>
    <p>${section.subtitle}</p>
</div>
`;
        for (const screen of section.screens) {
            const imgData = screenshotDataMap[screen.file];
            const badgeLabel = section.title;
            html += `
<div class="page">
    <div class="page-header">
        <h3>${screen.label}</h3>
        <span class="badge">${badgeLabel}</span>
    </div>
    <div class="page-desc">${screen.desc}</div>
    <div class="screenshot-container">
        ${imgData ? `<img src="data:image/png;base64,${imgData}" alt="${screen.label}" />` : `<div style="padding:40px;color:#999;">Captura no disponible</div>`}
    </div>
    <div class="footer-bar">BuilderApp — ${screen.label}</div>
</div>
`;
        }
    }

    html += `
<!-- BACK COVER -->
<div class="back-cover">
    <h2>BuilderApp</h2>
    <p>Gestion de eventos profesional, escalable y segura.<br/><br/>
    Multi-organizacion · Networking integrado · Credenciales personalizables ·
    Check-in inteligente · Comunicaciones masivas · Encuestas · Reportes PDF ·
    Portal del asistente · API REST</p>
</div>

</body>
</html>`;
    return html;
}

async function main() {
    console.log('📄 Generando PDF Brochure...\n');

    // Load all screenshots as base64
    const screenshotDataMap = {};
    const files = await readdir(SCREENSHOTS_DIR);
    for (const f of files.filter(f => f.endsWith('.png'))) {
        const data = await readFile(join(SCREENSHOTS_DIR, f));
        screenshotDataMap[f] = data.toString('base64');
        console.log(`  📷 ${f}`);
    }

    const html = buildHTML(screenshotDataMap);
    const htmlPath = join(OUTPUT_DIR, 'brochure-temp.html');
    const { writeFile: wf } = await import('fs/promises');
    await wf(htmlPath, html);
    console.log(`\n  📝 HTML generado (${(html.length / 1024 / 1024).toFixed(1)} MB)`);

    // Generate PDF using Chrome
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));

    const pdfPath = join(OUTPUT_DIR, 'BuilderApp-Brochure-CEO.pdf');
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        landscape: true,
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await browser.close();

    // Clean up temp HTML
    const { unlink } = await import('fs/promises');
    await unlink(htmlPath).catch(() => {});

    console.log(`\n✅ PDF generado: ${pdfPath}`);
}

main();
