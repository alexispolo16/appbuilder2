import { Head, router } from '@inertiajs/react';
import AttendeeLayout from '@/Layouts/AttendeeLayout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Cards from '@cloudscape-design/components/cards';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Badge from '@cloudscape-design/components/badge';
import Button from '@cloudscape-design/components/button';
import Link from '@cloudscape-design/components/link';
import Tabs from '@cloudscape-design/components/tabs';
import { formatEventDateRange } from '@/utils/formatters';

const statusLabels = {
    confirmed: 'Confirmado',
    registered: 'Registrado',
    attended: 'Asistio',
    waitlisted: 'En espera',
    cancelled: 'Cancelado',
};
const statusColors = {
    confirmed: 'green',
    registered: 'blue',
    attended: 'green',
    waitlisted: 'grey',
    cancelled: 'red',
};
const eventStatusLabels = { completed: 'Finalizado', cancelled: 'Cancelado' };

function getInitials(name = '') {
    return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

function EventCards({ items, isPast }) {
    return (
        <Cards
            cardsPerRow={[{ cards: 1 }, { minWidth: 600, cards: 2 }, { minWidth: 960, cards: 3 }]}
            cardDefinition={{
                header: (item) => (
                    <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                        <Link
                            href={`/portal/events/${item.id}/ticket`}
                            onFollow={(e) => { e.preventDefault(); router.visit(`/portal/events/${item.id}/ticket`); }}
                            fontSize="heading-m"
                        >
                            {item.name}
                        </Link>
                        {isPast && (
                            <Badge color="grey">{eventStatusLabels[item.status] || item.status}</Badge>
                        )}
                    </SpaceBetween>
                ),
                sections: [
                    {
                        id: 'cover',
                        content: (item) =>
                            item.image_url ? (
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="portal-event-cover"
                                />
                            ) : null,
                    },
                    {
                        id: 'info',
                        content: (item) => (
                            <SpaceBetween size="xxs">
                                <Box color="text-body-secondary" fontSize="body-s">
                                    📅&nbsp;{formatEventDateRange(item.date_start, item.date_end)}
                                </Box>
                                {(item.venue || item.location) && (
                                    <Box color="text-body-secondary" fontSize="body-s">
                                        📍&nbsp;{[item.venue, item.location].filter(Boolean).join(' · ')}
                                    </Box>
                                )}
                            </SpaceBetween>
                        ),
                    },
                    {
                        id: 'status',
                        content: (item) => (
                            <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                                <Badge color={statusColors[item.participant_status] || 'grey'}>
                                    {statusLabels[item.participant_status] || item.participant_status}
                                </Badge>
                                <Box color="text-body-secondary" fontSize="body-s">
                                    Cod: <strong>{item.registration_code}</strong>
                                </Box>
                            </SpaceBetween>
                        ),
                    },
                    {
                        id: 'actions',
                        content: (item) => (
                            <SpaceBetween direction="horizontal" size="xs">
                                <Button
                                    variant="primary"
                                    iconName="ticket"
                                    onClick={() => router.visit(`/portal/events/${item.id}/ticket`)}
                                >
                                    Mi entrada
                                </Button>
                                {!isPast && (
                                    <>
                                        <Button
                                            iconName="calendar"
                                            onClick={() => router.visit(`/portal/events/${item.id}/agenda`)}
                                        >
                                            Agenda
                                        </Button>
                                        <Button
                                            iconName="group-active"
                                            onClick={() => router.visit(`/portal/events/${item.id}/networking`)}
                                        >
                                            Networking
                                        </Button>
                                    </>
                                )}
                                {isPast && (
                                    <Button
                                        iconName="contact"
                                        onClick={() => router.visit(`/portal/events/${item.id}/contacts`)}
                                    >
                                        Mis Contactos
                                    </Button>
                                )}
                            </SpaceBetween>
                        ),
                    },
                ],
            }}
            items={items}
            empty={
                <Box textAlign="center" padding="l">
                    <SpaceBetween size="m">
                        <b>{isPast ? 'Sin eventos pasados' : 'No tienes eventos activos'}</b>
                        <Box color="text-body-secondary">
                            {isPast
                                ? 'Aqui apareceran los eventos a los que asististe.'
                                : 'Aun no te has registrado a ningun evento.'}
                        </Box>
                    </SpaceBetween>
                </Box>
            }
        />
    );
}

export default function Dashboard({ events }) {
    const activeEvents = events.filter((e) => !e.is_past);
    const pastEvents   = events.filter((e) => e.is_past);

    return (
        <AttendeeLayout>
            <Head title="Mis Eventos" />
            <ContentLayout
                header={
                    <Header
                        variant="h1"
                        description="Eventos a los que estas registrado"
                        counter={`(${events.length})`}
                    >
                        Portal del Asistente
                    </Header>
                }
            >
                <SpaceBetween size="l">
                    {pastEvents.length > 0 ? (
                        <Tabs
                            tabs={[
                                {
                                    id: 'active',
                                    label: `Activos (${activeEvents.length})`,
                                    content: <EventCards items={activeEvents} isPast={false} />,
                                },
                                {
                                    id: 'past',
                                    label: `Pasados (${pastEvents.length})`,
                                    content: <EventCards items={pastEvents} isPast={true} />,
                                },
                            ]}
                        />
                    ) : (
                        <EventCards items={activeEvents} isPast={false} />
                    )}
                </SpaceBetween>
            </ContentLayout>
        </AttendeeLayout>
    );
}
