import { Head } from '@inertiajs/react';
import AttendeeLayout from '@/Layouts/AttendeeLayout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Badge from '@cloudscape-design/components/badge';
import Button from '@cloudscape-design/components/button';

export default function Surveys({ event, surveys, registrationCode }) {
    const pending   = surveys.filter((s) => !s.responded).length;
    const responded = surveys.filter((s) => s.responded).length;

    return (
        <AttendeeLayout event={event}>
            <Head title={`Encuestas - ${event.name}`} />
            <ContentLayout
                header={
                    <Header
                        variant="h1"
                        description={event.name}
                        counter={`(${surveys.length})`}
                    >
                        Encuestas
                    </Header>
                }
            >
                <Table
                    columnDefinitions={[
                        {
                            id: 'title',
                            header: 'Encuesta',
                            cell: (item) => (
                                <SpaceBetween size="xxs">
                                    <Box fontWeight="bold">{item.title}</Box>
                                    {item.description && (
                                        <Box color="text-body-secondary" fontSize="body-s">
                                            {item.description}
                                        </Box>
                                    )}
                                </SpaceBetween>
                            ),
                        },
                        {
                            id: 'questions',
                            header: 'Preguntas',
                            cell: (item) => (
                                <Box color="text-body-secondary" fontSize="body-s">
                                    {item.questions_count} {item.questions_count === 1 ? 'pregunta' : 'preguntas'}
                                </Box>
                            ),
                            width: 130,
                        },
                        {
                            id: 'status',
                            header: 'Estado',
                            cell: (item) =>
                                item.responded ? (
                                    <Badge color="green">✓ Respondida</Badge>
                                ) : (
                                    <Badge color="blue">Pendiente</Badge>
                                ),
                            width: 140,
                        },
                        {
                            id: 'action',
                            header: '',
                            cell: (item) =>
                                item.responded ? (
                                    <Box color="text-body-secondary" fontSize="body-s">
                                        Completada
                                    </Box>
                                ) : (
                                    <Button
                                        variant="primary"
                                        href={`/e/${event.slug}/survey/${item.id}?code=${registrationCode}`}
                                        iconName="external"
                                        iconAlign="right"
                                        target="_blank"
                                    >
                                        Responder
                                    </Button>
                                ),
                            width: 150,
                        },
                    ]}
                    items={surveys}
                    header={
                        pending > 0 ? (
                            <Header
                                variant="h2"
                                counter={`${responded}/${surveys.length} respondidas`}
                            >
                                Encuestas del evento
                            </Header>
                        ) : undefined
                    }
                    empty={
                        <Box textAlign="center" padding="xl">
                            <SpaceBetween size="m" alignItems="center">
                                <Box fontSize="display-l">📋</Box>
                                <Box variant="h3">Sin encuestas</Box>
                                <Box color="text-body-secondary">
                                    No hay encuestas activas para este evento.
                                </Box>
                            </SpaceBetween>
                        </Box>
                    }
                    variant="full-page"
                    stickyHeader
                />
            </ContentLayout>
        </AttendeeLayout>
    );
}
