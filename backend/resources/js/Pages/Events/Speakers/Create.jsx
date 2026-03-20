import { useRef, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import EventLayout from '@/Layouts/EventLayout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Textarea from '@cloudscape-design/components/textarea';
import Select from '@cloudscape-design/components/select';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Box from '@cloudscape-design/components/box';

const speakerStatusOptions = [
    { value: 'invited', label: 'Invitado' },
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'declined', label: 'Declinado' },
];

export default function SpeakerCreate({ event }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company: '',
        job_title: '',
        status: 'invited',
        bio: '',
        photo: null,
        social_links: {
            twitter: '',
            linkedin: '',
            instagram: '',
            github: '',
            website: '',
        },
    });

    const fileInputRef = useRef(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    function handlePhotoChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setData('photo', file);
        setPhotoPreview(URL.createObjectURL(file));
        e.target.value = '';
    }

    function submit(e) {
        e.preventDefault();
        post(`/events/${event.id}/speakers`, {
            forceFormData: true,
        });
    }

    return (
        <EventLayout event={event}>
            <Head title={`Agregar speaker - ${event.name}`} />

            <SpaceBetween size="l">
            <Header variant="h1" description="Registra un nuevo speaker para este evento.">
                Agregar speaker
            </Header>

            <div className="edit-page-layout">
                {/* Sidebar — foto debajo del título en móvil */}
                <div className="edit-page-layout__sidebar">
                    <Container header={<Header variant="h2">Foto del speaker</Header>}>
                        <SpaceBetween size="m">
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt="Preview"
                                        style={{
                                            width: 128,
                                            height: 128,
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: 128,
                                            height: 128,
                                            borderRadius: '50%',
                                            backgroundColor: '#e8eaf6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.5rem',
                                            color: '#9e9e9e',
                                        }}
                                    >
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    </div>
                                )}

                                <Button
                                    variant="normal"
                                    iconName="upload"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    Seleccionar foto
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handlePhotoChange}
                                />

                                {errors.photo && (
                                    <Box color="text-status-error" fontSize="body-s">
                                        {errors.photo}
                                    </Box>
                                )}

                                <Box color="text-body-secondary" fontSize="body-s" textAlign="center">
                                    Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 2MB.
                                </Box>
                            </div>
                        </SpaceBetween>
                    </Container>
                </div>

                {/* Main form */}
                <div className="edit-page-layout__main">
                    <form onSubmit={submit}>
                        <SpaceBetween size="l">
                            <Container header={<Header variant="h2">Información personal</Header>}>
                                <SpaceBetween size="m">
                                    <ColumnLayout columns={2}>
                                        <FormField label="Nombre" errorText={errors.first_name}>
                                            <Input
                                                value={data.first_name}
                                                onChange={({ detail }) => setData('first_name', detail.value)}
                                                placeholder="Ej: Ana"
                                            />
                                        </FormField>
                                        <FormField label="Apellido" errorText={errors.last_name}>
                                            <Input
                                                value={data.last_name}
                                                onChange={({ detail }) => setData('last_name', detail.value)}
                                                placeholder="Ej: García"
                                            />
                                        </FormField>
                                    </ColumnLayout>

                                    <ColumnLayout columns={2}>
                                        <FormField label="Correo electrónico" errorText={errors.email}>
                                            <Input
                                                type="email"
                                                value={data.email}
                                                onChange={({ detail }) => setData('email', detail.value)}
                                                placeholder="Ej: ana@empresa.com"
                                            />
                                        </FormField>
                                        <FormField label="Teléfono" errorText={errors.phone}>
                                            <Input
                                                value={data.phone}
                                                onChange={({ detail }) => setData('phone', detail.value)}
                                                placeholder="Ej: +593 99 123 4567"
                                            />
                                        </FormField>
                                    </ColumnLayout>

                                    <ColumnLayout columns={2}>
                                        <FormField label="Empresa" errorText={errors.company}>
                                            <Input
                                                value={data.company}
                                                onChange={({ detail }) => setData('company', detail.value)}
                                                placeholder="Ej: Tech Corp"
                                            />
                                        </FormField>
                                        <FormField label="Cargo" errorText={errors.job_title}>
                                            <Input
                                                value={data.job_title}
                                                onChange={({ detail }) => setData('job_title', detail.value)}
                                                placeholder="Ej: CTO"
                                            />
                                        </FormField>
                                    </ColumnLayout>

                                    <FormField label="Estado" errorText={errors.status}>
                                        <Select
                                            selectedOption={
                                                speakerStatusOptions.find((o) => o.value === data.status) ||
                                                speakerStatusOptions[0]
                                            }
                                            onChange={({ detail }) =>
                                                setData('status', detail.selectedOption.value)
                                            }
                                            options={speakerStatusOptions}
                                        />
                                    </FormField>

                                    <FormField label="Biografía" errorText={errors.bio}>
                                        <Textarea
                                            value={data.bio}
                                            onChange={({ detail }) => setData('bio', detail.value)}
                                            placeholder="Breve biografía del speaker..."
                                            rows={4}
                                        />
                                    </FormField>
                                </SpaceBetween>
                            </Container>

                            <Container header={<Header variant="h2">Redes sociales</Header>}>
                                <SpaceBetween size="m">
                                    <ColumnLayout columns={2}>
                                        <FormField label="Twitter / X" errorText={errors['social_links.twitter']}>
                                            <Input
                                                value={data.social_links.twitter}
                                                onChange={({ detail }) =>
                                                    setData('social_links', { ...data.social_links, twitter: detail.value })
                                                }
                                                placeholder="https://twitter.com/..."
                                            />
                                        </FormField>
                                        <FormField label="LinkedIn" errorText={errors['social_links.linkedin']}>
                                            <Input
                                                value={data.social_links.linkedin}
                                                onChange={({ detail }) =>
                                                    setData('social_links', { ...data.social_links, linkedin: detail.value })
                                                }
                                                placeholder="https://linkedin.com/in/..."
                                            />
                                        </FormField>
                                    </ColumnLayout>
                                    <ColumnLayout columns={2}>
                                        <FormField label="Instagram" errorText={errors['social_links.instagram']}>
                                            <Input
                                                value={data.social_links.instagram}
                                                onChange={({ detail }) =>
                                                    setData('social_links', { ...data.social_links, instagram: detail.value })
                                                }
                                                placeholder="https://instagram.com/..."
                                            />
                                        </FormField>
                                        <FormField label="GitHub" errorText={errors['social_links.github']}>
                                            <Input
                                                value={data.social_links.github}
                                                onChange={({ detail }) =>
                                                    setData('social_links', { ...data.social_links, github: detail.value })
                                                }
                                                placeholder="https://github.com/..."
                                            />
                                        </FormField>
                                    </ColumnLayout>
                                    <FormField label="Sitio web" errorText={errors['social_links.website']}>
                                        <Input
                                            value={data.social_links.website}
                                            onChange={({ detail }) =>
                                                setData('social_links', { ...data.social_links, website: detail.value })
                                            }
                                            placeholder="https://..."
                                        />
                                    </FormField>
                                </SpaceBetween>
                            </Container>

                            {/* Buttons at bottom */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
                                <Button variant="link" onClick={() => router.visit(`/events/${event.id}/speakers`)}>
                                    Cancelar
                                </Button>
                                <Button variant="primary" formAction="submit" loading={processing}>
                                    Agregar speaker
                                </Button>
                            </div>
                        </SpaceBetween>
                    </form>
                </div>
            </div>
            </SpaceBetween>
        </EventLayout>
    );
}
