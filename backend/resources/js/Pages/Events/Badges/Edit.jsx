import { useState, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import EventLayout from '@/Layouts/EventLayout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Textarea from '@cloudscape-design/components/textarea';
import Select from '@cloudscape-design/components/select';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import Toggle from '@cloudscape-design/components/toggle';
import Multiselect from '@cloudscape-design/components/multiselect';
import DatePicker from '@cloudscape-design/components/date-picker';
import ConfirmModal from '@/Components/ConfirmModal';

const iconOptions = [
    { value: '🏆', label: '🏆 Trofeo' },
    { value: '⭐', label: '⭐ Estrella' },
    { value: '🎓', label: '🎓 Graduacion' },
    { value: '🔥', label: '🔥 Fuego' },
    { value: '💎', label: '💎 Diamante' },
    { value: '🎯', label: '🎯 Diana' },
    { value: '🚀', label: '🚀 Cohete' },
    { value: '🎖️', label: '🎖️ Medalla' },
    { value: '👑', label: '👑 Corona' },
    { value: '✅', label: '✅ Check' },
];

const typeOptions = [
    { value: 'manual', label: 'Manual' },
    { value: 'automatic', label: 'Automatica' },
];

const autoRuleOptions = [
    { value: 'session_attendance', label: 'Asistencia a sesiones', description: 'Se otorga al asistir a un numero minimo de sesiones' },
    { value: 'event_checkin', label: 'Check-in al evento', description: 'Se otorga al hacer check-in en el evento' },
    { value: 'survey_completion', label: 'Completar encuestas', description: 'Se otorga al completar un numero minimo de encuestas' },
];

export default function BadgesEdit({ event, badge, awardedParticipants }) {
    const { data, setData, processing, errors } = useForm({
        name: badge.name,
        description: badge.description || '',
        skills: badge.skills || '',
        icon: badge.icon,
        image: null,
        remove_image: false,
        color: badge.color,
        type: badge.type,
        auto_rule: badge.auto_rule || { type: 'session_attendance', min_sessions: 1, min_surveys: 1 },
        is_active: badge.is_active,
        valid_until: badge.valid_until || '',
    });

    const [imagePreview, setImagePreview] = useState(badge.image_url || null);
    const [skillInput, setSkillInput] = useState('');
    const [revokeTarget, setRevokeTarget] = useState(null);
    const [showAward, setShowAward] = useState(false);
    const [availableParticipants, setAvailableParticipants] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [awardNotes, setAwardNotes] = useState('');
    const [loadingParticipants, setLoadingParticipants] = useState(false);
    const fileInputRef = useRef(null);

    const skillList = data.skills
        ? data.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

    function addSkill() {
        const trimmed = skillInput.trim();
        if (!trimmed) return;
        const current = data.skills ? data.skills.split(',').map((s) => s.trim()).filter(Boolean) : [];
        if (!current.includes(trimmed)) {
            setData('skills', [...current, trimmed].join(', '));
        }
        setSkillInput('');
    }

    function removeSkill(index) {
        const current = data.skills.split(',').map((s) => s.trim()).filter(Boolean);
        current.splice(index, 1);
        setData('skills', current.join(', '));
    }

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (file) {
            setData((prev) => ({ ...prev, image: file, remove_image: false }));
            setImagePreview(URL.createObjectURL(file));
        }
    }

    function removeImage() {
        setData((prev) => ({ ...prev, image: null, remove_image: true }));
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    function handleSubmit(e) {
        e.preventDefault();
        const payload = { ...data };
        if (payload.type === 'manual') payload.auto_rule = null;
        router.put(`/events/${event.id}/badges/${badge.id}`, payload, {
            forceFormData: true,
            preserveScroll: true,
        });
    }

    function handleRevoke() {
        router.post(`/events/${event.id}/badges/${badge.id}/revoke`, {
            participant_id: revokeTarget.id,
        }, {
            onSuccess: () => setRevokeTarget(null),
        });
    }

    function loadAvailableParticipants() {
        setLoadingParticipants(true);
        fetch(`/events/${event.id}/badges/${badge.id}/participants`)
            .then((r) => r.json())
            .then((data) => {
                setAvailableParticipants(data.participants || []);
                setLoadingParticipants(false);
            })
            .catch(() => setLoadingParticipants(false));
    }

    function openAwardPanel() {
        setShowAward(true);
        loadAvailableParticipants();
    }

    function handleAward() {
        router.post(
            `/events/${event.id}/badges/${badge.id}/award`,
            {
                participant_ids: selectedParticipants.map((p) => p.value),
                notes: awardNotes,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowAward(false);
                    setSelectedParticipants([]);
                    setAwardNotes('');
                },
            }
        );
    }

    const hasImage = !!imagePreview;

    return (
        <EventLayout event={event}>
            <Head title={`Editar Insignia - ${badge.name}`} />

            <SpaceBetween size="l">
                <Header variant="h1">Editar insignia</Header>

                <div className="edit-page-layout">
                    {/* Sidebar — preview + imagen + icono/color */}
                    <div className="edit-page-layout__sidebar">
                        <SpaceBetween size="l">
                            {/* Badge preview */}
                            <Container header={<Header variant="h2">Vista previa</Header>}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '8px 0' }}>
                                    <div style={{
                                        width: 96,
                                        height: 96,
                                        borderRadius: 20,
                                        background: hasImage ? '#f0f0f0' : data.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        boxShadow: `0 4px 16px ${data.color}55`,
                                    }}>
                                        {hasImage ? (
                                            <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ fontSize: 44 }}>{data.icon}</span>
                                        )}
                                    </div>
                                    <Box variant="h3" tagOverride="p" textAlign="center">
                                        {data.name || 'Nombre de la insignia'}
                                    </Box>
                                    <div style={{
                                        display: 'inline-block',
                                        background: `${data.color}20`,
                                        color: data.color,
                                        border: `1px solid ${data.color}50`,
                                        borderRadius: 12,
                                        padding: '2px 12px',
                                        fontSize: 12,
                                        fontWeight: 600,
                                    }}>
                                        {data.type === 'manual' ? 'Manual' : 'Automática'}
                                    </div>
                                </div>
                            </Container>

                            {/* Image upload */}
                            <Container header={<Header variant="h2">Imagen personalizada</Header>}>
                                <SpaceBetween size="m">
                                    <Box color="text-body-secondary" fontSize="body-s">
                                        PNG, JPG o WebP. Máx. 2MB. Si no hay imagen se usa el ícono emoji.
                                    </Box>
                                    <SpaceBetween size="xs">
                                        <Button
                                            iconName="upload"
                                            fullWidth
                                            onClick={() => fileInputRef.current?.click()}
                                            formAction="none"
                                        >
                                            {hasImage ? 'Cambiar imagen' : 'Subir imagen'}
                                        </Button>
                                        {hasImage && (
                                            <Button variant="link" fullWidth onClick={removeImage} formAction="none">
                                                Quitar imagen
                                            </Button>
                                        )}
                                    </SpaceBetween>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                    {errors.image && <Box color="text-status-error" fontSize="body-s">{errors.image}</Box>}
                                </SpaceBetween>
                            </Container>

                            {/* Icon & color (only when no image) */}
                            {!hasImage && (
                                <Container header={<Header variant="h2">Ícono y color</Header>}>
                                    <SpaceBetween size="m">
                                        <FormField label="Ícono emoji">
                                            <Select
                                                selectedOption={iconOptions.find((o) => o.value === data.icon) || null}
                                                onChange={({ detail }) => setData('icon', detail.selectedOption.value)}
                                                options={iconOptions}
                                            />
                                        </FormField>
                                        <FormField label="Color">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <input
                                                    type="color"
                                                    value={data.color}
                                                    onChange={(e) => setData('color', e.target.value)}
                                                    style={{ width: 44, height: 36, border: 'none', cursor: 'pointer', borderRadius: 4 }}
                                                />
                                                <div style={{ flex: 1 }}>
                                                    <Input
                                                        value={data.color}
                                                        onChange={({ detail }) => setData('color', detail.value)}
                                                        placeholder="#0972d3"
                                                    />
                                                </div>
                                            </div>
                                        </FormField>
                                    </SpaceBetween>
                                </Container>
                            )}

                            {/* Color accent (only when image exists) */}
                            {hasImage && (
                                <Container header={<Header variant="h2">Color de acento</Header>}>
                                    <FormField label="Color">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <input
                                                type="color"
                                                value={data.color}
                                                onChange={(e) => setData('color', e.target.value)}
                                                style={{ width: 44, height: 36, border: 'none', cursor: 'pointer', borderRadius: 4 }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <Input
                                                    value={data.color}
                                                    onChange={({ detail }) => setData('color', detail.value)}
                                                    placeholder="#0972d3"
                                                />
                                            </div>
                                        </div>
                                    </FormField>
                                </Container>
                            )}
                        </SpaceBetween>
                    </div>

                    {/* Main form */}
                    <div className="edit-page-layout__main">
                        <form onSubmit={handleSubmit}>
                            <SpaceBetween size="l">
                                {/* Basic info */}
                                <Container header={<Header variant="h2">Información básica</Header>}>
                                    <SpaceBetween size="m">
                                        <FormField label="Nombre" errorText={errors.name}>
                                            <Input
                                                value={data.name}
                                                onChange={({ detail }) => setData('name', detail.value)}
                                                placeholder="Ej: Asistente estrella"
                                            />
                                        </FormField>

                                        <FormField label="Descripción" errorText={errors.description}>
                                            <Textarea
                                                value={data.description}
                                                onChange={({ detail }) => setData('description', detail.value)}
                                                placeholder="¿Qué logro representa esta insignia?"
                                                rows={3}
                                            />
                                        </FormField>

                                        <FormField
                                            label="Skills / Competencias"
                                            description="Presiona Enter o el botón + para agregar cada skill."
                                            errorText={errors.skills}
                                        >
                                            <SpaceBetween size="xs">
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <div style={{ flex: 1 }}>
                                                        <Input
                                                            value={skillInput}
                                                            onChange={({ detail }) => setSkillInput(detail.value)}
                                                            placeholder="Ej: Cloud Computing..."
                                                            onKeyDown={({ detail }) => {
                                                                if (detail.key === 'Enter') {
                                                                    detail.preventDefault?.();
                                                                    addSkill();
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <Button formAction="none" onClick={addSkill} iconName="add-plus" />
                                                </div>
                                                {skillList.length > 0 && (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 6 }}>
                                                        {skillList.map((skill, i) => (
                                                            <span key={i} style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: 4,
                                                                background: '#f0f2f5',
                                                                color: '#414d5c',
                                                                border: '1px solid #d1d5db',
                                                                borderRadius: 6,
                                                                padding: '5px 8px 5px 10px',
                                                                fontSize: 13,
                                                                fontWeight: 500,
                                                                lineHeight: 1,
                                                            }}>
                                                                {skill}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeSkill(i)}
                                                                    aria-label={`Quitar ${skill}`}
                                                                    style={{
                                                                        background: 'none',
                                                                        border: 'none',
                                                                        cursor: 'pointer',
                                                                        padding: '0 2px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        color: '#687078',
                                                                        fontSize: 16,
                                                                        lineHeight: 1,
                                                                        borderRadius: 3,
                                                                    }}
                                                                >
                                                                    ×
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </SpaceBetween>
                                        </FormField>
                                    </SpaceBetween>
                                </Container>

                                {/* Type & rule */}
                                <Container header={<Header variant="h2">Tipo y regla</Header>}>
                                    <SpaceBetween size="m">
                                        <ColumnLayout columns={2}>
                                            <FormField label="Tipo de insignia">
                                                <Select
                                                    selectedOption={typeOptions.find((o) => o.value === data.type) || null}
                                                    onChange={({ detail }) => setData('type', detail.selectedOption.value)}
                                                    options={typeOptions}
                                                />
                                            </FormField>

                                            <FormField
                                                label="Fecha de expiración (opcional)"
                                                errorText={errors.valid_until}
                                            >
                                                <DatePicker
                                                    value={data.valid_until}
                                                    onChange={({ detail }) => setData('valid_until', detail.value)}
                                                    placeholder="Sin expiración"
                                                />
                                            </FormField>
                                        </ColumnLayout>

                                        <FormField label="Estado">
                                            <Toggle
                                                checked={data.is_active}
                                                onChange={({ detail }) => setData('is_active', detail.checked)}
                                            >
                                                {data.is_active ? 'Activa' : 'Inactiva'}
                                            </Toggle>
                                        </FormField>

                                        {data.type === 'automatic' && (
                                            <Container variant="stacked" header={<Header variant="h3">Regla automática</Header>}>
                                                <SpaceBetween size="m">
                                                    <FormField label="Tipo de regla" errorText={errors['auto_rule.type']}>
                                                        <Select
                                                            selectedOption={autoRuleOptions.find((o) => o.value === data.auto_rule.type) || null}
                                                            onChange={({ detail }) =>
                                                                setData('auto_rule', { ...data.auto_rule, type: detail.selectedOption.value })
                                                            }
                                                            options={autoRuleOptions}
                                                        />
                                                    </FormField>

                                                    {data.auto_rule.type === 'session_attendance' && (
                                                        <FormField label="Sesiones mínimas" errorText={errors['auto_rule.min_sessions']}>
                                                            <Input
                                                                type="number"
                                                                value={String(data.auto_rule.min_sessions)}
                                                                onChange={({ detail }) =>
                                                                    setData('auto_rule', { ...data.auto_rule, min_sessions: parseInt(detail.value) || 1 })
                                                                }
                                                            />
                                                        </FormField>
                                                    )}

                                                    {data.auto_rule.type === 'survey_completion' && (
                                                        <FormField label="Encuestas mínimas" errorText={errors['auto_rule.min_surveys']}>
                                                            <Input
                                                                type="number"
                                                                value={String(data.auto_rule.min_surveys || 1)}
                                                                onChange={({ detail }) =>
                                                                    setData('auto_rule', { ...data.auto_rule, min_surveys: parseInt(detail.value) || 1 })
                                                                }
                                                            />
                                                        </FormField>
                                                    )}
                                                </SpaceBetween>
                                            </Container>
                                        )}
                                    </SpaceBetween>
                                </Container>

                                {/* Awarded participants */}
                                <Container
                    header={
                        <Header
                            variant="h2"
                            counter={`(${awardedParticipants.length})`}
                            actions={
                                badge.type === 'manual' && (
                                    <Button iconName="add-plus" onClick={openAwardPanel}>
                                        Asignar insignia
                                    </Button>
                                )
                            }
                        >
                            Participantes con esta insignia
                        </Header>
                    }
                >
                    <SpaceBetween size="m">
                        {/* Award panel */}
                        {showAward && (
                            <Container variant="stacked">
                                <SpaceBetween size="m">
                                    <FormField label="Seleccionar participantes">
                                        <Multiselect
                                            selectedOptions={selectedParticipants}
                                            onChange={({ detail }) => setSelectedParticipants(detail.selectedOptions)}
                                            options={availableParticipants.map((p) => ({
                                                value: p.id,
                                                label: p.full_name,
                                                description: `${p.email}${p.company ? ` - ${p.company}` : ''}`,
                                            }))}
                                            placeholder="Buscar participantes..."
                                            filteringType="auto"
                                            loading={loadingParticipants}
                                            loadingText="Cargando participantes..."
                                        />
                                    </FormField>
                                    <FormField label="Notas (opcional)">
                                        <Input
                                            value={awardNotes}
                                            onChange={({ detail }) => setAwardNotes(detail.value)}
                                            placeholder="Nota sobre la asignación..."
                                        />
                                    </FormField>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        <Button variant="link" onClick={() => setShowAward(false)}>
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="primary"
                                            disabled={selectedParticipants.length === 0}
                                            onClick={handleAward}
                                        >
                                            Asignar a {selectedParticipants.length} participante(s)
                                        </Button>
                                    </div>
                                </SpaceBetween>
                            </Container>
                        )}

                        {/* Mobile cards */}
                        <div className="plist plist--mobile">
                            {awardedParticipants.length === 0 ? (
                                <Box textAlign="center" padding={{ vertical: 'l' }} color="text-body-secondary">
                                    Ningún participante tiene esta insignia aún.
                                </Box>
                            ) : (
                                awardedParticipants.map((item) => (
                                    <div key={item.id} className="plist-card">
                                        <div className="plist-card__top">
                                            <div className="plist-card__info">
                                                <div className="plist-card__name">{item.full_name}</div>
                                                <div className="plist-card__email">{item.email}</div>
                                                {item.company && (
                                                    <div className="plist-card__meta">{item.company}</div>
                                                )}
                                                {item.awarded_at && (
                                                    <div className="plist-card__meta">
                                                        {new Date(item.awarded_at).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="plist-card__actions">
                                            <Button variant="normal" iconName="remove" onClick={() => setRevokeTarget(item)}>
                                                Revocar
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Desktop table */}
                        <div className="plist--desktop">
                            <Table
                                columnDefinitions={[
                                    { id: 'name', header: 'Participante', cell: (item) => item.full_name },
                                    { id: 'email', header: 'Email', cell: (item) => item.email },
                                    { id: 'company', header: 'Empresa', cell: (item) => item.company || '-' },
                                    {
                                        id: 'awarded_at',
                                        header: 'Fecha',
                                        cell: (item) => item.awarded_at
                                            ? new Date(item.awarded_at).toLocaleDateString('es-EC')
                                            : '-',
                                    },
                                    {
                                        id: 'actions',
                                        header: 'Acciones',
                                        cell: (item) => (
                                            <Button variant="inline-link" onClick={() => setRevokeTarget(item)}>
                                                Revocar
                                            </Button>
                                        ),
                                    },
                                ]}
                                items={awardedParticipants}
                                empty={
                                    <Box textAlign="center" padding="l" color="text-body-secondary">
                                        Ningún participante tiene esta insignia aún.
                                    </Box>
                                }
                            />
                        </div>
                    </SpaceBetween>
                                </Container>

                                {/* Buttons at bottom */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
                                    <Button variant="link" onClick={() => router.visit(`/events/${event.id}/badges`)}>
                                        Volver
                                    </Button>
                                    <Button variant="primary" formAction="submit" loading={processing}>
                                        Guardar cambios
                                    </Button>
                                </div>
                            </SpaceBetween>
                        </form>
                    </div>
                </div>
            </SpaceBetween>

            <ConfirmModal
                visible={!!revokeTarget}
                title="Revocar insignia"
                message={`¿Revocar la insignia "${badge.name}" de ${revokeTarget?.full_name}?`}
                confirmText="Revocar"
                danger
                onConfirm={handleRevoke}
                onCancel={() => setRevokeTarget(null)}
            />
        </EventLayout>
    );
}
