import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import AttendeeLayout from '@/Layouts/AttendeeLayout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Form from '@cloudscape-design/components/form';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ContentLayout from '@cloudscape-design/components/content-layout';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Toggle from '@cloudscape-design/components/toggle';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import Table from '@cloudscape-design/components/table';
import Modal from '@cloudscape-design/components/modal';
import ExpandableSection from '@cloudscape-design/components/expandable-section';

function getCsrfToken() {
    return decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || '');
}

function apiPost(url, body) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(),
            Accept: 'application/json',
        },
        body: JSON.stringify(body),
    });
}

function extractRegistrationCode(text) {
    if (!text) return null;
    const trimmed = text.trim();
    try {
        const url = new URL(trimmed);
        const match = url.pathname.match(/\/e\/[^/]+\/(?:registered|networking)\/([A-Z0-9]+)/i);
        if (match) return match[1].toUpperCase();
    } catch {
        // Not a URL
    }
    return trimmed.toUpperCase();
}

function QrScannerModal({ visible, onDismiss, onScan }) {
    const scannerRef = useRef(null);

    useEffect(() => {
        if (!visible) return;

        let scanner = null;

        async function startScanner() {
            const { Html5Qrcode } = await import('html5-qrcode');
            scanner = new Html5Qrcode('qr-reader-profile');
            scannerRef.current = scanner;

            try {
                await scanner.start(
                    { facingMode: 'environment' },
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    (decodedText) => {
                        const code = extractRegistrationCode(decodedText);
                        if (code) {
                            onScan(code, decodedText);
                            scanner.stop().catch(() => {});
                        }
                    },
                    () => {}
                );
            } catch {
                // Camera not available
            }
        }

        const timeout = setTimeout(startScanner, 300);

        return () => {
            clearTimeout(timeout);
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => {});
                scannerRef.current = null;
            }
        };
    }, [visible, onScan]);

    return (
        <Modal
            visible={visible}
            onDismiss={onDismiss}
            header="Escanear QR de participante"
            size="medium"
        >
            <SpaceBetween size="m">
                <Box textAlign="center">
                    <div
                        id="qr-reader-profile"
                        style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}
                    />
                </Box>
                <Box color="text-body-secondary" textAlign="center" fontSize="body-s">
                    Apunta la camara al codigo QR de la entrada de otro participante
                </Box>
            </SpaceBetween>
        </Modal>
    );
}

