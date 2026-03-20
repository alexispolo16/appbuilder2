import { Head, router } from '@inertiajs/react';
import EventLayout from '@/Layouts/EventLayout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import Button from '@cloudscape-design/components/button';
import ProgressBar from '@cloudscape-design/components/progress-bar';

function StatCard({ label, value, description }) {
    return (
        <div>
            <Box variant="awsui-key-label">{label}</Box>
            <Box variant="awsui-value-large">{value}</Box>
            {description && (
                <Box variant="small" color="text-body-secondary">{description}</Box>
            )}
        </div>
    );
}

function TrendChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <Box textAlign="center" padding="l" color="text-body-secondary">
                No hay datos de tendencia disponibles.
            </Box>
        );
    }

    const maxCount = Math.max(...data.map((d) => d.count), 1);

    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 120, padding: '8px 0' }}>
            {data.map((d, i) => (
                <div
                    key={i}
                    title={`${d.date}: ${d.count} insignia(s)`}
                    style={{
                        flex: 1,
                        background: 'linear-gradient(to top, #0972d3, #0972d3cc)',
                        borderRadius: '4px 4px 0 0',
                        height: `${Math.max((d.count / maxCount) * 100, 4)}%`,
                        minWidth: 6,
                        cursor: 'default',
                        transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => (e.target.style.opacity = 0.7)}
                    onMouseLeave={(e) => (e.target.style.opacity = 1)}
                />
            ))}
        </div>
    );
}

function SkillBar({ name, count, maxCount, color }) {
    const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
                minWidth: 140,
                fontSize: 13,
                fontWeight: 600,
                color: '#16191f',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            }}>
                {name}
            </div>
            <div style={{ flex: 1, height: 8, background: '#e9ebed', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: color || '#0972d3',
                    borderRadius: 4,
                    transition: 'width 0.3s',
                }} />
            </div>
            <div style={{ minWidth: 40, fontSize: 13, color: '#5f6b7a', fontWeight: 600, textAlign: 'right' }}>
                {count}
            </div>
        </div>
    );
}

export default function BadgesAnalytics({ event, summary, badgeStats, dailyTrend, topEarners, topSkills }) {
    return (
        <EventLayout event={event}>
            <Head title={`Analytics de Insignias - ${event.name}`} />

            <SpaceBetween size="l">
                <Header
                    variant="h1"
                    actions={
                        <Button
                            variant="link"
                            onClick={() => router.visit(`/events/${event.id}/badges`)}
                        >
                            Volver a Insignias
                        </Button>
                    }
                >
                    Analytics de Insignias
                </Header>

                {/* Summary Cards */}
                <Container header={<Header variant="h2">Resumen General</Header>}>
                    <ColumnLayout columns={4} variant="text-grid">
                        <StatCard
                            label="Total Insignias"
                            value={summary.total_badges}
                            description="Insignias configuradas"
                        />
                        <StatCard
                            label="Total Otorgadas"
                            value={summary.total_awarded}
                            description="Asignaciones realizadas"
                        />
                        <StatCard
                            label="Participantes con Insignia"
                            value={`${summary.unique_recipients} / ${summary.total_participants}`}
                            description={`${summary.earning_rate}% de los participantes`}
                        />
                        <StatCard
                            label="Tasa de Obtencion"
                            value={`${summary.earning_rate}%`}
                            description="Del total de participantes"
                        />
                    </ColumnLayout>
                </Container>

                {/* Daily Trend */}
                <Container
                    header={
                        <Header variant="h2" description="Insignias otorgadas por dia en los ultimos 30 dias">
                            Tendencia Diaria
                        </Header>
                    }
                >
                    <TrendChart data={dailyTrend} />
                    {dailyTrend.length > 0 && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: 11,
                            color: '#7d8998',
                            marginTop: 4,
                        }}>
                            <span>{dailyTrend[0]?.date}</span>
                            <span>{dailyTrend[dailyTrend.length - 1]?.date}</span>
                        </div>
                    )}
                </Container>

                <ColumnLayout columns={2}>
                    {/* Per-Badge Stats */}
                    <Container
                        header={
                            <Header variant="h2" description="Tasa de obtencion por insignia">
                                Rendimiento por Insignia
                            </Header>
                        }
                    >
                        <SpaceBetween size="m">
                            {badgeStats.map((b) => (
                                <div key={b.id}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                        {b.image_url ? (
                                            <img
                                                src={b.image_url}
                                                alt={b.name}
                                                style={{ width: 28, height: 28, objectFit: 'contain', borderRadius: 4 }}
                                            />
                                        ) : (
                                            <span style={{ fontSize: 22 }}>{b.icon}</span>
                                        )}
                                        <span style={{ fontWeight: 600, fontSize: 14, color: '#16191f' }}>{b.name}</span>
                                        <span style={{ marginLeft: 'auto', fontSize: 13, color: '#5f6b7a' }}>
                                            {b.awarded_count} otorgadas
                                        </span>
                                    </div>
                                    <ProgressBar
                                        value={b.rate}
                                        additionalInfo={`${b.rate}% de participantes`}
                                    />
                                </div>
                            ))}
                            {badgeStats.length === 0 && (
                                <Box textAlign="center" color="text-body-secondary">
                                    No hay insignias configuradas.
                                </Box>
                            )}
                        </SpaceBetween>
                    </Container>

                    {/* Top Skills */}
                    <Container
                        header={
                            <Header variant="h2" description="Skills mas otorgados en las insignias">
                                Top Skills Validados
                            </Header>
                        }
                    >
                        {topSkills.length > 0 ? (
                            <div style={{ padding: '8px 0' }}>
                                {topSkills.map((s, i) => (
                                    <SkillBar
                                        key={i}
                                        name={s.name}
                                        count={s.count}
                                        maxCount={topSkills[0]?.count || 1}
                                        color="#0972d3"
                                    />
                                ))}
                            </div>
                        ) : (
                            <Box textAlign="center" padding="l" color="text-body-secondary">
                                No hay skills definidos en las insignias.
                            </Box>
                        )}
                    </Container>
                </ColumnLayout>

                {/* Top Earners */}
                <Container
                    header={
                        <Header variant="h2" description="Participantes con mas insignias obtenidas">
                            Top Participantes
                        </Header>
                    }
                >
                    <Table
                        columnDefinitions={[
                            {
                                id: 'rank',
                                header: '#',
                                cell: (_, i) => i + 1,
                                width: 50,
                            },
                            {
                                id: 'name',
                                header: 'Participante',
                                cell: (item) => (
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{item.full_name}</div>
                                        {item.company && (
                                            <div style={{ fontSize: 12, color: '#7d8998' }}>{item.company}</div>
                                        )}
                                    </div>
                                ),
                            },
                            {
                                id: 'email',
                                header: 'Email',
                                cell: (item) => item.email,
                            },
                            {
                                id: 'badges',
                                header: 'Insignias',
                                cell: (item) => (
                                    <span style={{
                                        display: 'inline-block',
                                        background: '#0972d315',
                                        color: '#0972d3',
                                        fontWeight: 700,
                                        fontSize: 14,
                                        padding: '4px 14px',
                                        borderRadius: 20,
                                    }}>
                                        {item.badge_count}
                                    </span>
                                ),
                            },
                        ]}
                        items={topEarners}
                        empty={
                            <Box textAlign="center" padding="l" color="text-body-secondary">
                                Aun no se han otorgado insignias.
                            </Box>
                        }
                    />
                </Container>
            </SpaceBetween>
        </EventLayout>
    );
}
