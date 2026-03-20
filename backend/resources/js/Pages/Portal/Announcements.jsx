import { Head } from '@inertiajs/react';
import AttendeeLayout from '@/Layouts/AttendeeLayout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';

function formatDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('es-EC', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function Announcements({ event, announcements }) {
    return (
        <AttendeeLayout event={event}>
            <Head title={`Anuncios - ${event.name}`} />
            <ContentLayout
                header={
                    <Header
                        variant="h1"
                        description="Comunicaciones enviadas por los organizadores"
                        counter={`(${announcements.length})`}
                    >
                        Anuncios
                    </Header>
                }
            >
                <SpaceBetween size="l">
                    {announcements.length === 0 ? (
                        <Container>
                            <Box textAlign="center" padding="xl">
                                <SpaceBetween size="m" alignItems="center">
                                    <Box fontSize="display-l">📢</Box>
                                    <Box variant="h3">Sin anuncios</Box>
                                    <Box color="text-body-secondary">
                                        Los organizadores aun no han enviado comunicaciones para este evento.
                                    </Box>
                                </SpaceBetween>
                            </Box>
                        </Container>
                    ) : (
                        announcements.map((a) => (
                            <Container
                                key={a.id}
                                header={
                                    <Header
                                        variant="h2"
                                        description={
                                            <Box color="text-body-secondary" fontSize="body-s">
                                                📅 {formatDate(a.sent_at)}
                                            </Box>
                                        }
                                    >
                                        {a.subject}
                                    </Header>
                                }
                            >
                                <div
                                    style={{ lineHeight: 1.8, fontSize: 14, color: '#16191f' }}
                                    dangerouslySetInnerHTML={{
                                        __html: a.body
                                            .replace(/</g, '&lt;')
                                            .replace(/>/g, '&gt;')
                                            .replace(/\n/g, '<br/>'),
                                    }}
                                />
                            </Container>
                        ))
                    )}
                </SpaceBetween>
            </ContentLayout>
        </AttendeeLayout>
    );
}
