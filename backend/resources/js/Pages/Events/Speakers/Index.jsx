import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import EventLayout from '@/Layouts/EventLayout';
import Cards from '@cloudscape-design/components/cards';
import Header from '@cloudscape-design/components/header';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import ConfirmModal from '@/Components/ConfirmModal';

const speakerStatusConfig = {
    invited: { label: 'Invitado', type: 'info' },
    confirmed: { label: 'Confirmado', type: 'success' },
    declined: { label: 'Declinado', type: 'stopped' },
};

function SpeakerAvatar({ speaker }) {
    if (speaker.photo_url) {
        return (
            <img
                src={speaker.photo_url}
                alt={`${speaker.first_name} ${speaker.last_name}`}
                style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0,
                }}
            />
        );
    }
    const initials = `${speaker.first_name?.[0] || ''}${speaker.last_name?.[0] || ''}`;
    return (
        <div
            style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: '#e8eaf6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#3f51b5',
            }}
        >
            {initials}
        </div>
    );
}

function SocialLinks({ links }) {
    if (!links) return null;
    return (
        <SpaceBetween direction="horizontal" size="xs">
            {links.twitter && (
                <a href={links.twitter} target="_blank" rel="noopener noreferrer" style={{ color: '#687078', lineHeight: 1 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                </a>
            )}
            {links.linkedin && (
                <a href={links.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#687078', lineHeight: 1 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                    </svg>
                </a>
            )}
            {links.instagram && (
                <a href={links.instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#687078', lineHeight: 1 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                </a>
            )}
            {links.github && (
                <a href={links.github} target="_blank" rel="noopener noreferrer" style={{ color: '#687078', lineHeight: 1 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                </a>
            )}
            {links.website && (
                <a href={links.website} target="_blank" rel="noopener noreferrer" style={{ color: '#687078', lineHeight: 1 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" x2="22" y1="12" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                </a>
            )}
        </SpaceBetween>
    );
}

export default function SpeakersIndex({ event, speakers }) {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [localSpeakers, setLocalSpeakers] = useState(speakers);

    function moveUp(index) {
        if (index === 0) return;
        const reordered = [...localSpeakers];
        [reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]];
        setLocalSpeakers(reordered);
        submitReorder(reordered);
    }

    function moveDown(index) {
        if (index === localSpeakers.length - 1) return;
        const reordered = [...localSpeakers];
        [reordered[index], reordered[index + 1]] = [reordered[index + 1], reordered[index]];
        setLocalSpeakers(reordered);
        submitReorder(reordered);
    }

    function submitReorder(ordered) {
        router.post(`/events/${event.id}/speakers/reorder`, {
            speakers: ordered.map((s, i) => ({ id: s.id, sort_order: i + 1 })),
        });
    }

    function confirmDelete(speaker) {
        setDeleteTarget(speaker);
    }

    function deleteSpeaker() {
        router.delete(`/events/${event.id}/speakers/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    }

    const actions = (
        <Button
            variant="primary"
            iconName="add-plus"
            onClick={() => router.visit(`/events/${event.id}/speakers/create`)}
        >
            Agregar speaker
        </Button>
    );

    return (
        <EventLayout event={event} actions={actions}>
            <Head title={`Speakers - ${event.name}`} />

            <Cards
                header={
                    <Header
                        variant="h2"
                        counter={`(${localSpeakers.length})`}
                    >
                        Speakers
                    </Header>
                }
                cardDefinition={{
                    header: (item) => (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                            <SpeakerAvatar speaker={item} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                                    {item.first_name} {item.last_name}
                                </div>
                                {(item.job_title || item.company) && (
                                    <div style={{ fontSize: '0.8125rem', color: '#687078', marginTop: 2 }}>
                                        {[item.job_title, item.company].filter(Boolean).join(' @ ')}
                                    </div>
                                )}
                                <div style={{ marginTop: 6 }}>
                                    <StatusIndicator type={speakerStatusConfig[item.status]?.type || 'stopped'}>
                                        {speakerStatusConfig[item.status]?.label || item.status}
                                    </StatusIndicator>
                                </div>
                            </div>
                        </div>
                    ),
                    sections: [
                        {
                            id: 'social',
                            content: (item) =>
                                item.social_links && Object.values(item.social_links).some(Boolean) ? (
                                    <SocialLinks links={item.social_links} />
                                ) : null,
                        },
                        {
                            id: 'actions',
                            content: (item) => {
                                const index = localSpeakers.findIndex((s) => s.id === item.id);
                                return (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <SpaceBetween direction="horizontal" size="xs">
                                            <Button
                                                variant="icon"
                                                iconName="angle-up"
                                                onClick={() => moveUp(index)}
                                                disabled={index === 0}
                                                ariaLabel="Mover arriba"
                                            />
                                            <Button
                                                variant="icon"
                                                iconName="angle-down"
                                                onClick={() => moveDown(index)}
                                                disabled={index === localSpeakers.length - 1}
                                                ariaLabel="Mover abajo"
                                            />
                                        </SpaceBetween>
                                        <SpaceBetween direction="horizontal" size="xs">
                                            <Button
                                                variant="inline-link"
                                                onClick={() =>
                                                    router.visit(`/events/${event.id}/speakers/${item.id}/edit`)
                                                }
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="inline-link"
                                                onClick={() => confirmDelete(item)}
                                            >
                                                Eliminar
                                            </Button>
                                        </SpaceBetween>
                                    </div>
                                );
                            },
                        },
                    ],
                }}
                items={localSpeakers}
                empty={
                    <Box textAlign="center" padding={{ vertical: 'l' }}>
                        <SpaceBetween size="m">
                            <Box variant="h3">No hay speakers registrados</Box>
                            <Box variant="p" color="text-body-secondary">
                                Agrega los speakers que participarán en este evento.
                            </Box>
                            <Button
                                variant="primary"
                                iconName="add-plus"
                                onClick={() => router.visit(`/events/${event.id}/speakers/create`)}
                            >
                                Agregar primer speaker
                            </Button>
                        </SpaceBetween>
                    </Box>
                }
            />

            <ConfirmModal
                visible={!!deleteTarget}
                title="Eliminar speaker"
                message={`¿Eliminar a ${deleteTarget?.first_name} ${deleteTarget?.last_name}? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                danger
                onConfirm={deleteSpeaker}
                onCancel={() => setDeleteTarget(null)}
            />
        </EventLayout>
    );
}
