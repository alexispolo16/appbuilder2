import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AttendeeLayout from '@/Layouts/AttendeeLayout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import Input from '@cloudscape-design/components/input';
import Pagination from '@cloudscape-design/components/pagination';
import Badge from '@cloudscape-design/components/badge';

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : '';
}

const AVATAR_COLORS = ['#0972d3', '#037f0c', '#7d2105', '#8900e1', '#033160'];

function avatarColor(name = '') {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name = '') {
    return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

export default function Directory({ event, participants, savedContactIds, search }) {
    const [searchText, setSearchText] = useState(search || '');
    const [savingId, setSavingId]     = useState(null);
    const [localSaved, setLocalSaved] = useState(savedContactIds || []);

    function handleSearch() {
        router.visit(`/portal/events/${event.id}/directory`, {
            data: { search: searchText },
            preserveState: true,
        });
    }

    function handleKeyDown(e) {
        if (e.detail.key === 'Enter') handleSearch();
    }

    async function handleSaveContact(participantId) {
        setSavingId(participantId);
        try {
            const res = await fetch(`/portal/events/${event.id}/contacts/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') },
                body: JSON.stringify({ connected_participant_id: participantId }),
            });
            if (res.ok) setLocalSaved([...localSaved, participantId]);
        } finally {
            setSavingId(null);
        }
    }

    function handlePageChange({ detail }) {
        router.visit(`/portal/events/${event.id}/directory`, {
            data: { search: searchText, page: detail.currentPageIndex },
            preserveState: true,
        });
    }

    return (
        <AttendeeLayout event={event}>
            <Head title={`Directorio - ${event.name}`} />
            <ContentLayout
                header={
                    <Header
                        variant="h1"
                        description={event.name}
                        counter={`(${participants.total})`}
                    >
                        Directorio de participantes
                    </Header>
                }
            >
                <Table
                    header={
                        <Header
                            variant="h2"
                            actions={
                                <SpaceBetween direction="horizontal" size="xs">
                                    <Input
                                        value={searchText}
                                        onChange={({ detail }) => setSearchText(detail.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Buscar por nombre o empresa..."
                                        type="search"
                                    />
                                    <Button iconName="search" onClick={handleSearch}>
                                        Buscar
                                    </Button>
                                </SpaceBetween>
                            }
                        >
                            {search ? `Resultados para "${search}"` : 'Todos los asistentes'}
                        </Header>
                    }
                    columnDefinitions={[
                        {
                            id: 'name',
                            header: 'Nombre',
                            cell: (item) => (
                                <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                                    <div
                                        className="portal-avatar portal-avatar--sm"
                                        style={{ background: avatarColor(item.full_name) }}
                                    >
                                        {getInitials(item.full_name)}
                                    </div>
                                    <Box fontWeight="bold">{item.full_name}</Box>
                                </SpaceBetween>
                            ),
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
                            header: '',
                            cell: (item) =>
                                localSaved.includes(item.id) ? (
                                    <Badge color="green">Conectado</Badge>
                                ) : (
                                    <Button
                                        variant="primary"
                                        iconName="add-plus"
                                        loading={savingId === item.id}
                                        onClick={() => handleSaveContact(item.id)}
                                    >
                                        Conectar
                                    </Button>
                                ),
                            width: 150,
                        },
                    ]}
                    items={participants.data}
                    pagination={
                        <Pagination
                            currentPageIndex={participants.current_page}
                            pagesCount={participants.last_page}
                            onChange={handlePageChange}
                        />
                    }
                    empty={
                        <Box textAlign="center" padding="l" color="text-body-secondary">
                            {search
                                ? 'No se encontraron participantes con esa busqueda.'
                                : 'No hay participantes visibles en el directorio.'}
                        </Box>
                    }
                    variant="full-page"
                    stickyHeader
                />
            </ContentLayout>
        </AttendeeLayout>
    );
}
