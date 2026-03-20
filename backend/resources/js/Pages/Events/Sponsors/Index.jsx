import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import EventLayout from '@/Layouts/EventLayout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import Box from '@cloudscape-design/components/box';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import ConfirmModal from '@/Components/ConfirmModal';

const statusConfig = {
    prospect:  { label: 'Prospecto',  type: 'pending' },
    confirmed: { label: 'Confirmado', type: 'success' },
    paid:      { label: 'Pagado',     type: 'info' },
};

export default function SponsorsIndex({ event, sponsors, sponsorLevels }) {
    const [deletingId, setDeletingId] = useState(null);

    function handleDelete() {
        router.delete(`/events/${event.id}/sponsors/${deletingId}`, {
            onFinish: () => setDeletingId(null),
        });
    }

    const grouped = sponsorLevels.map((level) => ({
        level,
        items: sponsors.filter((s) => s.sponsor_level_id === level.id),
    }));

    const unassigned = sponsors.filter(
        (s) => !sponsorLevels.some((l) => l.id === s.sponsor_level_id)
    );

    const deletingSponsor = sponsors.find((s) => s.id === deletingId);

    const actions = (
        <Button
            variant="primary"
            iconName="add-plus"
            onClick={() => router.visit(`/events/${event.id}/sponsors/create`)}
        >
            Agregar sponsor
        </Button>
    );

    return (
        <EventLayout event={event} actions={actions}>
            <Head title={`Sponsors - ${event.name}`} />

            <SpaceBetween size="l">
                <div className="plist-header">
                    <span className="plist-header__title">
                        Sponsors <span className="plist-header__count">({sponsors.length})</span>
                    </span>
                </div>

                {sponsors.length === 0 && (
                    <Box textAlign="center" color="text-body-secondary" padding="xl">
                        No hay sponsors registrados para este evento.
                    </Box>
                )}

                {grouped.map(({ level, items }) =>
                    items.length > 0 ? (
                        <SpaceBetween key={level.id} size="s">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span className="section-title">{level.name}</span>
                                <span className="section-count">({items.length})</span>
                            </div>
                            <div className="rcard-grid">
                                {items.map((sponsor) => (
                                    <SponsorCard
                                        key={sponsor.id}
                                        sponsor={sponsor}
                                        levelName={level.name}
                                        event={event}
                                        onDelete={() => setDeletingId(sponsor.id)}
                                    />
                                ))}
                            </div>
                        </SpaceBetween>
                    ) : null
                )}

                {unassigned.length > 0 && (
                    <SpaceBetween size="s">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span className="section-title">Sin nivel asignado</span>
                            <span className="section-count">({unassigned.length})</span>
                        </div>
                        <div className="rcard-grid">
                            {unassigned.map((sponsor) => (
                                <SponsorCard
                                    key={sponsor.id}
                                    sponsor={sponsor}
                                    levelName="—"
                                    event={event}
                                    onDelete={() => setDeletingId(sponsor.id)}
                                />
                            ))}
                        </div>
                    </SpaceBetween>
                )}
            </SpaceBetween>

            <ConfirmModal
                visible={!!deletingId}
                title="Eliminar sponsor"
                message={`¿Estás seguro de que deseas eliminar a '${deletingSponsor?.company_name}'? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                danger
                onConfirm={handleDelete}
                onCancel={() => setDeletingId(null)}
            />
        </EventLayout>
    );
}

function SponsorCard({ sponsor, levelName, event, onDelete }) {
    const status = statusConfig[sponsor.status] || { label: sponsor.status, type: 'pending' };

    return (
        <div className="plist-card" style={{ borderRadius: 10 }}>
            {/* Logo */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                {sponsor.logo_url ? (
                    <img
                        src={sponsor.logo_url}
                        alt={sponsor.company_name}
                        style={{ maxHeight: 72, maxWidth: '100%', objectFit: 'contain', borderRadius: 6 }}
                    />
                ) : (
                    <div style={{
                        width: 88, height: 72, background: '#f0f2f5', borderRadius: 6,
                        border: '2px dashed #d1d5db',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#9ba7b6', fontSize: 11, fontWeight: 500,
                    }}>
                        Sin logo
                    </div>
                )}
            </div>

            {/* Name + status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                <Box variant="h3" tagOverride="p" style={{ margin: 0 }}>
                    {sponsor.company_name}
                </Box>
                <StatusIndicator type={status.type}>{status.label}</StatusIndicator>
            </div>

            {/* Level */}
            <Box color="text-body-secondary" fontSize="body-s">
                Nivel: {levelName}
            </Box>

            {/* Contact info */}
            <SpaceBetween size="xxs">
                {sponsor.contact_name && (
                    <Box fontSize="body-s">
                        <strong>Contacto:</strong> {sponsor.contact_name}
                    </Box>
                )}
                {sponsor.contact_email && (
                    <Box fontSize="body-s">
                        <a href={`mailto:${sponsor.contact_email}`} style={{ color: '#0972d3' }}>
                            {sponsor.contact_email}
                        </a>
                    </Box>
                )}
                {sponsor.website && (
                    <Box fontSize="body-s">
                        <a href={sponsor.website} target="_blank" rel="noopener noreferrer"
                            style={{ color: '#0972d3', wordBreak: 'break-all' }}>
                            {sponsor.website}
                        </a>
                    </Box>
                )}
            </SpaceBetween>

            {/* Actions */}
            <div className="plist-card__actions" style={{ marginTop: 12 }}>
                <Button
                    variant="normal"
                    iconName="edit"
                    onClick={() => router.visit(`/events/${event.id}/sponsors/${sponsor.id}/edit`)}
                >
                    Editar
                </Button>
                <Button variant="normal" iconName="remove" onClick={onDelete}>
                    Eliminar
                </Button>
            </div>
        </div>
    );
}
