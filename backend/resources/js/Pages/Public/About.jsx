import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import '@/styles/about.css';

const team = [
    {
        name: 'Alexis Polo',
        role: 'Líder AWS User Group Ecuador',
        bio: 'Líder de la comunidad AWS User Group Ecuador y creador de las primeras versiones de BuilderApp. Apasionado por conectar personas y fortalecer el ecosistema tech del Ecuador y Latinoamérica.',
        photo: 'https://media.licdn.com/dms/image/v2/C4E03AQHDbIG5MeJYeA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1637334841616?e=1775692800&v=beta&t=K_rXDZ2aqGwyLBEhLBeHj60WnO0KeLwforDjuPFQbPU',
        social: { linkedin: null },
    },
    {
        name: 'Jonathan Terán',
        role: 'Creador de BuilderApp',
        bio: 'Creador del nuevo BuilderApp Tomó las versiones anteriores y las mejoró y perfeccionó hasta convertirlas en la plataforma robusta y completa que es hoy.',
        photo: 'https://media.licdn.com/dms/image/v2/C4E03AQHgo4ZnEjWy8Q/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1649862115536?e=1775692800&v=beta&t=mu7k4N3NGWjOs4UDwVXGYLrMFJ0Ezgy0O9d5lXXvkgI',
        social: { linkedin: null, github: null },
    },
    {
        name: 'Silvana Rodriguez',
        role: 'Desarrolladora',
        bio: 'Programadora que contribuyó activamente en el desarrollo de la plataforma junto a Jonathan, aportando código y criterio técnico para hacer de BuilderApp una herramienta sólida y confiable.',
        photo: 'https://media.licdn.com/dms/image/v2/D4D03AQG9RhdSZ5fviw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1696198001379?e=1775692800&v=beta&t=KxrxTGWRlUMX3vLbR8PwNFeTMmWhVjUpVXu_wvIfV6U',
        social: { linkedin: null },
    },
    {
        name: 'Vanessa Barreiro',
        role: 'UX / UI',
        bio: 'Aportó su visión de diseño y experiencia de usuario para que BuilderApp sea intuitiva, accesible y agradable de usar para todas las comunidades.',
        photo: 'https://media.licdn.com/dms/image/v2/D4E03AQHmeOSraVwNYw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1727472602296?e=1775692800&v=beta&t=zRQ38EgSSQn1l0UT83t28SlDp_bRJjdWKTspn9fYpEI',
        social: { linkedin: null },
    },
];

const values = [
    {
        icon: 'community',
        title: 'Comunidad primero',
        description: 'Todo lo que construimos nace de las necesidades reales de las comunidades tech de Ecuador.',
    },
    {
        icon: 'innovation',
        title: 'Innovación local',
        description: 'Soluciones hechas en Ecuador, pensadas para Latinoamérica, con estándares globales.',
    },
    {
        icon: 'connection',
        title: 'Conexión real',
        description: 'La tecnología es el medio, las personas son el fin. Conectamos talento con oportunidades.',
    },
];

function ValueIcon({ type }) {
    if (type === 'community') {
        return (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        );
    }
    if (type === 'opensource') {
        return (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
                <line x1="12" y1="2" x2="12" y2="22" />
            </svg>
        );
    }
    if (type === 'innovation') {
        return (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
            </svg>
        );
    }
    if (type === 'connection') {
        return (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
        );
    }
    return null;
}

function SocialIcon({ type }) {
    if (type === 'linkedin') {
        return (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        );
    }
    if (type === 'github') {
        return (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
        );
    }
    return null;
}

