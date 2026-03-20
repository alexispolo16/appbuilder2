import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import TopNavigation from '@cloudscape-design/components/top-navigation';
import Container from '@cloudscape-design/components/container';
import Form from '@cloudscape-design/components/form';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Button from '@cloudscape-design/components/button';
import Checkbox from '@cloudscape-design/components/checkbox';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Alert from '@cloudscape-design/components/alert';

export default function Login() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(e) {
        e.preventDefault();
        post('/login', { onFinish: () => reset('password') });
    }

    return (
        <>
            <Head title="Iniciar sesion" />
            <div className="auth-shell">

                <TopNavigation
                    identity={{ href: '/', title: 'BuilderApp' }}
                    utilities={[]}
                />

                <div className="auth-content">
                    <div className="auth-card">

                        <div className="auth-card__heading">
                            <h1 className="auth-card__title">Iniciar sesion</h1>
                            <p className="auth-card__sub">Ingresa tus credenciales para continuar</p>
                        </div>

                        {flash?.success && (
                            <Alert type="success">
                                {flash.success}
                            </Alert>
                        )}
                        {flash?.error && (
                            <Alert type="error" header="Credenciales incorrectas">
                                {flash.error}
                            </Alert>
                        )}

                        <Container>
                            <form onSubmit={submit}>
                                <Form
                                    actions={
                                        <Button variant="primary" formAction="submit" fullWidth loading={processing}>
                                            Iniciar sesion
                                        </Button>
                                    }
                                >
                                    <SpaceBetween size="m">
                                        <FormField label="Correo electronico" errorText={errors.email}>
                                            <Input
                                                type="email"
                                                value={data.email}
                                                onChange={({ detail }) => setData('email', detail.value)}
                                                placeholder="tu@email.com"
                                                autoFocus
                                            />
                                        </FormField>

                                        <FormField label="Contrasena" errorText={errors.password}>
                                            <Input
                                                type="password"
                                                value={data.password}
                                                onChange={({ detail }) => setData('password', detail.value)}
                                                placeholder="Tu contrasena"
                                            />
                                        </FormField>

                                        <div className="auth-row">
                                            <Checkbox
                                                checked={data.remember}
                                                onChange={({ detail }) => setData('remember', detail.checked)}
                                            >
                                                Recordarme
                                            </Checkbox>
                                            <a href="/forgot-password" className="auth-forgot">
                                                ¿Olvidaste tu contrasena?
                                            </a>
                                        </div>
                                    </SpaceBetween>
                                </Form>
                            </form>
                        </Container>

                        <div className="auth-card__footer">
                            <div className="auth-card__footer-row">
                                ¿No tienes cuenta?{' '}
                                <Link href="/register">Crear cuenta gratis</Link>
                            </div>
                            <div className="auth-card__sep" />
                            <div className="auth-card__footer-row">
                                ¿Eres organizador?{' '}
                                <a href="/organizer/login">Acceso organizadores</a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
