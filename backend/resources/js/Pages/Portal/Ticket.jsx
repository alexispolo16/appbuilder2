import { Head } from '@inertiajs/react';
import { useState, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Modal from '@cloudscape-design/components/modal';
import AttendeeLayout from '@/Layouts/AttendeeLayout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Badge from '@cloudscape-design/components/badge';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import { formatEventDateRange } from '@/utils/formatters';
import { generateTicketImage } from '@/utils/ticket-generator';

const ticketTypeLabels = { general: 'General', vip: 'VIP', student: 'Estudiante' };
const statusLabels     = { confirmed: 'Confirmado', registered: 'Registrado', attended: 'Asistio' };
const statusColors     = { confirmed: 'green', registered: 'blue', attended: 'green' };

const MONTHS = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

function compactDate(start, end) {
    if (!start) return '';
    const s = new Date(start.includes('T') ? start : start + 'T12:00:00');
    if (!end) return `${s.getDate()} ${MONTHS[s.getMonth()]} ${s.getFullYear()}`;
    const e = new Date(end.includes('T') ? end : end + 'T12:00:00');
    if (s.toDateString() === e.toDateString())
        return `${s.getDate()} ${MONTHS[s.getMonth()]} ${s.getFullYear()}`;
    if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth())
        return `${s.getDate()} – ${e.getDate()} ${MONTHS[e.getMonth()]} ${e.getFullYear()}`;
    if (s.getFullYear() === e.getFullYear())
        return `${s.getDate()} ${MONTHS[s.getMonth()]} – ${e.getDate()} ${MONTHS[e.getMonth()]} ${e.getFullYear()}`;
    return `${s.getDate()} ${MONTHS[s.getMonth()]} ${s.getFullYear()} – ${e.getDate()} ${MONTHS[e.getMonth()]} ${e.getFullYear()}`;
}

const AVATAR_COLORS = ['#0972d3', '#037f0c', '#7d2105', '#8900e1', '#033160', '#0a5275'];

