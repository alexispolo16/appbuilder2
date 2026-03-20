import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function Networking({ event, participant, savedContactIds, profileUrl }) {
    const [pin, setPin] = useState(participant.networking_pin || '');
    const [pinSaving, setPinSaving] = useState(false);
    const [pinMessage, setPinMessage] = useState(null);
    const [pinError, setPinError] = useState(null);

    const [searchCode, setSearchCode] = useState('');
    const [searchStep, setSearchStep] = useState('code'); // 'code' | 'pin' | 'connected'
    const [searchTarget, setSearchTarget] = useState(null);
    const [searchPinValue, setSearchPinValue] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchResult, setSearchResult] = useState(null);
    const [searchError, setSearchError] = useState(null);
    const [searchSaving, setSearchSaving] = useState(false);

    const [socialLinks, setSocialLinks] = useState(participant.social_links || {});
    const [networkingVisible, setNetworkingVisible] = useState(participant.networking_visible);
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileMessage, setProfileMessage] = useState(null);
    const [profileError, setProfileError] = useState(null);

    const [localSavedIds, setLocalSavedIds] = useState(savedContactIds || []);

    const [photoUrl, setPhotoUrl] = useState(participant.photo_url || null);
    const [photoLoading, setPhotoLoading] = useState(false);
    const [photoMessage, setPhotoMessage] = useState(null);
    const [photoError, setPhotoError] = useState(null);
    const photoInputRef = useRef(null);

    const baseUrl = `/e/${event.slug}/networking/${participant.registration_code}`;

    const filterAlphanumeric = (value) => {
        return value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6);
    };

    const handlePinChange = (e) => {
        setPin(filterAlphanumeric(e.target.value));
        setPinMessage(null);
        setPinError(null);
    };

    const handleSavePin = async () => {
        if (pin.length !== 6) {
            setPinError('El PIN debe tener exactamente 6 caracteres.');
            return;
        }

        setPinSaving(true);
        setPinMessage(null);
        setPinError(null);

        try {
            const response = await window.axios.post(`${baseUrl}/pin`, {
                networking_pin: pin,
            });
            setPinMessage(response.data.message);
            setPin(response.data.networking_pin);
            if (response.data.networking_visible !== undefined) {
                setNetworkingVisible(response.data.networking_visible);
            }
        } catch (error) {
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                const firstError = errors?.networking_pin?.[0] || error.response.data.message;
                setPinError(firstError);
            } else {
                setPinError('Ocurrio un error al guardar el PIN.');
            }
        } finally {
            setPinSaving(false);
        }
    };

    const handleSearchByCode = async () => {
        if (searchCode.length !== 8) {
            setSearchError('Ingresa un codigo de 8 caracteres.');
            return;
        }

        setSearching(true);
        setSearchTarget(null);
        setSearchResult(null);
        setSearchError(null);

        try {
            const response = await window.axios.post(`${baseUrl}/search`, {
                registration_code: searchCode.toUpperCase(),
            });

            if (response.data.found) {
                setSearchTarget(response.data.participant);
                setSearchStep('pin');
                setSearchPinValue('');
            } else {
                setSearchError('No se encontro ningun participante con ese codigo.');
            }
        } catch {
            setSearchError('Ocurrio un error al buscar.');
        } finally {
            setSearching(false);
        }
    };

    const handleVerifyPin = async () => {
        if (!searchTarget || searchPinValue.length !== 6) return;

        setSearchSaving(true);
        setSearchError(null);

        try {
            const response = await window.axios.post(`${baseUrl}/verify-pin`, {
                target_participant_id: searchTarget.id,
                pin: searchPinValue.toUpperCase(),
            });

            if (response.data.connected) {
                setSearchResult(response.data.contact);
                setSearchStep('connected');
                setLocalSavedIds([...localSavedIds, response.data.contact.id]);
            }
        } catch (error) {
            setSearchError(error.response?.data?.message || 'PIN incorrecto.');
        } finally {
            setSearchSaving(false);
        }
    };

    const downloadVCard = (contact) => {
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
    };

    const resetSearch = () => {
        setSearchCode('');
        setSearchStep('code');
        setSearchTarget(null);
        setSearchPinValue('');
        setSearchResult(null);
        setSearchError(null);
    };

    const handleUploadPhoto = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPhotoLoading(true);
        setPhotoMessage(null);
        setPhotoError(null);

        const formData = new FormData();
        formData.append('photo', file);

        try {
            const response = await window.axios.post(`${baseUrl}/photo`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setPhotoUrl(response.data.photo_url);
            setPhotoMessage(response.data.message);
        } catch (error) {
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                setPhotoError(errors?.photo?.[0] || 'Error al subir la foto.');
            } else {
                setPhotoError('Ocurrio un error al subir la foto.');
            }
        } finally {
            setPhotoLoading(false);
            if (photoInputRef.current) photoInputRef.current.value = '';
        }
    };

    const handleSocialLinkChange = (key, value) => {
        setSocialLinks({ ...socialLinks, [key]: value });
        setProfileMessage(null);
        setProfileError(null);
    };

    const handleSaveProfile = async () => {
        setProfileSaving(true);
        setProfileMessage(null);
        setProfileError(null);

        try {
            const response = await window.axios.post(`${baseUrl}/profile`, {
                social_links: socialLinks,
                networking_visible: networkingVisible,
            });
            setProfileMessage(response.data.message);
            setSocialLinks(response.data.social_links);
            setNetworkingVisible(response.data.networking_visible);
        } catch (error) {
            if (error.response?.status === 422) {
                setProfileError('Verifica que las URLs sean validas.');
            } else {
                setProfileError('Ocurrio un error al guardar el perfil.');
            }
        } finally {
            setProfileSaving(false);
        }
    };

    const getInitials = (fullName) => {
        return fullName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const socialFields = [
        { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/tu-perfil' },
        { key: 'github', label: 'GitHub', placeholder: 'https://github.com/tu-usuario' },
        { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/tu-usuario' },
        { key: 'website', label: 'Sitio web', placeholder: 'https://tu-sitio.com' },
        { key: 'whatsapp', label: 'WhatsApp', placeholder: '+593 99 123 4567' },
    ];

    const contactsCount = localSavedIds.length;

    return (
        <PublicLayout>
            <Head title={`Networking - ${event.name}`} />

            <div className="networking-header">
                <div className="networking-header__content">
                    <h1 className="networking-header__title">{event.name}</h1>
                    <p className="networking-header__greeting">Hola, {participant.first_name}</p>
                </div>
            </div>

            <div className="networking-container">
                {/* QR Code Section */}
                {participant.networking_pin && (
                    <div className="networking-card">
                        <h2 className="networking-card__title">Mi Codigo QR</h2>
                        <p className="networking-card__description">
                            Otros participantes pueden escanear este codigo para ver tu perfil.
                        </p>
                        <div className="networking-qr">
                            <QRCodeSVG
                                value={profileUrl}
                                size={200}
                                level="M"
                                bgColor="#ffffff"
                                fgColor="#033160"
                            />
                        </div>
                    </div>
                )}

                {/* My PIN Section */}
                <div className="networking-card">
                    <h2 className="networking-card__title">Mi PIN de Networking</h2>
                    <p className="networking-card__description">
                        Comparte tu PIN con otros participantes para que puedan ver tu
                        informacion de contacto.
                    </p>

                    <div className="networking-input-group">
                        <input
                            type="text"
                            value={pin}
                            onChange={handlePinChange}
                            placeholder="Ej: ABC123"
                            maxLength={6}
                            className="networking-pin-input"
                        />
                        <button
                            onClick={handleSavePin}
                            disabled={pinSaving || pin.length !== 6}
                            className={`networking-btn networking-btn--primary ${pinSaving || pin.length !== 6 ? 'networking-btn--disabled' : ''}`}
                        >
                            {pinSaving ? 'Guardando...' : 'Guardar PIN'}
                        </button>
                    </div>

                    {pinMessage && (
                        <div className="networking-alert networking-alert--success">{pinMessage}</div>
                    )}
                    {pinError && (
                        <div className="networking-alert networking-alert--error">{pinError}</div>
                    )}
                </div>

                {/* Photo Upload Section */}
                <div className="networking-card">
                    <h2 className="networking-card__title">Foto de Perfil</h2>
                    <p className="networking-card__description">
                        Sube una foto para que otros participantes te reconozcan facilmente.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                        {photoUrl ? (
                            <img
                                src={photoUrl}
                                alt={participant.first_name}
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '2px solid #0972d3',
                                }}
                            />
                        ) : (
                            <div className="networking-contact-card__avatar" style={{ width: 80, height: 80, fontSize: 28 }}>
                                {getInitials(participant.first_name + ' ' + (participant.last_name || ''))}
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
                            <button
                                onClick={() => photoInputRef.current?.click()}
                                disabled={photoLoading}
                                className={`networking-btn networking-btn--primary ${photoLoading ? 'networking-btn--disabled' : ''}`}
                            >
                                {photoLoading ? 'Subiendo...' : (photoUrl ? 'Cambiar foto' : 'Subir foto')}
                            </button>
                        </div>
                    </div>
                    {photoMessage && (
                        <div className="networking-alert networking-alert--success">{photoMessage}</div>
                    )}
                    {photoError && (
                        <div className="networking-alert networking-alert--error">{photoError}</div>
                    )}
                </div>

                {/* Social Links / Profile Section */}
                <div className="networking-card">
                    <h2 className="networking-card__title">Mi Perfil de Networking</h2>
                    <p className="networking-card__description">
                        Agrega tus redes sociales para que otros participantes puedan conectar contigo.
                    </p>

                    <div className="networking-profile-form">
                        {socialFields.map((field) => (
                            <div key={field.key} className="networking-profile-form__field">
                                <label className="networking-profile-form__label">{field.label}</label>
                                <input
                                    type="text"
                                    value={socialLinks[field.key] || ''}
                                    onChange={(e) => handleSocialLinkChange(field.key, e.target.value)}
                                    placeholder={field.placeholder}
                                    className="networking-profile-form__input"
                                />
                            </div>
                        ))}

                        <div className="networking-profile-form__toggle">
                            <label className="networking-toggle">
                                <input
                                    type="checkbox"
                                    checked={networkingVisible}
                                    onChange={(e) => {
                                        setNetworkingVisible(e.target.checked);
                                        setProfileMessage(null);
                                    }}
                                />
                                <span className="networking-toggle__label">Visible en el directorio de participantes</span>
                            </label>
                        </div>

                        <button
                            onClick={handleSaveProfile}
                            disabled={profileSaving}
                            className={`networking-btn networking-btn--primary networking-btn--full ${profileSaving ? 'networking-btn--disabled' : ''}`}
                        >
                            {profileSaving ? 'Guardando...' : 'Guardar perfil'}
                        </button>

                        {profileMessage && (
                            <div className="networking-alert networking-alert--success">{profileMessage}</div>
                        )}
                        {profileError && (
                            <div className="networking-alert networking-alert--error">{profileError}</div>
                        )}
                    </div>
                </div>

                {/* Search Section */}
                <div className="networking-card">
                    <h2 className="networking-card__title">Buscar Participante</h2>
                    <p className="networking-card__description">
                        Ingresa el codigo de registro de otro participante para conectar.
                    </p>

                    {searchStep === 'code' && (
                        <>
                            <div className="networking-input-group">
                                <input
                                    type="text"
                                    value={searchCode}
                                    onChange={(e) => { setSearchCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)); setSearchError(null); }}
                                    placeholder="Ej: AB12CD34"
                                    maxLength={8}
                                    className="networking-pin-input"
                                />
                                <button
                                    onClick={handleSearchByCode}
                                    disabled={searching || searchCode.length !== 8}
                                    className={`networking-btn networking-btn--secondary ${searching || searchCode.length !== 8 ? 'networking-btn--disabled' : ''}`}
                                >
                                    {searching ? 'Buscando...' : 'Buscar'}
                                </button>
                            </div>
                            {searchError && (
                                <div className="networking-alert networking-alert--warning">{searchError}</div>
                            )}
                        </>
                    )}

                    {searchStep === 'pin' && searchTarget && (
                        <>
                            <div className="networking-contact-card">
                                <div className="networking-contact-card__avatar">
                                    {getInitials(searchTarget.full_name)}
                                </div>
                                <div className="networking-contact-card__info">
                                    <h3 className="networking-contact-card__name">
                                        {searchTarget.full_name}
                                    </h3>
                                </div>
                            </div>
                            <p className="networking-card__description" style={{ marginTop: 16 }}>
                                Ingresa el PIN de este participante para conectar.
                            </p>
                            <div className="networking-input-group">
                                <input
                                    type="text"
                                    value={searchPinValue}
                                    onChange={(e) => { setSearchPinValue(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)); setSearchError(null); }}
                                    placeholder="PIN (6 caracteres)"
                                    maxLength={6}
                                    className="networking-pin-input"
                                />
                                <button
                                    onClick={handleVerifyPin}
                                    disabled={searchSaving || searchPinValue.length !== 6}
                                    className={`networking-btn networking-btn--primary ${searchSaving || searchPinValue.length !== 6 ? 'networking-btn--disabled' : ''}`}
                                >
                                    {searchSaving ? 'Verificando...' : 'Verificar'}
                                </button>
                            </div>
                            {searchError && (
                                <div className="networking-alert networking-alert--warning">{searchError}</div>
                            )}
                            <button onClick={resetSearch} className="networking-btn networking-btn--small" style={{ marginTop: 8 }}>
                                Cancelar
                            </button>
                        </>
                    )}

                    {searchStep === 'connected' && searchResult && (
                        <>
                            <div className="networking-contact-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                    <div className="networking-contact-card__avatar">
                                        {getInitials(searchResult.full_name)}
                                    </div>
                                    <div>
                                        <h3 className="networking-contact-card__name" style={{ margin: 0 }}>
                                            {searchResult.full_name}
                                        </h3>
                                        {searchResult.job_title && (
                                            <p className="networking-contact-card__role">{searchResult.job_title}</p>
                                        )}
                                        {searchResult.company && (
                                            <p className="networking-contact-card__company">{searchResult.company}</p>
                                        )}
                                    </div>
                                    <span className="networking-badge networking-badge--saved" style={{ marginLeft: 'auto' }}>Conectado</span>
                                </div>
                                <div style={{ fontSize: 14, color: '#5f6b7a', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {searchResult.email && (
                                        <div><strong>Email:</strong> <a href={`mailto:${searchResult.email}`}>{searchResult.email}</a></div>
                                    )}
                                    {searchResult.phone && (
                                        <div><strong>Telefono:</strong> <a href={`tel:${searchResult.phone}`}>{searchResult.phone}</a></div>
                                    )}
                                    {searchResult.social_links && Object.entries(searchResult.social_links).filter(([, v]) => v).map(([key, value]) => (
                                        <div key={key}><strong>{key}:</strong> {value}</div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                                <button onClick={() => downloadVCard(searchResult)} className="networking-btn networking-btn--primary">
                                    Descargar contacto
                                </button>
                                <button onClick={resetSearch} className="networking-btn networking-btn--secondary">
                                    Buscar otro
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Navigation Links */}
                {participant.networking_pin && (
                    <div className="networking-nav">
                        <a href={`${baseUrl}/directory`} className="networking-nav__link">
                            <span className="networking-nav__icon">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 10a3 3 0 100-6 3 3 0 000 6zm6 0a3 3 0 100-6 3 3 0 000 6zM7 12c-3.3 0-6 1.34-6 3v1h12v-1c0-1.66-2.7-3-6-3zm6 0c-.37 0-.7.02-1.03.06C13.17 13.13 14 14.1 14 15v1h5v-1c0-1.66-2.7-3-6-3z" fill="currentColor"/></svg>
                            </span>
                            Directorio de participantes
                        </a>
                        <a href={`${baseUrl}/contacts`} className="networking-nav__link">
                            <span className="networking-nav__icon">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16 2H4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zM7 5a2 2 0 110 4 2 2 0 010-4zm4 10H3v-1c0-1.33 2.67-2 4-2s4 .67 4 2v1zm2-4h-2v-1h2v1zm3 0h-2v-1h2v1zm-3-2h-2V8h2v1zm3 0h-2V8h2v1z" fill="currentColor"/></svg>
                            </span>
                            Mis contactos ({contactsCount})
                        </a>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
