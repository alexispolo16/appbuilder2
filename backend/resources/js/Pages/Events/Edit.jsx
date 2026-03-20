import { useRef, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import RichTextEditor from '@/Components/RichTextEditor';
import Select from '@cloudscape-design/components/select';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Box from '@cloudscape-design/components/box';
import Toggle from '@cloudscape-design/components/toggle';
import { formatDateTimeLocal } from '@/utils/formatters';
import LocationPicker from '@/Components/LocationPicker';

const registrationOptions = [
    { value: 'open', label: 'Abierto' },
    { value: 'invite', label: 'Solo por invitacion' },
];

export default function EventEdit({ event, scanTypes: initialScanTypes }) {
    const [scanTypes, setScanTypes] = useState(initialScanTypes || [
        { key: 'checkin', label: 'Check-in', enabled: true },
    ]);

    const { data, setData, put, processing, errors } = useForm({
        name: event.name,
        slug: event.slug,
        description: event.description || '',
        date_start: formatDateTimeLocal(event.date_start),
        date_end: formatDateTimeLocal(event.date_end),
        location: event.location || '',
        venue: event.venue || '',
        latitude: event.latitude || '',
        longitude: event.longitude || '',
        capacity: event.capacity || '',
        registration_type: event.registration_type,
        settings: {
            ...event.settings,
            scan_types: initialScanTypes || [
                { key: 'checkin', label: 'Check-in', enabled: true },
            ],
        },
    });

    const coverForm = useForm({ cover_image: null });
    const eventImageForm = useForm({ event_image: null });
    const [coverPreview, setCoverPreview] = useState(null);
    const [eventImagePreview, setEventImagePreview] = useState(null);
    const coverInputRef = useRef(null);
    const eventImageInputRef = useRef(null);

    function submit(e) {
        e.preventDefault();
        put(`/events/${event.id}`);
    }

    function handleCoverSelect(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (coverPreview) URL.revokeObjectURL(coverPreview);
        setCoverPreview(URL.createObjectURL(file));
        coverForm.setData('cover_image', file);
    }

    function handleEventImageSelect(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (eventImagePreview) URL.revokeObjectURL(eventImagePreview);
        setEventImagePreview(URL.createObjectURL(file));
        eventImageForm.setData('event_image', file);
    }

    function uploadCover() {
        coverForm.post(`/events/${event.id}/cover`, {
            forceFormData: true,
            onSuccess: () => {
                if (coverPreview) URL.revokeObjectURL(coverPreview);
                setCoverPreview(null);
                coverForm.reset();
            },
        });
    }

    function uploadEventImage() {
        eventImageForm.post(`/events/${event.id}/event-image`, {
            forceFormData: true,
            onSuccess: () => {
                if (eventImagePreview) URL.revokeObjectURL(eventImagePreview);
                setEventImagePreview(null);
                eventImageForm.reset();
            },
        });
    }

    function updateScanTypes(newTypes) {
        setScanTypes(newTypes);
        setData('settings', { ...data.settings, scan_types: newTypes });
    }

    function addScanType() {
        const key = `custom_${Date.now()}`;
        updateScanTypes([...scanTypes, { key, label: '', enabled: true }]);
    }

    function removeScanType(index) {
        updateScanTypes(scanTypes.filter((_, i) => i !== index));
    }

    function updateScanType(index, field, value) {
        const updated = scanTypes.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        updateScanTypes(updated);
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Editar - ${event.name}`} />
            <SpaceBetween size="l">
                <BreadcrumbGroup
                    items={[
                        { text: 'Eventos', href: '/events' },
                        { text: event.name, href: `/events/${event.id}` },
                        { text: 'Editar', href: '#' },
                    ]}
                    onFollow={(e) => {
                        e.preventDefault();
                        router.visit(e.detail.href);
                    }}
                />

                {/* Images — shown first on mobile via CSS order */}
                <div className="edit-page-layout">
                    <div className="edit-page-layout__sidebar">
                        <SpaceBetween size="l">
                            <Container header={<Header variant="h2" description="Banner de cabecera del evento.">Imagen de portada</Header>}>
                                <SpaceBetween size="m">
                                    {coverPreview || event.cover_image_url ? (
                                        <img
                                            src={coverPreview || event.cover_image_url}
                                            alt={event.name}
                                            style={{ width: '100%', borderRadius: 8, objectFit: 'cover', maxHeight: 200 }}
                                        />
                                    ) : (
                                        <Box textAlign="center" padding="l" color="text-body-secondary">
                                            Sin imagen de portada
                                        </Box>
                                    )}
                                    <FormField constraintText="JPG, PNG, GIF. Max 4MB." errorText={coverForm.errors.cover_image}>
                                        <SpaceBetween size="xs">
                                            <Button variant="normal" iconName="upload" fullWidth onClick={() => coverInputRef.current.click()}>
                                                Seleccionar portada
                                            </Button>
                                            <input
                                                ref={coverInputRef}
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={handleCoverSelect}
                                            />
                                            {coverPreview && (
                                                <Button
                                                    variant="primary"
                                                    fullWidth
                                                    loading={coverForm.processing}
                                                    onClick={uploadCover}
                                                >
                                                    Subir portada
                                                </Button>
                                            )}
                                        </SpaceBetween>
                                    </FormField>
                                </SpaceBetween>
                            </Container>

                            <Container header={<Header variant="h2" description="Imagen principal del evento para listados y tarjetas.">Imagen del evento</Header>}>
                                <SpaceBetween size="m">
                                    {eventImagePreview || event.event_image_url ? (
                                        <img
                                            src={eventImagePreview || event.event_image_url}
                                            alt={event.name}
                                            style={{ width: '100%', borderRadius: 8, objectFit: 'cover', maxHeight: 200 }}
                                        />
                                    ) : (
                                        <Box textAlign="center" padding="l" color="text-body-secondary">
                                            Sin imagen del evento
                                        </Box>
                                    )}
                                    <FormField constraintText="JPG, PNG, GIF. Max 4MB." errorText={eventImageForm.errors.event_image}>
                                        <SpaceBetween size="xs">
                                            <Button variant="normal" iconName="upload" fullWidth onClick={() => eventImageInputRef.current.click()}>
                                                Seleccionar imagen
                                            </Button>
                                            <input
                                                ref={eventImageInputRef}
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={handleEventImageSelect}
                                            />
                                            {eventImagePreview && (
                                                <Button
                                                    variant="primary"
                                                    fullWidth
                                                    loading={eventImageForm.processing}
                                                    onClick={uploadEventImage}
                                                >
                                                    Subir imagen
                                                </Button>
                                            )}
                                        </SpaceBetween>
                                    </FormField>
                                </SpaceBetween>
                            </Container>
                        </SpaceBetween>
                    </div>

                    <div className="edit-page-layout__main">
                        <form onSubmit={submit}>
                            <SpaceBetween size="l">
                                <Container header={<Header variant="h2">Informacion del evento</Header>}>
                                    <SpaceBetween size="m">
                                        <FormField label="Nombre del evento" errorText={errors.name}>
                                            <Input
                                                value={data.name}
                                                onChange={({ detail }) => setData('name', detail.value)}
                                            />
                                        </FormField>
                                        <FormField label="Slug (URL)" errorText={errors.slug}>
                                            <Input
                                                value={data.slug}
                                                onChange={({ detail }) => setData('slug', detail.value)}
                                            />
                                        </FormField>
                                        <FormField label="Descripcion">
                                            <RichTextEditor
                                                value={data.description}
                                                onChange={(html) => setData('description', html)}
                                                placeholder="Describe tu evento..."
                                            />
                                        </FormField>
                                        <ColumnLayout columns={2}>
                                            <FormField label="Fecha y hora de inicio" errorText={errors.date_start}>
                                                <Input
                                                    type="datetime-local"
                                                    value={data.date_start}
                                                    onChange={({ detail }) => setData('date_start', detail.value)}
                                                />
                                            </FormField>
                                            <FormField label="Fecha y hora de fin" errorText={errors.date_end}>
                                                <Input
                                                    type="datetime-local"
                                                    value={data.date_end}
                                                    onChange={({ detail }) => setData('date_end', detail.value)}
                                                />
                                            </FormField>
                                        </ColumnLayout>
                                        <ColumnLayout columns={2}>
                                            <FormField label="Ciudad / Ubicacion">
                                                <Input
                                                    value={data.location}
                                                    onChange={({ detail }) => setData('location', detail.value)}
                                                />
                                            </FormField>
                                            <FormField label="Lugar / Venue">
                                                <Input
                                                    value={data.venue}
                                                    onChange={({ detail }) => setData('venue', detail.value)}
                                                />
                                            </FormField>
                                        </ColumnLayout>

                                        <FormField label="Ubicacion en el Mapa" description="Selecciona el punto exacto donde se realizara el evento.">
                                            <LocationPicker
                                                latitude={data.latitude}
                                                longitude={data.longitude}
                                                onChange={({ latitude, longitude }) => {
                                                    setData('latitude', latitude);
                                                    setData('longitude', longitude);
                                                }}
                                            />
                                        </FormField>

                                        <ColumnLayout columns={2}>
                                            <FormField label="Capacidad">
                                                <Input
                                                    type="number"
                                                    value={String(data.capacity || '')}
                                                    onChange={({ detail }) => setData('capacity', detail.value)}
                                                />
                                            </FormField>
                                            <FormField label="Tipo de registro">
                                                <Select
                                                    selectedOption={registrationOptions.find((o) => o.value === data.registration_type)}
                                                    onChange={({ detail }) => setData('registration_type', detail.selectedOption.value)}
                                                    options={registrationOptions}
                                                />
                                            </FormField>
                                        </ColumnLayout>
                                    </SpaceBetween>
                                </Container>

                                {/* Scan types — mobile-friendly card list */}
                                <Container
                                    header={
                                        <Header
                                            variant="h2"
                                            description="Configura los tipos de escaneo disponibles en el evento. El Check-in principal no puede ser eliminado."
                                            actions={
                                                <Button iconName="add-plus" onClick={addScanType}>
                                                    Agregar
                                                </Button>
                                            }
                                        >
                                            Tipos de escaneo
                                        </Header>
                                    }
                                >
                                    <SpaceBetween size="s">
                                        {scanTypes.map((item, idx) => (
                                            <div key={item.key} className="scan-type-row">
                                                <div className="scan-type-row__toggle">
                                                    <Toggle
                                                        checked={item.enabled}
                                                        onChange={({ detail }) => updateScanType(idx, 'enabled', detail.checked)}
                                                    />
                                                </div>
                                                <div className="scan-type-row__key">
                                                    <Box color={item.key === 'checkin' ? 'text-status-info' : 'text-body-secondary'} fontSize="body-s">
                                                        {item.key}
                                                    </Box>
                                                </div>
                                                <div className="scan-type-row__label">
                                                    <Input
                                                        value={item.label}
                                                        onChange={({ detail }) => updateScanType(idx, 'label', detail.value)}
                                                        placeholder="Nombre del tipo"
                                                        disabled={item.key === 'checkin'}
                                                    />
                                                </div>
                                                <div className="scan-type-row__actions">
                                                    {item.key !== 'checkin' && (
                                                        <Button
                                                            variant="icon"
                                                            iconName="remove"
                                                            onClick={() => removeScanType(idx)}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {scanTypes.length === 0 && (
                                            <Box textAlign="center" padding="l" color="text-body-secondary">
                                                No hay tipos de escaneo configurados.
                                            </Box>
                                        )}
                                    </SpaceBetween>
                                </Container>

                                {/* Action buttons at bottom */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
                                    <Button variant="link" onClick={() => router.visit(`/events/${event.id}`)}>
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" formAction="submit" loading={processing}>
                                        Guardar cambios
                                    </Button>
                                </div>
                            </SpaceBetween>
                        </form>
                    </div>
                </div>
            </SpaceBetween>
        </AuthenticatedLayout>
    );
}
