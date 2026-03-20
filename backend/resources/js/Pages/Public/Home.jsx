import { Head, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { formatEventDateRange } from '@/utils/formatters';
import { useState } from 'react';
import Pagination from '@cloudscape-design/components/pagination';

function getMonthDay(dateString) {
    if (!dateString) return null;
    const d = new Date(dateString);
    const month = d
        .toLocaleDateString('es-EC', { month: 'short' })
        .toUpperCase()
        .replace('.', '');
    const day = d.getDate();
    return { month, day };
}

function IconCalendar() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );
}
function IconUsers() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}
function IconPin() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}
function IconBuilding() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    );
}
function IconSearch() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
        </svg>
    );
}
function IconBarChart() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
    );
}
function IconStar() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}
function IconNetwork() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
    );
}
function IconQr() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 17v3" />
        </svg>
    );
}
function IconPinSmall() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}
function IconCalSmall() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );
}

function EventCard({ event }) {
    const md = getMonthDay(event.date_start);
    const imgUrl = event.event_image_url || event.cover_image_url;

    return (
        <a href={`/e/${event.slug}`} className="hc-card">
            <div className="hc-card__img-wrap">
                <div
                    className={`hc-card__img${imgUrl ? '' : ' hc-card__img--placeholder'}`}
                    style={imgUrl ? { backgroundImage: `url(${imgUrl})` } : undefined}
                >
                    {!imgUrl && (
                        <IconCalendar />
                    )}
                </div>
                {md && (
                    <div className="hc-card__date-badge">
                        <span className="hc-card__date-month">{md.month}</span>
                        <span className="hc-card__date-day">{md.day}</span>
                    </div>
                )}
                {event.registration_type === 'open' && (
                    <span className="hc-card__reg-badge hc-card__reg-badge--open">Registro abierto</span>
                )}
                {event.registration_type === 'invite' && (
                    <span className="hc-card__reg-badge hc-card__reg-badge--invite">Solo invitacion</span>
                )}
            </div>
            <div className="hc-card__body">
                <h3 className="hc-card__title">{event.name}</h3>
                {(event.venue || event.location) && (
                    <div className="hc-card__meta">
                        <IconPinSmall />
                        <span>{[event.venue, event.location].filter(Boolean).join(', ')}</span>
                    </div>
                )}
                {event.date_start && (
                    <div className="hc-card__meta">
                        <IconCalSmall />
                        <span>{formatEventDateRange(event.date_start, event.date_end)}</span>
                    </div>
                )}
                {event.organization?.name && (
                    <div className="hc-card__org">{event.organization.name}</div>
                )}
            </div>
            <div className="hc-card__footer">
                <span className="hc-card__cta">Ver evento &rarr;</span>
            </div>
        </a>
    );
}

const CATEGORIES = ['Conferencias', 'Workshops', 'Meetups', 'Networking', 'Hackathons'];

