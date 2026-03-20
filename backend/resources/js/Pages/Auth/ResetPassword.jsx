import { Head, Link, useForm } from '@inertiajs/react';
import TopNavigation from '@cloudscape-design/components/top-navigation';
import Container from '@cloudscape-design/components/container';
import Form from '@cloudscape-design/components/form';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/reset-password', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    }

    return (
        <>
            <Head title="Restablecer contrasena" />
            <div className="auth-shell">
                <TopNavigation
                    identity={{ href: '/', title: 'BuilderApp' }}
                    utilities={[]}
                />

                <div className="auth-content">
                    <div className="auth-card">
                        <div className="auth-card__heading">
                            <h1 className="auth-card__title">Restablecer contrasena</h1>
                            <p className="auth-card__sub">Ingresa tu nueva contrasena</p>
                        </div>

                        <Container>
                            <form onSubmit={submit}>
                                <Form
                                    actions={
                                        <Button variant="primary" formAction="submit" fullWidth loading={processing}>
                                            Restablecer contrasena
                                        </Button>
                                    }
                                >
                                    <SpaceBetween size="m">
                                        <FormField label="Correo electronico" errorText={errors.email}>
                                            <Input
                                                type="email"
                                                value={data.email}
                                                onChange={({ detail }) => setData('email', detail.value)}
                                            />
                                        </FormField>

                                        <FormField label="Nueva contrasena" errorText={errors.password}>
                                            <Input
                                                type="password"
                                                value={data.password}
                                                onChange={({ detail }) => setData('password', detail.value)}
                                                placeholder="Minimo 8 caracteres"
                                                autoFocus
                                            />
                                        </FormField>

                                        <FormField label="Confirmar contrasena" errorText={errors.password_confirmation}>
                                            <Input
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={({ detail }) => setData('password_confirmation', detail.value)}
                                                placeholder="Repite tu nueva contrasena"
                                            />
                                        </FormField>
                                    </SpaceBetween>
                                </Form>
                            </form>
                        </Container>

                        <div className="auth-card__footer">
                            <div className="auth-card__footer-row">
                                <Link href="/login">Volver a iniciar sesion</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
