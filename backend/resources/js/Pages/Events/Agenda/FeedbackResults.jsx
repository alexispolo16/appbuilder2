import { Head, router } from '@inertiajs/react';
import EventLayout from '@/Layouts/EventLayout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import PieChart from '@cloudscape-design/components/pie-chart';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

function percentage(count, total) {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
}

export default function FeedbackResults({ event, agendaItem, feedback }) {
    const { total, ratings, want_more, attendance } = feedback;
    const feedbackRate = attendance > 0 ? percentage(total, attendance) : 0;

    const ratingData = [
        { title: 'Me encanto', value: ratings.happy, color: '#037f0c' },
        { title: 'Regular', value: ratings.neutral, color: '#f89256' },
        { title: 'No me gusto', value: ratings.sad, color: '#d91515' },
    ].filter((d) => d.value > 0);

    const wantMoreData = [
        { title: 'Si', value: want_more, color: '#0972d3' },
        { title: 'No', value: total - want_more, color: '#d5dbdb' },
    ].filter((d) => d.value > 0);

    const feedbackUrl = `${window.location.origin}/e/${event.name ? '' : ''}` +
        `${window.location.origin.includes('localhost') ? '' : ''}`; // constructed in actions

    return (
        <EventLayout event={event}>
            <Head title={`Feedback - ${agendaItem.title}`} />

            <SpaceBetween size="l">
                <Container
                    header={
                        <Header
                            variant="h2"
                            description={
                                <>
                                    {agendaItem.speakers?.length > 0 && (
                                        <span>{agendaItem.speakers.map((s) => s.full_name).join(', ')} &middot; </span>
                                    )}
                                    {agendaItem.start_time} - {agendaItem.end_time}
                                </>
                            }
                            actions={
                                <Button
                                    variant="normal"
                                    onClick={() => router.visit(`/events/${event.id}/attendance`)}
                                >
                                    Volver a asistencia
                                </Button>
                            }
                        >
                            Feedback: {agendaItem.title}
                        </Header>
                    }
                >
                    <ColumnLayout columns={4} variant="text-grid">
                        <div>
                            <Box variant="awsui-key-label">Asistentes</Box>
                            <Box variant="h1" tagOverride="p">{attendance}</Box>
                        </div>
                        <div>
                            <Box variant="awsui-key-label">Feedbacks recibidos</Box>
                            <Box variant="h1" tagOverride="p">{total}</Box>
                        </div>
                        <div>
                            <Box variant="awsui-key-label">Tasa de respuesta</Box>
                            <Box variant="h1" tagOverride="p">{feedbackRate}%</Box>
                        </div>
                        <div>
                            <Box variant="awsui-key-label">Quieren mas del tema</Box>
                            <Box variant="h1" tagOverride="p">
                                {total > 0 ? percentage(want_more, total) : 0}%
                            </Box>
                        </div>
                    </ColumnLayout>
                </Container>

                <ColumnLayout columns={2}>
                    <Container header={<Header variant="h2">¿Que les parecio la charla?</Header>}>
                        {total > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <PieChart
                                    data={ratingData}
                                    detailPopoverContent={(datum) => [
                                        { key: 'Cantidad', value: datum.value },
                                        {
                                            key: 'Porcentaje',
                                            value: `${percentage(datum.value, total)}%`,
                                        },
                                    ]}
                                    size="large"
                                    variant="donut"
                                    innerMetricDescription="respuestas"
                                    innerMetricValue={String(total)}
                                    hideFilter
                                    empty={<Box textAlign="center">Sin datos</Box>}
                                />
                                <SpaceBetween direction="horizontal" size="l">
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: 32 }}>{'\u{1F60D}'}</div>
                                        <Box variant="h2" tagOverride="p">{ratings.happy}</Box>
                                        <Box color="text-body-secondary" fontSize="body-s">
                                            {percentage(ratings.happy, total)}%
                                        </Box>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: 32 }}>{'\u{1F610}'}</div>
                                        <Box variant="h2" tagOverride="p">{ratings.neutral}</Box>
                                        <Box color="text-body-secondary" fontSize="body-s">
                                            {percentage(ratings.neutral, total)}%
                                        </Box>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: 32 }}>{'\u{1F61E}'}</div>
                                        <Box variant="h2" tagOverride="p">{ratings.sad}</Box>
                                        <Box color="text-body-secondary" fontSize="body-s">
                                            {percentage(ratings.sad, total)}%
                                        </Box>
                                    </div>
                                </SpaceBetween>
                            </div>
                        ) : (
                            <Box textAlign="center" padding={{ vertical: 'l' }} color="text-body-secondary">
                                Aun no hay feedback para esta sesion.
                            </Box>
                        )}
                    </Container>

                    <Container header={<Header variant="h2">¿Quieren saber mas del tema?</Header>}>
                        {total > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <PieChart
                                    data={wantMoreData}
                                    detailPopoverContent={(datum) => [
                                        { key: 'Cantidad', value: datum.value },
                                        {
                                            key: 'Porcentaje',
                                            value: `${percentage(datum.value, total)}%`,
                                        },
                                    ]}
                                    size="large"
                                    variant="donut"
                                    innerMetricDescription={want_more > 0 ? 'quieren mas' : 'respuestas'}
                                    innerMetricValue={String(want_more)}
                                    hideFilter
                                    empty={<Box textAlign="center">Sin datos</Box>}
                                />
                                <SpaceBetween direction="horizontal" size="xl">
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: 32 }}>{'\u{1F44D}'}</div>
                                        <Box variant="h2" tagOverride="p">{want_more}</Box>
                                        <Box color="text-body-secondary" fontSize="body-s">Si</Box>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: 32 }}>{'\u{1F44E}'}</div>
                                        <Box variant="h2" tagOverride="p">{total - want_more}</Box>
                                        <Box color="text-body-secondary" fontSize="body-s">No</Box>
                                    </div>
                                </SpaceBetween>
                            </div>
                        ) : (
                            <Box textAlign="center" padding={{ vertical: 'l' }} color="text-body-secondary">
                                Aun no hay feedback para esta sesion.
                            </Box>
                        )}
                    </Container>
                </ColumnLayout>
            </SpaceBetween>
        </EventLayout>
    );
}
