import { Head, router } from '@inertiajs/react';
import EventLayout from '@/Layouts/EventLayout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';

export default function AttendanceIndex({ event, agendaItems, summary }) {
    return (
        <EventLayout event={event}>
            <Head title={`Asistencia - ${event.name}`} />

            <SpaceBetween size="l">
                {/* Stats */}
                <div className="rstat-grid">
                    <div className="rstat-item">
                        <div className="rstat-item__value">{summary.total_sessions}</div>
                        <div className="rstat-item__label">Sesiones totales</div>
                    </div>
                    <div className="rstat-item">
                        <div className="rstat-item__value">{summary.total_participants}</div>
                        <div className="rstat-item__label">Participantes registrados</div>
                    </div>
                    <div className="rstat-item">
                        <div className="rstat-item__value rstat-item__value--success">{summary.total_attendances}</div>
                        <div className="rstat-item__label">Registros de asistencia</div>
                    </div>
                    <div className="rstat-item">
                        <div className="rstat-item__value">{summary.avg_sessions_per_participant}</div>
                        <div className="rstat-item__label">Promedio sesiones/participante</div>
                    </div>
                </div>

                {/* Mobile cards */}
                <div className="plist plist--mobile">
                    <div className="plist-header">
                        <span className="plist-header__title">
                            Sesiones <span className="plist-header__count">({agendaItems.length})</span>
                        </span>
                    </div>
                    {agendaItems.length === 0 ? (
                        <Box textAlign="center" padding={{ vertical: 'l' }}>
                            <Box variant="p" color="text-body-secondary">
                                No hay sesiones en la agenda. Crea sesiones primero desde la tab Agenda.
                            </Box>
                        </Box>
                    ) : (
                        agendaItems.map((item) => (
                            <div key={item.id} className="plist-card">
                                <div className="plist-card__top">
                                    <div className="plist-card__info">
                                        <div className="plist-card__name">{item.title}</div>
                                        {item.speakers?.length > 0 && (
                                            <div className="plist-card__meta">{item.speakers.map((s) => s.full_name).join(', ')}</div>
                                        )}
                                        <div className="plist-card__meta" style={{ marginTop: 4 }}>
                                            {item.date ? new Date(item.date).toLocaleDateString('es-EC') : ''}
                                            {item.start_time && item.end_time ? ` · ${item.start_time} - ${item.end_time}` : ''}
                                        </div>
                                    </div>
                                    <div className="plist-card__badges">
                                        <span className="plist-card__stat-value plist-card__stat-value--success">
                                            {item.session_attendances_count}
                                        </span>
                                        <span className="plist-card__stat-label">asistentes</span>
                                    </div>
                                </div>
                                <div className="plist-card__actions">
                                    <Button
                                        variant="normal"
                                        iconName="expand"
                                        onClick={() => router.visit(`/events/${event.id}/agenda/${item.id}/attendance-qr`)}
                                    >
                                        Proyectar QR
                                    </Button>
                                    <Button
                                        variant="normal"
                                        onClick={() => router.visit(`/events/${event.id}/agenda/${item.id}/feedback`)}
                                    >
                                        Ver feedback
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop table */}
                <div className="plist--desktop">
                    <Table
                        header={
                            <Header
                                variant="h2"
                                counter={`(${agendaItems.length})`}
                                description="Proyecta el QR de cada sesion para que los participantes registren su asistencia."
                            >
                                Asistencia por Sesion
                            </Header>
                        }
                        columnDefinitions={[
                            {
                                id: 'title',
                                header: 'Sesion',
                                cell: (item) => (
                                    <div>
                                        <Link
                                            href={`/events/${event.id}/agenda/${item.id}/attendance-qr`}
                                            fontSize="body-m"
                                        >
                                            {item.title}
                                        </Link>
                                        {item.speakers?.length > 0 && (
                                            <Box variant="small" color="text-body-secondary">
                                                {item.speakers.map((s) => s.full_name).join(', ')}
                                            </Box>
                                        )}
                                    </div>
                                ),
                            },
                            {
                                id: 'date',
                                header: 'Fecha',
                                cell: (item) =>
                                    item.date
                                        ? new Date(item.date).toLocaleDateString('es-EC')
                                        : '-',
                            },
                            {
                                id: 'time',
                                header: 'Horario',
                                cell: (item) =>
                                    item.start_time && item.end_time
                                        ? `${item.start_time} - ${item.end_time}`
                                        : '-',
                            },
                            {
                                id: 'attendance',
                                header: 'Asistentes',
                                cell: (item) => (
                                    <span style={{ fontWeight: 600 }}>
                                        {item.session_attendances_count}
                                    </span>
                                ),
                            },
                            {
                                id: 'actions',
                                header: 'Acciones',
                                cell: (item) => (
                                    <SpaceBetween direction="horizontal" size="xs">
                                        <Button
                                            variant="inline-link"
                                            iconName="expand"
                                            onClick={() =>
                                                router.visit(
                                                    `/events/${event.id}/agenda/${item.id}/attendance-qr`
                                                )
                                            }
                                        >
                                            Proyectar QR
                                        </Button>
                                        <Button
                                            variant="inline-link"
                                            onClick={() =>
                                                router.visit(
                                                    `/events/${event.id}/agenda/${item.id}/feedback`
                                                )
                                            }
                                        >
                                            Ver feedback
                                        </Button>
                                    </SpaceBetween>
                                ),
                            },
                        ]}
                        items={agendaItems}
                        empty={
                            <Box textAlign="center" padding="l">
                                <Box variant="p" color="text-body-secondary">
                                    No hay sesiones en la agenda. Crea sesiones primero desde la tab Agenda.
                                </Box>
                            </Box>
                        }
                    />
                </div>
            </SpaceBetween>
        </EventLayout>
    );
}
