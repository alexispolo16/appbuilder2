import { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import EventLayout from '@/Layouts/EventLayout';
import Table from '@cloudscape-design/components/table';
import Header from '@cloudscape-design/components/header';
import Button from '@cloudscape-design/components/button';
import ButtonDropdown from '@cloudscape-design/components/button-dropdown';
import SpaceBetween from '@cloudscape-design/components/space-between';
import TextFilter from '@cloudscape-design/components/text-filter';
import Select from '@cloudscape-design/components/select';
import Pagination from '@cloudscape-design/components/pagination';
import Box from '@cloudscape-design/components/box';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import ConfirmModal from '@/Components/ConfirmModal';
import { participantStatusConfig, ticketTypeConfig } from '@/utils/status-config';

const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'registered', label: 'Registrado' },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'attended', label: 'Asistido' },
    { value: 'cancelled', label: 'Cancelado' },
];

const ticketTypeOptions = [
    { value: '', label: 'Todos los tipos' },
    { value: 'general', label: 'General' },
    { value: 'vip', label: 'VIP' },
    { value: 'student', label: 'Estudiante' },
    { value: 'speaker', label: 'Speaker' },
];

const AVATAR_COLORS = ['#0972d3', '#037f0c', '#8b4513', '#6b21a8', '#0e7490'];

