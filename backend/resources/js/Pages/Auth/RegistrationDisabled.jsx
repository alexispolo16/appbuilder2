import { Head, Link } from '@inertiajs/react';
import TopNavigation from '@cloudscape-design/components/top-navigation';
import Container from '@cloudscape-design/components/container';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';

export default function RegistrationDisabled() {
    return (
        <>
            <Head title="Registro no disponible" />
            <div className="auth-shell">
                <TopNavigation
                    identity={{ href: '/', title: 'BuilderApp' }}
                    utilities={[]}
                />

                <div className="auth-content">
                    <div className="auth-card">
                        <Container>
                            <div style={{ textAlign: 'center', padding: '24px 0' }}>
                                <SpaceBetween size="m">
                                    <div style={{ fontSize: 48 }}>{'\u{1F6A7}'}</div>
                                    <Box variant="h2">Registro temporalmente deshabilitado</Box>
                                    <Box color="text-body-secondary">
                                        Por el momento no estamos aceptando nuevos registros de organizadores.
                                        Vuelve a intentarlo mas adelante.
                                    </Box>
                                    <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                                        <Button variant="primary" href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>
                                            Volver al inicio
                                        </Button>
                                        <Button href="/login" onClick={(e) => { e.preventDefault(); window.location.href = '/login'; }}>
                                            Iniciar sesion
                                        </Button>
                                    </SpaceBetween>
                                </SpaceBetween>
                            </div>
                        </Container>
                    </div>
                </div>
            </div>
        </>
    );
}
