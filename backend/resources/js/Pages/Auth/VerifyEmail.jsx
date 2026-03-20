import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import TopNavigation from '@cloudscape-design/components/top-navigation';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Alert from '@cloudscape-design/components/alert';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';

const STEPS = [
    { title: 'Abre tu correo',       desc: 'Revisa la bandeja de la cuenta con la que te registraste.' },
    { title: 'Busca el mensaje',      desc: 'Busca un correo de BuilderApp. Si no aparece, revisa spam.' },
    { title: 'Haz clic en el enlace', desc: 'El enlace te redirigira de vuelta a la plataforma.' },
];

export default function VerifyEmail() {
    const { flash, auth } = usePage().props;
    const user = auth?.user;
    const [loading, setLoading] = useState(false);
    const [resent,  setResent]  = useState(false);

    const resend = () => {
        setLoading(true);
        router.post('/email/verification-notification', {}, {
            onSuccess: () => setResent(true),
            onFinish:  () => setLoading(false),
        });
    };

    const utilities = user
        ? [{
              type: 'menu-dropdown',
              text: `${user.first_name} ${user.last_name}`,
              iconName: 'user-profile',
              onItemClick: ({ detail }) => { if (detail.id === 'logout') router.post('/logout'); },
              items: [{ id: 'logout', text: 'Cerrar sesion' }],
          }]
        : [];

    return (
        <>
            <Head title="Verifica tu correo" />
            <div className="auth-shell">

                <TopNavigation
                    identity={{ href: '/', title: 'BuilderApp' }}
                    utilities={utilities}
                />

                <div className="auth-content" style={{ alignItems: 'center' }}>
                    <div className="auth-card">

                        {/* Icon + heading */}
                        <div style={{ textAlign: 'center' }}>
                            <div className="auth-verify__icon" style={{ margin: '0 auto 16px' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                                    stroke="#0972d3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                </svg>
                            </div>
                            <h1 className="auth-card__title">Verifica tu correo electronico</h1>
                            <p className="auth-card__sub" style={{ marginTop: 6 }}>
                                {user?.email
                                    ? <>Enviamos un enlace a <strong style={{ color: '#16191f' }}>{user.email}</strong></>
                                    : 'Enviamos un enlace de verificacion a tu correo.'}
                            </p>
                        </div>

                        {(flash?.success || resent) && (
                            <Alert type="success" header="Correo reenviado">
                                Revisa tu bandeja. Puede tardar unos segundos en llegar.
                            </Alert>
                        )}

                        <Container
                            header={
                                <Header variant="h3" description="Sigue estos 3 pasos para activar tu cuenta">
                                    Como verificar
                                </Header>
                            }
                        >
                            <div className="auth-verify__steps">
                                {STEPS.map((s, i) => (
                                    <div key={i} className="auth-verify__step">
                                        <div className="auth-verify__step-num">{i + 1}</div>
                                        <div>
                                            <div className="auth-verify__step-title">{s.title}</div>
                                            <div className="auth-verify__step-desc">{s.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Container>

                        <div className="auth-verify__notice">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                            </svg>
                            El enlace expira en <strong style={{ margin: '0 2px' }}>60 minutos</strong>. Puedes reenviar cuando quieras.
                        </div>

                        <SpaceBetween size="xs">
                            <Button variant="primary" onClick={resend} loading={loading} fullWidth>
                                {resent ? 'Reenviar de nuevo' : 'Reenviar correo de verificacion'}
                            </Button>
                            <Button variant="normal" onClick={() => router.post('/logout')} fullWidth>
                                Usar otra cuenta
                            </Button>
                        </SpaceBetween>

                        <p className="auth-card__footer-row" style={{ textAlign: 'center', marginTop: 4 }}>
                            ¿Correo incorrecto?{' '}
                            <a href="/register">Crea una nueva cuenta</a>
                        </p>

                    </div>
                </div>
            </div>
        </>
    );
}
