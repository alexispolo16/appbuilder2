import { Head, Link, useForm, usePage } from '@inertiajs/react';
import TopNavigation from '@cloudscape-design/components/top-navigation';
import Container from '@cloudscape-design/components/container';
import Form from '@cloudscape-design/components/form';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Alert from '@cloudscape-design/components/alert';

export default function ForgotPassword() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/forgot-password');
    }

    return (
        <>
            <Head title="Recuperar contrasena" />
            <div className="auth-shell">
                <TopNavigation
                    identity={{ href: '/', title: 'BuilderApp' }}
                    utilities={[]}
                />

                <div className="auth-content">
                    <div className="auth-card">
                        <div className="auth-card__heading">
                            <h1 className="auth-card__title">Recuperar contrasena</h1>
                            <p className="auth-card__sub">
                                Ingresa tu correo electronico y te enviaremos un enlace para restablecer tu contrasena.
                            </p>
                        </div>

                        {flash?.success && (
                            <Alert type="success">
                                {flash.success}
                            </Alert>
                        )}

                        <Container>
                            <form onSubmit={submit}>
                                <Form
                                    actions={
                                        <Button variant="primary" formAction="submit" fullWidth loading={processing}>
                                            Enviar enlace de recuperacion
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
