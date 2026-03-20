import { Head, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Alert from '@cloudscape-design/components/alert';

export default function PendingApproval({ organization }) {
    const isRejected = organization.approval_status === 'rejected';

    return (
        <GuestLayout>
            <Head title={isRejected ? 'Solicitud no aprobada' : 'Solicitud en revision'} />

            <SpaceBetween size="l">
                <div style={{ textAlign: 'center' }}>
                    {isRejected ? (
                        <>
                            <div style={{ fontSize: 48, marginBottom: 8 }}>&#10007;</div>
                            <Box variant="h1" fontSize="heading-xl">
                                Solicitud no aprobada
                            </Box>
                        </>
                    ) : (
                        <>
                            <div style={{ fontSize: 48, marginBottom: 8 }}>&#9203;</div>
                            <Box variant="h1" fontSize="heading-xl">
                                Solicitud en revision
                            </Box>
                        </>
                    )}
                </div>

                <Box variant="p" color="text-body-secondary" textAlign="center">
                    <strong>{organization.name}</strong>
                </Box>

                {isRejected ? (
                    <Alert type="error" header="Tu solicitud no fue aprobada">
                        {organization.rejection_reason
                            ? organization.rejection_reason
                            : 'Tu solicitud de registro no ha sido aprobada en esta ocasion. Si crees que esto es un error, contacta al equipo de soporte.'}
                    </Alert>
                ) : (
                    <Alert type="info" header="Estamos revisando tu solicitud">
                        Tu organizacion esta siendo revisada por nuestro equipo. Recibiras un correo electronico
                        cuando tu cuenta sea aprobada. Este proceso generalmente toma menos de 24 horas.
                    </Alert>
                )}

                <SpaceBetween size="s">
                    <Box textAlign="center" color="text-body-secondary" fontSize="body-s">
                        Puedes cerrar esta pagina. Te notificaremos por correo electronico.
                    </Box>
                    <div style={{ textAlign: 'center' }}>
                        <Button
                            onClick={() => router.post('/logout')}
                        >
                            Cerrar sesion
                        </Button>
                    </div>
                </SpaceBetween>
            </SpaceBetween>
        </GuestLayout>
    );
}
