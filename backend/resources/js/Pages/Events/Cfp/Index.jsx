import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import EventLayout from '@/Layouts/EventLayout';
import Table from '@cloudscape-design/components/table';
import Header from '@cloudscape-design/components/header';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Toggle from '@cloudscape-design/components/toggle';
import TextFilter from '@cloudscape-design/components/text-filter';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';
import { cfpStatusConfig } from '@/utils/status-config';

function CfpStatusBadge({ status }) {
    const config = cfpStatusConfig[status] || { label: status, type: 'stopped' };
    return (
        <StatusIndicator type={config.type}>
            {config.label}
        </StatusIndicator>
    );
}

export default function CfpIndex({ event, applications }) {
    const cfpEnabled = event.settings?.cfp_enabled || false;
    const [filterText, setFilterText] = useState('');
    const [toggling, setToggling] = useState(false);

    const cfpUrl = `${window.location.origin}/e/${event.slug}/cfp`;

    const filteredItems = applications.filter((app) => {
        if (!filterText) return true;
        const q = filterText.toLowerCase();
        return (
            app.participant.full_name.toLowerCase().includes(q) ||
            app.proposed_topic.toLowerCase().includes(q) ||
            app.participant.email.toLowerCase().includes(q)
        );
    });

    function handleToggle() {
        setToggling(true);
        router.post(`/events/${event.id}/cfp/toggle`, {}, {
            preserveScroll: true,
            onFinish: () => setToggling(false),
        });
    }

    const statusCounts = {
        pending: applications.filter((a) => a.status === 'pending').length,
        accepted: applications.filter((a) => a.status === 'accepted').length,
        changes_requested: applications.filter((a) => a.status === 'changes_requested').length,
        declined: applications.filter((a) => a.status === 'declined').length,
    };

    return (
        <EventLayout event={event}>
            <Head title={`Convocatoria de Speakers - ${event.name}`} />

            <SpaceBetween size="l">
                {/* CFP Toggle & URL */}
                <SpaceBetween size="s">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                        <Toggle
                            checked={cfpEnabled}
                            onChange={handleToggle}
                            disabled={toggling}
                        >
                            Convocatoria {cfpEnabled ? 'abierta' : 'cerrada'}
                        </Toggle>
                        {cfpEnabled && (
                            <Box color="text-body-secondary" fontSize="body-s">
                                URL publica: <Link href={cfpUrl} external>{cfpUrl}</Link>
                            </Box>
                        )}
                    </div>
                </SpaceBetween>

                {!cfpEnabled && (
                    <Alert type="info">
                        La convocatoria de speakers esta cerrada. Activa el toggle para permitir postulaciones.
                    </Alert>
                )}

                {/* Stats */}
                {applications.length > 0 && (
                    <div className="rstat-grid">
                        <div className="rstat-item">
                            <span className="rstat-item__value">{statusCounts.pending}</span>
                            <span className="rstat-item__label">Pendientes</span>
                        </div>
                        <div className="rstat-item">
                            <span className="rstat-item__value rstat-item__value--success">{statusCounts.accepted}</span>
                            <span className="rstat-item__label">Aceptadas</span>
                        </div>
                        <div className="rstat-item">
                            <span className="rstat-item__value rstat-item__value--warning">{statusCounts.changes_requested}</span>
                            <span className="rstat-item__label">Con cambios</span>
                        </div>
                        <div className="rstat-item">
                            <span className="rstat-item__value rstat-item__value--error">{statusCounts.declined}</span>
                            <span className="rstat-item__label">Declinadas</span>
                        </div>
                    </div>
                )}

                {/* Filter */}
                <TextFilter
                    filteringText={filterText}
                    onChange={({ detail }) => setFilterText(detail.filteringText)}
                    filteringPlaceholder="Buscar por nombre, tema o correo..."
                />

                {/* Section header */}
                <div className="plist-header">
                    <span className="plist-header__title">
                        Postulaciones <span className="plist-header__count">({filteredItems.length})</span>
                    </span>
                </div>

                {/* Mobile cards */}
                <div className="plist plist--mobile">
                    {filteredItems.length === 0 ? (
                        <Box textAlign="center" padding={{ vertical: 'l' }}>
                            <Box variant="p" color="text-body-secondary">
                                {cfpEnabled
                                    ? 'Aun no hay postulaciones. Comparte el enlace de la convocatoria con tu comunidad.'
                                    : 'Activa la convocatoria para empezar a recibir postulaciones.'
                                }
                            </Box>
                        </Box>
                    ) : (
                        filteredItems.map((item) => (
                            <div key={item.id} className="plist-card">
                                <div className="plist-card__top">
                                    <div className="plist-card__info">
                                        <div className="plist-card__name">{item.participant.full_name}</div>
                                        <div className="plist-card__email">{item.participant.email}</div>
                                        {(item.participant.job_title || item.participant.company) && (
                                            <div className="plist-card__meta">
                                                {[item.participant.job_title, item.participant.company].filter(Boolean).join(' @ ')}
                                            </div>
                                        )}
                                        <div style={{ marginTop: 8, fontWeight: 500, fontSize: 14 }}>{item.proposed_topic}</div>
                                        {item.topic_description && (
                                            <div className="plist-card__meta" style={{ marginTop: 4 }}>
                                                {item.topic_description.length > 120
                                                    ? item.topic_description.substring(0, 120) + '...'
                                                    : item.topic_description}
                                            </div>
                                        )}
                                    </div>
                                    <div className="plist-card__badges">
                                        <CfpStatusBadge status={item.status} />
                                        <span className="plist-card__code">
                                            {new Date(item.created_at).toLocaleDateString('es-EC', { day: '2-digit', month: 'short' })}
                                        </span>
                                    </div>
                                </div>
                                <div className="plist-card__actions">
                                    <Button
                                        variant="primary"
                                        onClick={() => router.visit(`/events/${event.id}/cfp/${item.id}`)}
                                    >
                                        Revisar postulación
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
                            <Header variant="h2" counter={`(${filteredItems.length})`}>
                                Postulaciones
                            </Header>
                        }
                        columnDefinitions={[
                            {
                                id: 'participant',
                                header: 'Postulante',
                                cell: (item) => (
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{item.participant.full_name}</div>
                                        <div style={{ fontSize: '0.8125rem', color: '#687078' }}>{item.participant.email}</div>
                                        {(item.participant.job_title || item.participant.company) && (
                                            <div style={{ fontSize: '0.75rem', color: '#9ba7b6' }}>
                                                {[item.participant.job_title, item.participant.company].filter(Boolean).join(' @ ')}
                                            </div>
                                        )}
                                    </div>
                                ),
                                width: 220,
                            },
                            {
                                id: 'topic',
                                header: 'Tema propuesto',
                                cell: (item) => (
                                    <div>
                                        <div style={{ fontWeight: 500 }}>{item.proposed_topic}</div>
                                        {item.topic_description && (
                                            <div style={{ fontSize: '0.8125rem', color: '#687078', marginTop: 2 }}>
                                                {item.topic_description.length > 100
                                                    ? item.topic_description.substring(0, 100) + '...'
                                                    : item.topic_description}
                                            </div>
                                        )}
                                    </div>
                                ),
                            },
                            {
                                id: 'status',
                                header: 'Estado',
                                cell: (item) => <CfpStatusBadge status={item.status} />,
                                width: 160,
                            },
                            {
                                id: 'date',
                                header: 'Fecha',
                                cell: (item) => new Date(item.created_at).toLocaleDateString('es-EC', {
                                    day: '2-digit', month: 'short', year: 'numeric',
                                }),
                                width: 120,
                            },
                            {
                                id: 'actions',
                                header: 'Acciones',
                                cell: (item) => (
                                    <Button
                                        variant="inline-link"
                                        onClick={() => router.visit(`/events/${event.id}/cfp/${item.id}`)}
                                    >
                                        Revisar
                                    </Button>
                                ),
                                width: 100,
                            },
                        ]}
                        items={filteredItems}
                        empty={
                            <Box textAlign="center" padding={{ vertical: 'l' }}>
                                <Box variant="p" color="text-body-secondary">
                                    {cfpEnabled
                                        ? 'Aun no hay postulaciones. Comparte el enlace de la convocatoria con tu comunidad.'
                                        : 'Activa la convocatoria para empezar a recibir postulaciones.'
                                    }
                                </Box>
                            </Box>
                        }
                        sortingDisabled
                        variant="container"
                    />
                </div>
            </SpaceBetween>
        </EventLayout>
    );
}