function avatarColor(name = '') {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function getInitials(name = '') {
    return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

export default function Ticket({ event, participant, credentialDesign, sponsors = [] }) {
    const qrRef = useRef(null);
    const [copied,      setCopied]      = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [showQr,      setShowQr]      = useState(false);

    const d = {
        header_bg_start: '#0972d3',
        header_bg_end: '#033160',
        accent_color: '#0972d3',
        ...credentialDesign,
    };

    const qrValue = `${window.location.origin}/e/${event.slug}/networking/${participant.registration_code}/profile`;

    function copyCode() {
        navigator.clipboard.writeText(participant.registration_code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    }

    const downloadTicket = useCallback(async () => {
        const svg = qrRef.current?.querySelector('svg');
        if (!svg || downloading) return;
        setDownloading(true);
        try {
            const dataUrl = await generateTicketImage(svg, event, participant, credentialDesign, sponsors);
            const a = document.createElement('a');
            a.download = `entrada-${participant.registration_code}.png`;
            a.href = dataUrl;
            a.click();
        } finally {
            setDownloading(false);
        }
    }, [event, participant, credentialDesign, sponsors, downloading]);

    const dateShort = compactDate(event.date_start, event.date_end);
    const dateStr   = formatEventDateRange(event.date_start, event.date_end);
    const venueStr  = [event.venue, event.location].filter(Boolean).join(', ');
    const metaLine  = [dateShort, venueStr].filter(Boolean).join('  ·  ');

    const statusTag = participant.status || 'registered';
    const typeTag   = participant.ticket_type || 'general';

    const eventItems = [
        { label: 'Evento', value: event.name },
        { label: 'Fecha',  value: dateStr },
        ...(venueStr ? [{ label: 'Lugar', value: venueStr }] : []),
        {
            label: 'Estado',
            value: (
                <Badge color={statusColors[participant.status] || 'grey'}>
                    {statusLabels[participant.status] || participant.status}
                </Badge>
            ),
        },
        {
            label: 'Tipo',
            value: <Badge>{ticketTypeLabels[participant.ticket_type] || participant.ticket_type}</Badge>,
        },
    ];

    const attendeeItems = [
        { label: 'Nombre',  value: participant.full_name },
        { label: 'Email',   value: participant.email },
        ...(participant.company   ? [{ label: 'Empresa', value: participant.company }]   : []),
        ...(participant.job_title ? [{ label: 'Cargo',   value: participant.job_title }] : []),
    ];

    return (
        <AttendeeLayout event={event}>
            <Head title={`Mi Entrada - ${event.name}`} />
            <ContentLayout
                header={
                    <Header variant="h1" description={event.name}>
                        Mi Entrada Digital
                    </Header>
                }
            >
                <div className="tkv2-page">

                    {/* ━━━ LEFT: info panels ━━━ */}
                    <div className="tkv2-info">
                        <SpaceBetween size="l">
                            <Container header={<Header variant="h2">Informacion del evento</Header>}>
                                <KeyValuePairs columns={1} items={eventItems} />
                            </Container>
                            <Container header={<Header variant="h2">Datos del asistente</Header>}>
                                <KeyValuePairs columns={1} items={attendeeItems} />
                            </Container>
                        </SpaceBetween>
                    </div>

                    {/* ━━━ RIGHT: ticket card ━━━ */}
                    <div className="tkv2">

                        {/* 1 — Accent bar */}
                        <div
                            className="tkv2__accent"
                            style={{ background: `linear-gradient(90deg, ${d.header_bg_start}, ${d.header_bg_end})` }}
                        />

                        {/* 2 — Event header */}
                        <div className="tkv2__header">
                            <p className="tkv2__header-name">{event.name}</p>
                            <p className="tkv2__header-meta">{metaLine}</p>
                            <div className="tkv2__header-tags">
                                <span className={`tkv2__tag tkv2__tag--${statusTag}`}>
                                    {statusLabels[participant.status] || participant.status}
                                </span>
                                <span className={`tkv2__tag tkv2__tag--${typeTag}`}>
                                    {ticketTypeLabels[participant.ticket_type] || participant.ticket_type}
                                </span>
                            </div>
                        </div>

                        {/* 3 — QR + code */}
                        <div className="tkv2__qr">
                            <div
                                ref={qrRef}
                                className="tkv2__qr-frame"
                                role="button"
                                tabIndex={0}
                                aria-label="Ver QR en pantalla completa"
                                onClick={() => setShowQr(true)}
                                onKeyDown={(e) => e.key === 'Enter' && setShowQr(true)}
                            >
                                <QRCodeSVG value={qrValue} size={210} level="M" marginSize={0} />
                            </div>
                            <p className="tkv2__code" style={{ color: d.accent_color }}>{participant.registration_code}</p>
                            <p className="tkv2__code-sub">Codigo de registro</p>
                        </div>

                        {/* 4 — Attendee */}
                        <div className="tkv2__attendee">
                            <div
                                className="tkv2__attendee-avatar"
                                style={{ background: avatarColor(participant.full_name) }}
                            >
                                {getInitials(participant.full_name)}
                            </div>
                            <div>
                                <p className="tkv2__attendee-name">{participant.full_name}</p>
                                {(participant.job_title || participant.company) && (
                                    <p className="tkv2__attendee-sub">
                                        {[participant.job_title, participant.company].filter(Boolean).join(' · ')}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* 5 — Actions */}
                        <div className="tkv2__actions">
                            <Button
                                variant="primary"
                                iconName="download"
                                onClick={downloadTicket}
                                loading={downloading}
                                fullWidth
                            >
                                Descargar entrada
                            </Button>
                            <div className="tkv2__action-row">
                                <Button
                                    iconName={copied ? 'status-positive' : 'copy'}
                                    onClick={copyCode}
                                >
                                    {copied ? 'Copiado' : 'Copiar codigo'}
                                </Button>
                                <Button iconName="expand" onClick={() => setShowQr(true)}>
                                    Ver QR
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </ContentLayout>

            {/* ━━━ MODAL QR ━━━ */}
            <Modal
                visible={showQr}
                onDismiss={() => setShowQr(false)}
                header={participant.full_name}
                size="medium"
            >
                <SpaceBetween size="l" alignItems="center">
                    <div style={{ padding: 14, border: '1.5px solid #dde1e7', borderRadius: 16, lineHeight: 0 }}>
                        <QRCodeSVG value={qrValue} size={300} level="H" marginSize={0} />
                    </div>
                    <SpaceBetween size="xxs" alignItems="center">
                        <Box fontSize="heading-xl" fontWeight="bold" color="text-status-info">
                            {participant.registration_code}
                        </Box>
                        <Box color="text-body-secondary" fontSize="body-s">
                            Presenta este QR en la entrada del evento
                        </Box>
                    </SpaceBetween>
                    <Button variant="primary" iconName="download" onClick={downloadTicket} loading={downloading}>
                        Descargar entrada
                    </Button>
                </SpaceBetween>
            </Modal>
        </AttendeeLayout>
    );
}
