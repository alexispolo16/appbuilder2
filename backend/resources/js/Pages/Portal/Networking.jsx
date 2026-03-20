import { Head } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import AttendeeLayout from '@/Layouts/AttendeeLayout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Input from '@cloudscape-design/components/input';
import Toggle from '@cloudscape-design/components/toggle';
import FormField from '@cloudscape-design/components/form-field';
import Alert from '@cloudscape-design/components/alert';
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

export default function Networking({ event, participant, savedContactIds }) {
    const [pin, setPin]                   = useState(participant.networking_pin || '');
    const [pinLoading, setPinLoading]     = useState(false);
    const [pinMessage, setPinMessage]     = useState('');
    const [pinError, setPinError]         = useState('');

    const [searchCode, setSearchCode]       = useState('');
    const [searchStep, setSearchStep]       = useState('code'); // 'code' | 'pin' | 'connected'
    const [searchTarget, setSearchTarget]   = useState(null);
    const [searchPinValue, setSearchPinValue] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchResult, setSearchResult] = useState(null);
    const [searchError, setSearchError]   = useState('');

    const [socialLinks, setSocialLinks]   = useState(participant.social_links || {});
    const [visible, setVisible]           = useState(participant.networking_visible);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState('');
    const [saveLoading, setSaveLoading]   = useState(false);

    const [photoUrl, setPhotoUrl]         = useState(participant.photo_url || null);
    const [photoLoading, setPhotoLoading] = useState(false);
    const [photoMessage, setPhotoMessage] = useState('');
    const [photoError, setPhotoError]     = useState('');
    const photoInputRef = useRef(null);

    async function handleUpdatePin() {
        setPinLoading(true);
        setPinMessage('');
        setPinError('');
        try {
            const res = await fetch(`/portal/events/${event.id}/networking/pin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') },
                body: JSON.stringify({ networking_pin: pin.toUpperCase() }),
            });
            const data = await res.json();
            if (!res.ok) {
                setPinError(data.message || 'Error al actualizar PIN');
            } else {
                setPinMessage(data.message);
                setPin(data.networking_pin);
                setVisible(data.networking_visible);
            }
        } finally {
            setPinLoading(false);
        }
    }

    async function handleSearchByCode() {
        setSearchLoading(true);
        setSearchTarget(null);
        setSearchResult(null);
        setSearchError('');
        try {
            const res = await fetch(`/portal/events/${event.id}/networking/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') },
                body: JSON.stringify({ registration_code: searchCode.toUpperCase() }),
            });
            const data = await res.json();
            if (!res.ok) {
                setSearchError(data.message || 'Error en la busqueda');
            } else if (!data.found) {
                setSearchError('No se encontro ningun participante con ese codigo.');
            } else {
                setSearchTarget(data.participant);
                setSearchStep('pin');
                setSearchPinValue('');
            }
        } finally {
            setSearchLoading(false);
        }
    }

    async function handleVerifyPin() {
        if (!searchTarget) return;
        setSaveLoading(true);
        setSearchError('');
        try {
            const res = await fetch(`/portal/events/${event.id}/networking/verify-pin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') },
                body: JSON.stringify({ target_participant_id: searchTarget.id, pin: searchPinValue.toUpperCase() }),
            });
            const data = await res.json();
            if (!res.ok) {
                setSearchError(data.message || 'PIN incorrecto');
            } else if (data.connected) {
                setSearchResult({ ...data.contact, already_saved: true });
                setSearchStep('connected');
            }
        } finally {
            setSaveLoading(false);
        }
    }

    function downloadVCard(contact) {
        const nameParts = contact.full_name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:${lastName};${firstName}\nFN:${contact.full_name}\n`;
        if (contact.email) vcard += `EMAIL:${contact.email}\n`;
        if (contact.phone) vcard += `TEL:${contact.phone}\n`;
        if (contact.company) vcard += `ORG:${contact.company}\n`;
        if (contact.job_title) vcard += `TITLE:${contact.job_title}\n`;
        if (contact.social_links) {
            Object.entries(contact.social_links).filter(([, v]) => v).forEach(([key, value]) => {
                vcard += `X-SOCIALPROFILE;type=${key}:${value}\n`;
            });
        }
        vcard += 'END:VCARD';
        const blob = new Blob([vcard], { type: 'text/vcard' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${contact.full_name.replace(/\s+/g, '_')}.vcf`;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    function resetSearch() {
        setSearchCode('');
        setSearchStep('code');
        setSearchTarget(null);
        setSearchPinValue('');
        setSearchResult(null);
        setSearchError('');
    }

    async function handleUploadPhoto(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        setPhotoLoading(true);
        setPhotoMessage('');
        setPhotoError('');

        const formData = new FormData();
        formData.append('photo', file);

        try {
            const res = await fetch(`/portal/events/${event.id}/networking/photo`, {
                method: 'POST',
                headers: { 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') },
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) {
                setPhotoError(data.message || 'Error al subir la foto.');
            } else {
                setPhotoUrl(data.photo_url);
                setPhotoMessage(data.message);
            }
        } catch {
            setPhotoError('Error al subir la foto.');
        } finally {
            setPhotoLoading(false);
            if (photoInputRef.current) photoInputRef.current.value = '';
        }
    }

    async function handleUpdateProfile() {
        setProfileLoading(true);
        setProfileMessage('');
        try {
            const res = await fetch(`/portal/events/${event.id}/networking/profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') },
                body: JSON.stringify({ social_links: socialLinks, networking_visible: visible }),
            });
            const data = await res.json();
            if (res.ok) {
                setProfileMessage(data.message);
                setSocialLinks(data.social_links || {});
                setVisible(data.networking_visible);
            }
        } finally {
            setProfileLoading(false);
        }
    }

    return (
        <AttendeeLayout event={event}>
            <Head title={`Networking - ${event.name}`} />
            <ContentLayout
                header={
                    <Header
                        variant="h1"
                        description={event.name}
                        actions={
                            <SpaceBetween direction="horizontal" size="xs">
                                <Button
                                    iconName="group-active"
                                    onClick={() => router.visit(`/portal/events/${event.id}/directory`)}
                                >
                                    Ver directorio
                                </Button>
                                <Button
                                    variant="primary"
                                    iconName="contact"
                                    onClick={() => router.visit(`/portal/events/${event.id}/contacts`)}
                                >
                                    Mis contactos
                                </Button>
                            </SpaceBetween>
                        }
                    >
                        Networking
                    </Header>
                }
            >
                <SpaceBetween size="l">
                    <ColumnLayout columns={2}>
                        {/* ── Mi PIN ── */}
                        <Container header={<Header variant="h2">Mi PIN de Networking</Header>}>
                            <SpaceBetween size="m">
                                <Box color="text-body-secondary" fontSize="body-s">
                                    Comparte tu PIN con otros asistentes para conectar al instante.
                                </Box>

                                {pin && (
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div className="portal-pin-box">{pin}</div>
                                    </div>
                                )}

                                <FormField label="Actualizar PIN" errorText={pinError}>
                                    <Input
                                        value={pin}
                                        onChange={({ detail }) => setPin(detail.value.toUpperCase().slice(0, 6))}
                                        placeholder="XXXXXX"
                                    />
                                </FormField>
                                {pinMessage && <Alert type="success">{pinMessage}</Alert>}
                                <Button onClick={handleUpdatePin} loading={pinLoading}>
                                    {participant.networking_pin ? 'Actualizar PIN' : 'Crear PIN'}
                                </Button>
                            </SpaceBetween>
                        </Container>

                        {/* ── Buscar participante ── */}
                        <Container header={<Header variant="h2">Buscar participante</Header>}>
                            <SpaceBetween size="m">
                                <Box color="text-body-secondary" fontSize="body-s">
                                    Ingresa el codigo de registro de otro asistente para encontrarlo y conectar.
                                </Box>

                                {searchStep === 'code' && (
                                    <>
                                        <FormField label="Codigo de registro" errorText={searchError}>
                                            <Input
                                                value={searchCode}
                                                onChange={({ detail }) => setSearchCode(detail.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))}
                                                placeholder="Ej: AB12CD34"
                                            />
                                        </FormField>
                                        <Button variant="primary" onClick={handleSearchByCode} loading={searchLoading} iconName="search" disabled={searchCode.length !== 8}>
                                            Buscar
                                        </Button>
                                    </>
                                )}

                                {searchStep === 'pin' && searchTarget && (
                                    <>
                                        <Container>
                                            <SpaceBetween direction="horizontal" size="m" alignItems="center">
                                                <div
                                                    className="portal-avatar portal-avatar--md"
                                                    style={{ background: avatarColor(searchTarget.full_name) }}
                                                >
                                                    {getInitials(searchTarget.full_name)}
                                                </div>
                                                <Box fontWeight="bold" fontSize="body-l">
                                                    {searchTarget.full_name}
                                                </Box>
                                            </SpaceBetween>
                                        </Container>
                                        <FormField label="Ingresa el PIN de este participante" errorText={searchError}>
                                            <Input
                                                value={searchPinValue}
                                                onChange={({ detail }) => setSearchPinValue(detail.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                                                placeholder="XXXXXX"
                                            />
                                        </FormField>
                                        <SpaceBetween direction="horizontal" size="xs">
                                            <Button variant="primary" onClick={handleVerifyPin} loading={saveLoading} disabled={searchPinValue.length !== 6}>
                                                Verificar y conectar
                                            </Button>
                                            <Button onClick={resetSearch}>
                                                Cancelar
                                            </Button>
                                        </SpaceBetween>
                                    </>
                                )}

                                {searchStep === 'connected' && searchResult && (
                                    <>
                                        <Container>
                                            <SpaceBetween size="s">
                                                <SpaceBetween direction="horizontal" size="m" alignItems="center">
                                                    <div
                                                        className="portal-avatar portal-avatar--md"
                                                        style={{ background: avatarColor(searchResult.full_name) }}
                                                    >
                                                        {getInitials(searchResult.full_name)}
                                                    </div>
                                                    <div>
                                                        <Box fontWeight="bold" fontSize="body-l">
                                                            {searchResult.full_name}
                                                        </Box>
                                                        {searchResult.job_title && (
                                                            <Box color="text-body-secondary" fontSize="body-s">
                                                                {searchResult.job_title}
                                                            </Box>
                                                        )}
                                                        {searchResult.company && (
                                                            <Box color="text-body-secondary" fontSize="body-s">
                                                                {searchResult.company}
                                                            </Box>
                                                        )}
                                                    </div>
                                                </SpaceBetween>
                                                <Badge color="green">Conectado</Badge>
                                                {searchResult.email && (
                                                    <Box fontSize="body-s"><strong>Email:</strong> {searchResult.email}</Box>
                                                )}
                                                {searchResult.phone && (
                                                    <Box fontSize="body-s"><strong>Telefono:</strong> {searchResult.phone}</Box>
                                                )}
                                                {searchResult.social_links && Object.entries(searchResult.social_links).filter(([, v]) => v).length > 0 && (
                                                    <SpaceBetween size="xxs">
                                                        <Box fontSize="body-s" fontWeight="bold">Redes sociales</Box>
                                                        {Object.entries(searchResult.social_links).filter(([, v]) => v).map(([key, value]) => (
                                                            <Box key={key} fontSize="body-s">{key}: {value}</Box>
                                                        ))}
                                                    </SpaceBetween>
                                                )}
                                            </SpaceBetween>
                                        </Container>
                                        <SpaceBetween direction="horizontal" size="xs">
                                            <Button variant="primary" iconName="download" onClick={() => downloadVCard(searchResult)}>
                                                Descargar contacto
                                            </Button>
                                            <Button onClick={resetSearch} iconName="search">
                                                Buscar otro
                                            </Button>
                                        </SpaceBetween>
                                    </>
                                )}
                            </SpaceBetween>
                        </Container>
                    </ColumnLayout>

                    {/* ── Foto de perfil ── */}
                    <Container header={<Header variant="h2">Foto de perfil</Header>}>
                        <SpaceBetween size="m">
                            <Box color="text-body-secondary" fontSize="body-s">
                                Sube una foto para que otros participantes te reconozcan facilmente.
                            </Box>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                {photoUrl ? (
                                    <img
                                        src={photoUrl}
                                        alt={participant.full_name}
                                        style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            border: '2px solid #0972d3',
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="portal-avatar portal-avatar--lg"
                                        style={{ background: avatarColor(participant.full_name), width: 80, height: 80, fontSize: 28 }}
                                    >
                                        {getInitials(participant.full_name)}
                                    </div>
                                )}
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={photoInputRef}
                                        onChange={handleUploadPhoto}
                                        style={{ display: 'none' }}
                                    />
                                    <Button
                                        onClick={() => photoInputRef.current?.click()}
                                        loading={photoLoading}
                                        iconName="upload"
                                    >
                                        {photoUrl ? 'Cambiar foto' : 'Subir foto'}
                                    </Button>
                                </div>
                            </div>
                            {photoMessage && <Alert type="success">{photoMessage}</Alert>}
                            {photoError && <Alert type="error">{photoError}</Alert>}
                        </SpaceBetween>
                    </Container>

                    {/* ── Perfil de networking ── */}
                    <Container header={<Header variant="h2">Perfil de networking</Header>}>
                        <SpaceBetween size="m">
                            <Toggle
                                checked={visible}
                                onChange={({ detail }) => setVisible(detail.checked)}
                            >
                                Visible en el directorio del evento
                            </Toggle>
                            <ColumnLayout columns={2}>
                                <FormField label="LinkedIn">
                                    <Input
                                        value={socialLinks.linkedin || ''}
                                        onChange={({ detail }) => setSocialLinks({ ...socialLinks, linkedin: detail.value })}
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </FormField>
                                <FormField label="GitHub">
                                    <Input
                                        value={socialLinks.github || ''}
                                        onChange={({ detail }) => setSocialLinks({ ...socialLinks, github: detail.value })}
                                        placeholder="https://github.com/..."
                                    />
                                </FormField>
                                <FormField label="Instagram">
                                    <Input
                                        value={socialLinks.instagram || ''}
                                        onChange={({ detail }) => setSocialLinks({ ...socialLinks, instagram: detail.value })}
                                        placeholder="https://instagram.com/..."
                                    />
                                </FormField>
                                <FormField label="Sitio web">
                                    <Input
                                        value={socialLinks.website || ''}
                                        onChange={({ detail }) => setSocialLinks({ ...socialLinks, website: detail.value })}
                                        placeholder="https://..."
                                    />
                                </FormField>
                                <FormField label="WhatsApp">
                                    <Input
                                        value={socialLinks.whatsapp || ''}
                                        onChange={({ detail }) => setSocialLinks({ ...socialLinks, whatsapp: detail.value })}
                                        placeholder="+593..."
                                    />
                                </FormField>
                            </ColumnLayout>
                            {profileMessage && <Alert type="success">{profileMessage}</Alert>}
                            <Button variant="primary" onClick={handleUpdateProfile} loading={profileLoading} iconName="check">
                                Guardar perfil
                            </Button>
                        </SpaceBetween>
                    </Container>
                </SpaceBetween>
            </ContentLayout>
        </AttendeeLayout>
    );
}