function TeamCard({ member }) {
    const initials = member.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();

    return (
        <div className="about-card">
            <div className="about-card__glow" />
            <div className="about-card__inner">
                <div className="about-card__avatar">
                    {member.photo ? (
                        <img src={member.photo} alt={member.name} />
                    ) : (
                        <span className="about-card__initials">{initials}</span>
                    )}
                </div>
                <div className="about-card__content">
                    <h3 className="about-card__name">{member.name}</h3>
                    <span className="about-card__role">{member.role}</span>
                    <p className="about-card__bio">{member.bio}</p>
                    <div className="about-card__social">
                        {Object.entries(member.social).map(
                            ([key, url]) =>
                                url && (
                                    <a
                                        key={key}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="about-card__social-link"
                                        aria-label={key}
                                    >
                                        <SocialIcon type={key} />
                                    </a>
                                )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function About() {
    return (
        <PublicLayout>
            <Head title="Sobre BuilderApp" />

            {/* Hero */}
            <section className="about-hero">
                <div className="about-hero__orb about-hero__orb--1" />
                <div className="about-hero__orb about-hero__orb--2" />
                <div className="about-hero__orb about-hero__orb--3" />
                <div className="about-hero__content">
                    <span className="about-hero__badge">Hecho en Ecuador</span>
                    <h1 className="about-hero__title">
                        Construimos tecnología
                        <span className="about-hero__gradient"> para la comunidad</span>
                    </h1>
                    <p className="about-hero__subtitle">
                        BuilderApp nace de una necesidad real y de un sueño compartido:
                        unificar y fortalecer las comunidades tecnológicas del Ecuador y
                        toda Latinoamérica.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="about-stats">
                <div className="about-stats__inner">
                    <div className="about-stats__item">
                        <span className="about-stats__number">100%</span>
                        <span className="about-stats__label">Gratuito</span>
                    </div>
                    <div className="about-stats__divider" />
                    <div className="about-stats__item">
                        <span className="about-stats__number">Ecuador</span>
                        <span className="about-stats__label">Hecho en</span>
                    </div>
                    <div className="about-stats__divider" />
                    <div className="about-stats__item">
                        <span className="about-stats__number">Open</span>
                        <span className="about-stats__label">Para todas las comunidades</span>
                    </div>
                </div>
            </section>

            {/* Historia */}
            <section className="about-section">
                <div className="about-section__inner">
                    <span className="about-section__label">Nuestra historia</span>
                    <h2 className="about-section__title">
                        De una necesidad real
                        <span className="about-hero__gradient"> a una plataforma real</span>
                    </h2>
                    <div className="about-story">
                        <p>
                            BuilderApp nace de una necesidad real y de un sueño compartido: unificar y
                            fortalecer las comunidades tecnológicas del Ecuador. Desde sus inicios, esta
                            plataforma fue concebida no solo como una herramienta para organizar eventos,
                            sino como un punto de encuentro donde las comunidades tech del país pudieran
                            crecer juntas, apoyarse mutuamente y avanzar hacia un bien común.
                        </p>
                        <p>
                            Ecuador tiene un ecosistema tecnológico lleno de talento, energía y potencial.
                            BuilderApp llegó para darle a ese ecosistema una herramienta propia, pensada
                            desde adentro, que entienda sus necesidades y permita a las comunidades
                            conectarse de manera profesional y sencilla.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="about-section about-section--dark">
                <div className="about-section__inner">
                    <span className="about-section__label about-section__label--light">Lo que nos mueve</span>
                    <h2 className="about-section__title about-section__title--light">
                        Nuestros valores
                    </h2>
                    <div className="about-values">
                        {values.map((value) => (
                            <div key={value.title} className="about-value">
                                <div className="about-value__icon">
                                    <ValueIcon type={value.icon} />
                                </div>
                                <h3 className="about-value__title">{value.title}</h3>
                                <p className="about-value__desc">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="about-section about-section--team">
                <div className="about-section__inner">
                    <span className="about-section__label about-section__label--light">Quienes hicieron esto posible</span>
                    <h2 className="about-section__title about-section__title--light">
                        Gracias a quienes
                        <span className="about-hero__gradient"> construyeron esto</span>
                    </h2>
                    <p className="about-team__intro">
                        Esta aplicación es el resultado del esfuerzo, la dedicación y la pasión de un
                        equipo que creyó en la idea desde el primer día. Cada línea de código, cada
                        decisión de diseño y cada hora invertida tiene nombre y apellido.
                    </p>
                    <div className="about-team about-team--4">
                        {team.map((member) => (
                            <TeamCard key={member.name} member={member} />
                        ))}
                    </div>
                </div>
            </section>

            {/* La Comunidad */}
            <section className="about-section">
                <div className="about-section__inner">
                    <span className="about-section__label">La comunidad</span>
                    <h2 className="about-section__title">
                        BuilderApp es
                        <span className="about-hero__gradient"> de todos</span>
                    </h2>
                    <div className="about-story">
                        <p>
                            BuilderApp está construida para servir a las comunidades tecnológicas del
                            Ecuador y toda Latinoamérica. Creemos firmemente que la
                            tecnología se construye mejor en comunidad, y que cuando nos apoyamos entre
                            todos, los límites de lo que podemos lograr se expanden enormemente.
                        </p>
                        <p>
                            Estamos seguros de que disfrutarán esta plataforma y de que muchas comunidades
                            podrán beneficiarse de ella. Cada meetup organizado, cada conexión generada y
                            cada talento descubierto a través de BuilderApp es una pequeña victoria para
                            todo el ecosistema tech de nuestra región.
                        </p>
                        <p>
                            Si eres parte de una comunidad tecnológica y quieres usar BuilderApp para tus
                            eventos, no dudes en contactarnos. Estamos aquí para ayudarte a crecer.
                            <strong> Juntos somos más fuertes.</strong>
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="about-cta">
                <div className="about-cta__inner">
                    <h2 className="about-cta__title">
                        ¿Eres parte de una comunidad tech?
                    </h2>
                    <p className="about-cta__text">
                        BuilderApp es gratuita y está abierta para todas las comunidades
                        tecnológicas. Organiza tus eventos de manera profesional.
                    </p>
                    <div className="about-cta__buttons">
                        <a href="/organizer/register" className="about-cta__btn about-cta__btn--primary">
                            Empieza a organizar
                        </a>
                        <a href="/" className="about-cta__btn about-cta__btn--secondary">
                            Explorar eventos
                        </a>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
