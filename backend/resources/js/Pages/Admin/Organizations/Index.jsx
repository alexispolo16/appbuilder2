import { useState, useCallback, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import TextFilter from '@cloudscape-design/components/text-filter';
import Select from '@cloudscape-design/components/select';
import Pagination from '@cloudscape-design/components/pagination';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import Badge from '@cloudscape-design/components/badge';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Modal from '@cloudscape-design/components/modal';
import FormField from '@cloudscape-design/components/form-field';
import Textarea from '@cloudscape-design/components/textarea';
import Alert from '@cloudscape-design/components/alert';
import ConfirmModal from '@/Components/ConfirmModal';
import { formatDate } from '@/utils/formatters';

const activeOptions = [
    { value: '', label: 'Todos los estados' },
    { value: '1', label: 'Activas' },
    { value: '0', label: 'Inactivas' },
];

const approvalOptions = [
    { value: '', label: 'Todas las solicitudes' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'approved', label: 'Aprobadas' },
    { value: 'rejected', label: 'Rechazadas' },
];

const approvalIndicator = {
    pending: { type: 'pending', label: 'Pendiente' },
    approved: { type: 'success', label: 'Aprobada' },
    rejected: { type: 'error', label: 'Rechazada' },
};

export default function OrganizationsIndex({ organizations, filters, pendingCount }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [activeFilter, setActiveFilter] = useState(
        activeOptions.find((o) => o.value === String(filters?.is_active ?? '')) || activeOptions[0]
    );
    const [approvalFilter, setApprovalFilter] = useState(
        approvalOptions.find((o) => o.value === (filters?.approval_status ?? '')) || approvalOptions[0]
    );
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const searchTimeout = useRef(null);

    const applyFilters = useCallback((newSearch, newActive, newApproval) => {
        router.get(
            '/admin/organizations',
            {
                search: newSearch || undefined,
                is_active: newActive !== '' ? newActive : undefined,
                approval_status: newApproval || undefined,
            },
            { preserveState: true, replace: true }
        );
    }, []);

    function handleSearch(value) {
        setSearch(value);
        clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => applyFilters(value, activeFilter.value, approvalFilter.value), 300);
    }

    function handleActiveChange(selected) {
        setActiveFilter(selected);
        applyFilters(search, selected.value, approvalFilter.value);
    }

    function handleApprovalChange(selected) {
        setApprovalFilter(selected);
        applyFilters(search, activeFilter.value, selected.value);
    }

    function handlePageChange({ detail }) {
        router.get(
            '/admin/organizations',
            {
                search: search || undefined,
                is_active: activeFilter.value !== '' ? activeFilter.value : undefined,
                approval_status: approvalFilter.value || undefined,
                page: detail.currentPageIndex,
            },
            { preserveState: true }
        );
    }

    function toggleActive(org) {
        router.patch(`/admin/organizations/${org.id}/toggle-active`);
    }

    function impersonate(org) {
        router.post(`/admin/impersonate/${org.id}`);
    }

    function approveOrg(org) {
        router.patch(`/admin/organizations/${org.id}/approve`);
    }

    function openRejectModal(org) {
        setRejectModal(org);
        setRejectionReason('');
    }

    function submitReject() {
        router.patch(`/admin/organizations/${rejectModal.id}/reject`, {
            rejection_reason: rejectionReason,
        }, {
            onSuccess: () => setRejectModal(null),
        });
    }

    function deleteOrganization() {
        router.delete(`/admin/organizations/${confirmDelete.id}`, {
            onSuccess: () => setConfirmDelete(null),
        });
    }

    return (
        <AdminLayout>
            <Head title="Organizaciones" />
            <SpaceBetween size="l">
                {pendingCount > 0 && (
                    <Alert
                        type="warning"
                        header={`${pendingCount} organizacion${pendingCount > 1 ? 'es' : ''} pendiente${pendingCount > 1 ? 's' : ''} de aprobacion`}
                        action={
                            <Button onClick={() => {
                                const opt = approvalOptions.find(o => o.value === 'pending');
                                setApprovalFilter(opt);
                                applyFilters(search, activeFilter.value, 'pending');
                            }}>
                                Ver pendientes
                            </Button>
                        }
                    >
                        Hay solicitudes de registro que requieren tu revision.
                    </Alert>
                )}

                <Table
                    header={
                        <Header
                            variant="h1"
                            description="Gestiona todas las organizaciones de la plataforma."
                            counter={pendingCount > 0 ? `(${pendingCount} pendientes)` : undefined}
                            actions={
                                <Button
                                    variant="primary"
                                    iconName="add-plus"
                                    onClick={() => router.visit('/admin/organizations/create')}
                                >
                                    Crear organizacion
                                </Button>
                            }
                        >
                            Organizaciones
                        </Header>
                    }
                    filter={
                        <SpaceBetween direction="horizontal" size="xs">
                            <TextFilter
                                filteringText={search}
                                filteringPlaceholder="Buscar por nombre, email o slug..."
                                onChange={({ detail }) => handleSearch(detail.filteringText)}
                            />
                            <Select
                                selectedOption={activeFilter}
                                onChange={({ detail }) => handleActiveChange(detail.selectedOption)}
                                options={activeOptions}
                            />
                            <Select
                                selectedOption={approvalFilter}
                                onChange={({ detail }) => handleApprovalChange(detail.selectedOption)}
                                options={approvalOptions}
                            />
                        </SpaceBetween>
                    }
                    columnDefinitions={[
                        {
                            id: 'name',
                            header: 'Nombre',
                            cell: (item) => (
                                <SpaceBetween size="xxxs">
                                    <Link
                                        onFollow={(e) => {
                                            e.preventDefault();
                                            router.visit(`/admin/organizations/${item.id}`);
                                        }}
                                    >
                                        {item.name}
                                    </Link>
                                    <Box color="text-body-secondary" fontSize="body-s">
                                        {item.slug}
                                    </Box>
                                </SpaceBetween>
                            ),
                        },
                        {
                            id: 'email',
                            header: 'Email',
                            cell: (item) => item.email || '-',
                        },
                        {
                            id: 'events_count',
                            header: 'Eventos',
                            cell: (item) => item.events_count ?? 0,
                        },
                        {
                            id: 'approval',
                            header: 'Aprobacion',
                            cell: (item) => {
                                const info = approvalIndicator[item.approval_status] || approvalIndicator.pending;
                                return <StatusIndicator type={info.type}>{info.label}</StatusIndicator>;
                            },
                        },
                        {
                            id: 'is_active',
                            header: 'Activa',
                            cell: (item) =>
                                item.is_active ? (
                                    <StatusIndicator type="success">Si</StatusIndicator>
                                ) : (
                                    <StatusIndicator type="stopped">No</StatusIndicator>
                                ),
                        },
                        {
                            id: 'created_at',
                            header: 'Creada',
                            cell: (item) => formatDate(item.created_at),
                        },
                        {
                            id: 'actions',
                            header: 'Acciones',
                            cell: (item) => (
                                <SpaceBetween direction="horizontal" size="xs">
                                    {item.approval_status === 'pending' && (
                                        <>
                                            <Button
                                                variant="primary"
                                                onClick={() => approveOrg(item)}
                                            >
                                                Aprobar
                                            </Button>
                                            <Button
                                                onClick={() => openRejectModal(item)}
                                            >
                                                Rechazar
                                            </Button>
                                        </>
                                    )}
                                    {item.approval_status === 'rejected' && (
                                        <Button
                                            variant="primary"
                                            onClick={() => approveOrg(item)}
                                        >
                                            Aprobar
                                        </Button>
                                    )}
                                    {item.approval_status === 'approved' && (
                                        <>
                                            <Button
                                                variant="link"
                                                onClick={() => toggleActive(item)}
                                            >
                                                {item.is_active ? 'Desactivar' : 'Activar'}
                                            </Button>
                                            {item.is_active && (
                                                <Button
                                                    variant="link"
                                                    onClick={() => impersonate(item)}
                                                >
                                                    Impersonar
                                                </Button>
                                            )}
                                        </>
                                    )}
                                    <Button
                                        variant="link"
                                        onClick={() =>
                                            router.visit(`/admin/organizations/${item.id}`)
                                        }
                                    >
                                        Ver
                                    </Button>
                                    <Button
                                        variant="link"
                                        onClick={() => setConfirmDelete(item)}
                                    >
                                        Eliminar
                                    </Button>
                                </SpaceBetween>
                            ),
                        },
                    ]}
                    items={organizations?.data || []}
                    pagination={
                        organizations?.last_page > 1 ? (
                            <Pagination
                                currentPageIndex={organizations.current_page}
                                pagesCount={organizations.last_page}
                                onChange={handlePageChange}
                            />
                        ) : null
                    }
                    empty={
                        <Box textAlign="center" padding={{ vertical: 'l' }}>
                            <SpaceBetween size="m">
                                <Box variant="h3">No hay organizaciones</Box>
                                <Box color="text-body-secondary">
                                    No se encontraron organizaciones con los filtros actuales.
                                </Box>
                                <Button
                                    variant="primary"
                                    onClick={() => router.visit('/admin/organizations/create')}
                                >
                                    Crear organizacion
                                </Button>
                            </SpaceBetween>
                        </Box>
                    }
                />
            </SpaceBetween>

            <ConfirmModal
                visible={!!confirmDelete}
                title="Eliminar organizacion"
                message={
                    confirmDelete
                        ? `Estas seguro de eliminar la organizacion '${confirmDelete.name}'? Esta accion no se puede deshacer.`
                        : ''
                }
                confirmText="Eliminar"
                danger
                onConfirm={deleteOrganization}
                onCancel={() => setConfirmDelete(null)}
            />

            {/* Reject modal with reason */}
            <Modal
                visible={!!rejectModal}
                onDismiss={() => setRejectModal(null)}
                header="Rechazar organizacion"
                footer={
                    <Box float="right">
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button onClick={() => setRejectModal(null)}>Cancelar</Button>
                            <Button variant="primary" onClick={submitReject}>
                                Rechazar
                            </Button>
                        </SpaceBetween>
                    </Box>
                }
            >
                <SpaceBetween size="m">
                    <Box>
                        Vas a rechazar la organizacion <strong>{rejectModal?.name}</strong>.
                    </Box>
                    <FormField label="Motivo del rechazo (opcional)">
                        <Textarea
                            value={rejectionReason}
                            onChange={({ detail }) => setRejectionReason(detail.value)}
                            placeholder="Explica el motivo del rechazo..."
                            rows={3}
                        />
                    </FormField>
                </SpaceBetween>
            </Modal>
        </AdminLayout>
    );
}
