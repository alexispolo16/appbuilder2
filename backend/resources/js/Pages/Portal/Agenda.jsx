import { Head } from '@inertiajs/react';
import AttendeeLayout from '@/Layouts/AttendeeLayout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Container from '@cloudscape-design/components/container';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { extractDate, formatDateLong } from '@/utils/formatters';

const typeLabels = {
    talk: 'Charla',
    workshop: 'Taller',
    break: 'Descanso',
    networking: 'Networking',
    ceremony: 'Ceremonia',
};

const typeColors = {
    talk: 'blue',
    workshop: 'green',
    break: 'grey',
    networking: 'blue',
    ceremony: 'blue',
};

function formatTime(timeStr) {
    if (!timeStr) return '';
    return timeStr.substring(0, 5);
}

function getInitials(name = '') {
    return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

export default function Agenda({ event, agendaItems }) {
    const groupedByDate = agendaItems.reduce((acc, item) => {
        const date = extractDate(item.date);
        if (!acc[date]) acc[date] = [];
        acc[date].push(item);
        return acc;
    }, {});

    const dates = Object.keys(groupedByDate).sort();

    return (
        <AttendeeLayout event={event}>
            <Head title={`Agenda - ${event.name}`} />
            <ContentLayout
                header={
                    <Header
                        variant="h1"
                        description={event.name}
                        counter={dates.length > 0 ? `${dates.length} ${dates.length === 1 ? 'dia' : 'dias'}` : undefined}
                    >
                        Agenda
                    </Header>
                }
            >
                <SpaceBetween size="l">
                    {dates.length === 0 ? (
                        <Container>
                            <Box textAlign="center" padding="l" color="text-body-secondary">
                                No hay agenda disponible para este evento.
                            </Box>
                        </Container>
                    ) : (
                        dates.map((date) => (
                            <Container
                                key={date}
                                header={<Header variant="h2">{formatDateLong(date)}</Header>}
                            >
                                <Table
                                    columnDefinitions={[
                                        {
                                            id: 'time',
                                            header: 'Hora',
                                            cell: (item) => (
                                                <div className="portal-agenda-time">
                                                    {formatTime(item.start_time)}
                                                    {item.end_time && (
                                                        <div className="portal-agenda-time__end">
                                                            {formatTime(item.end_time)}
                                                        </div>
                                                    )}
                                                </div>
                                            ),
                                            width: 90,
                                        },
                                        {
                                            id: 'type',
                                            header: 'Tipo',
                                            cell: (item) => (
                                                <Badge color={typeColors[item.type] || 'grey'}>
                                                    {typeLabels[item.type] || item.type}
                                                </Badge>
                                            ),
                                            width: 110,
                                        },
                                        {
                                            id: 'title',
                                            header: 'Actividad',
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
                                            id: 'speakers',
                                            header: 'Speakers',
                                            cell: (item) => {
                                                if (!item.speakers || item.speakers.length === 0) return <Box color="text-body-secondary">—</Box>;
                                                return (
                                                    <SpaceBetween size="xxs">
                                                        {item.speakers.map((s, idx) => (
                                                            <SpaceBetween key={idx} direction="horizontal" size="xs" alignItems="center">
                                                                <div
                                                                    className="portal-avatar portal-avatar--sm"
                                                                    style={{ background: '#0972d3' }}
                                                                >
                                                                    {s.photo_url
                                                                        ? <img src={s.photo_url} alt={s.full_name} />
                                                                        : getInitials(s.full_name)}
                                                                </div>
                                                                <Box fontSize="body-s">{s.full_name}</Box>
                                                            </SpaceBetween>
                                                        ))}
                                                    </SpaceBetween>
                                                );
                                            },
                                            width: 200,
                                        },
                                        {
                                            id: 'location',
                                            header: 'Sala',
                                            cell: (item) => item.location_detail
                                                ? <Box fontSize="body-s">{item.location_detail}</Box>
                                                : <Box color="text-body-secondary">—</Box>,
                                            width: 130,
                                        },
                                    ]}
                                    items={groupedByDate[date]}
                                    variant="embedded"
                                    wrapLines
                                />
                            </Container>
                        ))
                    )}
                </SpaceBetween>
            </ContentLayout>
        </AttendeeLayout>
    );
}
