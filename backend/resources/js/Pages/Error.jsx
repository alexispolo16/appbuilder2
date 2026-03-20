import { Head } from '@inertiajs/react';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Icon from '@cloudscape-design/components/icon';

const errors = {
    403: {
        title: 'Acceso denegado',
        icon: 'lock-private',
        message: 'No tienes permisos para acceder a esta pagina. Si crees que esto es un error, contacta al administrador.',
    },
    404: {
        title: 'Pagina no encontrada',
        icon: 'search',
        message: 'La pagina que buscas no existe o fue movida. Verifica la URL e intenta de nuevo.',
    },
    419: {
        title: 'Sesion expirada',
        icon: 'status-warning',
        message: 'Tu sesion ha expirado. Por favor recarga la pagina e intenta de nuevo.',
    },
    429: {
        title: 'Demasiadas solicitudes',
        icon: 'status-warning',
        message: 'Has realizado demasiadas solicitudes en poco tiempo. Por favor espera un momento antes de intentar de nuevo.',
    },
    500: {
        title: 'Error del servidor',
        icon: 'status-negative',
        message: 'Ocurrio un error inesperado en el servidor. Por favor intenta de nuevo en unos minutos.',
    },
    503: {
        title: 'En mantenimiento',
        icon: 'status-in-progress',
        message: 'Estamos realizando mejoras en la plataforma. Volveremos en unos minutos. Gracias por tu paciencia.',
    },
};

export default function Error({ status }) {
    const error = errors[status] || errors[500];

    return (
        <>
            <Head title={`${status} - ${error.title}`} />

            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #f0f2f5 0%, #e3e6ea 100%)',
                    padding: 24,
                }}
            >
                <div style={{ maxWidth: 520, width: '100%' }}>
                    <SpaceBetween size="l">
                        {/* Error code badge */}
                        <div style={{ textAlign: 'center' }}>
                            <div
                                style={{
                                    display: 'inline-block',
                                    background: 'linear-gradient(135deg, #0972d3 0%, #033160 100%)',
                                    borderRadius: 16,
                                    padding: '20px 40px',
                                    marginBottom: 16,
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 56,
                                        fontWeight: 800,
                                        color: 'rgba(255,255,255,0.2)',
                                        letterSpacing: -2,
                                        lineHeight: 1,
                                    }}
                                >
                                    {status}
                                </span>
                            </div>
                        </div>

                        <Container
                            header={
                                <Header
                                    variant="h1"
                                    description={error.message}
                                >
                                    <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                                        <Icon name={error.icon} size="medium" />
                                        <span>{error.title}</span>
                                    </SpaceBetween>
                                </Header>
                            }
                        >
                            <SpaceBetween size="m">
                                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <Button variant="primary" href="/" iconName="arrow-left">
                                        Ir al inicio
                                    </Button>
                                    {status === 419 || status === 429 ? (
                                        <Button onClick={() => window.location.reload()} iconName="refresh">
                                            Recargar pagina
                                        </Button>
                                    ) : (
                                        <Button onClick={() => window.history.back()} iconName="undo">
                                            Volver atras
                                        </Button>
                                    )}
                                </div>

                                <Box textAlign="center" color="text-body-secondary" fontSize="body-s">
                                    BuilderApp
                                </Box>
                            </SpaceBetween>
                        </Container>
                    </SpaceBetween>
                </div>
            </div>
        </>
    );
}
