import { useState, useRef } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import EventLayout from '@/Layouts/EventLayout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Toggle from '@cloudscape-design/components/toggle';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Alert from '@cloudscape-design/components/alert';
import ButtonDropdown from '@cloudscape-design/components/button-dropdown';
import { formatEventDateRange } from '@/utils/formatters';

const DEFAULTS = {
    enabled: false,
    title_text: 'CERTIFICADO DE PARTICIPACION',
    body_text: 'Se confiere este certificado de participacion a',
    participation_text: 'por haber participado en',
    signers: [{ name: '', role: '', signature_url: null }],
    show_dates: true,
    show_location: true,
    text_color: '#1a1a2e',
    name_color: '#0972d3',
};

function getConfig(initial) {
    const signers = initial?.signers?.length
        ? initial.signers.map((s) => ({ ...s, signature_url: s.signature_url || null }))
        : DEFAULTS.signers;
    return { ...DEFAULTS, ...initial, signers };
}

export default function CertificatesIndex({ event, certificateConfig: initial, backgroundUrl, signerSignatures = {} }) {
    const { flash } = usePage().props;
    const config = getConfig(initial);

    const { data, setData, put, processing, recentlySuccessful } = useForm({
        enabled: config.enabled,
        title_text: config.title_text,
        body_text: config.body_text,
        participation_text: config.participation_text,
        signers: config.signers,
        show_dates: config.show_dates,
        show_location: config.show_location,
        text_color: config.text_color,
        name_color: config.name_color,
    });

    const fileInputRef = useRef(null);
    const signatureInputRefs = useRef({});
    const [uploading, setUploading] = useState(false);
    const [uploadingSignature, setUploadingSignature] = useState(null);

    function submit(e) {
        if (e) e.preventDefault();
        put(`/events/${event.id}/certificates/config`);
    }

    function uploadBackground(e) {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('background', file);
        router.post(`/events/${event.id}/certificates/background`, formData, {
            forceFormData: true,
            onFinish: () => {
                setUploading(false);
                e.target.value = '';
            },
        });
    }

    function removeBackground() {
        router.delete(`/events/${event.id}/certificates/background`);
    }

    function uploadSignature(index, e) {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingSignature(index);
        const formData = new FormData();
        formData.append('signature', file);
        formData.append('signer_index', index);
        router.post(`/events/${event.id}/certificates/signature`, formData, {
            forceFormData: true,
            onFinish: () => {
                setUploadingSignature(null);
                e.target.value = '';
            },
        });
    }

    function removeSignature(index) {
        router.delete(`/events/${event.id}/certificates/signature/${index}`);
    }

    function addSigner() {
        if (data.signers.length >= 5) return;
        setData('signers', [...data.signers, { name: '', role: '', signature_url: null }]);
    }

    function removeSigner(index) {
        if (data.signers.length <= 1) return;
        setData('signers', data.signers.filter((_, i) => i !== index));
    }

    function updateSigner(index, field, value) {
        const updated = data.signers.map((s, i) => (i === index ? { ...s, [field]: value } : s));
        setData('signers', updated);
    }

    function triggerSignatureInput(index) {
        if (!signatureInputRefs.current[index]) {
            signatureInputRefs.current[index] = document.createElement('input');
            signatureInputRefs.current[index].type = 'file';
            signatureInputRefs.current[index].accept = 'image/*';
            signatureInputRefs.current[index].addEventListener('change', (e) => uploadSignature(index, e));
        }
        signatureInputRefs.current[index].click();
    }

    const sampleName = 'Maria Garcia Lopez';
    const eventDates = formatEventDateRange(event.date_start, event.date_end);
    const eventLocation = [event.venue, event.location].filter(Boolean).join(', ');

    return (
        <EventLayout event={event}>
            <Head title={`Certificados - ${event.name}`} />

            {recentlySuccessful && (
                <Alert type="success" dismissible>
                    Configuracion del certificado guardada correctamente.
                </Alert>
            )}
            {flash?.success && !recentlySuccessful && (
                <Alert type="success" dismissible>
                    {flash.success}
                </Alert>
            )}
            {flash?.error && (
                <Alert type="error" dismissible>
                    {flash.error}
                </Alert>
            )}

            <div className="cert-layout">
                {/* ── Configuration controls ── */}
                <div className="cert-layout__config">
                    <SpaceBetween size="l">
                        <Container header={<Header variant="h2">Estado</Header>}>
                            <Toggle
                                checked={data.enabled}
                                onChange={({ detail }) => setData('enabled', detail.checked)}
                            >
                                Habilitar certificados para este evento
                            </Toggle>
                        </Container>

                        <Container header={<Header variant="h2">Imagen de fondo</Header>}>
                            <SpaceBetween size="m">
                                {backgroundUrl ? (
                                    <div>
                                        <img
                                            src={backgroundUrl}
                                            alt="Fondo del certificado"
                                            style={{
                                                width: '100%',
                                                borderRadius: 8,
                                                border: '1px solid #e9ebed',
                                                aspectRatio: '297/210',
                                                objectFit: 'cover',
                                            }}
                                        />
                                        <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                            <Button onClick={() => fileInputRef.current.click()} loading={uploading}>
                                                Cambiar imagen
                                            </Button>
                                            <Button onClick={removeBackground}>Eliminar</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <Box variant="p" color="text-body-secondary">
                                            Sube una imagen de fondo en alta resolucion (A4 landscape: 297x210mm, recomendado 2480x1754px).
                                        </Box>
                                        <div style={{ marginTop: 8 }}>
                                            <Button iconName="upload" onClick={() => fileInputRef.current.click()} loading={uploading}>
                                                Subir imagen de fondo
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    ref={fileInputRef}
                                    onChange={uploadBackground}
                                />
                            </SpaceBetween>
                        </Container>

                        <Container header={<Header variant="h2">Textos del certificado</Header>}>
                            <SpaceBetween size="m">
                                <FormField label="Titulo">
                                    <Input
                                        value={data.title_text}
                                        onChange={({ detail }) => setData('title_text', detail.value)}
                                        placeholder="CERTIFICADO DE PARTICIPACION"
                                    />
                                </FormField>
                                <FormField label="Texto introductorio">
                                    <Input
                                        value={data.body_text}
                                        onChange={({ detail }) => setData('body_text', detail.value)}
                                        placeholder="Se confiere este certificado de participacion a"
                                    />
                                </FormField>
                                <FormField label="Texto de participacion">
                                    <Input
                                        value={data.participation_text}
                                        onChange={({ detail }) => setData('participation_text', detail.value)}
                                        placeholder="por haber participado en"
                                    />
                                </FormField>
                            </SpaceBetween>
                        </Container>

                        <Container header={<Header variant="h2">Colores</Header>}>
                            <SpaceBetween size="m">
                                <FormField label="Color del texto">
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <input
                                            type="color"
                                            value={data.text_color}
                                            onChange={(e) => setData('text_color', e.target.value)}
                                            style={{ width: 40, height: 32, border: 'none', cursor: 'pointer' }}
                                        />
                                        <Input
                                            value={data.text_color}
                                            onChange={({ detail }) => setData('text_color', detail.value)}
                                        />
                                    </div>
                                </FormField>
                                <FormField label="Color del nombre del participante">
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <input
                                            type="color"
                                            value={data.name_color}
                                            onChange={(e) => setData('name_color', e.target.value)}
                                            style={{ width: 40, height: 32, border: 'none', cursor: 'pointer' }}
                                        />
                                        <Input
                                            value={data.name_color}
                                            onChange={({ detail }) => setData('name_color', detail.value)}
                                        />
                                    </div>
                                </FormField>
                            </SpaceBetween>
                        </Container>

                        <Container
                            header={
                                <Header
                                    variant="h2"
                                    description="Agrega los firmantes y opcionalmente sube una imagen de firma digital para cada uno."
                                    actions={
                                        <Button
                                            iconName="add-plus"
                                            onClick={addSigner}
                                            disabled={data.signers.length >= 5}
                                        >
                                            Agregar firmante
                                        </Button>
                                    }
                                >
                                    Firmantes
                                </Header>
                            }
                        >
                            <SpaceBetween size="l">
                                {data.signers.map((signer, index) => (
                                    <div key={index} style={{ padding: 12, background: '#fafafa', borderRadius: 8, border: '1px solid #e9ebed' }}>
                                        <SpaceBetween size="s">
                                            <div className="cert-signer-fields">
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <FormField label={`Nombre ${index + 1}`}>
                                                        <Input
                                                            value={signer.name}
                                                            onChange={({ detail }) => updateSigner(index, 'name', detail.value)}
                                                            placeholder="Nombre completo"
                                                        />
                                                    </FormField>
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <FormField label="Cargo/Rol">
                                                        <Input
                                                            value={signer.role}
                                                            onChange={({ detail }) => updateSigner(index, 'role', detail.value)}
                                                            placeholder="Director, Coordinador..."
                                                        />
                                                    </FormField>
                                                </div>
                                                {data.signers.length > 1 && (
                                                    <Button
                                                        iconName="remove"
                                                        variant="icon"
                                                        onClick={() => removeSigner(index)}
                                                        ariaLabel="Eliminar firmante"
                                                    />
                                                )}
                                            </div>
                                            {/* Signature upload */}
                                            <div>
                                                <Box fontSize="body-s" fontWeight="bold" margin={{ bottom: 'xxs' }}>Firma digital</Box>
                                                {signerSignatures[index] ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                                        <img
                                                            src={signerSignatures[index]}
                                                            alt={`Firma de ${signer.name}`}
                                                            style={{
                                                                height: 48,
                                                                maxWidth: 160,
                                                                objectFit: 'contain',
                                                                background: '#fff',
                                                                border: '1px solid #e9ebed',
                                                                borderRadius: 4,
                                                                padding: 4,
                                                            }}
                                                        />
                                                        <Button
                                                            variant="inline-link"
                                                            onClick={() => triggerSignatureInput(index)}
                                                            loading={uploadingSignature === index}
                                                        >
                                                            Cambiar
                                                        </Button>
                                                        <Button variant="inline-link" onClick={() => removeSignature(index)}>
                                                            Eliminar
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                                        <Button
                                                            iconName="upload"
                                                            variant="normal"
                                                            onClick={() => triggerSignatureInput(index)}
                                                            loading={uploadingSignature === index}
                                                        >
                                                            Subir firma
                                                        </Button>
                                                        <Box fontSize="body-s" color="text-body-secondary">PNG transparente recomendado</Box>
                                                    </div>
                                                )}
                                            </div>
                                        </SpaceBetween>
                                    </div>
                                ))}
                            </SpaceBetween>
                        </Container>

                        <Container header={<Header variant="h2">Opciones</Header>}>
                            <SpaceBetween size="m">
                                <Toggle
                                    checked={data.show_dates}
                                    onChange={({ detail }) => setData('show_dates', detail.checked)}
                                >
                                    Mostrar fechas del evento
                                </Toggle>
                                <Toggle
                                    checked={data.show_location}
                                    onChange={({ detail }) => setData('show_location', detail.checked)}
                                >
                                    Mostrar ubicacion del evento
                                </Toggle>
                            </SpaceBetween>
                        </Container>

                        {/* ── Action buttons ── */}
                        <div className="cert-actions">
                            <Button variant="primary" onClick={submit} loading={processing} iconName="check">
                                Guardar configuracion
                            </Button>
                            <Button
                                iconName="external"
                                onClick={() => window.open(`/events/${event.id}/certificates/preview`, '_blank')}
                            >
                                Vista previa PDF
                            </Button>
                            <ButtonDropdown
                                items={[
                                    { id: 'zip', text: 'ZIP (un PDF por participante)', iconName: 'download' },
                                    { id: 'pdf', text: 'PDF multipagina', iconName: 'download' },
                                ]}
                                onItemClick={({ detail }) => {
                                    if (detail.id === 'zip') window.location.href = `/events/${event.id}/certificates/download-all`;
                                    if (detail.id === 'pdf') window.location.href = `/events/${event.id}/certificates/download-all-pdf`;
                                }}
                            >
                                Descargar todos
                            </ButtonDropdown>
                        </div>
                    </SpaceBetween>
                </div>

                {/* ── Live preview ── */}
                <div className="cert-layout__preview">
                    <SpaceBetween size="m">
                        <Container header={<Header variant="h2">Vista previa</Header>}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <div className="cert-preview-card" style={{ background: backgroundUrl ? `url(${backgroundUrl}) center/cover` : '#fff' }}>
                                    <div className="cert-preview-overlay">
                                        <div style={{ fontSize: 'clamp(8px, 1.6vw, 14px)', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: data.text_color, marginBottom: '3%' }}>
                                            {data.title_text}
                                        </div>
                                        <div style={{ fontSize: 'clamp(6px, 1.1vw, 10px)', color: data.text_color, marginBottom: '2%' }}>
                                            {data.body_text}
                                        </div>
                                        <div style={{ fontSize: 'clamp(12px, 2.8vw, 22px)', fontWeight: 700, color: data.name_color, marginBottom: '1%' }}>
                                            {sampleName}
                                        </div>
                                        <div style={{ width: '40%', borderTop: '1.5px solid #ccc', marginBottom: '2%' }} />
                                        <div style={{ fontSize: 'clamp(6px, 1.1vw, 10px)', color: data.text_color, marginBottom: '1%' }}>
                                            {data.participation_text}
                                        </div>
                                        <div style={{ fontSize: 'clamp(8px, 1.5vw, 13px)', fontWeight: 700, color: data.text_color, marginBottom: '2%' }}>
                                            {event.name}
                                        </div>
                                        <div style={{ fontSize: 'clamp(5px, 0.9vw, 8px)', color: data.text_color, lineHeight: 1.8 }}>
                                            {data.show_dates && eventDates && <div>{eventDates}</div>}
                                            {data.show_location && eventLocation && <div>{eventLocation}</div>}
                                        </div>

                                        {/* Signers with signatures */}
                                        <div className="cert-preview-signers">
                                            {data.signers
                                                .filter((s) => s.name)
                                                .map((signer, i) => (
                                                    <div key={i} style={{ textAlign: 'center', flex: 1 }}>
                                                        {signerSignatures[i] && (
                                                            <img
                                                                src={signerSignatures[i]}
                                                                alt=""
                                                                style={{ height: 'clamp(16px, 3vw, 36px)', maxWidth: '80%', objectFit: 'contain', marginBottom: 2 }}
                                                            />
                                                        )}
                                                        <div style={{ width: '70%', margin: '0 auto 4px', borderTop: '1px solid #555' }} />
                                                        <div style={{ fontSize: 'clamp(5px, 0.9vw, 8px)', fontWeight: 700, color: data.text_color }}>
                                                            {signer.name}
                                                        </div>
                                                        <div style={{ fontSize: 'clamp(4px, 0.8vw, 7px)', color: data.text_color, opacity: 0.7 }}>
                                                            {signer.role}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Container>

                        <Box color="text-body-secondary" fontSize="body-s" textAlign="center">
                            Esta es una vista previa con datos de ejemplo. Cada participante vera su nombre en el certificado.
                        </Box>
                    </SpaceBetween>
                </div>
            </div>
        </EventLayout>
    );
}