function NetworkingEventCard({ ep }) {
    const [pin, setPin] = useState(ep.networking_pin || '');
    const [visible, setVisible] = useState(ep.networking_visible);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const [contacts, setContacts] = useState(ep.contacts || []);

    async function savePin() {
        if (pin.length !== 6) {
            setError('El PIN debe tener exactamente 6 caracteres.');
            return;
        }
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            const res = await apiPost(`/portal/events/${ep.event_id}/networking/pin`, {
                networking_pin: pin.toUpperCase(),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.errors?.networking_pin?.[0] || data.message || 'Error al guardar.');
            } else {
                setPin(data.networking_pin);
                setVisible(data.networking_visible);
                setSuccess('PIN actualizado correctamente.');
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch {
            setError('Error de conexion.');
        } finally {
            setSaving(false);
        }
    }

    async function toggleVisible(checked) {
        setVisible(checked);
        try {
            await apiPost(`/portal/events/${ep.event_id}/networking/profile`, {
                networking_visible: checked,
                social_links: ep.social_links,
            });
        } catch {
            setVisible(!checked);
        }
    }

    function handleQrScan(registrationCode, rawText) {
        setShowScanner(false);
        // Navigate to the scanned participant's public networking profile
        // which has the connect/save contact functionality built in
        window.location.href = `/e/${ep.event_slug}/networking/${registrationCode}/profile`;
    }

    const socialLabels = { linkedin: 'LinkedIn', github: 'GitHub', instagram: 'Instagram', website: 'Web', whatsapp: 'WhatsApp' };

    return (
        <Container
            header={
                <Header
                    variant="h3"
                    counter={`(${contacts.length})`}
                    actions={
                        <SpaceBetween direction="horizontal" size="xs">
                            {contacts.length > 0 && (
                                <Button iconName="download" href={`/portal/events/${ep.event_id}/contacts/export`}>
                                    Exportar
                                </Button>
                            )}
                            <Button iconName="search" onClick={() => setShowScanner(true)}>
                                Escanear QR
                            </Button>
                        </SpaceBetween>
                    }
                >
                    {ep.event_name}
                </Header>
            }
        >
            <SpaceBetween size="m">
                {error && <Alert type="error" dismissible onDismiss={() => setError('')}>{error}</Alert>}
                {success && <Alert type="success">{success}</Alert>}

                <ColumnLayout columns={2}>
                    <FormField
                        label="PIN de Networking"
                        description="6 caracteres. Compartelo para conectar al instante."
                    >
                        <SpaceBetween size="xs" direction="horizontal">
                            <Input
                                value={pin}
                                onChange={({ detail }) => setPin(detail.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                                placeholder="Ej: ABC123"
                            />
                            <Button onClick={savePin} loading={saving}>
                                {ep.networking_pin ? 'Actualizar' : 'Crear PIN'}
                            </Button>
                        </SpaceBetween>
                    </FormField>

                    <FormField label="Visibilidad en directorio">
                        <Toggle
                            checked={visible}
                            onChange={({ detail }) => toggleVisible(detail.checked)}
                        >
                            {visible ? (
                                <StatusIndicator type="success">Visible</StatusIndicator>
                            ) : (
                                <StatusIndicator type="stopped">Oculto</StatusIndicator>
                            )}
                        </Toggle>
                    </FormField>
                </ColumnLayout>

                {contacts.length > 0 ? (
                    <ExpandableSection
                        headerText={`Contactos guardados (${contacts.length})`}
                        defaultExpanded={contacts.length <= 5}
                    >
                        <Table
                            variant="embedded"
                            columnDefinitions={[
                                {
                                    id: 'name',
                                    header: 'Nombre',
                                    cell: (item) => item.full_name,
                                },
                                {
                                    id: 'company',
                                    header: 'Empresa',
                                    cell: (item) => item.company || '-',
                                },
                                {
                                    id: 'job',
                                    header: 'Cargo',
                                    cell: (item) => item.job_title || '-',
                                },
                                {
                                    id: 'email',
                                    header: 'Email',
                                    cell: (item) => item.email ? (
                                        <Link href={`mailto:${item.email}`} external>{item.email}</Link>
                                    ) : '-',
                                },
                                {
                                    id: 'social',
                                    header: 'Redes',
                                    cell: (item) => {
                                        const links = item.social_links || {};
                                        const active = Object.entries(links).filter(([, v]) => v);
                                        if (!active.length) return '-';
                                        return (
                                            <SpaceBetween size="xxxs" direction="horizontal">
                                                {active.map(([key, url]) => (
                                                    <Link key={key} href={url} external fontSize="body-s">
                                                        {socialLabels[key] || key}
                                                    </Link>
                                                ))}
                                            </SpaceBetween>
                                        );
                                    },
                                },
                            ]}
                            items={contacts}
                        />
                    </ExpandableSection>
                ) : (
                    <Box color="text-body-secondary" textAlign="center" padding="m">
                        Aun no tienes contactos en este evento. Escanea el QR de otro participante o usa la seccion de Networking del evento.
                    </Box>
                )}
            </SpaceBetween>

            <QrScannerModal
                visible={showScanner}
                onDismiss={() => setShowScanner(false)}
                onScan={handleQrScan}
            />
        </Container>
    );
}

export default function Profile({ profile, eventPins = [] }) {
    const profileForm = useForm({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    function submitProfile(e) {
        e.preventDefault();
        profileForm.put('/portal/profile');
    }

    function submitPassword(e) {
        e.preventDefault();
        passwordForm.put('/portal/profile/password', {
            onSuccess: () => passwordForm.reset(),
        });
    }

    return (
        <AttendeeLayout>
            <Head title="Mi Perfil" />

            <ContentLayout header={<Header variant="h1">Mi Perfil</Header>}>
                <SpaceBetween size="l">
                    <Container header={<Header variant="h2">Datos personales</Header>}>
                        <form onSubmit={submitProfile}>
                            <Form
                                actions={
                                    <Button variant="primary" formAction="submit" loading={profileForm.processing}>
                                        Guardar cambios
                                    </Button>
                                }
                            >
                                <ColumnLayout columns={2}>
                                    <FormField label="Nombre" errorText={profileForm.errors.first_name}>
                                        <Input
                                            value={profileForm.data.first_name}
                                            onChange={({ detail }) => profileForm.setData('first_name', detail.value)}
                                        />
                                    </FormField>
                                    <FormField label="Apellido" errorText={profileForm.errors.last_name}>
                                        <Input
                                            value={profileForm.data.last_name}
                                            onChange={({ detail }) => profileForm.setData('last_name', detail.value)}
                                        />
                                    </FormField>
                                </ColumnLayout>
                                <FormField label="Correo electronico" errorText={profileForm.errors.email}>
                                    <Input
                                        type="email"
                                        value={profileForm.data.email}
                                        onChange={({ detail }) => profileForm.setData('email', detail.value)}
                                    />
                                </FormField>
                            </Form>
                        </form>
                    </Container>

                    {eventPins.length > 0 && (
                        <SpaceBetween size="m">
                            <Header variant="h2" description="PIN, contactos y escaner QR por cada evento">
                                Networking por evento
                            </Header>
                            {eventPins.map((ep) => (
                                <NetworkingEventCard key={ep.event_id} ep={ep} />
                            ))}
                        </SpaceBetween>
                    )}

                    <Container header={<Header variant="h2">Cambiar contrasena</Header>}>
                        <form onSubmit={submitPassword}>
                            <Form
                                actions={
                                    <Button variant="primary" formAction="submit" loading={passwordForm.processing}>
                                        Actualizar contrasena
                                    </Button>
                                }
                            >
                                <SpaceBetween size="m">
                                    <FormField label="Contrasena actual" errorText={passwordForm.errors.current_password}>
                                        <Input
                                            type="password"
                                            value={passwordForm.data.current_password}
                                            onChange={({ detail }) => passwordForm.setData('current_password', detail.value)}
                                        />
                                    </FormField>
                                    <FormField label="Nueva contrasena" errorText={passwordForm.errors.password}>
                                        <Input
                                            type="password"
                                            value={passwordForm.data.password}
                                            onChange={({ detail }) => passwordForm.setData('password', detail.value)}
                                        />
                                    </FormField>
                                    <FormField label="Confirmar nueva contrasena" errorText={passwordForm.errors.password_confirmation}>
                                        <Input
                                            type="password"
                                            value={passwordForm.data.password_confirmation}
                                            onChange={({ detail }) => passwordForm.setData('password_confirmation', detail.value)}
                                        />
                                    </FormField>
                                </SpaceBetween>
                            </Form>
                        </form>
                    </Container>
                </SpaceBetween>
            </ContentLayout>
        </AttendeeLayout>
    );
}
