import { Head, Link, useForm } from '@inertiajs/react';
import TopNavigation from '@cloudscape-design/components/top-navigation';
import Container from '@cloudscape-design/components/container';
import Form from '@cloudscape-design/components/form';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ColumnLayout from '@cloudscape-design/components/column-layout';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    }

    return (
        <>
            <Head title="Crear cuenta" />
            <div className="auth-shell">

                <TopNavigation
                    identity={{ href: '/', title: 'BuilderApp' }}
                    utilities={[]}
                />

                <div className="auth-content">
                    <div className="auth-card">

                        <div className="auth-card__heading">
                            <h1 className="auth-card__title">Crear cuenta</h1>
                            <p className="auth-card__sub">Registrate gratis, sin tarjeta de credito</p>
                        </div>

                        <Container>
                            <form onSubmit={submit}>
                                <Form
                                    actions={
                                        <Button variant="primary" formAction="submit" fullWidth loading={processing}>
                                            Crear cuenta
                                        </Button>
                                    }
                                >
                                    <SpaceBetween size="m">

                                        <ColumnLayout columns={2} variant="default">
                                            <FormField label="Nombre" errorText={errors.first_name}>
                                                <Input
                                                    value={data.first_name}
                                                    onChange={({ detail }) => setData('first_name', detail.value)}
                                                    placeholder="Juan"
                                                    autoFocus
                                                />
                                            </FormField>
                                            <FormField label="Apellido" errorText={errors.last_name}>
                                                <Input
                                                    value={data.last_name}
                                                    onChange={({ detail }) => setData('last_name', detail.value)}
                                                    placeholder="Perez"
                                                />
                                            </FormField>
                                        </ColumnLayout>

                                        <FormField label="Correo electronico" errorText={errors.email}>
                                            <Input
                                                type="email"
                                                value={data.email}
                                                onChange={({ detail }) => setData('email', detail.value)}
                                                placeholder="tu@email.com"
                                            />
                                        </FormField>

                                        <FormField
                                            label="Contrasena"
                                            errorText={errors.password}
                                            constraintText="Minimo 8 caracteres"
                                        >
                                            <Input
                                                type="password"
                                                value={data.password}
                                                onChange={({ detail }) => setData('password', detail.value)}
                                                placeholder="Minimo 8 caracteres"
                                            />
                                        </FormField>

                                        <FormField label="Confirmar contrasena" errorText={errors.password_confirmation}>
                                            <Input
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={({ detail }) => setData('password_confirmation', detail.value)}
                                                placeholder="Repite tu contrasena"
                                            />
                                        </FormField>

                                    </SpaceBetween>
                                </Form>
                            </form>
                        </Container>

                        <div className="auth-card__footer">
                            <div className="auth-card__footer-row">
                                ¿Ya tienes cuenta?{' '}
                                <Link href="/login">Iniciar sesion</Link>
                            </div>
                            <div className="auth-card__sep" />
                            <div className="auth-card__footer-row">
                                ¿Quieres organizar eventos?{' '}
                                <a href="/organizer/register">Registrar organizacion</a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
