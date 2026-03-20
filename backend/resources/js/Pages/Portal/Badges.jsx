import { Head } from '@inertiajs/react';
import AttendeeLayout from '@/Layouts/AttendeeLayout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import ColumnLayout from '@cloudscape-design/components/column-layout';

function BadgeCard({ badge, eventName }) {
    const shareUrl = `${window.location.origin}/badge/${badge.verification_token}`;
    const shareText = `Obtuve la insignia "${badge.name}" en ${eventName}`;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    const downloadUrl = `/badge/${badge.verification_token}/download`;

    const hasImage = !!badge.image_url;

    const isExpired = badge.valid_until && new Date(badge.valid_until) < new Date();

    return (
        <div style={{
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
            background: '#fff',
            transition: 'transform 0.2s, box-shadow 0.2s',
            opacity: isExpired ? 0.6 : 1,
        }}>
            {/* Badge visual */}
            <div style={{
                background: hasImage
                    ? '#f8f9fa'
                    : `linear-gradient(135deg, ${badge.color}, ${badge.color}cc)`,
                padding: hasImage ? '24px' : '36px 24px',
                textAlign: 'center',
                minHeight: 180,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
            }}>
                {hasImage ? (
                    <img
                        src={badge.image_url}
                        alt={badge.name}
                        style={{
                            width: 140,
                            height: 140,
                            objectFit: 'contain',
                        }}
                    />
                ) : (
                    <div style={{ fontSize: 72 }}>{badge.icon}</div>
                )}
                {isExpired && (
                    <div style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: '#d91515',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: 20,
                    }}>
                        Expirada
                    </div>
                )}
            </div>

            {/* Badge info */}
            <div style={{ padding: '20px 24px', textAlign: 'center' }}>
                <div style={{
                    fontWeight: 700,
                    fontSize: 17,
                    color: '#16191f',
                    marginBottom: 4,
                }}>
                    {badge.name}
                </div>
                {badge.description && (
                    <div style={{
                        fontSize: 13,
                        color: '#5f6b7a',
                        marginBottom: 12,
                        lineHeight: 1.5,
                    }}>
                        {badge.description}
                    </div>
                )}
                {badge.skills && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 12 }}>
                        {badge.skills.split(',').filter(Boolean).map((s, i) => (
                            <span key={i} style={{
                                display: 'inline-block',
                                background: `${badge.color}15`,
                                color: badge.color,
                                fontSize: 11,
                                fontWeight: 600,
                                padding: '3px 10px',
                                borderRadius: 20,
                                border: `1px solid ${badge.color}30`,
                            }}>
                                {s.trim()}
                            </span>
                        ))}
                    </div>
                )}
                <div style={{
                    fontSize: 12,
                    color: '#7d8998',
                    marginBottom: badge.valid_until ? 4 : 16,
                }}>
                    Obtenida el{' '}
                    {badge.awarded_at
                        ? new Date(badge.awarded_at).toLocaleDateString('es-EC', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })
                        : '-'}
                </div>
                {badge.valid_until && (
                    <div style={{
                        fontSize: 11,
                        color: isExpired ? '#d91515' : '#7d8998',
                        marginBottom: 16,
                    }}>
                        {isExpired ? 'Expirada el' : 'Valida hasta'}{' '}
                        {new Date(badge.valid_until).toLocaleDateString('es-EC', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </div>
                )}

                {/* Share actions */}
                <div style={{
                    borderTop: '1px solid #e9ebed',
                    paddingTop: 16,
                    display: 'flex',
                    gap: 6,
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                }}>
                    <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn" style={socialBtnStyle('#0a66c2')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                    <a href={twitterUrl} target="_blank" rel="noopener noreferrer" title="X (Twitter)" style={socialBtnStyle('#000')}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    <a href={facebookUrl} target="_blank" rel="noopener noreferrer" title="Facebook" style={socialBtnStyle('#1877f2')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" title="WhatsApp" style={socialBtnStyle('#25d366')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>
                    <a href={downloadUrl} title="Descargar PNG" style={socialBtnStyle('#5f6b7a')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                    </a>
                    <button
                        onClick={() => navigator.clipboard.writeText(shareUrl)}
                        title="Copiar enlace"
                        style={{ ...socialBtnStyle('#8d99a8'), border: 'none', cursor: 'pointer' }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

function socialBtnStyle(bg) {
    return {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: bg,
        textDecoration: 'none',
        transition: 'opacity 0.2s',
    };
}

export default function PortalBadges({ event, badges, attendanceStats }) {
    return (
        <AttendeeLayout event={event}>
            <Head title={`Mis Insignias - ${event.name}`} />

            <SpaceBetween size="l">
                <Header variant="h1">Mis Insignias</Header>

                <Container header={<Header variant="h2">Progreso de Asistencia</Header>}>
                    <ColumnLayout columns={2} variant="text-grid">
                        <div>
                            <Box variant="awsui-key-label">Sesiones asistidas</Box>
                            <Box variant="awsui-value-large">
                                {attendanceStats.sessions_attended} / {attendanceStats.total_sessions}
                            </Box>
                        </div>
                        <div>
                            <Box variant="awsui-key-label">Porcentaje</Box>
                            <Box variant="awsui-value-large">
                                {attendanceStats.total_sessions > 0
                                    ? Math.round(
                                          (attendanceStats.sessions_attended / attendanceStats.total_sessions) * 100
                                      )
                                    : 0}
                                %
                            </Box>
                        </div>
                    </ColumnLayout>
                </Container>

                {badges.length > 0 ? (
                    <Container
                        header={
                            <Header variant="h2" counter={`(${badges.length})`}>
                                Insignias Obtenidas
                            </Header>
                        }
                    >
                        <ColumnLayout columns={2}>
                            {badges.map((badge) => (
                                <BadgeCard key={badge.id} badge={badge} eventName={event.name} />
                            ))}
                        </ColumnLayout>
                    </Container>
                ) : (
                    <Container header={<Header variant="h2">Insignias</Header>}>
                        <Box textAlign="center" padding={{ vertical: 'l' }}>
                            <SpaceBetween size="s">
                                <Box variant="h3">Aun no tienes insignias</Box>
                                <Box variant="p" color="text-body-secondary">
                                    Asiste a las sesiones del evento para obtener insignias automaticamente.
                                </Box>
                            </SpaceBetween>
                        </Box>
                    </Container>
                )}
            </SpaceBetween>
        </AttendeeLayout>
    );
}
