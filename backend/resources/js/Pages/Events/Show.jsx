import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import EventLayout from '@/Layouts/EventLayout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Grid from '@cloudscape-design/components/grid';
import Input from '@cloudscape-design/components/input';
import FormField from '@cloudscape-design/components/form-field';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Alert from '@cloudscape-design/components/alert';
import ConfirmModal from '@/Components/ConfirmModal';
import { formatCurrency } from '@/utils/formatters';
import ButtonDropdown from '@cloudscape-design/components/button-dropdown';
import { statusActions, eventStatusConfig } from '@/utils/status-config';

export default function EventShow({ event, previewUrl }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingLevel, setEditingLevel] = useState(null);
    const [changingStatus, setChangingStatus] = useState(false);
    const sponsorLevelForm = useForm({ name: '', price: '' });
    const editLevelForm = useForm({ name: '', price: '' });

    function changeStatus(newStatus) {
        router.patch(`/events/${event.id}/status`, { status: newStatus }, {
            onStart: () => setChangingStatus(true),
            onFinish: () => setChangingStatus(false),
        });
    }

    function deleteEvent() {
        router.delete(`/events/${event.id}`);
    }

    function addSponsorLevel(e) {
        e.preventDefault();
        sponsorLevelForm.post(`/events/${event.id}/sponsor-levels`, {
            onSuccess: () => sponsorLevelForm.reset(),
        });
    }

    function startEditLevel(level) {
        setEditingLevel(level.id);
        editLevelForm.setData({ name: level.name, price: level.price || '' });
    }

    function saveEditLevel(level) {
        editLevelForm.put(`/events/${event.id}/sponsor-levels/${level.id}`, {
            onSuccess: () => setEditingLevel(null),
        });
    }

    function deleteSponsorLevel(level) {
        router.delete(`/events/${event.id}/sponsor-levels/${level.id}`);
    }

    const availableActions = statusActions.filter((a) => a.from === event.status);

    const statusDropdownItems = availableActions.map((action) => ({
        id: action.to,
        text: action.label,
        description: `Estado: ${eventStatusConfig[action.to]?.label}`,
        disabled: changingStatus,
    }));

    const actions = (
        <SpaceBetween direction="horizontal" size="xs">
            <Button
                iconName="external"
                onClick={() => window.open(previewUrl, '_blank')}
            >
                Previsualizar
            </Button>
            <Button onClick={() => router.visit(`/events/${event.id}/credential-designer`)}>
                Credencial
            </Button>
            <Button onClick={() => router.visit(`/events/${event.id}/edit`)}>Editar</Button>
            {statusDropdownItems.length > 0 && (
                <ButtonDropdown
                    items={statusDropdownItems}
                    onItemClick={({ detail }) => changeStatus(detail.id)}
                    loading={changingStatus}
                    variant="primary"
                >
                    Cambiar estado
                </ButtonDropdown>
            )}
        </SpaceBetween>
    );

    return (
        <EventLayout event={event} actions={actions}>
            <Head title={event.name} />

            <SpaceBetween size="l">

                {/* Images */}
                {(event.cover_image_url || event.event_image_url) && (
                    <div className="rcard-grid" style={{ gridTemplateColumns: event.cover_image_url && event.event_image_url ? undefined : '1fr' }}>
                        {event.cover_image_url && (
                            <Container>
                                <SpaceBetween size="xs">
                                    <Box variant="awsui-key-label">Portada (header)</Box>
                                    <img className="event-show__img" src={event.cover_image_url} alt="Portada" style={{ width: '100%', borderRadius: 8, objectFit: 'cover', maxHeight: 180 }} />
                                </SpaceBetween>
                            </Container>
                        )}
                        {event.event_image_url && (
                            <Container>
                                <SpaceBetween size="xs">
                                    <Box variant="awsui-key-label">Imagen del evento</Box>
                                    <img className="event-show__img" src={event.event_image_url} alt="Evento" style={{ width: '100%', borderRadius: 8, objectFit: 'cover', maxHeight: 180 }} />
                                </SpaceBetween>
                            </Container>
                        )}
                    </div>
                )}

                {/* Stats */}
                <div className="rstat-grid">
                    <div className="rstat-item">
                        <div className="rstat-item__value">{event.participants_count ?? 0}</div>
                        <div className="rstat-item__label">Participantes</div>
                    </div>
                    <div className="rstat-item">
                        <div className="rstat-item__value">{event.speakers_count ?? 0}</div>
                        <div className="rstat-item__label">Speakers</div>
                    </div>
                    <div className="rstat-item">
                        <div className="rstat-item__value">{event.sponsors_count ?? 0}</div>
                        <div className="rstat-item__label">Sponsors</div>
                    </div>
                    <div className="rstat-item">
                        <div className="rstat-item__value">{event.agenda_items_count ?? 0}</div>
                        <div className="rstat-item__label">Sesiones</div>
                    </div>
                </div>

                <Grid gridDefinition={[{ colspan: { default: 12, l: 8 } }, { colspan: { default: 12, l: 4 } }]}>
                    <SpaceBetween size="l">
                        {/* Description */}
                        <Container header={<Header variant="h2">Descripción</Header>}>
                            {event.description ? (
                                <div className="event-rich-description" dangerouslySetInnerHTML={{ __html: event.description }} />
                            ) : (
                                <Box color="text-body-secondary" fontStyle="italic">Sin descripción.</Box>
                            )}
                        </Container>

                        {/* Sponsor Levels */}
                        <Container
                            header={
                                <Header variant="h2" counter={event.sponsor_levels?.length ? `(${event.sponsor_levels.length})` : undefined}>
                                    Niveles de sponsor
                                </Header>
                            }
                        >
                            <SpaceBetween size="l">
                                {event.sponsor_levels?.length > 0 ? (
                                    <SpaceBetween size="xs">
                                        {event.sponsor_levels.map(item => (
                                            <div key={item.id} className="slevel-row">
                                                {editingLevel === item.id ? (
                                                    <SpaceBetween size="s">
                                                        <ColumnLayout columns={2}>
                                                            <FormField label="Nombre">
                                                                <Input
                                                                    value={editLevelForm.data.name}
                                                                    onChange={({ detail }) => editLevelForm.setData('name', detail.value)}
                                                                    placeholder="Nombre"
                                                                    autoFocus
                                                                />
                                                            </FormField>
                                                            <FormField label="Precio">
                                                                <Input
                                                                    type="number"
                                                                    value={String(editLevelForm.data.price)}
                                                                    onChange={({ detail }) => editLevelForm.setData('price', detail.value)}
                                                                    placeholder="0.00"
                                                                />
                                                            </FormField>
                                                        </ColumnLayout>
                                                        <SpaceBetween direction="horizontal" size="xs">
                                                            <Button variant="primary" onClick={() => saveEditLevel(item)}>Guardar</Button>
                                                            <Button variant="link" onClick={() => setEditingLevel(null)}>Cancelar</Button>
                                                        </SpaceBetween>
                                                    </SpaceBetween>
                                                ) : (
                                                    <div className="slevel-row__view">
                                                        <div className="slevel-row__info">
                                                            <Box fontWeight="bold">{item.name}</Box>
                                                            <Box color="text-body-secondary">{formatCurrency(item.price)}</Box>
                                                        </div>
                                                        <SpaceBetween direction="horizontal" size="xs">
                                                            <Button variant="link" iconName="edit" onClick={() => startEditLevel(item)}>Editar</Button>
                                                            <Button variant="link" iconName="remove" onClick={() => deleteSponsorLevel(item)}>Eliminar</Button>
                                                        </SpaceBetween>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </SpaceBetween>
                                ) : (
                                    <Box color="text-body-secondary" fontStyle="italic">Sin niveles de sponsor configurados.</Box>
                                )}

                                {/* Add form */}
                                <Container variant="stacked">
                                    <form onSubmit={addSponsorLevel}>
                                        <SpaceBetween size="s">
                                            <Box variant="awsui-key-label">Agregar nivel</Box>
                                            <ColumnLayout columns={2}>
                                                <FormField label="Nombre">
                                                    <Input
                                                        value={sponsorLevelForm.data.name}
                                                        onChange={({ detail }) => sponsorLevelForm.setData('name', detail.value)}
                                                        placeholder="Ej: Diamante"
                                                    />
                                                </FormField>
                                                <FormField label="Precio">
                                                    <Input
                                                        type="number"
                                                        value={sponsorLevelForm.data.price}
                                                        onChange={({ detail }) => sponsorLevelForm.setData('price', detail.value)}
                                                        placeholder="0.00"
                                                    />
                                                </FormField>
                                            </ColumnLayout>
                                            <Button variant="primary" formAction="submit" loading={sponsorLevelForm.processing} iconName="add-plus">
                                                Agregar nivel
                                            </Button>
                                        </SpaceBetween>
                                    </form>
                                </Container>
                            </SpaceBetween>
                        </Container>
                    </SpaceBetween>

                    <SpaceBetween size="l">
                        {/* Details */}
                        <Container header={<Header variant="h2">Detalles</Header>}>
                            <KeyValuePairs
                                columns={1}
                                items={[
                                    {
                                        label: 'Tipo de registro',
                                        value: event.registration_type === 'open' ? 'Abierto' : 'Solo por invitación',
                                    },
                                    ...(event.capacity ? [{ label: 'Capacidad', value: `${event.capacity} personas` }] : []),
                                    ...(event.location ? [{ label: 'Ubicación', value: event.location }] : []),
                                    ...(event.venue ? [{ label: 'Venue', value: event.venue }] : []),
                                    { label: 'Slug', value: event.slug },
                                ]}
                            />
                        </Container>

                        {/* Danger zone */}
                        <Container header={<Header variant="h2">Zona de peligro</Header>}>
                            <SpaceBetween size="m">
                                <Alert type="warning">
                                    Esta acción eliminará el evento permanentemente y no se puede deshacer.
                                </Alert>
                                <Button
                                    variant="normal"
                                    iconName="remove"
                                    onClick={() => setShowDeleteModal(true)}
                                    fullWidth
                                >
                                    Eliminar evento
                                </Button>
                            </SpaceBetween>
                        </Container>
                    </SpaceBetween>
                </Grid>

            </SpaceBetween>

            <ConfirmModal
                visible={showDeleteModal}
                title="Eliminar evento"
                message={`¿Estás seguro de que deseas eliminar el evento '${event.name}'? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                danger
                onConfirm={deleteEvent}
                onCancel={() => setShowDeleteModal(false)}
            />
        </EventLayout>
    );
}
