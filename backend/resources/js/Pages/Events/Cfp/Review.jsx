import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import EventLayout from '@/Layouts/EventLayout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Textarea from '@cloudscape-design/components/textarea';
import FormField from '@cloudscape-design/components/form-field';
import Alert from '@cloudscape-design/components/alert';
import { cfpStatusConfig } from '@/utils/status-config';

function SocialLinks({ links }) {
    if (!links) return <Box color="text-body-secondary">—</Box>;
    const entries = Object.entries(links).filter(([, v]) => v);
    if (entries.length === 0) return <Box color="text-body-secondary">—</Box>;
    return (
        <SpaceBetween size="xs">
            {entries.map(([key, url]) => (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem' }}>
                    {key === 'twitter' ? 'X / Twitter' : key === 'linkedin' ? 'LinkedIn' : 'Website'}
                </a>
            ))}
        </SpaceBetween>
    );
}

export default function CfpReview({ event, application }) {
    const statusConfig = cfpStatusConfig[application.status] || { label: application.status, type: 'stopped' };

    const [reviewerNotes, setReviewerNotes] = useState(application.reviewer_notes || '');
    const [actionLoading, setActionLoading] = useState(false);

    function handleAction(status) {
        setActionLoading(true);
        router.patch(`/events/${event.id}/cfp/${application.id}/status`, {
            status,
            reviewer_notes: reviewerNotes,
        }, {
            onFinish: () => setActionLoading(false),
        });
    }

    return (
        <EventLayout event={event}>
            <Head title={`Revisar postulación - ${application.participant.full_name}`} />

            <SpaceBetween size="l">
                <Button
                    variant="link"
                    iconName="angle-left"
                    onClick={() => router.visit(`/events/${event.id}/cfp`)}
                >
                    Volver a postulaciones
                </Button>

                {/* Applicant info */}
                <Container
                    header={
                        <Header
                            variant="h2"
                            description={`Postulación de ${application.participant.full_name}`}
                        >
                            {application.proposed_topic}
                        </Header>
                    }
                >
                    <SpaceBetween size="l">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <StatusIndicator type={statusConfig.type}>
                                {statusConfig.label}
                            </StatusIndicator>
                            <Box color="text-body-secondary" fontSize="body-s">
                                {new Date(application.created_at).toLocaleDateString('es-EC', {
                                    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                                })}
                            </Box>
                        </div>

                        <ColumnLayout columns={2} variant="text-grid">
                            <SpaceBetween size="xs">
                                <Box variant="awsui-key-label">Postulante</Box>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '1rem' }}>
                                        {application.participant.full_name}
                                    </div>
                                    <div style={{ color: '#687078' }}>{application.participant.email}</div>
                                    {application.participant.phone && (
                                        <div style={{ color: '#687078' }}>{application.participant.phone}</div>
                                    )}
                                </div>
                            </SpaceBetween>
                            <SpaceBetween size="xs">
                                <Box variant="awsui-key-label">Empresa / Cargo</Box>
                                <div>
                                    {application.participant.job_title || application.participant.company
                                        ? [application.participant.job_title, application.participant.company].filter(Boolean).join(' @ ')
                                        : <Box color="text-body-secondary">—</Box>
                                    }
                                </div>
                            </SpaceBetween>
                        </ColumnLayout>

                        <ColumnLayout columns={2} variant="text-grid">
                            <SpaceBetween size="xs">
                                <Box variant="awsui-key-label">Bio</Box>
                                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                    {application.bio}
                                </div>
                            </SpaceBetween>
                            <SpaceBetween size="xs">
                                {application.photo_url && (
                                    <>
                                        <Box variant="awsui-key-label">Foto</Box>
                                        <img
                                            src={application.photo_url}
                                            alt={application.participant.full_name}
                                            style={{
                                                width: 120,
                                                height: 120,
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </>
                                )}
                                <Box variant="awsui-key-label">Redes sociales</Box>
                                <SocialLinks links={application.social_links} />
                            </SpaceBetween>
                        </ColumnLayout>

                        {application.topic_description && (
                            <SpaceBetween size="xs">
                                <Box variant="awsui-key-label">Descripción del tema</Box>
                                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                    {application.topic_description}
                                </div>
                            </SpaceBetween>
                        )}
                    </SpaceBetween>
                </Container>

                {/* Review actions */}
                {application.status !== 'accepted' && (
                    <Container
                        header={<Header variant="h2">Accion del revisor</Header>}
                    >
                        <SpaceBetween size="m">
                            <FormField
                                label="Notas / Comentarios"
                                description="Estas notas se enviarán al postulante en la notificación por correo."
                            >
                                <Textarea
                                    value={reviewerNotes}
                                    onChange={({ detail }) => setReviewerNotes(detail.value)}
                                    placeholder="Comentarios para el postulante (opcional para aceptar, recomendado para cambios/declinación)"
                                    rows={3}
                                />
                            </FormField>

                            <SpaceBetween direction="horizontal" size="s">
                                <Button
                                    variant="primary"
                                    loading={actionLoading}
                                    onClick={() => handleAction('accepted')}
                                >
                                    Aceptar postulación
                                </Button>
                                <Button
                                    loading={actionLoading}
                                    onClick={() => handleAction('changes_requested')}
                                >
                                    Solicitar cambios
                                </Button>
                                <Button
                                    loading={actionLoading}
                                    onClick={() => handleAction('declined')}
                                >
                                    Declinar
                                </Button>
                            </SpaceBetween>

                            <Alert type="info" statusIconAriaLabel="Info">
                                <strong>Aceptar</strong> creará automaticamente el perfil de speaker y cambiará el tipo de ticket del participante a "Speaker".
                            </Alert>
                        </SpaceBetween>
                    </Container>
                )}

                {application.status === 'accepted' && (
                    <Alert type="success" statusIconAriaLabel="Success">
                        Esta postulación ya fue aceptada. El perfil de speaker fue creado automaticamente.
                    </Alert>
                )}
            </SpaceBetween>
        </EventLayout>
    );
}
