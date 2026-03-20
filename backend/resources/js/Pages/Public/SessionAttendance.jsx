import { useState } from 'react';
import { Head } from '@inertiajs/react';

export default function SessionAttendance({ event, session, attendanceCode, autoParticipant, autoStatus }) {
    const [registrationCode, setRegistrationCode] = useState('');
    const [resolvedCode, setResolvedCode] = useState(autoParticipant?.registration_code || '');
    const [status, setStatus] = useState(autoStatus || null);
    const [message, setMessage] = useState(
        autoStatus === 'success'
            ? 'Asistencia registrada correctamente.'
            : autoStatus === 'duplicate'
              ? 'Ya registraste tu asistencia a esta sesion.'
              : ''
    );
    const [participantName, setParticipantName] = useState(autoParticipant?.name || '');
    const [newBadges, setNewBadges] = useState([]);

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus('loading');

        try {
            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            };
            const meta = document.querySelector('meta[name="csrf-token"]');
            if (meta) {
                headers['X-CSRF-TOKEN'] = meta.content;
            }

            const response = await fetch(`/e/${event.slug}/session/${attendanceCode}`, {
                method: 'POST',
                headers,
                credentials: 'same-origin',
                body: JSON.stringify({ registration_code: registrationCode.toUpperCase() }),
            });

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                data = { message: `Error del servidor (${response.status})` };
            }

            if (response.ok) {
                setStatus('success');
                setMessage(data.message);
                setParticipantName(data.participant_name);
                setResolvedCode(registrationCode.toUpperCase());
                setNewBadges(data.new_badges || []);
            } else {
                setStatus('error');
                setMessage(data.message || 'Error al registrar asistencia.');
            }
        } catch {
            setStatus('error');
            setMessage('Error de conexion. Intenta de nuevo.');
        }
    }

    const isResolved = status === 'success' || status === 'duplicate';

    return (
        <>
            <Head title={`Asistencia - ${session.title}`} />

            <div
                style={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #0972d3, #033160)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 24,
                    color: '#fff',
                }}
            >
                <div
                    style={{
                        background: '#fff',
                        borderRadius: 16,
                        padding: 32,
                        maxWidth: 420,
                        width: '100%',
                        color: '#16191f',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <div style={{ fontSize: 13, color: '#5f6b7a', marginBottom: 4 }}>
                            {event.name}
                        </div>
                        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
                            {session.title}
                        </h1>
                        {session.speakers?.length > 0 && (
                            <div style={{ fontSize: 14, color: '#5f6b7a', marginTop: 4 }}>
                                {session.speakers.join(', ')}
                            </div>
                        )}
                        {session.start_time && (
                            <div style={{ fontSize: 13, color: '#7d8998', marginTop: 8 }}>
                                {session.start_time} - {session.end_time}
                            </div>
                        )}
                    </div>

                    {isResolved ? (
                        <div style={{ textAlign: 'center' }}>
                            <div
                                style={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: '50%',
                                    background: status === 'success' ? '#e6f4ea' : '#e8f0fe',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 16px',
                                    fontSize: 28,
                                }}
                            >
                                {status === 'success' ? '✓' : 'ℹ'}
                            </div>
                            <h2
                                style={{
                                    fontSize: 20,
                                    fontWeight: 700,
                                    color: status === 'success' ? '#037f0c' : '#0972d3',
                                    marginBottom: 8,
                                }}
                            >
                                {status === 'success' ? 'Asistencia registrada' : 'Ya registrado'}
                            </h2>
                            <p style={{ color: '#5f6b7a', marginBottom: 4 }}>
                                {participantName && (
                                    <strong style={{ color: '#16191f' }}>{participantName}</strong>
                                )}
                            </p>
                            <p style={{ color: '#5f6b7a', marginBottom: 16, fontSize: 14 }}>
                                {message}
                            </p>

                            {newBadges.length > 0 && (
                                <div
                                    style={{
                                        background: '#f0f9ff',
                                        border: '2px solid #0972d3',
                                        borderRadius: 12,
                                        padding: 16,
                                        marginTop: 16,
                                    }}
                                >
                                    <div style={{ fontWeight: 700, color: '#0972d3', marginBottom: 8 }}>
                                        &#127942; Nueva insignia obtenida!
                                    </div>
                                    {newBadges.map((name, i) => (
                                        <div key={i} style={{ fontSize: 15, fontWeight: 600 }}>
                                            {name}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <a
                                href={`/e/${event.slug}/session/${attendanceCode}/feedback${resolvedCode ? `?code=${resolvedCode}` : ''}`}
                                style={{
                                    display: 'inline-block',
                                    marginTop: 20,
                                    padding: '14px 28px',
                                    background: '#8430ce',
                                    color: '#fff',
                                    borderRadius: 10,
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    fontSize: 15,
                                }}
                            >
                                Deja tu feedback de la charla
                            </a>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    marginBottom: 8,
                                }}
                            >
                                Codigo de registro
                            </label>
                            <input
                                type="text"
                                value={registrationCode}
                                onChange={(e) => setRegistrationCode(e.target.value.toUpperCase())}
                                placeholder="Ej: AB12CD34"
                                maxLength={8}
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="characters"
                                required
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    fontSize: 20,
                                    fontFamily: "'SF Mono', 'Fira Code', Consolas, monospace",
                                    textAlign: 'center',
                                    letterSpacing: 6,
                                    textTransform: 'uppercase',
                                    border: '2px solid #d5dbdb',
                                    borderRadius: 10,
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={(e) => (e.target.style.borderColor = '#0972d3')}
                                onBlur={(e) => (e.target.style.borderColor = '#d5dbdb')}
                            />
                            <p style={{ fontSize: 12, color: '#7d8998', marginTop: 8, marginBottom: 16 }}>
                                Encuentra tu codigo en tu ticket o confirmacion de registro.
                            </p>

                            {status === 'error' && (
                                <div
                                    style={{
                                        background: '#fdf3f1',
                                        border: '1px solid #d91515',
                                        borderRadius: 8,
                                        padding: 12,
                                        marginBottom: 16,
                                        color: '#d91515',
                                        fontSize: 14,
                                    }}
                                >
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'loading' || registrationCode.length < 8}
                                style={{
                                    width: '100%',
                                    padding: '14px 24px',
                                    fontSize: 16,
                                    fontWeight: 600,
                                    color: '#fff',
                                    background: '#0972d3',
                                    border: 'none',
                                    borderRadius: 10,
                                    cursor: status === 'loading' ? 'wait' : 'pointer',
                                    opacity: status === 'loading' || registrationCode.length < 8 ? 0.6 : 1,
                                    transition: 'opacity 0.2s',
                                }}
                            >
                                {status === 'loading' ? 'Registrando...' : 'Registrar asistencia'}
                            </button>
                        </form>
                    )}
                </div>

                <a
                    href={`/e/${event.slug}`}
                    style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: 13,
                        marginTop: 20,
                        textDecoration: 'none',
                    }}
                >
                    Volver al evento
                </a>
            </div>
        </>
    );
}
