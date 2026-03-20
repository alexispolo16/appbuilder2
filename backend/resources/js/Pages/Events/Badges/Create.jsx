import { useRef, useState } from 'react';
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
import Box from '@cloudscape-design/components/box';
import DatePicker from '@cloudscape-design/components/date-picker';

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
    { value: 'manual', label: 'Manual', description: 'Asignas la insignia manualmente a cada participante' },
    { value: 'automatic', label: 'Automatica', description: 'Se asigna automaticamente al cumplir una regla' },
];

const autoRuleOptions = [
    { value: 'session_attendance', label: 'Asistencia a sesiones', description: 'Se otorga al asistir a un numero minimo de sesiones' },
    { value: 'event_checkin', label: 'Check-in al evento', description: 'Se otorga al hacer check-in en el evento' },
    { value: 'survey_completion', label: 'Completar encuestas', description: 'Se otorga al completar un numero minimo de encuestas' },
];

export default function BadgesCreate({ event }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        skills: '',
        icon: '🏆',
        image: null,
        color: '#0972d3',
        type: 'manual',
        auto_rule: { type: 'session_attendance', min_sessions: 1, min_surveys: 1 },
        valid_until: '',
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [skillInput, setSkillInput] = useState('');
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
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    }

    function removeImage() {
        setData('image', null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    function handleSubmit(e) {
        e.preventDefault();
        const payload = { ...data };
        if (payload.type === 'manual') payload.auto_rule = null;
        post(`/events/${event.id}/badges`, { data: payload, forceFormData: true });
    }

    const hasImage = !!imagePreview;

    return (
        <EventLayout event={event}>
            <Head title={`Nueva Insignia - ${event.name}`} />

            <SpaceBetween size="l">
                <Header variant="h1">Nueva insignia</Header>

                <div className="edit-page-layout">
                    {/* Sidebar — preview + imagen + icono/color */}
                    <div className="edit-page-layout__sidebar">
                        <SpaceBetween size="l">
                            {/* Live preview */}
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
                                        <FormField label="Ícono emoji" errorText={errors.icon}>
                                            <Select
                                                selectedOption={iconOptions.find((o) => o.value === data.icon) || null}
                                                onChange={({ detail }) => setData('icon', detail.selectedOption.value)}
                                                options={iconOptions}
                                            />
                                        </FormField>
                                        <FormField label="Color" errorText={errors.color}>
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
                                    <FormField label="Color" errorText={errors.color}>
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
                                                placeholder="Ej: AWS Cloud Practitioner"
                                            />
                                        </FormField>

                                        <FormField label="Descripción" errorText={errors.description}>
                                            <Textarea
                                                value={data.description}
                                                onChange={({ detail }) => setData('description', detail.value)}
                                                placeholder="Describe los criterios o logro que representa esta insignia..."
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
                                                            placeholder="Ej: Cloud Computing, Networking..."
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
                                            <FormField label="Tipo de insignia" errorText={errors.type}>
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
                                                    isDateEnabled={(date) => new Date(date.year, date.month - 1, date.day) > new Date()}
                                                />
                                            </FormField>
                                        </ColumnLayout>

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
                                                        <FormField
                                                            label="Sesiones mínimas"
                                                            description="Cantidad mínima de sesiones a las que debe asistir el participante."
                                                            errorText={errors['auto_rule.min_sessions']}
                                                        >
                                                            <Input
                                                                type="number"
                                                                value={String(data.auto_rule.min_sessions)}
                                                                onChange={({ detail }) =>
                                                                    setData('auto_rule', {
                                                                        ...data.auto_rule,
                                                                        min_sessions: parseInt(detail.value) || 1,
                                                                    })
                                                                }
                                                            />
                                                        </FormField>
                                                    )}

                                                    {data.auto_rule.type === 'survey_completion' && (
                                                        <FormField
                                                            label="Encuestas mínimas"
                                                            description="Cantidad mínima de encuestas que debe completar el participante."
                                                            errorText={errors['auto_rule.min_surveys']}
                                                        >
                                                            <Input
                                                                type="number"
                                                                value={String(data.auto_rule.min_surveys)}
                                                                onChange={({ detail }) =>
                                                                    setData('auto_rule', {
                                                                        ...data.auto_rule,
                                                                        min_surveys: parseInt(detail.value) || 1,
                                                                    })
                                                                }
                                                            />
                                                        </FormField>
                                                    )}
                                                </SpaceBetween>
                                            </Container>
                                        )}
                                    </SpaceBetween>
                                </Container>

                                {/* Buttons at bottom */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
                                    <Button variant="link" onClick={() => router.visit(`/events/${event.id}/badges`)}>
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" formAction="submit" loading={processing}>
                                        Crear insignia
                                    </Button>
                                </div>
                            </SpaceBetween>
                        </form>
                    </div>
                </div>
            </SpaceBetween>
        </EventLayout>
    );
}
