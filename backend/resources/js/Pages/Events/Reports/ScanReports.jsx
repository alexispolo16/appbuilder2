import { Head } from '@inertiajs/react';
import EventLayout from '@/Layouts/EventLayout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import PieChart from '@cloudscape-design/components/pie-chart';
import BarChart from '@cloudscape-design/components/bar-chart';
import Badge from '@cloudscape-design/components/badge';
import ProgressBar from '@cloudscape-design/components/progress-bar';
import Alert from '@cloudscape-design/components/alert';

const PIE_COLORS = ['#0972d3', '#037f0c', '#8900e1', '#f89256', '#d91515', '#0a5275', '#7d2105', '#033160'];

const ticketTypeLabels = { general: 'General', vip: 'VIP', student: 'Estudiante', speaker: 'Speaker' };

function percentage(value, total) {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}

function StatCard({ label, value, description }) {
    return (
        <div>
            <Box variant="awsui-key-label">{label}</Box>
            <Box variant="h1" tagOverride="p">{value}</Box>
            {description && (
                <Box color="text-body-secondary" fontSize="body-s">{description}</Box>
            )}
        </div>
    );
}

export default function ScanReports({
    event,
    scanTypeLabels,
    summary,
    scansByType,
    scansByHour,
    scansByTicketType,
    recentScans,
    error,
}) {
    // Pie chart data: scans by type
    const pieData = Object.entries(scansByType).map(([key, count], idx) => ({
        title: scanTypeLabels[key] || key,
        value: count,
        color: PIE_COLORS[idx % PIE_COLORS.length],
    }));

    // Bar chart data: scans by hour per type
    const allHours = new Set();
    Object.values(scansByHour).forEach((hourMap) => {
        Object.keys(hourMap).forEach((h) => allHours.add(h));
    });
    const sortedHours = [...allHours].sort();

    const barSeries = Object.entries(scansByHour).map(([scanType, hourMap], idx) => ({
        title: scanTypeLabels[scanType] || scanType,
        type: 'bar',
        data: sortedHours.map((hour) => ({ x: hour, y: hourMap[hour] || 0 })),
        color: PIE_COLORS[idx % PIE_COLORS.length],
    }));

    // Ticket type breakdown
    const totalTicketScans = Object.values(scansByTicketType).reduce((a, b) => a + b, 0) || 1;
    const ticketTypeEntries = Object.entries(scansByTicketType)
        .map(([type, count]) => ({
            label: ticketTypeLabels[type] || type,
            count,
            pct: (count / totalTicketScans) * 100,
        }))
        .sort((a, b) => b.count - a.count);

    const hasData = summary.total_scans > 0;

    return (
        <EventLayout event={event}>
            <Head title={`Reportes de Escaneo - ${event.name}`} />

            <SpaceBetween size="l">
                {error && (
                    <Alert type="error" header="Error">
                        {error}
                    </Alert>
                )}
                {/* Summary */}
                <Container header={<Header variant="h2">Resumen General</Header>}>
                    <ColumnLayout columns={4} variant="text-grid">
                        <StatCard
                            label="Total de participantes"
                            value={summary.total_participants}
                        />
                        <StatCard
                            label="Total de escaneos"
                            value={summary.total_scans}
                        />
                        <StatCard
                            label="Participantes escaneados"
                            value={summary.unique_scanned}
                            description={`${percentage(summary.unique_scanned, summary.total_participants)}% del total`}
                        />
                        <StatCard
                            label="Tasa de check-in"
                            value={`${summary.checkin_rate}%`}
                        />
                    </ColumnLayout>
                </Container>

                {/* Charts row */}
                <ColumnLayout columns={2}>
                    {/* Pie: distribution by scan type */}
                    <Container header={<Header variant="h2">Distribucion por tipo de escaneo</Header>}>
                        {hasData ? (
                            <PieChart
                                data={pieData}
                                detailPopoverContent={(datum) => [
                                    { key: 'Cantidad', value: datum.value },
                                    {
                                        key: 'Porcentaje',
                                        value: `${percentage(datum.value, summary.total_scans)}%`,
                                    },
                                ]}
                                size="large"
                                variant="donut"
                                innerMetricDescription="escaneos"
                                innerMetricValue={String(summary.total_scans)}
                                hideFilter
                                empty={<Box textAlign="center">Sin datos</Box>}
                            />
                        ) : (
                            <Box textAlign="center" padding={{ vertical: 'l' }} color="text-body-secondary">
                                Aun no hay escaneos registrados.
                            </Box>
                        )}
                    </Container>

                    {/* Pie: distribution by ticket type */}
                    <Container header={<Header variant="h2">Escaneos por tipo de entrada</Header>}>
                        {ticketTypeEntries.length > 0 ? (
                            <SpaceBetween size="m">
                                {ticketTypeEntries.map((entry) => (
                                    <div key={entry.label}>
                                        <Box variant="p" margin={{ bottom: 'xxs' }}>
                                            {entry.label} ({entry.count})
                                        </Box>
                                        <ProgressBar
                                            value={entry.pct}
                                            additionalInfo={`${entry.pct.toFixed(1)}%`}
                                        />
                                    </div>
                                ))}
                            </SpaceBetween>
                        ) : (
                            <Box textAlign="center" padding={{ vertical: 'l' }} color="text-body-secondary">
                                Aun no hay escaneos registrados.
                            </Box>
                        )}
                    </Container>
                </ColumnLayout>

                {/* Bar chart: scans by hour */}
                <Container header={<Header variant="h2">Escaneos por hora</Header>}>
                    {sortedHours.length > 0 ? (
                        <BarChart
                            series={barSeries}
                            xDomain={sortedHours}
                            yDomain={[0, Math.max(
                                ...barSeries.flatMap((s) => s.data.map((d) => d.y)),
                                1
                            )]}
                            xTitle="Hora"
                            yTitle="Escaneos"
                            height={300}
                            stackedBars
                            hideFilter={barSeries.length <= 1}
                            empty={<Box textAlign="center">Sin datos</Box>}
                        />
                    ) : (
                        <Box textAlign="center" padding={{ vertical: 'l' }} color="text-body-secondary">
                            Aun no hay escaneos registrados.
                        </Box>
                    )}
                </Container>

                {/* Progress per scan type */}
                {Object.keys(scansByType).length > 1 && (
                    <Container header={<Header variant="h2">Progreso por tipo de escaneo</Header>}>
                        <SpaceBetween size="m">
                            {Object.entries(scansByType).map(([key, count]) => (
                                <div key={key}>
                                    <Box variant="p" margin={{ bottom: 'xxs' }}>
                                        {scanTypeLabels[key] || key}: {count} / {summary.total_participants}
                                    </Box>
                                    <ProgressBar
                                        value={summary.total_participants > 0
                                            ? (count / summary.total_participants) * 100
                                            : 0
                                        }
                                        additionalInfo={`${percentage(count, summary.total_participants)}%`}
                                    />
                                </div>
                            ))}
                        </SpaceBetween>
                    </Container>
                )}

                {/* Recent scans table */}
                <Table
                    header={
                        <Header
                            variant="h2"
                            counter={`(${recentScans.length})`}
                        >
                            Ultimos escaneos
                        </Header>
                    }
                    columnDefinitions={[
                        {
                            id: 'participant',
                            header: 'Participante',
                            cell: (item) => (
                                <div>
                                    <div style={{ fontWeight: 500 }}>{item.participant_name}</div>
                                    <Box variant="small" color="text-body-secondary">
                                        {item.participant_email}
                                    </Box>
                                </div>
                            ),
                        },
                        {
                            id: 'company',
                            header: 'Empresa',
                            cell: (item) => item.participant_company || '-',
                        },
                        {
                            id: 'ticket_type',
                            header: 'Tipo entrada',
                            cell: (item) => (
                                <Badge>
                                    {ticketTypeLabels[item.participant_ticket_type] || item.participant_ticket_type}
                                </Badge>
                            ),
                        },
                        {
                            id: 'scan_type',
                            header: 'Tipo escaneo',
                            cell: (item) => (
                                <Badge color="blue">
                                    {scanTypeLabels[item.scan_type] || item.scan_type}
                                </Badge>
                            ),
                        },
                        {
                            id: 'scanned_at',
                            header: 'Fecha/Hora',
                            cell: (item) => item.scanned_at,
                        },
                        {
                            id: 'scanner',
                            header: 'Escaneado por',
                            cell: (item) => item.scanner_name,
                        },
                    ]}
                    items={recentScans}
                    empty={
                        <Box textAlign="center" padding={{ vertical: 'l' }}>
                            <Box variant="p" color="text-body-secondary">
                                Aun no se han realizado escaneos.
                            </Box>
                        </Box>
                    }
                />
            </SpaceBetween>
        </EventLayout>
    );
}
