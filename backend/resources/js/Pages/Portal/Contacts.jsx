import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AttendeeLayout from '@/Layouts/AttendeeLayout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';
import Tabs from '@cloudscape-design/components/tabs';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import Badge from '@cloudscape-design/components/badge';
import Link from '@cloudscape-design/components/link';

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : '';
}

const statusLabels = { accepted: 'Aceptado', pending: 'Pendiente' };
const statusColors = { accepted: 'green', pending: 'grey' };

const AVATAR_COLORS = ['#0972d3', '#037f0c', '#7d2105', '#8900e1', '#033160'];

function avatarColor(name = '') {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name = '') {
    return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

function NameCell({ item }) {
    return (
        <SpaceBetween direction="horizontal" size="xs" alignItems="center">
            <div
                className="portal-avatar portal-avatar--sm"
                style={{ background: avatarColor(item.full_name) }}
            >
                {getInitials(item.full_name)}
            </div>
            <Box fontWeight="bold">{item.full_name}</Box>
        </SpaceBetween>
    );
}

export default function Contacts({ event, contacts: initialContacts, requests: initialRequests }) {
    const [contacts, setContacts] = useState(initialContacts);
    const [requests, setRequests] = useState(initialRequests);
    const [loadingId, setLoadingId] = useState(null);

    async function handleAccept(requesterId) {
        setLoadingId(requesterId);
        try {
            const res = await fetch(`/portal/events/${event.id}/contacts/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') },
                body: JSON.stringify({ requester_participant_id: requesterId }),
            });
            if (res.ok) {
                const accepted = requests.find((r) => r.id === requesterId);
                setRequests(requests.filter((r) => r.id !== requesterId));
                if (accepted) setContacts([...contacts, { ...accepted, status: 'accepted' }]);
            }
        } finally {
            setLoadingId(null);
        }
    }

    async function handleReject(requesterId) {
        setLoadingId(requesterId);
        try {
            const res = await fetch(`/portal/events/${event.id}/contacts/reject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') },
                body: JSON.stringify({ requester_participant_id: requesterId }),
            });
            if (res.ok) setRequests(requests.filter((r) => r.id !== requesterId));
        } finally {
            setLoadingId(null);
        }
    }

    async function handleRemove(contactId) {
        setLoadingId(contactId);
        try {
            const res = await fetch(`/portal/events/${event.id}/contacts/remove`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') },
                body: JSON.stringify({ connected_participant_id: contactId }),
            });
            if (res.ok) setContacts(contacts.filter((c) => c.id !== contactId));
        } finally {
            setLoadingId(null);
        }
    }

    return (
        <AttendeeLayout event={event}>
            <Head title={`Mis Contactos - ${event.name}`} />
            <ContentLayout
                header={
                    <Header
                        variant="h1"
                        description={event.name}
                        actions={
                            contacts.length > 0 && (
                                <Button
                                    iconName="download"
                                    href={`/portal/events/${event.id}/contacts/export`}
                                >
                                    Exportar CSV
                                </Button>
                            )
                        }
                    >
                        Mis Contactos
                    </Header>
                }
            >
                <Tabs
                    tabs={[
                        {
                            label: `Contactos (${contacts.length})`,
                            id: 'contacts',
                            content: (
                                <Table
                                    columnDefinitions={[
                                        {
                                            id: 'name',
                                            header: 'Nombre',
                                            cell: (item) => <NameCell item={item} />,
                                        },
                                        {
                                            id: 'company',
                                            header: 'Empresa',
                                            cell: (item) => item.company || <Box color="text-body-secondary">—</Box>,
                                        },
                                        {
                                            id: 'job_title',
                                            header: 'Cargo',
                                            cell: (item) => item.job_title || <Box color="text-body-secondary">—</Box>,
                                        },
                                        {
                                            id: 'email',
                                            header: 'Email',
                                            cell: (item) => item.email
                                                ? <Link href={`mailto:${item.email}`} external fontSize="body-s">{item.email}</Link>
                                                : <Box color="text-body-secondary">—</Box>,
                                        },
                                        {
                                            id: 'social',
                                            header: 'Redes',
                                            cell: (item) => {
                                                const entries = Object.entries(item.social_links || {}).filter(([, v]) => v);
                                                if (!entries.length) return <Box color="text-body-secondary">—</Box>;
                                                return (
                                                    <SpaceBetween direction="horizontal" size="xxs">
                                                        {entries.map(([key, url]) => (
                                                            <Link key={key} href={url} external fontSize="body-s">
                                                                {key}
                                                            </Link>
                                                        ))}
                                                    </SpaceBetween>
                                                );
                                            },
                                        },
                                        {
                                            id: 'status',
                                            header: 'Estado',
                                            cell: (item) => (
                                                <Badge color={statusColors[item.status] || 'grey'}>
                                                    {statusLabels[item.status] || item.status}
                                                </Badge>
                                            ),
                                            width: 110,
                                        },
                                        {
                                            id: 'actions',
                                            header: '',
                                            cell: (item) => (
                                                <Button
                                                    variant="link"
                                                    onClick={() => handleRemove(item.id)}
                                                    loading={loadingId === item.id}
                                                >
                                                    Eliminar
                                                </Button>
                                            ),
                                            width: 100,
                                        },
                                    ]}
                                    items={contacts}
                                    empty={
                                        <Box textAlign="center" padding="l" color="text-body-secondary">
                                            Aun no tienes contactos. Visita el directorio para conectar con otros asistentes.
                                        </Box>
                                    }
                                    variant="embedded"
                                />
                            ),
                        },
                        {
                            label: `Solicitudes (${requests.length})`,
                            id: 'requests',
                            content: (
                                <Table
                                    columnDefinitions={[
                                        {
                                            id: 'name',
                                            header: 'Nombre',
                                            cell: (item) => <NameCell item={item} />,
                                        },
                                        {
                                            id: 'company',
                                            header: 'Empresa',
                                            cell: (item) => item.company || <Box color="text-body-secondary">—</Box>,
                                        },
                                        {
                                            id: 'job_title',
                                            header: 'Cargo',
                                            cell: (item) => item.job_title || <Box color="text-body-secondary">—</Box>,
                                        },
                                        {
                                            id: 'actions',
                                            header: 'Acciones',
                                            cell: (item) => (
                                                <SpaceBetween direction="horizontal" size="xs">
                                                    <Button
                                                        variant="primary"
                                                        iconName="check"
                                                        onClick={() => handleAccept(item.id)}
                                                        loading={loadingId === item.id}
                                                    >
                                                        Aceptar
                                                    </Button>
                                                    <Button
                                                        iconName="close"
                                                        onClick={() => handleReject(item.id)}
                                                        loading={loadingId === item.id}
                                                    >
                                                        Rechazar
                                                    </Button>
                                                </SpaceBetween>
                                            ),
                                            width: 220,
                                        },
                                    ]}
                                    items={requests}
                                    empty={
                                        <Box textAlign="center" padding="l" color="text-body-secondary">
                                            No tienes solicitudes pendientes.
                                        </Box>
                                    }
                                    variant="embedded"
                                />
                            ),
                        },
                    ]}
                />
            </ContentLayout>
        </AttendeeLayout>
    );
}
