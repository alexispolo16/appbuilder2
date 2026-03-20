import { useState, useCallback, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Table from '@cloudscape-design/components/table';
import Header from '@cloudscape-design/components/header';
import Button from '@cloudscape-design/components/button';
import ButtonDropdown from '@cloudscape-design/components/button-dropdown';
import SpaceBetween from '@cloudscape-design/components/space-between';
import TextFilter from '@cloudscape-design/components/text-filter';
import Select from '@cloudscape-design/components/select';
import Pagination from '@cloudscape-design/components/pagination';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import StatusBadge from '@/Components/StatusBadge';
import { formatEventDateRange } from '@/utils/formatters';
import { statusActions } from '@/utils/status-config';

const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'draft', label: 'Borrador' },
    { value: 'active', label: 'Activo' },
    { value: 'completed', label: 'Completado' },
    { value: 'cancelled', label: 'Cancelado' },
];

export default function EventsIndex({ events, filters, isSuperAdmin }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(
        statusOptions.find((o) => o.value === (filters?.status || '')) || statusOptions[0]
    );

    const applyFilters = useCallback(
        (newSearch, newStatus) => {
            router.get(
                '/events',
                {
                    search: newSearch || undefined,
                    status: newStatus || undefined,
                },
                { preserveState: true, replace: true }
            );
        },
        []
    );

    const searchTimeout = useRef(null);
    function handleSearch(value) {
        setSearch(value);
        clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => applyFilters(value, status.value), 300);
    }

    function handleStatusChange(selected) {
        setStatus(selected);
        applyFilters(search, selected.value);
    }

    function handlePageChange({ detail }) {
        const url = events.links?.find((_, i) => i === detail.currentPageIndex)?.url;
        if (url) router.visit(url);
        else {
            router.get('/events', {
                search: search || undefined,
                status: status.value || undefined,
                page: detail.currentPageIndex,
            }, { preserveState: true });
        }
    }

    function changeStatus(eventId, newStatus) {
        router.patch(`/events/${eventId}/status`, { status: newStatus }, {
            preserveState: true,
        });
    }

    const items = events.data || [];
    const total = events.total || items.length;

    const columnDefinitions = [
        {
            id: 'name',
            header: 'Nombre',
            cell: (item) => (
                <Link
                    onFollow={(e) => {
                        e.preventDefault();
                        router.visit(`/events/${item.id}`);
                    }}
                >
                    {item.name}
                </Link>
            ),
            sortingField: 'name',
        },
        ...(isSuperAdmin ? [{
            id: 'organization',
            header: 'Organización',
            cell: (item) => item.organization?.name || '-',
        }] : []),
        {
            id: 'status',
            header: 'Estado',
            cell: (item) => <StatusBadge status={item.status} />,
        },
        {
            id: 'date',
            header: 'Fecha',
            cell: (item) => formatEventDateRange(item.date_start, item.date_end),
        },
        {
            id: 'location',
            header: 'Ubicación',
            cell: (item) => item.venue || item.location || '-',
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: (item) => {
                const actions = statusActions.filter((a) => a.from === item.status);
                return (
                    <SpaceBetween direction="horizontal" size="xs">
                        <ButtonDropdown
                            expandToViewport
                            items={[
                                { id: 'view', text: 'Ver detalles' },
                                { id: 'edit', text: 'Editar' },
                                ...(actions.length > 0 ? [
                                    { id: 'divider', text: '-', disabled: true },
                                    ...actions.map((a) => ({
                                        id: `status-${a.to}`,
                                        text: a.label,
                                    })),
                                ] : []),
                            ]}
                            variant="inline-icon"
                            onItemClick={({ detail }) => {
                                if (detail.id === 'view') router.visit(`/events/${item.id}`);
                                else if (detail.id === 'edit') router.visit(`/events/${item.id}/edit`);
                                else if (detail.id.startsWith('status-')) changeStatus(item.id, detail.id.replace('status-', ''));
                            }}
                        />
                    </SpaceBetween>
                );
            },
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Eventos" />

            {/* Mobile cards */}
            <div className="plist plist--mobile">
                <div className="plist-filters">
                    <TextFilter
                        filteringText={search}
                        filteringPlaceholder="Buscar eventos..."
                        onChange={({ detail }) => handleSearch(detail.filteringText)}
                    />
                    <Select
                        selectedOption={status}
                        onChange={({ detail }) => handleStatusChange(detail.selectedOption)}
                        options={statusOptions}
                    />
                </div>
                <div className="plist-header">
                    <span className="plist-header__title">
                        Eventos <span className="plist-header__count">({total})</span>
                    </span>
                    <Button variant="primary" iconName="add-plus" onClick={() => router.visit('/events/create')}>
                        Crear evento
                    </Button>
                </div>
                {items.length === 0 ? (
                    <Box textAlign="center" padding={{ vertical: 'l' }}>
                        <SpaceBetween size="m">
                            <Box variant="h3">No hay eventos</Box>
                            <Box variant="p" color="text-body-secondary">
                                Crea tu primer evento para empezar a gestionar participantes, speakers y sponsors.
                            </Box>
                            <Button variant="primary" iconName="add-plus" onClick={() => router.visit('/events/create')}>
                                Crear evento
                            </Button>
                        </SpaceBetween>
                    </Box>
                ) : (
                    items.map((item) => {
                        const actions = statusActions.filter((a) => a.from === item.status);
                        return (
                            <div key={item.id} className="plist-card" onClick={() => router.visit(`/events/${item.id}`)} style={{ cursor: 'pointer' }}>
                                <div className="plist-card__top">
                                    <div className="plist-card__info">
                                        <div className="plist-card__name">{item.name}</div>
                                        {isSuperAdmin && item.organization?.name && (
                                            <div className="plist-card__email">{item.organization.name}</div>
                                        )}
                                        <div className="plist-card__meta">
                                            {formatEventDateRange(item.date_start, item.date_end)}
                                        </div>
                                        {(item.venue || item.location) && (
                                            <div className="plist-card__meta">{item.venue || item.location}</div>
                                        )}
                                    </div>
                                    <div className="plist-card__badges">
                                        <StatusBadge status={item.status} />
                                    </div>
                                </div>
                                <div className="plist-card__actions" onClick={(e) => e.stopPropagation()}>
                                    <Button variant="normal" onClick={() => router.visit(`/events/${item.id}`)}>
                                        Ver
                                    </Button>
                                    <Button variant="normal" iconName="edit" onClick={() => router.visit(`/events/${item.id}/edit`)}>
                                        Editar
                                    </Button>
                                    {actions.length > 0 && (
                                        <ButtonDropdown
                                            expandToViewport
                                            items={actions.map((a) => ({ id: a.to, text: a.label }))}
                                            onItemClick={({ detail }) => changeStatus(item.id, detail.id)}
                                        >
                                            Estado
                                        </ButtonDropdown>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                {events.last_page > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
                        <Pagination
                            currentPageIndex={events.current_page}
                            pagesCount={events.last_page}
                            onChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            {/* Desktop table */}
            <div className="plist--desktop">
                <Table
                    header={
                        <Header
                            variant="h1"
                            counter={`(${total})`}
                            description={isSuperAdmin ? 'Gestiona todos los eventos de la plataforma.' : 'Gestiona todos los eventos de tu organización.'}
                            actions={
                                <Button variant="primary" iconName="add-plus" onClick={() => router.visit('/events/create')}>
                                    Crear evento
                                </Button>
                            }
                        >
                            Eventos
                        </Header>
                    }
                    columnDefinitions={columnDefinitions}
                    items={items}
                    filter={
                        <SpaceBetween direction="horizontal" size="xs">
                            <TextFilter
                                filteringText={search}
                                filteringPlaceholder="Buscar eventos..."
                                onChange={({ detail }) => handleSearch(detail.filteringText)}
                            />
                            <Select
                                selectedOption={status}
                                onChange={({ detail }) => handleStatusChange(detail.selectedOption)}
                                options={statusOptions}
                            />
                        </SpaceBetween>
                    }
                    pagination={
                        events.last_page > 1 ? (
                            <Pagination
                                currentPageIndex={events.current_page}
                                pagesCount={events.last_page}
                                onChange={handlePageChange}
                            />
                        ) : null
                    }
                    empty={
                        <Box textAlign="center" padding={{ vertical: 'l' }}>
                            <SpaceBetween size="m">
                                <Box variant="h3">No hay eventos</Box>
                                <Box variant="p" color="text-body-secondary">
                                    Crea tu primer evento para empezar a gestionar participantes, speakers y sponsors.
                                </Box>
                                <Button variant="primary" iconName="add-plus" onClick={() => router.visit('/events/create')}>
                                    Crear evento
                                </Button>
                            </SpaceBetween>
                        </Box>
                    }
                />
            </div>
        </AuthenticatedLayout>
    );
}