export default function Home({ events, search, stats = {} }) {
    const [searchValue, setSearchValue] = useState(search || '');

    function handleSearch(e) {
        if (e && e.preventDefault) e.preventDefault();
        router.get('/', { search: searchValue || undefined }, { preserveState: true });
    }

    function handleCategory(cat) {
        router.get('/', { search: cat }, { preserveState: true });
    }

    const totalEvents = events.total || events.data.length;

    return (
        <PublicLayout>
            <Head title="Descubre Eventos" />

            {/* ── Hero ── */}
            <section className="nh-hero">
                <div className="nh-hero__bg" aria-hidden="true" />
                <div className="nh-hero__inner">
                    <div className="nh-hero__eyebrow">La plataforma de eventos #1</div>
                    <h1 className="nh-hero__title">
                        Descubre eventos que{' '}
                        <span className="nh-hero__accent">inspiran y conectan</span>
                    </h1>
                    <p className="nh-hero__subtitle">
                        Encuentra conferencias, workshops, meetups y experiencias de tecnologia cerca de ti.
                    </p>
                    <form onSubmit={handleSearch} className="nh-hero__search-form">
                        <div className="nh-hero__search-wrap">
                            <span className="nh-hero__search-icon"><IconSearch /></span>
                            <input
                                className="nh-hero__search-input"
                                type="search"
                                placeholder="Buscar eventos, ciudades o temas..."
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                            />
                            <button type="submit" className="nh-hero__search-btn">
                                Buscar
                            </button>
                        </div>
                    </form>
                    <div className="nh-hero__tags">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                type="button"
                                className="nh-hero__tag"
                                onClick={() => handleCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Stats ── */}
            <section className="nh-stats">
                <div className="nh-stats__card">
                    <div className="nh-stat">
                        <div className="nh-stat__icon nh-stat__icon--blue"><IconCalendar /></div>
                        <div>
                            <div className="nh-stat__number">{stats.events ?? totalEvents}+</div>
                            <div className="nh-stat__label">Eventos</div>
                        </div>
                    </div>
                    <div className="nh-stat">
                        <div className="nh-stat__icon nh-stat__icon--purple"><IconUsers /></div>
                        <div>
                            <div className="nh-stat__number">{stats.participants ?? 0}+</div>
                            <div className="nh-stat__label">Participantes</div>
                        </div>
                    </div>
                    <div className="nh-stat">
                        <div className="nh-stat__icon nh-stat__icon--green"><IconPin /></div>
                        <div>
                            <div className="nh-stat__number">{stats.cities ?? 0}+</div>
                            <div className="nh-stat__label">Ciudades</div>
                        </div>
                    </div>
                    <div className="nh-stat">
                        <div className="nh-stat__icon nh-stat__icon--orange"><IconBuilding /></div>
                        <div>
                            <div className="nh-stat__number">{stats.organizations ?? 0}+</div>
                            <div className="nh-stat__label">Organizadores</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Events ── */}
            <section className="nh-events">
                <div className="nh-events__header">
                    <div>
                        <h2 className="nh-events__title">
                            {search ? `Resultados para "${search}"` : 'Proximos eventos'}
                        </h2>
                        {!search && (
                            <p className="nh-events__subtitle">
                                Explora los eventos mas destacados que se vienen
                            </p>
                        )}
                    </div>
                    {search && (
                        <a href="/" className="nh-events__clear">&#x2715; Limpiar busqueda</a>
                    )}
                </div>

                {events.data.length > 0 ? (
                    <div className="nh-grid">
                        {events.data.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="nh-empty">
                        <div className="nh-empty__icon">
                            <IconSearch />
                        </div>
                        <h3 className="nh-empty__title">No se encontraron eventos</h3>
                        <p className="nh-empty__text">
                            {search
                                ? 'No hay eventos que coincidan con tu busqueda.'
                                : 'No hay eventos disponibles en este momento. Vuelve pronto para descubrir nuevas experiencias.'}
                        </p>
                        {search && (
                            <a href="/" className="nh-btn nh-btn--primary nh-btn--sm">
                                Ver todos los eventos
                            </a>
                        )}
                    </div>
                )}

                {events.last_page > 1 && (
                    <div className="nh-pagination">
                        <Pagination
                            currentPageIndex={events.current_page}
                            pagesCount={events.last_page}
                            onChange={({ detail }) => {
                                router.get(
                                    '/',
                                    { page: detail.currentPageIndex, search: search || undefined },
                                    { preserveState: true }
                                );
                            }}
                        />
                    </div>
                )}
            </section>

            {/* ── CTA ── */}
            <section className="nh-cta">
                <div className="nh-cta__inner">
                    <div className="nh-cta__content">
                        <div className="nh-cta__eyebrow">Para organizadores</div>
                        <h2 className="nh-cta__title">Organiza tu propio evento</h2>
                        <p className="nh-cta__text">
                            Crea eventos, gestiona participantes, sponsors y networking en una sola plataforma.
                        </p>
                        <div className="nh-cta__actions">
                            <a href="/organizer/register" className="nh-btn nh-btn--primary">
                                Comenzar gratis
                            </a>
                            <a href="/organizer/login" className="nh-btn nh-btn--ghost">
                                Ya tengo cuenta
                            </a>
                        </div>
                    </div>
                    <div className="nh-cta__visual" aria-hidden="true">
                        <div className="nh-cta__orb nh-cta__orb--1" />
                        <div className="nh-cta__orb nh-cta__orb--2" />
                        <div className="nh-cta__features">
                            <div className="nh-cta__feature">
                                <div className="nh-cta__feature-icon nh-cta__feature-icon--blue"><IconCalendar /></div>
                                <div>
                                    <div className="nh-cta__feature-title">Gestión de eventos</div>
                                    <div className="nh-cta__feature-desc">Crea y publica en minutos</div>
                                </div>
                            </div>
                            <div className="nh-cta__feature">
                                <div className="nh-cta__feature-icon nh-cta__feature-icon--purple"><IconUsers /></div>
                                <div>
                                    <div className="nh-cta__feature-title">Control de asistentes</div>
                                    <div className="nh-cta__feature-desc">Registro y check-in digital</div>
                                </div>
                            </div>
                            <div className="nh-cta__feature">
                                <div className="nh-cta__feature-icon nh-cta__feature-icon--orange"><IconStar /></div>
                                <div>
                                    <div className="nh-cta__feature-title">Sponsors</div>
                                    <div className="nh-cta__feature-desc">Gestiona patrocinadores</div>
                                </div>
                            </div>
                            <div className="nh-cta__feature">
                                <div className="nh-cta__feature-icon nh-cta__feature-icon--green"><IconBarChart /></div>
                                <div>
                                    <div className="nh-cta__feature-title">Analiticas en vivo</div>
                                    <div className="nh-cta__feature-desc">Estadisticas en tiempo real</div>
                                </div>
                            </div>
                            <div className="nh-cta__feature">
                                <div className="nh-cta__feature-icon nh-cta__feature-icon--indigo"><IconNetwork /></div>
                                <div>
                                    <div className="nh-cta__feature-title">Networking</div>
                                    <div className="nh-cta__feature-desc">Conecta participantes</div>
                                </div>
                            </div>
                            <div className="nh-cta__feature">
                                <div className="nh-cta__feature-icon nh-cta__feature-icon--teal"><IconQr /></div>
                                <div>
                                    <div className="nh-cta__feature-title">Tickets QR</div>
                                    <div className="nh-cta__feature-desc">Acceso rapido y seguro</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
