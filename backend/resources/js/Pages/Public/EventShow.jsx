import { Head } from '@inertiajs/react';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { formatDateLong, formatEventDateRange } from '@/utils/formatters';
import { agendaTypeConfig } from '@/utils/status-config';
import PublicMapViewer from '@/Components/PublicMapViewer';

function getInitials(name) {
    return name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

function groupAgendaByDate(items) {
    const groups = {};
    items.forEach((item) => {
        const dateKey = item.date;
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(item);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}

function groupAgendaByRoom(items) {
    const groups = {};
    items.forEach((item) => {
        const room = item.location_detail || 'General';
        if (!groups[room]) groups[room] = [];
        groups[room].push(item);
    });
    // Sort items within each room by date then start_time
    Object.values(groups).forEach((roomItems) => {
        roomItems.sort((a, b) => {
            const dateCmp = (a.date || '').localeCompare(b.date || '');
            if (dateCmp !== 0) return dateCmp;
            return (a.start_time || '').localeCompare(b.start_time || '');
        });
    });
    // Sort rooms alphabetically, but "General" always last
    return Object.entries(groups).sort(([a], [b]) => {
        if (a === 'General') return 1;
        if (b === 'General') return -1;
        return a.localeCompare(b);
    });
}

function getCalendarData(items, selectedDate) {
    const filtered = selectedDate
        ? items.filter((item) => item.date === selectedDate)
        : items;

    // Unique rooms
    const roomSet = new Set();
    filtered.forEach((item) => roomSet.add(item.location_detail || 'General'));
    const rooms = [...roomSet].sort((a, b) => {
        if (a === 'General') return 1;
        if (b === 'General') return -1;
        return a.localeCompare(b);
    });

    // Time range
    let minHour = 23, maxHour = 0;
    filtered.forEach((item) => {
        if (item.start_time) {
            const h = parseInt(item.start_time.slice(0, 2), 10);
            if (h < minHour) minHour = h;
        }
        if (item.end_time) {
            const h = parseInt(item.end_time.slice(0, 2), 10);
            const m = parseInt(item.end_time.slice(3, 5), 10);
            const endH = m > 0 ? h + 1 : h;
            if (endH > maxHour) maxHour = endH;
        }
    });
    if (minHour > maxHour) { minHour = 8; maxHour = 18; }

    // Generate 30-min slots
    const slots = [];
    for (let h = minHour; h < maxHour; h++) {
        slots.push({ hour: h, minute: 0, label: `${String(h).padStart(2, '0')}:00` });
        slots.push({ hour: h, minute: 30, label: `${String(h).padStart(2, '0')}:30` });
    }

    // Unique dates
    const dates = [...new Set(items.map((i) => i.date).filter(Boolean))].sort();

    return { rooms, slots, filtered, dates, minHour };
}

function getSlotSpan(startTime, endTime) {
    if (!startTime || !endTime) return 1;
    const sh = parseInt(startTime.slice(0, 2), 10);
    const sm = parseInt(startTime.slice(3, 5), 10);
    const eh = parseInt(endTime.slice(0, 2), 10);
    const em = parseInt(endTime.slice(3, 5), 10);
    const durationMin = (eh * 60 + em) - (sh * 60 + sm);
    return Math.max(1, Math.round(durationMin / 30));
}

function getSlotIndex(startTime, minHour) {
    if (!startTime) return 0;
    const h = parseInt(startTime.slice(0, 2), 10);
    const m = parseInt(startTime.slice(3, 5), 10);
    return (h - minHour) * 2 + (m >= 30 ? 1 : 0);
}

const TYPE_COLORS = agendaTypeConfig;

function groupSponsorsByLevel(sponsors, levels) {
    const grouped = {};
    levels.forEach((level) => {
        grouped[level.id] = { level, sponsors: [] };
    });
    sponsors.forEach((sp) => {
        if (sp.sponsor_level && grouped[sp.sponsor_level.id]) {
            grouped[sp.sponsor_level.id].sponsors.push(sp);
        }
    });
    return Object.values(grouped)
        .filter((g) => g.sponsors.length > 0)
        .sort((a, b) => a.level.sort_order - b.level.sort_order);
}

function getDateParts(dateString) {
    if (!dateString) return null;
    const d = new Date(dateString);
    const month = d.toLocaleDateString('es-EC', { month: 'short' }).toUpperCase().replace('.', '');
    const day = d.getDate();
    const weekday = d.toLocaleDateString('es-EC', { weekday: 'long' });
    return { month, day, weekday };
}

function getTimeRemaining(targetDate) {
    if (!targetDate) return null;
    const total = new Date(targetDate).getTime() - Date.now();
    if (total <= 0) return null;
    return {
        days: Math.floor(total / (1000 * 60 * 60 * 24)),
        hours: Math.floor((total / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((total / (1000 * 60)) % 60),
        seconds: Math.floor((total / 1000) % 60),
    };
}

function useScrollReveal() {
    const observerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, []);

    return useCallback((node) => {
        if (observerRef.current) observerRef.current.disconnect();
        if (!node) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal--visible');
                        observerRef.current?.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '-40px' }
        );

        const elements = node.querySelectorAll('.reveal');
        elements.forEach((el) => observerRef.current.observe(el));
    }, []);
}


export default function EventShow({ event, speakers, sponsors, agendaItems, sponsorLevels, communities, isPreview, registeredCount, cfpEnabled }) {
    const heroStyle = event.cover_image_url
        ? { backgroundImage: `url(${event.cover_image_url})` }
        : {};

    const [agendaView, setAgendaView] = useState('timeline');

    const agendaByDate = groupAgendaByDate(agendaItems);
    const agendaByRoom = useMemo(() => groupAgendaByRoom(agendaItems), [agendaItems]);
    const sponsorsByLevel = groupSponsorsByLevel(sponsors, sponsorLevels);
    const dateParts = getDateParts(event.date_start);

    // Calendar state
    const calendarDates = useMemo(
        () => [...new Set(agendaItems.map((i) => i.date).filter(Boolean))].sort(),
        [agendaItems]
    );
    const [calendarDay, setCalendarDay] = useState(calendarDates[0] || null);
    const calendarData = useMemo(
        () => getCalendarData(agendaItems, calendarDay),
        [agendaItems, calendarDay]
    );

    // Countdown
    const [countdown, setCountdown] = useState(() => getTimeRemaining(event.date_start));
    useEffect(() => {
        if (!event.date_start) return;
        const id = setInterval(() => {
            const remaining = getTimeRemaining(event.date_start);
            setCountdown(remaining);
            if (!remaining) clearInterval(id);
        }, 1000);
        return () => clearInterval(id);
    }, [event.date_start]);

    // Scroll reveal
    const revealRef = useScrollReveal();

    const hasContent = speakers.length > 0 || agendaByDate.length > 0 || sponsorsByLevel.length > 0 ||
        (communities && communities.length > 0) || event.description ||
        (event.latitude && event.longitude);

    return (
        <PublicLayout isPreview={isPreview}>
            <Head title={event.name} />

            {/* Hero */}
            <section className="event-hero">
                {/* Background image — always fully visible on mobile (sits above content) */}
                <div className="event-hero__bg" style={heroStyle}>
                    <div className="event-hero__overlay" />
                    <div className="event-hero__shapes">
                        <div className="event-hero__shape event-hero__shape--1" />
                        <div className="event-hero__shape event-hero__shape--2" />
                        <div className="event-hero__shape event-hero__shape--3" />
                    </div>
                </div>

                {/* Content — below image on mobile, overlays at bottom on desktop */}
                <div className="event-hero__body">
                    <div className="event-hero__inner">
                        {dateParts && (
                            <div className="event-hero__date-badge">
                                <span className="event-hero__date-month">{dateParts.month}</span>
                                <span className="event-hero__date-day">{dateParts.day}</span>
                            </div>
                        )}
                        <div className="event-hero__text">
                            <h1 className="event-hero__title">{event.name}</h1>
                            <div className="event-hero__actions">
                                {event.registration_type === 'open' ? (
                                    <a href={`/e/${event.slug}/register`} className="event-hero__cta">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                            <circle cx="8.5" cy="7" r="4" />
                                            <line x1="20" y1="8" x2="20" y2="14" />
                                            <line x1="23" y1="11" x2="17" y2="11" />
                                        </svg>
                                        Registrarse ahora
                                    </a>
                                ) : (
                                    <span className="event-hero__cta event-hero__cta--disabled">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                        Solo por invitacion
                                    </span>
                                )}
                                <a href={`/e/${event.slug}/event.ics`} className="event-hero__calendar-btn" download>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                        <line x1="12" y1="14" x2="12" y2="18" />
                                        <line x1="10" y1="16" x2="14" y2="16" />
                                    </svg>
                                    Agregar a calendario
                                </a>
                            </div>
                            {countdown && (
                                <div className="event-hero__countdown">
                                    {[['days', 'Dias'], ['hours', 'Horas'], ['minutes', 'Min'], ['seconds', 'Seg']].map(([key, label]) => (
                                        <div key={key} className="event-hero__countdown-item">
                                            <span className="event-hero__countdown-value">{countdown[key]}</span>
                                            <span className="event-hero__countdown-label">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {hasContent && (
                <div className="event-content" ref={revealRef}>
                    {/* Quick info strip */}
                    <div className="event-info-strip reveal">
                        {event.date_start && (
                            <div className="event-info-strip__item">
                                <div className="event-info-strip__icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="event-info-strip__label">Fecha</div>
                                    <div className="event-info-strip__value">
                                        {formatEventDateRange(event.date_start, event.date_end)}
                                    </div>
                                </div>
                            </div>
                        )}
                        {(event.location || event.venue) && (
                            <div className="event-info-strip__item">
                                <div className="event-info-strip__icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="event-info-strip__label">Ubicacion</div>
                                    <div className="event-info-strip__value">
                                        {[event.venue, event.location].filter(Boolean).join(', ')}
                                    </div>
                                </div>
                            </div>
                        )}
                        {event.capacity && (
                            <div className="event-info-strip__item">
                                <div className="event-info-strip__icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="event-info-strip__label">Capacidad</div>
                                    <div className="event-info-strip__value">
                                        {registeredCount !== undefined && registeredCount !== null
                                            ? `${registeredCount} / ${event.capacity} registrados`
                                            : `${event.capacity} personas`
                                        }
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="event-info-strip__item">
                            <div className="event-info-strip__icon event-info-strip__icon--accent">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                    <polyline points="10 17 15 12 10 7" />
                                    <line x1="15" y1="12" x2="3" y2="12" />
                                </svg>
                            </div>
                            <div>
                                <div className="event-info-strip__label">Registro</div>
                                <div className="event-info-strip__value">
                                    {event.registration_type === 'open' ? (
                                        <a href={`/e/${event.slug}/register`} className="event-info-strip__link">
                                            Registro abierto
                                        </a>
                                    ) : (
                                        'Solo por invitacion'
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description + Event Image */}
                    {(event.description || event.event_image_url) && (
                        <section className="event-section reveal">
                            <h2 className="event-section__title">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <polyline points="10 9 9 9 8 9" />
                                </svg>
                                Acerca del evento
                            </h2>
                            <div className="event-about-layout">
                                {event.description && (
                                    <div className="event-description">
                                        <div className="event-description__text" dangerouslySetInnerHTML={{ __html: event.description }} />
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Location Map */}
                    {event.latitude && event.longitude && (
                        <section className="event-section reveal">
                            <h2 className="event-section__title">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                Ubicacion
                            </h2>
                            <PublicMapViewer
                                latitude={event.latitude}
                                longitude={event.longitude}
                                venue={event.venue}
                                location={event.location}
                            />
                        </section>
                    )}

                    {/* Speakers */}
                    {speakers.length > 0 && (
                        <section className="event-section reveal">
                            <h2 className="event-section__title">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                Speakers
                            </h2>
                            <div className="speakers-grid">
                                {speakers.map((speaker, index) => (
                                    <div key={speaker.id} className="speaker-card reveal" style={{ '--delay': `${Math.min(index * 0.1, 0.6)}s` }}>
                                        {speaker.photo_url ? (
                                            <img
                                                src={speaker.photo_url}
                                                alt={speaker.full_name}
                                                className="speaker-card__photo"
                                            />
                                        ) : (
                                            <div className="speaker-card__initials">
                                                {getInitials(speaker.full_name)}
                                            </div>
                                        )}
                                        <div className="speaker-card__info">
                                            <h3 className="speaker-card__name">{speaker.full_name}</h3>
                                            {(speaker.job_title || speaker.company) && (
                                                <p className="speaker-card__role">
                                                    {[speaker.job_title, speaker.company]
                                                        .filter(Boolean)
                                                        .join(' - ')}
                                                </p>
                                            )}
                                            {speaker.bio && (
                                                <p className="speaker-card__bio">{speaker.bio}</p>
                                            )}
                                            {speaker.social_links && Object.keys(speaker.social_links).length > 0 && (
                                                <div className="speaker-card__socials">
                                                    {speaker.social_links.website && (
                                                        <a
                                                            href={speaker.social_links.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="speaker-card__social-link"
                                                            title="Website"
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <circle cx="12" cy="12" r="10" />
                                                                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                                            </svg>
                                                        </a>
                                                    )}
                                                    {speaker.social_links.twitter && (
                                                        <a
                                                            href={speaker.social_links.twitter}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="speaker-card__social-link"
                                                            title="X (Twitter)"
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                            </svg>
                                                        </a>
                                                    )}
                                                    {speaker.social_links.linkedin && (
                                                        <a
                                                            href={speaker.social_links.linkedin}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="speaker-card__social-link"
                                                            title="LinkedIn"
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                            </svg>
                                                        </a>
                                                    )}
                                                    {speaker.social_links.instagram && (
                                                        <a
                                                            href={speaker.social_links.instagram}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="speaker-card__social-link"
                                                            title="Instagram"
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                                            </svg>
                                                        </a>
                                                    )}
                                                    {speaker.social_links.github && (
                                                        <a
                                                            href={speaker.social_links.github}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="speaker-card__social-link"
                                                            title="GitHub"
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                                            </svg>
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Agenda */}
                    {agendaByDate.length > 0 && (
                        <section className="event-section reveal">
                            <h2 className="event-section__title">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                Programa
                            </h2>

                            {/* View tabs */}
                            <div className="agenda-tabs">
                                <button
                                    className={`agenda-tabs__btn ${agendaView === 'timeline' ? 'agenda-tabs__btn--active' : ''}`}
                                    onClick={() => setAgendaView('timeline')}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    Cronograma
                                </button>
                                <button
                                    className={`agenda-tabs__btn ${agendaView === 'rooms' ? 'agenda-tabs__btn--active' : ''}`}
                                    onClick={() => setAgendaView('rooms')}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                        <polyline points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                    Por Salas
                                </button>
                                <button
                                    className={`agenda-tabs__btn ${agendaView === 'calendar' ? 'agenda-tabs__btn--active' : ''}`}
                                    onClick={() => setAgendaView('calendar')}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    Calendario
                                </button>
                            </div>

                            <div key={agendaView} className="agenda-view-container">
                            {/* Timeline view (existing) */}
                            {agendaView === 'timeline' && agendaByDate.map(([date, items]) => (
                                <div key={date} className="agenda-day">
                                    <h3 className="agenda-day__title">{formatDateLong(date)}</h3>
                                    <div className="agenda-items">
                                        {items.map((item) => (
                                            <div key={item.id} className="agenda-item">
                                                <div className="agenda-item__time">
                                                    {item.start_time?.slice(0, 5)}
                                                </div>
                                                <div className="agenda-item__line" />
                                                <div className="agenda-item__content">
                                                    <h4 className="agenda-item__title">{item.title}</h4>
                                                    {item.description && (
                                                        <p className="agenda-item__description">{item.description}</p>
                                                    )}
                                                    <div className="agenda-item__details">
                                                        {item.type && (
                                                            <span className="agenda-item__type">{item.type}</span>
                                                        )}
                                                        {item.speakers && item.speakers.length > 0 && (
                                                            <span className="agenda-item__speaker">
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                                    <circle cx="12" cy="7" r="4" />
                                                                </svg>
                                                                {item.speakers.map((s) => s.full_name).join(', ')}
                                                            </span>
                                                        )}
                                                        {item.location_detail && (
                                                            <span className="agenda-item__location">
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                                    <circle cx="12" cy="10" r="3" />
                                                                </svg>
                                                                {item.location_detail}
                                                            </span>
                                                        )}
                                                        {item.end_time && (
                                                            <span className="agenda-item__duration">
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <circle cx="12" cy="12" r="10" />
                                                                    <polyline points="12 6 12 12 16 14" />
                                                                </svg>
                                                                {item.start_time?.slice(0, 5)} - {item.end_time?.slice(0, 5)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Rooms view */}
                            {agendaView === 'rooms' && agendaByRoom.map(([room, items]) => (
                                <div key={room} className="agenda-room">
                                    <h3 className="agenda-room__title">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                            <polyline points="9 22 9 12 15 12 15 22" />
                                        </svg>
                                        {room}
                                    </h3>
                                    <div className="agenda-items">
                                        {items.map((item) => (
                                            <div key={item.id} className="agenda-item">
                                                <div className="agenda-item__time">
                                                    {item.start_time?.slice(0, 5)}
                                                </div>
                                                <div className="agenda-item__line" />
                                                <div className="agenda-item__content">
                                                    <h4 className="agenda-item__title">{item.title}</h4>
                                                    {item.description && (
                                                        <p className="agenda-item__description">{item.description}</p>
                                                    )}
                                                    <div className="agenda-item__details">
                                                        {item.type && (
                                                            <span className="agenda-item__type">{item.type}</span>
                                                        )}
                                                        {item.speakers && item.speakers.length > 0 && (
                                                            <span className="agenda-item__speaker">
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                                    <circle cx="12" cy="7" r="4" />
                                                                </svg>
                                                                {item.speakers.map((s) => s.full_name).join(', ')}
                                                            </span>
                                                        )}
                                                        {item.date && (
                                                            <span className="agenda-item__duration">
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                                    <line x1="16" y1="2" x2="16" y2="6" />
                                                                    <line x1="8" y1="2" x2="8" y2="6" />
                                                                    <line x1="3" y1="10" x2="21" y2="10" />
                                                                </svg>
                                                                {formatDateLong(item.date)}
                                                            </span>
                                                        )}
                                                        {item.end_time && (
                                                            <span className="agenda-item__duration">
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <circle cx="12" cy="12" r="10" />
                                                                    <polyline points="12 6 12 12 16 14" />
                                                                </svg>
                                                                {item.start_time?.slice(0, 5)} - {item.end_time?.slice(0, 5)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Calendar view */}
                            {agendaView === 'calendar' && (
                                <div className="agenda-calendar">
                                    {calendarDates.length > 1 && (
                                        <div className="agenda-calendar__day-selector">
                                            {calendarDates.map((d) => (
                                                <button
                                                    key={d}
                                                    className={`agenda-calendar__day-btn ${calendarDay === d ? 'agenda-calendar__day-btn--active' : ''}`}
                                                    onClick={() => setCalendarDay(d)}
                                                >
                                                    {formatDateLong(d)}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <div className="agenda-calendar__scroll">
                                        <div
                                            className="agenda-calendar__grid"
                                            style={{
                                                gridTemplateColumns: `64px repeat(${calendarData.rooms.length}, 1fr)`,
                                                gridTemplateRows: `auto repeat(${calendarData.slots.length}, 48px)`,
                                            }}
                                        >
                                            {/* Header row */}
                                            <div className="agenda-calendar__corner" />
                                            {calendarData.rooms.map((room) => (
                                                <div key={room} className="agenda-calendar__header">
                                                    {room}
                                                </div>
                                            ))}

                                            {/* Time slots row labels */}
                                            {calendarData.slots.map((slot, idx) => (
                                                <div
                                                    key={slot.label}
                                                    className="agenda-calendar__time"
                                                    style={{ gridRow: idx + 2 }}
                                                >
                                                    {slot.minute === 0 ? slot.label : ''}
                                                </div>
                                            ))}

                                            {/* Empty cells for grid lines */}
                                            {calendarData.slots.map((slot, slotIdx) =>
                                                calendarData.rooms.map((room, roomIdx) => (
                                                    <div
                                                        key={`${slot.label}-${room}`}
                                                        className={`agenda-calendar__slot ${slot.minute === 0 ? 'agenda-calendar__slot--hour' : ''}`}
                                                        style={{
                                                            gridRow: slotIdx + 2,
                                                            gridColumn: roomIdx + 2,
                                                        }}
                                                    />
                                                ))
                                            )}

                                            {/* Agenda blocks */}
                                            {calendarData.filtered.map((item) => {
                                                const roomIdx = calendarData.rooms.indexOf(item.location_detail || 'General');
                                                const slotIdx = getSlotIndex(item.start_time, calendarData.minHour);
                                                const span = getSlotSpan(item.start_time, item.end_time);
                                                const colors = TYPE_COLORS[item.type] || TYPE_COLORS.talk;
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="agenda-calendar__block"
                                                        style={{
                                                            gridRow: `${slotIdx + 2} / span ${span}`,
                                                            gridColumn: roomIdx + 2,
                                                            backgroundColor: colors.bg,
                                                            borderLeft: `3px solid ${colors.border}`,
                                                            color: colors.text,
                                                        }}
                                                        title={`${item.title}${item.speakers?.length ? ` — ${item.speakers.map((s) => s.full_name).join(', ')}` : ''}`}
                                                    >
                                                        <span className="agenda-calendar__block-title">{item.title}</span>
                                                        <span className="agenda-calendar__block-time">
                                                            {item.start_time?.slice(0, 5)}{item.end_time ? ` - ${item.end_time.slice(0, 5)}` : ''}
                                                        </span>
                                                        {item.speakers?.length > 0 && (
                                                            <span className="agenda-calendar__block-speaker">{item.speakers.map((s) => s.full_name).join(', ')}</span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                            </div>
                        </section>
                    )}

                    {/* Communities */}
                    {communities && communities.length > 0 && (
                        <section className="event-section reveal">
                            <h2 className="event-section__title">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                Comunidades
                            </h2>
                            <div className="communities-grid">
                                {communities.map((community, index) => {
                                    const Tag = community.url ? 'a' : 'div';
                                    const linkProps = community.url
                                        ? { href: community.url, target: '_blank', rel: 'noopener noreferrer' }
                                        : {};
                                    return (
                                        <Tag
                                            key={community.id}
                                            className="community-card reveal"
                                            style={{ '--delay': `${Math.min(index * 0.1, 0.6)}s` }}
                                            {...linkProps}
                                        >
                                            {community.logo_url ? (
                                                <img
                                                    src={community.logo_url}
                                                    alt={community.name}
                                                    className="community-card__logo"
                                                />
                                            ) : (
                                                <div className="community-card__initials">
                                                    {getInitials(community.name)}
                                                </div>
                                            )}
                                            <span className="community-card__name">{community.name}</span>
                                        </Tag>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Sponsors */}
                    {sponsorsByLevel.length > 0 && (
                        <section className="event-section reveal">
                            <h2 className="event-section__title">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                Sponsors
                            </h2>
                            {sponsorsByLevel.map(({ level, sponsors: levelSponsors }) => (
                                <div key={level.id} className="sponsor-tier">
                                    <h3 className="sponsor-tier__title">{level.name}</h3>
                                    <div className="sponsor-tier__logos">
                                        {levelSponsors.map((sp, index) => {
                                            const Tag = sp.website ? 'a' : 'div';
                                            const linkProps = sp.website
                                                ? { href: sp.website, target: '_blank', rel: 'noopener noreferrer' }
                                                : {};
                                            return (
                                                <Tag
                                                    key={sp.id}
                                                    className="sponsor-logo-card reveal"
                                                    style={{ '--delay': `${Math.min(index * 0.1, 0.6)}s` }}
                                                    {...linkProps}
                                                >
                                                    {sp.logo_url ? (
                                                        <img src={sp.logo_url} alt={sp.company_name} />
                                                    ) : (
                                                        <span className="sponsor-logo-card__text">
                                                            {sp.company_name}
                                                        </span>
                                                    )}
                                                </Tag>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* CFP Banner */}
                    {cfpEnabled && (
                        <section className="cfp-banner reveal">
                            <h2 className="cfp-banner__title">Convocatoria de Speakers abierta</h2>
                            <p className="cfp-banner__text">
                                Tienes una charla o tema para compartir? Postulate como speaker para este evento.
                            </p>
                            <a href={`/e/${event.slug}/cfp`} className="cfp-banner__btn">
                                Postularme como speaker
                            </a>
                        </section>
                    )}

                    {/* Bottom CTA */}
                    {event.registration_type === 'open' && (
                        <section className="event-bottom-cta reveal">
                            <div className="event-bottom-cta__inner">
                                <h2 className="event-bottom-cta__title">No te lo pierdas</h2>
                                <p className="event-bottom-cta__text">
                                    Asegura tu lugar en {event.name}. El registro es gratuito y toma menos de un minuto.
                                </p>
                                <a href={`/e/${event.slug}/register`} className="event-bottom-cta__btn">
                                    Registrarse ahora
                                </a>
                            </div>
                        </section>
                    )}

                </div>
            )}
        </PublicLayout>
    );
}
