import { Head } from '@inertiajs/react';
import AttendeeLayout from '@/Layouts/AttendeeLayout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import PieChart from '@cloudscape-design/components/pie-chart';
import { agendaTypeConfig } from '@/utils/status-config';

function pct(count, total) {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
}

function FeedbackMini({ feedback }) {
    if (!feedback || feedback.total === 0) {
        return <Box color="text-body-secondary" fontSize="body-s">Sin feedback</Box>;
    }
    const { ratings, total } = feedback;
    return (
        <SpaceBetween direction="horizontal" size="xs">
            <span title="Me encanto">{'\u{1F60D}'} {ratings.happy}</span>
            <span title="Regular">{'\u{1F610}'} {ratings.neutral}</span>
            <span title="No me gusto">{'\u{1F61E}'} {ratings.sad}</span>
            <Box color="text-body-secondary" fontSize="body-s">({total})</Box>
        </SpaceBetween>
    );
}

export default function SpeakerDashboard({ event, participant, sessions, totals }) {
    const totalFeedbacks = sessions.reduce((sum, s) => sum + (s.feedback?.total || 0), 0);
    const totalAttendance = sessions.reduce((sum, s) => sum + s.attendance, 0);
    const allHappy = sessions.reduce((sum, s) => sum + (s.feedback?.ratings?.happy || 0), 0);
    const allNeutral = sessions.reduce((sum, s) => sum + (s.feedback?.ratings?.neutral || 0), 0);
    const allSad = sessions.reduce((sum, s) => sum + (s.feedback?.ratings?.sad || 0), 0);
    const allWantMore = sessions.reduce((sum, s) => sum + (s.feedback?.want_more || 0), 0);

    const overallRatingData = [
        { title: 'Me encanto', value: allHappy, color: '#037f0c' },
        { title: 'Regular', value: allNeutral, color: '#f89256' },
        { title: 'No me gusto', value: allSad, color: '#d91515' },
    ].filter((d) => d.value > 0);

    return (
        <AttendeeLayout event={event}>
            <Head title={`Speaker Dashboard - ${event.name}`} />

            <SpaceBetween size="l">
                <Header
                    variant="h1"
                    description={`${participant.full_name} - ${event.name}`}
                >
                    Dashboard del Speaker
                </Header>

                {/* Stats */}
                <ColumnLayout columns={4} variant="text-grid">
                    <Container>
                        <Box variant="awsui-key-label">Mis sesiones</Box>
                        <Box variant="h1" tagOverride="p">{sessions.length}</Box>
                    </Container>
                    <Container>
                        <Box variant="awsui-key-label">Total asistentes</Box>
                        <Box variant="h1" tagOverride="p">{totalAttendance}</Box>
                    </Container>
                    <Container>
                        <Box variant="awsui-key-label">Feedbacks recibidos</Box>
                        <Box variant="h1" tagOverride="p">{totalFeedbacks}</Box>
                    </Container>
                    <Container>
                        <Box variant="awsui-key-label">Quieren mas del tema</Box>
                        <Box variant="h1" tagOverride="p">
                            {totalFeedbacks > 0 ? `${pct(allWantMore, totalFeedbacks)}%` : '-'}
                        </Box>
                    </Container>
                </ColumnLayout>

                {/* Sessions table */}
                <Container header={<Header variant="h2">Mis sesiones</Header>}>
                    <Table
                        columnDefinitions={[
                            {
                                id: 'title',
                                header: 'Sesion',
                                cell: (item) => (
                                    <div>
                                        <Box fontWeight="bold">{item.title}</Box>
                                        {item.location_detail && (
                                            <Box color="text-body-secondary" fontSize="body-s">
                                                {item.location_detail}
                                            </Box>
                                        )}
                                    </div>
                                ),
                            },
                            {
                                id: 'type',
                                header: 'Tipo',
                                cell: (item) => {
                                    const cfg = agendaTypeConfig[item.type];
                                    return cfg ? (
                                        <span
                                            style={{
                                                background: cfg.bg,
                                                color: cfg.text,
                                                padding: '2px 8px',
                                                borderRadius: 4,
                                                fontSize: 12,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {cfg.label}
                                        </span>
                                    ) : item.type;
                                },
                            },
                            {
                                id: 'schedule',
                                header: 'Horario',
                                cell: (item) => (
                                    <div>
                                        <Box fontSize="body-s">{item.date}</Box>
                                        <Box fontWeight="bold">
                                            {item.start_time} - {item.end_time}
                                        </Box>
                                    </div>
                                ),
                            },
                            {
                                id: 'attendance',
                                header: 'Asistentes',
                                cell: (item) => (
                                    <Box variant="h3" tagOverride="span">{item.attendance}</Box>
                                ),
                            },
                            {
                                id: 'feedback',
                                header: 'Feedback',
                                cell: (item) => <FeedbackMini feedback={item.feedback} />,
                            },
                        ]}
                        items={sessions}
                        variant="embedded"
                        empty={
                            <Box textAlign="center" padding="l" color="text-body-secondary">
                                No tienes sesiones asignadas en este evento.
                            </Box>
                        }
                    />
                </Container>

                {/* Feedback charts */}
                {totalFeedbacks > 0 && (
                    <ColumnLayout columns={2}>
                        <Container header={<Header variant="h2">Valoracion general</Header>}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <PieChart
                                    data={overallRatingData}
                                    detailPopoverContent={(datum) => [
                                        { key: 'Cantidad', value: datum.value },
                                        { key: 'Porcentaje', value: `${pct(datum.value, totalFeedbacks)}%` },
                                    ]}
                                    size="large"
                                    variant="donut"
                                    innerMetricDescription="respuestas"
                                    innerMetricValue={String(totalFeedbacks)}
                                    hideFilter
                                />
                                <SpaceBetween direction="horizontal" size="l">
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: 36 }}>{'\u{1F60D}'}</div>
                                        <Box variant="h2" tagOverride="p">{allHappy}</Box>
                                        <Box color="text-body-secondary" fontSize="body-s">
                                            {pct(allHappy, totalFeedbacks)}%
                                        </Box>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: 36 }}>{'\u{1F610}'}</div>
                                        <Box variant="h2" tagOverride="p">{allNeutral}</Box>
                                        <Box color="text-body-secondary" fontSize="body-s">
                                            {pct(allNeutral, totalFeedbacks)}%
                                        </Box>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: 36 }}>{'\u{1F61E}'}</div>
                                        <Box variant="h2" tagOverride="p">{allSad}</Box>
                                        <Box color="text-body-secondary" fontSize="body-s">
                                            {pct(allSad, totalFeedbacks)}%
                                        </Box>
                                    </div>
                                </SpaceBetween>
                            </div>
                        </Container>

                        <Container header={<Header variant="h2">¿Quieren mas del tema?</Header>}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <PieChart
                                    data={[
                                        { title: 'Si', value: allWantMore, color: '#0972d3' },
                                        { title: 'No', value: totalFeedbacks - allWantMore, color: '#d5dbdb' },
                                    ].filter((d) => d.value > 0)}
                                    detailPopoverContent={(datum) => [
                                        { key: 'Cantidad', value: datum.value },
                                        { key: 'Porcentaje', value: `${pct(datum.value, totalFeedbacks)}%` },
                                    ]}
                                    size="large"
                                    variant="donut"
                                    innerMetricDescription="quieren mas"
                                    innerMetricValue={String(allWantMore)}
                                    hideFilter
                                />
                                <SpaceBetween direction="horizontal" size="xl">
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: 36 }}>{'\u{1F44D}'}</div>
                                        <Box variant="h2" tagOverride="p">{allWantMore}</Box>
                                        <Box color="text-body-secondary" fontSize="body-s">
                                            {pct(allWantMore, totalFeedbacks)}% Si
                                        </Box>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: 36 }}>{'\u{1F44E}'}</div>
                                        <Box variant="h2" tagOverride="p">{totalFeedbacks - allWantMore}</Box>
                                        <Box color="text-body-secondary" fontSize="body-s">
                                            {pct(totalFeedbacks - allWantMore, totalFeedbacks)}% No
                                        </Box>
                                    </div>
                                </SpaceBetween>
                            </div>
                        </Container>
                    </ColumnLayout>
                )}
            </SpaceBetween>
        </AttendeeLayout>
    );
}
