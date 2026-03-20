import { useState } from 'react';
import { Head } from '@inertiajs/react';

const RATINGS = [
    { value: 'happy', emoji: '\u{1F60D}', label: 'Me encanto' },
    { value: 'neutral', emoji: '\u{1F610}', label: 'Regular' },
    { value: 'sad', emoji: '\u{1F61E}', label: 'No me gusto' },
];

export default function SessionFeedback({ event, session, attendanceCode, autoParticipant }) {
    const [step, setStep] = useState(autoParticipant ? 'feedback' : 'code');
    const [registrationCode, setRegistrationCode] = useState(autoParticipant?.registration_code || '');
    const [rating, setRating] = useState(null);
    const [wantMore, setWantMore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [participantName, setParticipantName] = useState(autoParticipant?.name || '');

    async function handleSubmit() {
        if (!rating || wantMore === null) return;
        setLoading(true);

        try {
            const headers = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            };
            const meta = document.querySelector('meta[name="csrf-token"]');
            if (meta) {
                headers['X-CSRF-TOKEN'] = meta.content;
            }

            const response = await fetch(`/e/${event.slug}/session/${attendanceCode}/feedback`, {
                method: 'POST',
                headers,
                credentials: 'same-origin',
                body: JSON.stringify({
                    registration_code: registrationCode.toUpperCase(),
                    rating,
                    want_more: wantMore,
                }),
            });

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                data = { message: `Error del servidor (${response.status})` };
            }

            if (response.ok) {
                setStep('success');
                setParticipantName(data.participant_name);
            } else {
                setMessage(data.message || 'Error al enviar feedback.');
                setStep('error');
            }
        } catch {
            setMessage('Error de conexion. Intenta de nuevo.');
            setStep('error');
        } finally {
            setLoading(false);
        }
    }

    const cardStyle = {
        background: '#fff',
        borderRadius: 16,
        padding: 32,
        maxWidth: 440,
        width: '100%',
        color: '#16191f',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    };

    const btnBase = {
        padding: '14px 24px',
        fontSize: 16,
        fontWeight: 600,
        color: '#fff',
        background: '#0972d3',
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
        width: '100%',
    };

    return (
        <>
            <Head title={`Feedback - ${session.title}`} />

            <div
                style={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #8430ce, #033160)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 24,
                }}
            >
                <div style={cardStyle}>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <div style={{ fontSize: 13, color: '#5f6b7a', marginBottom: 4 }}>
                            {event.name}
                        </div>
                        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
                            {session.title}
                        </h1>
                        {session.speakers?.length > 0 && (
                            <div style={{ fontSize: 14, color: '#5f6b7a', marginTop: 4 }}>
                                {session.speakers.join(', ')}
                            </div>
                        )}
                    </div>

                    {step === 'code' && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setStep('feedback');
                            }}
                        >
                            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                                Codigo de registro
                            </label>
                            <input
                                type="text"
                                value={registrationCode}
                                onChange={(e) => setRegistrationCode(e.target.value)}
                                placeholder="Ej: AB12CD34"
                                maxLength={8}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    fontSize: 18,
                                    fontFamily: 'monospace',
                                    textAlign: 'center',
                                    letterSpacing: 4,
                                    textTransform: 'uppercase',
                                    border: '2px solid #d5dbdb',
                                    borderRadius: 8,
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                            />
                            <p style={{ fontSize: 12, color: '#7d8998', marginTop: 8, marginBottom: 16 }}>
                                Encuentra tu codigo en tu ticket o confirmacion de registro.
                            </p>
                            <button
                                type="submit"
                                disabled={registrationCode.length < 8}
                                style={{
                                    ...btnBase,
                                    opacity: registrationCode.length < 8 ? 0.6 : 1,
                                }}
                            >
                                Continuar
                            </button>
                        </form>
                    )}

                    {step === 'feedback' && (
                        <div>
                            <h2 style={{ fontSize: 17, fontWeight: 600, textAlign: 'center', marginBottom: 20 }}>
                                ¿Que te parecio la charla?
                            </h2>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 28 }}>
                                {RATINGS.map((r) => (
                                    <button
                                        key={r.value}
                                        type="button"
                                        onClick={() => setRating(r.value)}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 6,
                                            padding: '14px 18px',
                                            borderRadius: 12,
                                            border: rating === r.value ? '3px solid #0972d3' : '2px solid #d5dbdb',
                                            background: rating === r.value ? '#f0f7ff' : '#fff',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            transform: rating === r.value ? 'scale(1.08)' : 'scale(1)',
                                        }}
                                    >
                                        <span style={{ fontSize: 40 }}>{r.emoji}</span>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: '#5f6b7a' }}>
                                            {r.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <h2 style={{ fontSize: 17, fontWeight: 600, textAlign: 'center', marginBottom: 16 }}>
                                ¿Te gustaria saber mas de este tema?
                            </h2>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 28 }}>
                                {[
                                    { value: true, label: 'Si', emoji: '\u{1F44D}' },
                                    { value: false, label: 'No', emoji: '\u{1F44E}' },
                                ].map((opt) => (
                                    <button
                                        key={String(opt.value)}
                                        type="button"
                                        onClick={() => setWantMore(opt.value)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            padding: '12px 28px',
                                            borderRadius: 12,
                                            border:
                                                wantMore === opt.value
                                                    ? '3px solid #0972d3'
                                                    : '2px solid #d5dbdb',
                                            background: wantMore === opt.value ? '#f0f7ff' : '#fff',
                                            cursor: 'pointer',
                                            fontSize: 16,
                                            fontWeight: 600,
                                            transition: 'all 0.2s',
                                            transform: wantMore === opt.value ? 'scale(1.08)' : 'scale(1)',
                                        }}
                                    >
                                        <span style={{ fontSize: 24 }}>{opt.emoji}</span>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!rating || wantMore === null || loading}
                                style={{
                                    ...btnBase,
                                    opacity: !rating || wantMore === null || loading ? 0.6 : 1,
                                    cursor: loading ? 'wait' : 'pointer',
                                }}
                            >
                                {loading ? 'Enviando...' : 'Enviar feedback'}
                            </button>
                        </div>
                    )}

                    {step === 'success' && (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 56, marginBottom: 12 }}>{'\u{1F389}'}</div>
                            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#037f0c', marginBottom: 8 }}>
                                Gracias por tu feedback!
                            </h2>
                            <p style={{ color: '#5f6b7a' }}>
                                {participantName}, tu opinion nos ayuda a mejorar.
                            </p>
                        </div>
                    )}

                    {step === 'error' && (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>{'\u{26A0}\u{FE0F}'}</div>
                            <p style={{ color: '#d91515', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
                                {message}
                            </p>
                            <button
                                type="button"
                                onClick={() => setStep('code')}
                                style={btnBase}
                            >
                                Intentar de nuevo
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
