import { useState, useRef, useCallback } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Toggle from '@cloudscape-design/components/toggle';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import Alert from '@cloudscape-design/components/alert';
import { formatEventDateRange } from '@/utils/formatters';
import { generateTicketImage, getDesign } from '@/utils/ticket-generator';

const SAMPLE_PARTICIPANT = {
    full_name: 'Maria Garcia Lopez',
    email: 'maria@ejemplo.com',
    company: 'TechCorp Ecuador',
    job_title: 'Desarrolladora Senior',
    registration_code: 'ABC12345',
};

export default function CredentialDesigner({ event, credentialDesign: initial, sponsors = [] }) {
    const design = getDesign(initial);

    const { data, setData, put, processing, recentlySuccessful } = useForm({
        header_bg_start: design.header_bg_start,
        header_bg_end: design.header_bg_end,
        header_label: design.header_label,
        accent_color: design.accent_color,
        bg_color: design.bg_color,
        text_primary: design.text_primary,
        text_secondary: design.text_secondary,
        show_company: design.show_company,
        show_job_title: design.show_job_title,
        show_sponsors: design.show_sponsors,
    });

    const qrRef = useRef(null);
    const [downloading, setDownloading] = useState(false);

    function submit(e) {
        e.preventDefault();
        put(`/events/${event.id}/credential-design`);
    }

    const downloadPreview = useCallback(async () => {
        const svg = qrRef.current?.querySelector('svg');
        if (!svg || downloading) return;
        setDownloading(true);
        try {
            const dataUrl = await generateTicketImage(svg, event, SAMPLE_PARTICIPANT, data, sponsors);
            const link = document.createElement('a');
            link.download = `credencial-preview-${event.slug}.png`;
            link.href = dataUrl;
            link.click();
        } finally {
            setDownloading(false);
        }
    }, [event, data, sponsors, downloading]);

    function resetDefaults() {
        const defaults = getDesign(null);
        setData({
            header_bg_start: defaults.header_bg_start,
            header_bg_end: defaults.header_bg_end,
            header_label: defaults.header_label,
            accent_color: defaults.accent_color,
            bg_color: defaults.bg_color,
            text_primary: defaults.text_primary,
            text_secondary: defaults.text_secondary,
            show_company: defaults.show_company,
            show_job_title: defaults.show_job_title,
            show_sponsors: defaults.show_sponsors,
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Credencial - ${event.name}`} />
            <SpaceBetween size="l">
                <BreadcrumbGroup
                    items={[
                        { text: 'Eventos', href: '/events' },
                        { text: event.name, href: `/events/${event.id}` },
                        { text: 'Credencial', href: '#' },
                    ]}
                    onFollow={(e) => {
                        e.preventDefault();
                        router.visit(e.detail.href);
                    }}
                />

                <Header
                    variant="h1"
                    description="Personaliza el diseno de la credencial digital para este evento."
                    actions={
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button onClick={resetDefaults}>Restaurar predeterminado</Button>
                            <Button variant="primary" onClick={submit} loading={processing}>
                                Guardar diseno
                            </Button>
                        </SpaceBetween>
                    }
                >
                    Disenar credencial
                </Header>

                {recentlySuccessful && (
                    <Alert type="success" dismissible>
                        Diseno de credencial guardado correctamente.
                    </Alert>
                )}

                <Grid gridDefinition={[{ colspan: 5 }, { colspan: 7 }]}>
                    {/* Design controls */}
                    <SpaceBetween size="l">
                        <Container header={<Header variant="h2">Colores del encabezado</Header>}>
                            <SpaceBetween size="m">
                                <FormField label="Color inicial del gradiente">
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <input
                                            type="color"
                                            value={data.header_bg_start}
                                            onChange={(e) => setData('header_bg_start', e.target.value)}
                                            style={{ width: 40, height: 32, border: 'none', cursor: 'pointer' }}
                                        />
                                        <Input
                                            value={data.header_bg_start}
                                            onChange={({ detail }) => setData('header_bg_start', detail.value)}
                                            placeholder="#0972d3"
                                        />
                                    </div>
                                </FormField>
                                <FormField label="Color final del gradiente">
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <input
                                            type="color"
                                            value={data.header_bg_end}
                                            onChange={(e) => setData('header_bg_end', e.target.value)}
                                            style={{ width: 40, height: 32, border: 'none', cursor: 'pointer' }}
                                        />
                                        <Input
                                            value={data.header_bg_end}
                                            onChange={({ detail }) => setData('header_bg_end', detail.value)}
                                            placeholder="#033160"
                                        />
                                    </div>
                                </FormField>
                                <div
                                    style={{
                                        height: 40,
                                        borderRadius: 8,
                                        background: `linear-gradient(135deg, ${data.header_bg_start}, ${data.header_bg_end})`,
                                    }}
                                />
                            </SpaceBetween>
                        </Container>

                        <Container header={<Header variant="h2">Textos y acentos</Header>}>
                            <SpaceBetween size="m">
                                <FormField label="Texto del encabezado">
                                    <Input
                                        value={data.header_label}
                                        onChange={({ detail }) => setData('header_label', detail.value)}
                                        placeholder="ENTRADA DIGITAL"
                                    />
                                </FormField>
                                <FormField label="Color de acento (codigo de registro)">
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <input
                                            type="color"
                                            value={data.accent_color}
                                            onChange={(e) => setData('accent_color', e.target.value)}
                                            style={{ width: 40, height: 32, border: 'none', cursor: 'pointer' }}
                                        />
                                        <Input
                                            value={data.accent_color}
                                            onChange={({ detail }) => setData('accent_color', detail.value)}
                                        />
                                    </div>
                                </FormField>
                            </SpaceBetween>
                        </Container>

                        <Container header={<Header variant="h2">Colores generales</Header>}>
                            <SpaceBetween size="m">
                                <FormField label="Fondo">
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <input
                                            type="color"
                                            value={data.bg_color}
                                            onChange={(e) => setData('bg_color', e.target.value)}
                                            style={{ width: 40, height: 32, border: 'none', cursor: 'pointer' }}
                                        />
                                        <Input
                                            value={data.bg_color}
                                            onChange={({ detail }) => setData('bg_color', detail.value)}
                                        />
                                    </div>
                                </FormField>
                                <FormField label="Texto principal">
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <input
                                            type="color"
                                            value={data.text_primary}
                                            onChange={(e) => setData('text_primary', e.target.value)}
                                            style={{ width: 40, height: 32, border: 'none', cursor: 'pointer' }}
                                        />
                                        <Input
                                            value={data.text_primary}
                                            onChange={({ detail }) => setData('text_primary', detail.value)}
                                        />
                                    </div>
                                </FormField>
                                <FormField label="Texto secundario (etiquetas)">
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <input
                                            type="color"
                                            value={data.text_secondary}
                                            onChange={(e) => setData('text_secondary', e.target.value)}
                                            style={{ width: 40, height: 32, border: 'none', cursor: 'pointer' }}
                                        />
                                        <Input
                                            value={data.text_secondary}
                                            onChange={({ detail }) => setData('text_secondary', detail.value)}
                                        />
                                    </div>
                                </FormField>
                            </SpaceBetween>
                        </Container>

                        <Container header={<Header variant="h2">Campos visibles</Header>}>
                            <SpaceBetween size="m">
                                <Toggle
                                    checked={data.show_company}
                                    onChange={({ detail }) => setData('show_company', detail.checked)}
                                >
                                    Mostrar empresa
                                </Toggle>
                                <Toggle
                                    checked={data.show_job_title}
                                    onChange={({ detail }) => setData('show_job_title', detail.checked)}
                                >
                                    Mostrar cargo
                                </Toggle>
                                <Toggle
                                    checked={data.show_sponsors}
                                    onChange={({ detail }) => setData('show_sponsors', detail.checked)}
                                >
                                    Mostrar logos de sponsors
                                </Toggle>
                                {data.show_sponsors && sponsors.length === 0 && (
                                    <Box color="text-status-warning" fontSize="body-s">
                                        No hay sponsors con logo en este evento. Agrega sponsors con logo desde la seccion de sponsors.
                                    </Box>
                                )}
                            </SpaceBetween>
                        </Container>
                    </SpaceBetween>

                    {/* Live preview */}
                    <SpaceBetween size="m">
                        <Container
                            header={
                                <Header
                                    variant="h2"
                                    actions={
                                        <Button
                                            iconName="download"
                                            onClick={downloadPreview}
                                            loading={downloading}
                                        >
                                            Descargar preview
                                        </Button>
                                    }
                                >
                                    Vista previa
                                </Header>
                            }
                        >
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <div style={{
                                    width: 340,
                                    background: data.bg_color,
                                    borderRadius: 16,
                                    padding: 12,
                                    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                                }}>
                                    {/* Ticket preview card */}
                                    <div style={{
                                        background: '#fff',
                                        borderRadius: 16,
                                        overflow: 'hidden',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    }}>
                                        {/* Header */}
                                        <div style={{
                                            background: `linear-gradient(135deg, ${data.header_bg_start}, ${data.header_bg_end})`,
                                            padding: '20px 24px',
                                            textAlign: 'center',
                                            color: '#fff',
                                        }}>
                                            <div style={{ fontSize: 9, fontWeight: 700, opacity: 0.6, letterSpacing: 1.5, marginBottom: 8 }}>
                                                {data.header_label}
                                            </div>
                                            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>
                                                {event.name}
                                            </div>
                                            <div style={{ fontSize: 10, opacity: 0.75 }}>
                                                {formatEventDateRange(event.date_start, event.date_end)}
                                            </div>
                                        </div>

                                        {/* Tear line */}
                                        <div style={{ position: 'relative', height: 1 }}>
                                            <div style={{
                                                position: 'absolute',
                                                left: -10,
                                                top: -10,
                                                width: 20,
                                                height: 20,
                                                borderRadius: '50%',
                                                background: data.bg_color,
                                            }} />
                                            <div style={{
                                                position: 'absolute',
                                                right: -10,
                                                top: -10,
                                                width: 20,
                                                height: 20,
                                                borderRadius: '50%',
                                                background: data.bg_color,
                                            }} />
                                            <div style={{
                                                margin: '0 16px',
                                                borderTop: '2px dashed #dde1e6',
                                            }} />
                                        </div>

                                        {/* Body */}
                                        <div style={{ padding: '20px 24px' }}>
                                            <div style={{ marginBottom: 12 }}>
                                                <div style={{ fontSize: 8, fontWeight: 600, textTransform: 'uppercase', color: data.text_secondary, marginBottom: 2 }}>
                                                    NOMBRE COMPLETO
                                                </div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: data.text_primary }}>
                                                    {SAMPLE_PARTICIPANT.full_name}
                                                </div>
                                            </div>
                                            <div style={{ marginBottom: 12 }}>
                                                <div style={{ fontSize: 8, fontWeight: 600, textTransform: 'uppercase', color: data.text_secondary, marginBottom: 2 }}>
                                                    CORREO ELECTRONICO
                                                </div>
                                                <div style={{ fontSize: 11, fontWeight: 500, color: data.text_primary }}>
                                                    {SAMPLE_PARTICIPANT.email}
                                                </div>
                                            </div>

                                            {data.show_company && (
                                                <div style={{ marginBottom: 12 }}>
                                                    <div style={{ fontSize: 8, fontWeight: 600, textTransform: 'uppercase', color: data.text_secondary, marginBottom: 2 }}>
                                                        EMPRESA
                                                    </div>
                                                    <div style={{ fontSize: 11, fontWeight: 500, color: data.text_primary }}>
                                                        {SAMPLE_PARTICIPANT.company}
                                                    </div>
                                                </div>
                                            )}

                                            {data.show_job_title && (
                                                <div style={{ marginBottom: 12 }}>
                                                    <div style={{ fontSize: 8, fontWeight: 600, textTransform: 'uppercase', color: data.text_secondary, marginBottom: 2 }}>
                                                        CARGO
                                                    </div>
                                                    <div style={{ fontSize: 11, fontWeight: 500, color: data.text_primary }}>
                                                        {SAMPLE_PARTICIPANT.job_title}
                                                    </div>
                                                </div>
                                            )}

                                            <div style={{ textAlign: 'center', marginTop: 16 }}>
                                                <div style={{ fontSize: 8, fontWeight: 600, textTransform: 'uppercase', color: data.text_secondary, marginBottom: 6 }}>
                                                    CODIGO DE REGISTRO
                                                </div>
                                                <div style={{
                                                    fontSize: 20,
                                                    fontWeight: 700,
                                                    fontFamily: "'SF Mono', 'Fira Code', Consolas, monospace",
                                                    color: data.accent_color,
                                                    marginBottom: 12,
                                                }}>
                                                    {SAMPLE_PARTICIPANT.registration_code}
                                                </div>
                                                <div ref={qrRef} style={{ display: 'inline-block', padding: 8, background: '#fff', borderRadius: 8, border: '1px solid #e9ebed' }}>
                                                    <QRCodeSVG
                                                        value="https://ejemplo.com/credencial"
                                                        size={140}
                                                        level="M"
                                                    />
                                                </div>
                                                <div style={{ fontSize: 9, color: data.text_secondary, marginTop: 8 }}>
                                                    Presenta este codigo en la entrada del evento
                                                </div>
                                            </div>

                                            {data.show_sponsors && sponsors.length > 0 && (
                                                <div style={{ textAlign: 'center', marginTop: 16 }}>
                                                    <div style={{ fontSize: 8, fontWeight: 600, textTransform: 'uppercase', color: data.text_secondary, marginBottom: 8 }}>
                                                        SPONSORS
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                                        {sponsors.slice(0, 6).map((s, i) => (
                                                            <img
                                                                key={i}
                                                                src={s.logo_url}
                                                                alt={s.company_name}
                                                                style={{ maxHeight: 28, maxWidth: 60, objectFit: 'contain' }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div style={{ textAlign: 'center', marginTop: 16, paddingTop: 12, borderTop: '1px solid #e9ebed' }}>
                                                <span style={{ fontSize: 8, color: '#b8bfc7' }}>Generado por BuilderApp</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Container>

                        <Box color="text-body-secondary" fontSize="body-s" textAlign="center">
                            Esta es una vista previa con datos de ejemplo. Los participantes veran sus propios datos al descargar su credencial.
                        </Box>
                    </SpaceBetween>
                </Grid>
            </SpaceBetween>
        </AuthenticatedLayout>
    );
}
