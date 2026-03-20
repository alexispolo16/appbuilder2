import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import EventLayout from '@/Layouts/EventLayout';
import Table from '@cloudscape-design/components/table';
import Header from '@cloudscape-design/components/header';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Badge from '@cloudscape-design/components/badge';
import Link from '@cloudscape-design/components/link';
import ConfirmModal from '@/Components/ConfirmModal';

const badgeTypeConfig = {
    manual: { label: 'Manual', color: 'blue' },
    automatic: { label: 'Automatica', color: 'green' },
};

export default function BadgesIndex({ event, badges, totalParticipants }) {
    const [deleteTarget, setDeleteTarget] = useState(null);

    function deleteBadge() {
        router.delete(`/events/${event.id}/badges/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    }

    const actions = (
        <SpaceBetween direction="horizontal" size="xs">
            <Button
                iconName="status-info"
                onClick={() => router.visit(`/events/${event.id}/badges-analytics`)}
            >
                Analytics
            </Button>
            <Button
                variant="primary"
                iconName="add-plus"
                onClick={() => router.visit(`/events/${event.id}/badges/create`)}
            >
                Nueva insignia
            </Button>
        </SpaceBetween>
    );

    function getRuleLabel(item) {
        if (item.type === 'manual') return null;
        const rule = item.auto_rule;
        if (!rule) return null;
        if (rule.type === 'session_attendance') return `${rule.min_sessions} sesiones mín.`;
        if (rule.type === 'event_checkin') return 'Check-in al evento';
        if (rule.type === 'survey_completion') return `${rule.min_surveys} encuesta(s) mín.`;
        return null;
    }

    return (
        <EventLayout event={event} actions={actions}>
            <Head title={`Insignias - ${event.name}`} />

            {/* Mobile cards */}
            <div className="plist plist--mobile">
                <div className="plist-header">
                    <span className="plist-header__title">
                        Insignias <span className="plist-header__count">({badges.length})</span>
                    </span>
                </div>
                {badges.length === 0 ? (
                    <Box textAlign="center" padding={{ vertical: 'l' }}>
                        <SpaceBetween size="m">
                            <Box variant="h3">No hay insignias</Box>
                            <Box variant="p" color="text-body-secondary">
                                Crea insignias para reconocer logros de tus participantes.
                            </Box>
                            <Button variant="primary" iconName="add-plus"
                                onClick={() => router.visit(`/events/${event.id}/badges/create`)}>
                                Nueva insignia
                            </Button>
                        </SpaceBetween>
                    </Box>
                ) : (
                    badges.map((item) => {
                        const typeCfg = badgeTypeConfig[item.type] || { label: item.type, color: 'grey' };
                        const skills = item.skills ? item.skills.split(',').map((s) => s.trim()).filter(Boolean) : [];
                        const ruleLabel = getRuleLabel(item);
                        return (
                            <div key={item.id} className="plist-card">
                                <div className="plist-card__top">
                                    <div className="plist-card__avatar" style={{
                                        background: item.color || '#0972d3',
                                        borderRadius: 10,
                                        fontSize: item.image_url ? undefined : 20,
                                        overflow: 'hidden',
                                    }}>
                                        {item.image_url
                                            ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            : item.icon}
                                    </div>
                                    <div className="plist-card__info">
                                        <div className="plist-card__name">{item.name}</div>
                                        {ruleLabel && <div className="plist-card__code">{ruleLabel}</div>}
                                        <div className="plist-card__meta" style={{ marginTop: 4 }}>
                                            Asignadas: {item.awarded_count} / {totalParticipants}
                                        </div>
                                        {skills.length > 0 && (
                                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
                                                {skills.slice(0, 3).map((s, i) => (
                                                    <span key={i} style={{
                                                        background: `${item.color}15`, color: item.color,
                                                        fontSize: 11, fontWeight: 600, padding: '2px 8px',
                                                        borderRadius: 12, border: `1px solid ${item.color}30`,
                                                    }}>{s}</span>
                                                ))}
                                                {skills.length > 3 && <span style={{ fontSize: 11, color: '#7d8998' }}>+{skills.length - 3}</span>}
                                            </div>
                                        )}
                                    </div>
                                    <div className="plist-card__badges">
                                        <Badge color={typeCfg.color}>{typeCfg.label}</Badge>
                                        <StatusIndicator type={item.is_active ? 'success' : 'stopped'}>
                                            {item.is_active ? 'Activa' : 'Inactiva'}
                                        </StatusIndicator>
                                    </div>
                                </div>
                                <div className="plist-card__actions">
                                    <Button variant="normal" iconName="edit"
                                        onClick={() => router.visit(`/events/${event.id}/badges/${item.id}/edit`)}>
                                        Editar
                                    </Button>
                                    <Button variant="normal" iconName="remove" onClick={() => setDeleteTarget(item)}>
                                        Eliminar
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Desktop table */}
            <div className="plist--desktop">
            <Table
                header={
                    <Header
                        variant="h2"
                        counter={`(${badges.length})`}
                        description="Crea insignias para reconocer logros de los participantes. Pueden ser manuales o automaticas basadas en asistencia."
                    >
                        Insignias
                    </Header>
                }
                columnDefinitions={[
                    {
                        id: 'badge',
                        header: 'Insignia',
                        cell: (item) => (
                            <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                                {item.image_url ? (
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            objectFit: 'contain',
                                            borderRadius: 4,
                                        }}
                                    />
                                ) : (
                                    <span style={{ fontSize: 24 }}>{item.icon}</span>
                                )}
                                <Link
                                    href={`/events/${event.id}/badges/${item.id}/edit`}
                                    fontSize="body-m"
                                >
                                    {item.name}
                                </Link>
                            </SpaceBetween>
                        ),
                    },
                    {
                        id: 'type',
                        header: 'Tipo',
                        cell: (item) => {
                            const cfg = badgeTypeConfig[item.type];
                            return <Badge color={cfg.color}>{cfg.label}</Badge>;
                        },
                    },
                    {
                        id: 'rule',
                        header: 'Regla',
                        cell: (item) => getRuleLabel(item) || '-',
                    },
                    {
                        id: 'skills',
                        header: 'Skills',
                        cell: (item) => {
                            if (!item.skills) return '-';
                            const skills = item.skills.split(',').map((s) => s.trim()).filter(Boolean);
                            return (
                                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                    {skills.slice(0, 3).map((s, i) => (
                                        <span key={i} style={{
                                            display: 'inline-block',
                                            background: `${item.color}15`,
                                            color: item.color,
                                            fontSize: 11,
                                            fontWeight: 600,
                                            padding: '2px 8px',
                                            borderRadius: 12,
                                            border: `1px solid ${item.color}30`,
                                        }}>
                                            {s}
                                        </span>
                                    ))}
                                    {skills.length > 3 && (
                                        <span style={{ fontSize: 11, color: '#7d8998' }}>+{skills.length - 3}</span>
                                    )}
                                </div>
                            );
                        },
                    },
                    {
                        id: 'awarded',
                        header: 'Asignadas',
                        cell: (item) => (
                            <span>
                                {item.awarded_count} / {totalParticipants}
                            </span>
                        ),
                    },
                    {
                        id: 'status',
                        header: 'Estado',
                        cell: (item) => (
                            <StatusIndicator type={item.is_active ? 'success' : 'stopped'}>
                                {item.is_active ? 'Activa' : 'Inactiva'}
                            </StatusIndicator>
                        ),
                    },
                    {
                        id: 'actions',
                        header: 'Acciones',
                        cell: (item) => (
                            <SpaceBetween direction="horizontal" size="xs">
                                <Button
                                    variant="inline-link"
                                    onClick={() => router.visit(`/events/${event.id}/badges/${item.id}/edit`)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="inline-link"
                                    onClick={() => setDeleteTarget(item)}
                                >
                                    Eliminar
                                </Button>
                            </SpaceBetween>
                        ),
                    },
                ]}
                items={badges}
                empty={
                    <Box textAlign="center" padding={{ vertical: 'l' }}>
                        <SpaceBetween size="m">
                            <Box variant="h3">No hay insignias</Box>
                            <Box variant="p" color="text-body-secondary">
                                Crea insignias para reconocer logros de tus participantes.
                            </Box>
                            <Button
                                variant="primary"
                                iconName="add-plus"
                                onClick={() => router.visit(`/events/${event.id}/badges/create`)}
                            >
                                Nueva insignia
                            </Button>
                        </SpaceBetween>
                    </Box>
                }
            />

            </div>

            <ConfirmModal
                visible={!!deleteTarget}
                title="Eliminar insignia"
                message={`¿Eliminar la insignia "${deleteTarget?.name}"? También se eliminarán todas las asignaciones. Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                danger
                onConfirm={deleteBadge}
                onCancel={() => setDeleteTarget(null)}
            />
        </EventLayout>
    );
}
