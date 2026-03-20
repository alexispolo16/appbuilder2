import { Head } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect, useRef } from 'react';

export default function AttendanceQR({ event, agendaItem, attended: initialAttended }) {
    const url = `${window.location.origin}/e/${event.slug}/session/${agendaItem.attendance_code}`;
    const [attended, setAttended] = useState(initialAttended);
    const [attendees, setAttendees] = useState([]);
    const [newIds, setNewIds] = useState(new Set());
    const prevIdsRef = useRef(new Set());

    useEffect(() => {
        const fetchLive = async () => {
            try {
                const res = await fetch(
                    `/events/${event.id}/agenda/${agendaItem.id}/attendance-qr/live`,
                    { headers: { Accept: 'application/json' } }
                );
                if (!res.ok) return;
                const data = await res.json();

                setAttended(data.attended);
                setAttendees(data.attendees);

                // Detect new attendees for animation
                const currentIds = new Set(data.attendees.map((a) => a.id));
                const freshIds = new Set();
                currentIds.forEach((id) => {
                    if (!prevIdsRef.current.has(id)) freshIds.add(id);
                });
                if (freshIds.size > 0) {
                    setNewIds(freshIds);
                    setTimeout(() => setNewIds(new Set()), 2000);
                }
                prevIdsRef.current = currentIds;
            } catch {
                // silently ignore
            }
        };

        fetchLive();
        const interval = setInterval(fetchLive, 4000);
        return () => clearInterval(interval);
    }, [event.id, agendaItem.id]);

    return (
        <>
            <Head title={`QR Asistencia - ${agendaItem.title}`} />

            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    background: 'linear-gradient(135deg, #0972d3, #033160)',
                    color: '#fff',
                    padding: 32,
                    textAlign: 'center',
                }}
            >
                <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>
                    {event.name}
                </div>
                <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
                    {agendaItem.title}
                </h1>
                <div style={{ fontSize: 16, opacity: 0.85, marginBottom: 24 }}>
                    Escanea el codigo QR para registrar tu asistencia
                </div>

                <div
                    style={{
                        background: '#fff',
                        borderRadius: 20,
                        padding: 32,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    }}
                >
                    <QRCodeSVG
                        value={url}
                        size={280}
                        level="H"
                        includeMargin={false}
                    />
                </div>

                <div style={{ marginTop: 20, fontSize: 18, fontWeight: 600 }}>
                    {attended} asistente{attended !== 1 ? 's' : ''} registrado{attended !== 1 ? 's' : ''}
                </div>

                <div style={{ marginTop: 8, fontSize: 13, opacity: 0.5 }}>
                    {agendaItem.date} &middot; {agendaItem.start_time} - {agendaItem.end_time}
                </div>

                {/* Live attendees list */}
                {attendees.length > 0 && (
                    <div
                        style={{
                            marginTop: 24,
                            width: '100%',
                            maxWidth: 600,
                            maxHeight: 'calc(100vh - 520px)',
                            overflowY: 'auto',
                        }}
                    >
                        <div
                            style={{
                                fontSize: 13,
                                textTransform: 'uppercase',
                                letterSpacing: 1.5,
                                opacity: 0.6,
                                marginBottom: 12,
                            }}
                        >
                            Registro en vivo
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {attendees.map((a) => (
                                <div
                                    key={a.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        background: newIds.has(a.id)
                                            ? 'rgba(255,255,255,0.25)'
                                            : 'rgba(255,255,255,0.1)',
                                        borderRadius: 10,
                                        padding: '10px 16px',
                                        transition: 'all 0.5s ease',
                                        animation: newIds.has(a.id)
                                            ? 'slideIn 0.5s ease'
                                            : 'none',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                background: 'rgba(255,255,255,0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 14,
                                                fontWeight: 700,
                                            }}
                                        >
                                            {a.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span style={{ fontSize: 15, fontWeight: 500 }}>
                                            {a.name}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: 12, opacity: 0.6 }}>
                                        {a.scanned_at}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes slideIn {
                    0% {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.95);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </>
    );
}
