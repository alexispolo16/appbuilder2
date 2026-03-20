import { useRef, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import EventLayout from '@/Layouts/EventLayout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Textarea from '@cloudscape-design/components/textarea';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';
import ConfirmModal from '@/Components/ConfirmModal';

export default function CommunityEdit({ event, community }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [logoPreview, setLogoPreview] = useState(null);

    const { data, setData, put, processing, errors } = useForm({
        name: community.name || '',
        url: community.url || '',
        description: community.description || '',
    });

    const logoForm = useForm({ logo: null });
    const fileInputRef = useRef(null);

    function submit(e) {
        e.preventDefault();
        put(`/events/${event.id}/communities/${community.id}`);
    }

    function handleLogoSelect(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (logoPreview) URL.revokeObjectURL(logoPreview);
        setLogoPreview(URL.createObjectURL(file));
        logoForm.setData('logo', file);
    }

    function uploadLogo() {
        logoForm.post(`/events/${event.id}/communities/${community.id}/logo`, {
            forceFormData: true,
            onSuccess: () => {
                if (logoPreview) URL.revokeObjectURL(logoPreview);
                setLogoPreview(null);
                logoForm.reset();
            },
        });
    }

    function handleDelete() {
        router.delete(`/events/${event.id}/communities/${community.id}`);
    }

    const displayLogo = logoPreview || community.logo_url;

    return (
        <EventLayout event={event}>
            <Head title={`Editar comunidad - ${community.name}`} />

            <SpaceBetween size="l">
                <Header variant="h1">Editar comunidad</Header>

                <div className="edit-page-layout">
                    {/* Sidebar — logo primero en móvil */}
                    <div className="edit-page-layout__sidebar">
                        <Container header={<Header variant="h2">Logo de la comunidad</Header>}>
                            <SpaceBetween size="m">
                                {/* Preview */}
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
                                    {displayLogo ? (
                                        <img
                                            src={displayLogo}
                                            alt={community.name}
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: 140,
                                                objectFit: 'contain',
                                                borderRadius: 8,
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: 120,
                                            height: 120,
                                            borderRadius: 12,
                                            background: '#f0f2f5',
                                            border: '2px dashed #d1d5db',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 8,
                                            color: '#9ba7b6',
                                        }}>
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                                            </svg>
                                            <span style={{ fontSize: 11, fontWeight: 500 }}>Sin logo</span>
                                        </div>
                                    )}
                                </div>

                                <FormField
                                    constraintText="JPG, PNG, GIF. Máximo 2MB."
                                    errorText={logoForm.errors.logo}
                                >
                                    <SpaceBetween size="xs">
                                        <Button
                                            variant="normal"
                                            iconName="upload"
                                            fullWidth
                                            onClick={() => fileInputRef.current.click()}
                                        >
                                            {community.logo_url ? 'Cambiar logo' : 'Seleccionar logo'}
                                        </Button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={handleLogoSelect}
                                        />
                                        {logoPreview && (
                                            <Button
                                                variant="primary"
                                                iconName="upload"
                                                fullWidth
                                                loading={logoForm.processing}
                                                onClick={uploadLogo}
                                            >
                                                Subir logo
                                            </Button>
                                        )}
                                    </SpaceBetween>
                                </FormField>

                                {/* URL preview */}
                                {community.url && (
                                    <Box fontSize="body-s" textAlign="center">
                                        <Link href={community.url} external fontSize="body-s">
                                            Ver sitio web
                                        </Link>
                                    </Box>
                                )}
                            </SpaceBetween>
                        </Container>
                    </div>

                    {/* Main form */}
                    <div className="edit-page-layout__main">
                        <form onSubmit={submit}>
                            <SpaceBetween size="l">
                                <Container header={<Header variant="h2">Información de la comunidad</Header>}>
                                    <SpaceBetween size="m">
                                        <FormField label="Nombre de la comunidad" errorText={errors.name}>
                                            <Input
                                                value={data.name}
                                                onChange={({ detail }) => setData('name', detail.value)}
                                                placeholder="Ej: Python Ecuador"
                                            />
                                        </FormField>

                                        <FormField
                                            label="URL / Sitio web"
                                            errorText={errors.url}
                                            constraintText="Incluye https://"
                                        >
                                            <Input
                                                value={data.url}
                                                onChange={({ detail }) => setData('url', detail.value)}
                                                type="url"
                                                placeholder="https://www.ejemplo.com"
                                            />
                                        </FormField>

                                        <FormField
                                            label="Descripción"
                                            errorText={errors.description}
                                            constraintText="Breve descripción de la comunidad."
                                        >
                                            <Textarea
                                                value={data.description}
                                                onChange={({ detail }) => setData('description', detail.value)}
                                                placeholder="¿De qué trata esta comunidad?"
                                                rows={4}
                                            />
                                        </FormField>
                                    </SpaceBetween>
                                </Container>

                                {/* Danger zone */}
                                <Container header={<Header variant="h2">Zona de peligro</Header>}>
                                    <SpaceBetween size="m">
                                        <Alert type="warning">
                                            Esta acción eliminará la comunidad permanentemente y no se puede deshacer.
                                        </Alert>
                                        <Button
                                            variant="normal"
                                            iconName="remove"
                                            fullWidth
                                            onClick={() => setShowDeleteModal(true)}
                                        >
                                            Eliminar comunidad
                                        </Button>
                                    </SpaceBetween>
                                </Container>

                                {/* Buttons at bottom */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
                                    <Button variant="link" onClick={() => router.visit(`/events/${event.id}/communities`)}>
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

            <ConfirmModal
                visible={showDeleteModal}
                title="Eliminar comunidad"
                message={`¿Estás seguro de que deseas eliminar la comunidad '${community.name}'? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                danger
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </EventLayout>
    );
}
