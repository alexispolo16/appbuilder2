import { Head } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useEffect, useRef, useCallback } from 'react';
import { formatEventDateRange } from '@/utils/formatters';
import { generateTicketImage } from '@/utils/ticket-generator';

function ConfettiCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors = ['#0972d3', '#ec7211', '#037f0c', '#d91515', '#8b5cf6', '#f59e0b'];
        const pieces = Array.from({ length: 80 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 8 + 4,
            h: Math.random() * 6 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            spin: Math.random() * 0.2 - 0.1,
            angle: Math.random() * Math.PI * 2,
            drift: Math.random() * 1 - 0.5,
        }));

        let frame;
        let elapsed = 0;
        function draw() {
            elapsed++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const p of pieces) {
                p.y += p.speed;
                p.x += p.drift;
                p.angle += p.spin;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0, 1 - elapsed / 120);
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            }
            if (elapsed < 120) {
                frame = requestAnimationFrame(draw);
            }
        }
        draw();
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1000,
            }}
        />
    );
}

export default function EventRegistrationSuccess({ event, participant, networkingUrl, credentialDesign, sponsors = [] }) {
    const [copied, setCopied] = useState(false);
    const [showConfetti, setShowConfetti] = useState(true);
    const qrRef = useRef(null);

    const d = {
        header_bg_start: '#0972d3',
        header_bg_end: '#033160',
        accent_color: '#0972d3',
        ...credentialDesign,
    };
    const profileUrl = `${window.location.origin}/e/${event.slug}/networking/${participant.registration_code}/profile`;

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 4000);
        return () => clearTimeout(timer);
    }, []);

    function copyCode() {
        navigator.clipboard.writeText(participant.registration_code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    const [downloading, setDownloading] = useState(false);

    const downloadTicket = useCallback(async () => {
        const svg = qrRef.current?.querySelector('svg');
        if (!svg || downloading) return;
        setDownloading(true);
        try {
            const dataUrl = await generateTicketImage(svg, event, participant, credentialDesign, sponsors);
            const link = document.createElement('a');
            link.download = `entrada-${participant.registration_code}.png`;
            link.href = dataUrl;
            link.click();
        } finally {
            setDownloading(false);
        }
    }, [event, participant, credentialDesign, sponsors, downloading]);

    return (
        <PublicLayout>
            <Head title={`Registro exitoso - ${event.name}`} />

            {showConfetti && <ConfettiCanvas />}

            <div className="success-page">
                {/* Animated success header */}
                <div className="success-hero">
                    <div className="success-hero__check">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h1 className="success-hero__title">Registro exitoso!</h1>
                    <p className="success-hero__subtitle">
                        Te has registrado en <strong>{event.name}</strong>
                    </p>
                    <p className="success-hero__email-note">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="M22 4L12 13 2 4" />
                        </svg>
                        Hemos enviado la confirmacion a <strong>{participant.email}</strong>
                    </p>
                </div>

                {/* Ticket card */}
                <div className="success-ticket">
                    {/* Ticket top: event info */}
                    <div className="success-ticket__header" style={{ background: `linear-gradient(135deg, ${d.header_bg_start}, ${d.header_bg_end})` }}>
                        <div className="success-ticket__event-name">{event.name}</div>
                        <div className="success-ticket__event-details">
                            {event.date_start && (
                                <span className="success-ticket__detail">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="4" width="18" height="18" rx="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    {formatEventDateRange(event.date_start, event.date_end)}
                                </span>
                            )}
                            {(event.location || event.venue) && (
                                <span className="success-ticket__detail">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    {[event.venue, event.location].filter(Boolean).join(', ')}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Ticket tear line */}
                    <div className="success-ticket__tear">
                        <div className="success-ticket__tear-circle success-ticket__tear-circle--left" />
                        <div className="success-ticket__tear-line" />
                        <div className="success-ticket__tear-circle success-ticket__tear-circle--right" />
                    </div>

                    {/* Ticket body */}
                    <div className="success-ticket__body">
                        <div className="success-ticket__info">
                            <div className="success-ticket__field">
                                <span className="success-ticket__label">Nombre</span>
                                <span className="success-ticket__value">{participant.full_name}</span>
                            </div>
                            <div className="success-ticket__field">
                                <span className="success-ticket__label">Email</span>
                                <span className="success-ticket__value success-ticket__value--small">{participant.email}</span>
                            </div>
                            <div className="success-ticket__field">
                                <span className="success-ticket__label">Codigo de registro</span>
                                <div className="success-ticket__code-row">
                                    <span className="success-ticket__code" style={{ color: d.accent_color }}>{participant.registration_code}</span>
                                    <button
                                        type="button"
                                        className="success-ticket__copy-btn"
                                        onClick={copyCode}
                                        title="Copiar codigo"
                                    >
                                        {copied ? (
                                            <>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                Copiado
                                            </>
                                        ) : (
                                            <>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                </svg>
                                                Copiar
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* QR section */}
                        <div className="success-ticket__qr" ref={qrRef}>
                            <QRCodeSVG
                                value={profileUrl}
                                size={200}
                                level="M"
                                includeMargin
                            />
                            <p className="success-ticket__qr-label">Presenta este QR en el evento</p>
                            <button type="button" className="success-ticket__download-btn" onClick={downloadTicket} disabled={downloading} style={{ color: d.accent_color, borderColor: d.accent_color }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                {downloading ? 'Generando...' : 'Descargar entrada digital'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Next steps */}
                <div className="success-next">
                    <h3 className="success-next__title">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        Siguientes pasos
                    </h3>
                    <div className="success-next__steps">
                        <div className="success-next__step">
                            <span className="success-next__step-num">1</span>
                            <div>
                                <strong>Revisa tu correo</strong>
                                <p>Te enviamos tus credenciales de acceso y la confirmacion del evento</p>
                            </div>
                        </div>
                        <div className="success-next__step">
                            <span className="success-next__step-num">2</span>
                            <div>
                                <strong>Inicia sesion en tu portal</strong>
                                <p>Accede a tu agenda, networking y toda la info del evento</p>
                            </div>
                        </div>
                        <div className="success-next__step">
                            <span className="success-next__step-num">3</span>
                            <div>
                                <strong>Presenta tu QR</strong>
                                <p>Muestralo en la entrada del evento para el check-in</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="success-buttons">
                    <a href="/login" className="success-buttons__primary" style={{ background: `linear-gradient(135deg, ${d.header_bg_start}, ${d.header_bg_end})` }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <polyline points="10 17 15 12 10 7" />
                            <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                        Iniciar sesion
                    </a>
                    <a href={`/e/${event.slug}`} className="success-buttons__secondary">
                        Ver pagina del evento
                    </a>
                </div>
            </div>
        </PublicLayout>
    );
}
