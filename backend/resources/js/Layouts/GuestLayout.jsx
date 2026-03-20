import '@/styles/guest-layout.css';
import Box from '@cloudscape-design/components/box';

export default function GuestLayout({ children }) {
    return (
        <div className="guest-layout">
            {/* Mobile header — shown when branding panel is hidden */}
            <div className="guest-layout__mobile-header">
                <a href="/">BuilderApp</a>
            </div>

            <div className="guest-layout__body">
                {/* Left panel: Branding */}
                <div className="guest-layout__branding">
                    <div className="guest-layout__circle guest-layout__circle--1" />
                    <div className="guest-layout__circle guest-layout__circle--2" />
                    <div className="guest-layout__circle guest-layout__circle--3" />
                    <div className="guest-layout__branding-content">
                        <div>
                            <a href="/" style={{ textDecoration: 'none', color: 'white', fontSize: '20px', fontWeight: 700 }}>
                                BuilderApp
                            </a>
                        </div>
                        <div style={{ maxWidth: 400 }}>
                            <h1 style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1.3, margin: 0 }}>
                                Descubre y participa en los mejores eventos
                            </h1>
                            <p style={{ marginTop: 16, opacity: 0.85, lineHeight: 1.6, fontSize: 15 }}>
                                Encuentra conferencias, meetups y hackathons cerca de ti.
                                Inscribete, conecta con otros asistentes y no te pierdas nada.
                            </p>
                            <div style={{ marginTop: 32 }}>
                                <div className="guest-layout__feature-item">
                                    &#10003; Inscripcion rapida con confirmacion al instante
                                </div>
                                <div className="guest-layout__feature-item">
                                    &#10003; Tu agenda personalizada y notificaciones
                                </div>
                                <div className="guest-layout__feature-item">
                                    &#10003; Networking con otros asistentes y speakers
                                </div>
                            </div>
                        </div>
                        <p style={{ fontSize: 12, opacity: 0.5 }}>
                            &copy; {new Date().getFullYear()} BuilderApp. Todos los derechos reservados.
                        </p>
                    </div>
                </div>

                {/* Right panel: Form */}
                <div className="guest-layout__form-panel">
                    <div className="guest-layout__form-wrapper">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
