import '@cloudscape-design/global-styles/index.css';
import '@/styles/public-layout.css';
import { usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

function UserMenu({ user }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return;
        function onOut(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', onOut);
        return () => document.removeEventListener('mousedown', onOut);
    }, [open]);

    return (
        <div className="pnav__user" ref={ref}>
            <button className="pnav__user-btn" onClick={() => setOpen(v => !v)}>
                <span className="pnav__user-avatar">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                </span>
                <span className="pnav__user-name">{user.first_name} {user.last_name}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>
            {open && (
                <div className="pnav__dropdown">
                    <a
                        href={user.is_participant ? '/portal' : '/dashboard'}
                        className="pnav__dropdown-item"
                        onClick={() => setOpen(false)}
                    >
                        {user.is_participant ? 'Mi Portal' : 'Dashboard'}
                    </a>
                    <button
                        className="pnav__dropdown-item pnav__dropdown-logout"
                        onClick={() => { setOpen(false); router.post('/logout'); }}
                    >
                        Cerrar sesion
                    </button>
                </div>
            )}
        </div>
    );
}

export default function PublicLayout({ children, isPreview }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <div className="public-layout">
            {isPreview && (
                <div className="preview-banner">
                    Vista previa — Esta pagina aun no es visible al publico.
                </div>
            )}

            <header className="pnav">
                <div className="pnav__inner">
                    <a href="/" className="pnav__brand">BuilderApp</a>
                    <div className="pnav__actions">
                        {user ? (
                            <UserMenu user={user} />
                        ) : (
                            <>
                                <a href="/login" className="pnav__link">Iniciar sesion</a>
                                <a href="/register" className="pnav__btn">Crear cuenta</a>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="public-main">{children}</main>

            <footer className="public-footer">
                <div className="public-footer__inner">
                    <div className="public-footer__brand">
                        <span className="public-footer__logo">BuilderApp</span>
                        <p className="public-footer__tagline">
                            La plataforma para crear y gestionar eventos de tecnologia.
                        </p>
                    </div>
                    <div className="public-footer__nav">
                        <div className="public-footer__col">
                            <span className="public-footer__col-title">Asistentes</span>
                            <div className="public-footer__links">
                                <a href="/login">Iniciar sesion</a>
                                <a href="/register">Crear cuenta</a>
                            </div>
                        </div>
                        <div className="public-footer__col">
                            <span className="public-footer__col-title">Organizadores</span>
                            <div className="public-footer__links">
                                <a href="/organizer/login">Acceso organizadores</a>
                                <a href="/organizer/register">Organizar un evento</a>
                            </div>
                        </div>
                        <div className="public-footer__col">
                            <span className="public-footer__col-title">Plataforma</span>
                            <div className="public-footer__links">
                                <a href="/about">Sobre BuilderApp</a>
                                <a href="/privacy">Politica de privacidad</a>
                                <a href="/terms">Terminos y condiciones</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="public-footer__bottom">
                    &copy; {new Date().getFullYear()} BuilderApp. Todos los derechos reservados.
                </div>
            </footer>
        </div>
    );
}