function getInitials(first, last) {
    return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
}
function getAvatarColor(name) {
    let n = 0;
    for (const c of name) n += c.charCodeAt(0);
    return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

export default function ParticipantsIndex({ event, participants, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(
        statusOptions.find((o) => o.value === (filters?.status || '')) || statusOptions[0]
    );
    const [ticketType, setTicketType] = useState(
        ticketTypeOptions.find((o) => o.value === (filters?.ticket_type || '')) || ticketTypeOptions[0]
    );
    const [deleteTarget, setDeleteTarget] = useState(null);
    const fileInputRef = useRef(null);
    const searchTimeout = useRef(null);

    function applyFilters(newSearch, newStatus, newTicketType) {
        router.get(
            `/events/${event.id}/participants`,
            {
                search: newSearch || undefined,
                status: newStatus || undefined,
                ticket_type: newTicketType || undefined,
            },
            { preserveState: true, replace: true }
        );
    }

    function handleSearchChange(value) {
        setSearch(value);
        clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => applyFilters(value, status.value, ticketType.value), 300);
    }

    function handleStatusChange(selected) {
        setStatus(selected);
        applyFilters(search, selected.value, ticketType.value);
    }

    function handleTicketTypeChange(selected) {
        setTicketType(selected);
        applyFilters(search, status.value, selected.value);
    }

    function handlePageChange({ detail }) {
        router.get(
            `/events/${event.id}/participants`,
            {
                search: search || undefined,
                status: status.value || undefined,
                ticket_type: ticketType.value || undefined,
                page: detail.currentPageIndex,
            },
            { preserveState: true }
        );
    }

    function checkIn(id) {
        router.post(`/events/${event.id}/participants/${id}/check-in`);
    }

    function confirmDelete(participant) {
        setDeleteTarget(participant);
    }

    function deleteParticipant() {
        router.delete(`/events/${event.id}/participants/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    }

    function handleImportCsv(e) {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        router.post(`/events/${event.id}/participants/import`, formData, {
            forceFormData: true,
        });
        e.target.value = '';
    }

    function downloadTemplate() {
        const headers = 'first_name,last_name,email,phone,company,job_title,ticket_type';
        const example1 = 'Juan,Perez,juan@email.com,+593 991234567,Empresa SA,Developer,general';
        const example2 = 'Maria,Lopez,maria@email.com,+593 987654321,,Estudiante,student';
        const example3 = 'Carlos,Ruiz,carlos@email.com,,,Ponente,speaker';
        const csv = [headers, example1, example2, example3].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plantilla-participantes.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    const items = participants.data || [];
    const total = participants.total ?? items.length;

    const actions = (
        <SpaceBetween direction="horizontal" size="xs">
            <input
                type="file"
                accept=".csv,.txt"
                style={{ display: 'none' }}
                onChange={handleImportCsv}
                ref={fileInputRef}
            />
            <ButtonDropdown
                items={[
                    { id: 'template', text: 'Descargar plantilla CSV', iconName: 'download' },
                    { id: 'import', text: 'Importar CSV', iconName: 'upload' },
                    { id: 'export', text: 'Exportar CSV', iconName: 'download' },
                ]}
                onItemClick={({ detail }) => {
                    if (detail.id === 'template') downloadTemplate();
                    if (detail.id === 'import') fileInputRef.current.click();
                    if (detail.id === 'export') window.location.href = `/events/${event.id}/participants/export`;
                }}
            >
                CSV
            </ButtonDropdown>
            <Button
                variant="primary"
                iconName="add-plus"
                onClick={() => router.visit(`/events/${event.id}/participants/create`)}
            >
                Agregar
            </Button>
        </SpaceBetween>
    );

    return (
        <EventLayout event={event} actions={actions}>
            <Head title={`Participantes - ${event.name}`} />

            {/* ── Filters ── */}
            <div className="plist-filters">
                <TextFilter
                    filteringText={search}
                    filteringPlaceholder="Buscar por nombre o email..."
                    onChange={({ detail }) => handleSearchChange(detail.filteringText)}
                />
                <Select
                    selectedOption={status}
                    onChange={({ detail }) => handleStatusChange(detail.selectedOption)}
                    options={statusOptions}
                />
                <Select
                    selectedOption={ticketType}
                    onChange={({ detail }) => handleTicketTypeChange(detail.selectedOption)}
                    options={ticketTypeOptions}
                />
            </div>

            {/* ── Header count ── */}
            <div className="plist-header">
                <span className="plist-header__title">
                    Participantes <span className="plist-header__count">({total})</span>
                </span>
            </div>

            {/* ── Mobile card list ── */}
            <div className="plist plist--mobile">
                {items.length === 0 ? (
                    <Box textAlign="center" padding={{ vertical: 'l' }}>
                        <SpaceBetween size="m">
                            <Box variant="h3">No hay participantes</Box>
                            <Box variant="p" color="text-body-secondary">
                                Agrega participantes manualmente o importa desde un CSV.
                            </Box>
                            <Button
                                variant="primary"
                                iconName="add-plus"
                                onClick={() => router.visit(`/events/${event.id}/participants/create`)}
                            >
                                Agregar participante
                            </Button>
                        </SpaceBetween>
                    </Box>
                ) : (
                    items.map((item) => {
                        const statusCfg = participantStatusConfig[item.status] || { label: item.status, type: 'stopped' };
                        const ticketCfg = ticketTypeConfig[item.ticket_type] || { label: item.ticket_type, type: 'info' };
                        const initials = getInitials(item.first_name, item.last_name);
                        const avatarColor = getAvatarColor(item.first_name + item.last_name);

                        return (
                            <div key={item.id} className="plist-card">
                                <div className="plist-card__top">
                                    <div
                                        className="plist-card__avatar"
                                        style={{ background: avatarColor }}
                                    >
                                        {initials}
                                    </div>
                                    <div className="plist-card__info">
                                        <div className="plist-card__name">
                                            {item.first_name} {item.last_name}
                                        </div>
                                        <div className="plist-card__code">{item.registration_code}</div>
                                        <div className="plist-card__email">{item.email}</div>
                                        {(item.company || item.job_title) && (
                                            <div className="plist-card__meta">
                                                {[item.job_title, item.company].filter(Boolean).join(' · ')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="plist-card__badges">
                                        <StatusIndicator type={statusCfg.type}>{statusCfg.label}</StatusIndicator>
                                        <StatusIndicator type={ticketCfg.type}>{ticketCfg.label}</StatusIndicator>
                                    </div>
                                </div>
                                <div className="plist-card__actions">
                                    {item.status !== 'attended' && item.status !== 'cancelled' && (
                                        <Button
                                            variant="normal"
                                            iconName="check"
                                            onClick={() => checkIn(item.id)}
                                        >
                                            Check-in
                                        </Button>
                                    )}
                                    <Button
                                        variant="normal"
                                        iconName="file"
                                        onClick={() => router.visit(`/events/${event.id}/participants/${item.id}/credential`)}
                                    >
                                        Credencial
                                    </Button>
                                    {item.status === 'attended' && (
                                        <Button
                                            variant="normal"
                                            iconName="download"
                                            onClick={() => window.location.href = `/events/${event.id}/certificates/${item.id}/download`}
                                        >
                                            Certificado
                                        </Button>
                                    )}
                                    <Button
                                        variant="normal"
                                        iconName="edit"
                                        onClick={() => router.visit(`/events/${event.id}/participants/${item.id}/edit`)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="normal"
                                        iconName="remove"
                                        onClick={() => confirmDelete(item)}
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* ── Desktop table ── */}
            <div className="plist--desktop">
                <Table
                    header={
                        <Header variant="h2" counter={`(${total})`}>
                            Participantes
                        </Header>
                    }
                    columnDefinitions={[
                        {
                            id: 'name',
                            header: 'Nombre',
                            cell: (item) => (
                                <div>
                                    <div style={{ fontWeight: 500 }}>
                                        {item.first_name} {item.last_name}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#687078', fontFamily: 'monospace' }}>
                                        {item.registration_code}
                                    </div>
                                </div>
                            ),
                        },
                        {
                            id: 'email',
                            header: 'Email',
                            cell: (item) => item.email,
                        },
                        {
                            id: 'company',
                            header: 'Empresa',
                            cell: (item) => item.company || '-',
                        },
                        {
                            id: 'ticket_type',
                            header: 'Tipo',
                            cell: (item) => {
                                const cfg = ticketTypeConfig[item.ticket_type] || { label: item.ticket_type, type: 'info' };
                                return <StatusIndicator type={cfg.type}>{cfg.label}</StatusIndicator>;
                            },
                        },
                        {
                            id: 'status',
                            header: 'Estado',
                            cell: (item) => {
                                const cfg = participantStatusConfig[item.status] || { label: item.status, type: 'stopped' };
                                return <StatusIndicator type={cfg.type}>{cfg.label}</StatusIndicator>;
                            },
                        },
                        {
                            id: 'actions',
                            header: 'Acciones',
                            cell: (item) => (
                                <SpaceBetween direction="horizontal" size="xs">
                                    {item.status !== 'attended' && item.status !== 'cancelled' && (
                                        <Button
                                            variant="inline-icon"
                                            iconName="check"
                                            onClick={() => checkIn(item.id)}
                                            ariaLabel="Check-in"
                                        />
                                    )}
                                    <Button
                                        variant="inline-link"
                                        onClick={() => router.visit(`/events/${event.id}/participants/${item.id}/credential`)}
                                    >
                                        Credencial
                                    </Button>
                                    {item.status === 'attended' && (
                                        <Button
                                            variant="inline-link"
                                            onClick={() => window.location.href = `/events/${event.id}/certificates/${item.id}/download`}
                                        >
                                            Certificado
                                        </Button>
                                    )}
                                    <Button
                                        variant="inline-link"
                                        onClick={() => router.visit(`/events/${event.id}/participants/${item.id}/edit`)}
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
                            ),
                        },
                    ]}
                    items={items}
                    empty={
                        <Box textAlign="center" padding={{ vertical: 'l' }}>
                            <SpaceBetween size="m">
                                <Box variant="h3">No hay participantes</Box>
                                <Box variant="p" color="text-body-secondary">
                                    Agrega participantes manualmente o importa desde un CSV.
                                </Box>
                                <Button
                                    variant="primary"
                                    iconName="add-plus"
                                    onClick={() => router.visit(`/events/${event.id}/participants/create`)}
                                >
                                    Agregar participante
                                </Button>
                            </SpaceBetween>
                        </Box>
                    }
                    pagination={
                        participants.last_page > 1 ? (
                            <Pagination
                                currentPageIndex={participants.current_page}
                                pagesCount={participants.last_page}
                                onChange={handlePageChange}
                            />
                        ) : null
                    }
                />
            </div>

            <ConfirmModal
                visible={!!deleteTarget}
                title="Eliminar participante"
                message={`¿Eliminar a ${deleteTarget?.first_name} ${deleteTarget?.last_name}? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                danger
                onConfirm={deleteParticipant}
                onCancel={() => setDeleteTarget(null)}
            />
        </EventLayout>
    );
}
