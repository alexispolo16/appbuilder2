import { Head, useForm, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { formatEventDateRange } from '@/utils/formatters';
import { useState } from 'react';

const cfpStatusLabels = {
    pending: { label: 'Pendiente de revisión', color: '#0972d3', bg: '#e8f0fe' },
    accepted: { label: 'Aceptada', color: '#1e8e3e', bg: '#e6f4ea' },
    changes_requested: { label: 'Cambios solicitados', color: '#e08600', bg: '#fffbeb' },
    declined: { label: 'No aceptada', color: '#d91515', bg: '#fdf3f3' },
};

function ApplicationStatus({ application }) {
    const status = cfpStatusLabels[application.status];
    return (
        <div className="register-form">
            <div className="cfp-status">
                <div className="cfp-status__badge" style={{ background: status.bg, color: status.color }}>
                    {status.label}
                </div>
                <h2 className="register-form__title" style={{ marginTop: 16 }}>Tu postulación</h2>
                <div className="cfp-status__topic">
                    <strong>Tema:</strong> {application.proposed_topic}
                </div>
                {application.topic_description && (
                    <p className="cfp-status__desc">{application.topic_description}</p>
                )}
                {application.reviewer_notes && (
                    <div className="cfp-status__notes">
                        <strong>Comentarios del organizador:</strong>
                        <p>{application.reviewer_notes}</p>
                    </div>
                )}
                {application.status === 'changes_requested' && (
                    <p className="cfp-status__hint">
                        Puedes actualizar tu postulación usando el formulario de abajo.
                    </p>
                )}
            </div>
        </div>
    );
}

export default function CfpApply({ event, participant, existingApplication }) {
    const { flash } = usePage().props;
    const canEdit = !existingApplication || existingApplication.status === 'changes_requested';
    const showForm = participant && canEdit;

    const [photoPreview, setPhotoPreview] = useState(existingApplication?.photo_url || null);

    const { data, setData, post, processing, errors } = useForm({
        proposed_topic: existingApplication?.proposed_topic || '',
        topic_description: existingApplication?.topic_description || '',
        bio: existingApplication?.bio || '',
        photo: null,
        social_links: {
            twitter: existingApplication?.social_links?.twitter || participant?.social_links?.twitter || '',
            linkedin: existingApplication?.social_links?.linkedin || participant?.social_links?.linkedin || '',
            instagram: existingApplication?.social_links?.instagram || participant?.social_links?.instagram || '',
            github: existingApplication?.social_links?.github || participant?.social_links?.github || '',
            website: existingApplication?.social_links?.website || participant?.social_links?.website || '',
        },
    });

    function handlePhotoChange(e) {
        const file = e.target.files[0];
        if (file) {
            setData('photo', file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        post(`/e/${event.slug}/cfp`, {
            forceFormData: true,
        });
    }

    const descriptionText = event.description ? event.description.replace(/<[^>]*>/g, '') : '';
    const description = descriptionText
        ? (descriptionText.length > 150 ? descriptionText.substring(0, 150) + '...' : descriptionText)
        : null;

    return (
        <PublicLayout>
            <Head title={`Postularse como speaker - ${event.name}`} />

            <div className="register-container">
                {/* Event header */}
                <div className="register-header">
                    {event.cover_image_url && (
                        <div
                            className="register-header__image"
                            style={{ backgroundImage: `url(${event.cover_image_url})` }}
                        />
                    )}
                    <div className="cfp-header-badge">Convocatoria de Speakers</div>
                    <h1 className="register-header__title">{event.name}</h1>
                    <div className="register-header__meta">
                        {event.date_start && (
                            <span>{formatEventDateRange(event.date_start, event.date_end)}</span>
                        )}
                        {(event.location || event.venue) && (
                            <span>{[event.venue, event.location].filter(Boolean).join(', ')}</span>
                        )}
                    </div>
                    {description && (
                        <p className="register-header__description">{description}</p>
                    )}
                </div>

                {/* Flash messages */}
                {flash?.success && (
                    <div className="cfp-flash cfp-flash--success">{flash.success}</div>
                )}
                {flash?.error && (
                    <div className="cfp-flash cfp-flash--error">{flash.error}</div>
                )}

                {/* Not registered yet */}
                {!participant && (
                    <div className="register-form">
                        <div className="register-already">
                            <h2 className="register-form__title">Primero registrate en el evento</h2>
                            <p className="register-already__text">
                                Para postularte como speaker, primero debes estar registrado en el evento.
                            </p>
                            <a
                                href={`/e/${event.slug}/register`}
                                className="register-form__submit"
                                style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
                            >
                                Registrarme en el evento
                            </a>
                            <a href={`/e/${event.slug}`} className="register-form__back">
                                Volver al evento
                            </a>
                        </div>
                    </div>
                )}

                {/* Existing application status */}
                {existingApplication && (
                    <ApplicationStatus application={existingApplication} />
                )}

                {/* Application form */}
                {showForm && (
                    <form className="register-form" onSubmit={handleSubmit}>
                        <h2 className="register-form__title">
                            {existingApplication ? 'Actualizar postulación' : 'Postularme como speaker'}
                        </h2>

                        {/* Applicant info summary */}
                        <div className="register-auth-summary">
                            <div className="register-auth-summary__avatar">
                                {participant.first_name.charAt(0)}{participant.last_name.charAt(0)}
                            </div>
                            <div className="register-auth-summary__info">
                                <strong>{participant.first_name} {participant.last_name}</strong>
                                <span>{participant.email}</span>
                                {(participant.job_title || participant.company) && (
                                    <span style={{ fontSize: '0.8125rem', color: '#687078' }}>
                                        {[participant.job_title, participant.company].filter(Boolean).join(' @ ')}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Proposed topic */}
                        <div className="register-form__field">
                            <label className="register-form__label">
                                Tema propuesto <span className="register-form__required">*</span>
                            </label>
                            <input
                                type="text"
                                className={`register-form__input ${errors.proposed_topic ? 'register-form__input--error' : ''}`}
                                value={data.proposed_topic}
                                onChange={(e) => setData('proposed_topic', e.target.value)}
                                placeholder="Titulo de tu charla"
                            />
                            {errors.proposed_topic && (
                                <span className="register-form__error">{errors.proposed_topic}</span>
                            )}
                        </div>

                        {/* Topic description */}
                        <div className="register-form__field">
                            <label className="register-form__label">Descripción del tema</label>
                            <textarea
                                className={`register-form__input register-form__textarea ${errors.topic_description ? 'register-form__input--error' : ''}`}
                                value={data.topic_description}
                                onChange={(e) => setData('topic_description', e.target.value)}
                                placeholder="Describe brevemente de que tratará tu charla, que aprenderá la audiencia, etc."
                                rows={4}
                            />
                            {errors.topic_description && (
                                <span className="register-form__error">{errors.topic_description}</span>
                            )}
                        </div>

                        {/* Bio */}
                        <div className="register-form__field">
                            <label className="register-form__label">
                                Bio / Acerca de ti <span className="register-form__required">*</span>
                            </label>
                            <textarea
                                className={`register-form__input register-form__textarea ${errors.bio ? 'register-form__input--error' : ''}`}
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                                placeholder="Cuentanos sobre ti, tu experiencia, tus logros..."
                                rows={4}
                            />
                            {errors.bio && (
                                <span className="register-form__error">{errors.bio}</span>
                            )}
                        </div>

                        {/* Photo */}
                        <div className="register-form__field">
                            <label className="register-form__label">
                                Foto de perfil {!photoPreview && <span className="register-form__required">*</span>}
                            </label>
                            <div className="cfp-photo-upload">
                                {photoPreview && (
                                    <img
                                        src={photoPreview}
                                        alt="Preview"
                                        className="cfp-photo-upload__preview"
                                    />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="register-form__input"
                                />
                            </div>
                            {errors.photo && (
                                <span className="register-form__error">{errors.photo}</span>
                            )}
                        </div>

                        {/* Social links */}
                        <div className="register-form__field">
                            <label className="register-form__label">Redes sociales</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <input
                                    type="url"
                                    className={`register-form__input ${errors['social_links.twitter'] ? 'register-form__input--error' : ''}`}
                                    value={data.social_links.twitter}
                                    onChange={(e) => setData('social_links', { ...data.social_links, twitter: e.target.value })}
                                    placeholder="https://x.com/tu_usuario"
                                />
                                <input
                                    type="url"
                                    className={`register-form__input ${errors['social_links.linkedin'] ? 'register-form__input--error' : ''}`}
                                    value={data.social_links.linkedin}
                                    onChange={(e) => setData('social_links', { ...data.social_links, linkedin: e.target.value })}
                                    placeholder="https://linkedin.com/in/tu_perfil"
                                />
                                <input
                                    type="url"
                                    className={`register-form__input ${errors['social_links.instagram'] ? 'register-form__input--error' : ''}`}
                                    value={data.social_links.instagram}
                                    onChange={(e) => setData('social_links', { ...data.social_links, instagram: e.target.value })}
                                    placeholder="https://instagram.com/tu_usuario"
                                />
                                <input
                                    type="url"
                                    className={`register-form__input ${errors['social_links.github'] ? 'register-form__input--error' : ''}`}
                                    value={data.social_links.github}
                                    onChange={(e) => setData('social_links', { ...data.social_links, github: e.target.value })}
                                    placeholder="https://github.com/tu_usuario"
                                />
                                <input
                                    type="url"
                                    className={`register-form__input ${errors['social_links.website'] ? 'register-form__input--error' : ''}`}
                                    value={data.social_links.website}
                                    onChange={(e) => setData('social_links', { ...data.social_links, website: e.target.value })}
                                    placeholder="https://tu-sitio-web.com"
                                />
                            </div>
                            {(errors['social_links.twitter'] || errors['social_links.linkedin'] || errors['social_links.instagram'] || errors['social_links.github'] || errors['social_links.website']) && (
                                <span className="register-form__error">Verifica que las URLs sean validas</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="register-form__submit"
                            disabled={processing}
                        >
                            {processing
                                ? 'Enviando...'
                                : existingApplication
                                    ? 'Actualizar postulación'
                                    : 'Enviar postulación'
                            }
                        </button>

                        <a href={`/e/${event.slug}`} className="register-form__back">
                            Volver al evento
                        </a>
                    </form>
                )}

                {/* Already submitted and not editable */}
                {existingApplication && existingApplication.status !== 'changes_requested' && (
                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <a href={`/e/${event.slug}`} className="register-form__back">
                            Volver al evento
                        </a>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
