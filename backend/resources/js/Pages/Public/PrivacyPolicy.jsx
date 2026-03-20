import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import '@/styles/static-page.css';

export default function PrivacyPolicy() {
    return (
        <PublicLayout>
            <Head title="Politica de Privacidad" />

            <div className="static-page">
                <div className="static-page__inner">
                    <h1 className="static-page__title">Politica de Privacidad</h1>
                    <p className="static-page__date">Ultima actualizacion: Marzo 2026</p>

                    <div className="static-page__content">
                        <h2>1. Responsable del tratamiento</h2>
                        <p>
                            BuilderApp (en adelante, "la Plataforma") es una plataforma de
                            gestion de eventos tecnologicos operada desde la Republica del
                            Ecuador. El responsable del tratamiento de los datos personales
                            es el equipo administrador de BuilderApp.
                        </p>

                        <h2>2. Informacion que recopilamos</h2>
                        <p>
                            Recopilamos diferentes categorias de datos personales dependiendo
                            de tu interaccion con la Plataforma:
                        </p>
                        <h3>2.1. Datos de registro de cuenta</h3>
                        <ul>
                            <li>Nombre completo y apellido</li>
                            <li>Direccion de correo electronico</li>
                            <li>Contrasena (almacenada de forma cifrada)</li>
                            <li>Tipo de usuario (asistente, organizador, speaker, sponsor)</li>
                        </ul>
                        <h3>2.2. Datos de perfil profesional</h3>
                        <ul>
                            <li>Nombre de la empresa u organizacion</li>
                            <li>Cargo o titulo profesional</li>
                            <li>Numero de telefono (cuando es proporcionado voluntariamente)</li>
                            <li>Foto de perfil (cuando es proporcionada voluntariamente)</li>
                            <li>Enlaces a redes sociales y sitio web personal</li>
                        </ul>
                        <h3>2.3. Datos de participacion en eventos</h3>
                        <ul>
                            <li>Historial de inscripciones y asistencia a eventos</li>
                            <li>Respuestas a formularios personalizados de registro</li>
                            <li>Preferencias alimentarias o de accesibilidad (cuando aplique)</li>
                            <li>Respuestas a encuestas post-evento</li>
                            <li>Datos de networking (PIN de conexion, contactos guardados)</li>
                        </ul>
                        <h3>2.4. Datos recopilados automaticamente</h3>
                        <ul>
                            <li>Direccion IP y datos de navegador (User-Agent)</li>
                            <li>Cookies de sesion necesarias para el funcionamiento de la Plataforma</li>
                            <li>Registros de acceso (logs) con fines de seguridad</li>
                        </ul>

                        <h2>3. Base legal para el tratamiento</h2>
                        <p>El tratamiento de tus datos personales se fundamenta en:</p>
                        <ul>
                            <li>
                                <strong>Consentimiento:</strong> Al registrarte en la Plataforma
                                o inscribirte en un evento, otorgas tu consentimiento expreso
                                para el tratamiento de tus datos conforme a esta politica.
                            </li>
                            <li>
                                <strong>Ejecucion contractual:</strong> El tratamiento es necesario
                                para prestarte los servicios de la Plataforma (gestion de cuenta,
                                inscripcion a eventos, emision de badges y certificados).
                            </li>
                            <li>
                                <strong>Interes legitimo:</strong> Para mejorar la seguridad de la
                                Plataforma, prevenir fraudes y mejorar la experiencia del usuario.
                            </li>
                        </ul>

                        <h2>4. Finalidad del tratamiento</h2>
                        <p>Utilizamos tus datos personales para los siguientes fines:</p>
                        <ul>
                            <li>Crear y gestionar tu cuenta de usuario</li>
                            <li>Procesar tu inscripcion y participacion en eventos</li>
                            <li>Enviar confirmaciones, recordatorios y actualizaciones de eventos por correo electronico</li>
                            <li>Generar badges digitales y certificados de asistencia</li>
                            <li>Facilitar funcionalidades de networking entre participantes</li>
                            <li>Permitir a los organizadores gestionar sus eventos y asistentes</li>
                            <li>Realizar estadisticas anonimizadas sobre el uso de la Plataforma</li>
                            <li>Garantizar la seguridad y el correcto funcionamiento del servicio</li>
                            <li>Cumplir con obligaciones legales aplicables</li>
                        </ul>

                        <h2>5. Comparticion de datos con terceros</h2>
                        <h3>5.1. Organizadores de eventos</h3>
                        <p>
                            Cuando te inscribes en un evento, tus datos de registro (nombre,
                            correo electronico y respuestas al formulario de inscripcion) son
                            compartidos con el organizador del evento. El organizador es
                            responsable del uso que haga de dichos datos dentro del contexto
                            del evento.
                        </p>
                        <h3>5.2. Otros participantes</h3>
                        <p>
                            Si utilizas las funcionalidades de networking, tu nombre, cargo y
                            empresa pueden ser visibles para otros participantes del mismo
                            evento que hayan activado esta funcion. Puedes controlar la
                            visibilidad de tu perfil de networking en cualquier momento.
                        </p>
                        <h3>5.3. Proveedores de servicios</h3>
                        <p>
                            Podemos compartir datos con proveedores tecnologicos que nos
                            asisten en la operacion de la Plataforma, incluyendo:
                        </p>
                        <ul>
                            <li>Servicios de alojamiento en la nube (Amazon Web Services)</li>
                            <li>Servicios de envio de correo electronico transaccional</li>
                            <li>Servicios de almacenamiento de archivos</li>
                        </ul>
                        <p>
                            Estos proveedores estan obligados contractualmente a proteger tus
                            datos y a utilizarlos unicamente para los fines especificados.
                        </p>
                        <h3>5.4. Lo que NO hacemos</h3>
                        <ul>
                            <li>No vendemos tus datos personales a terceros</li>
                            <li>No compartimos tus datos con fines publicitarios de terceros</li>
                            <li>No utilizamos tus datos para elaborar perfiles comerciales</li>
                        </ul>

                        <h2>6. Transferencia internacional de datos</h2>
                        <p>
                            Tus datos pueden ser almacenados y procesados en servidores
                            ubicados fuera de Ecuador, particularmente en infraestructura de
                            Amazon Web Services. En estos casos, nos aseguramos de que existan
                            garantias adecuadas de proteccion conforme a la Ley Organica de
                            Proteccion de Datos Personales del Ecuador (LOPDP).
                        </p>

                        <h2>7. Seguridad de los datos</h2>
                        <p>
                            Implementamos medidas de seguridad tecnicas y organizativas
                            apropiadas para proteger tus datos personales, incluyendo:
                        </p>
                        <ul>
                            <li>Cifrado de contrasenas mediante algoritmos de hash seguros (bcrypt)</li>
                            <li>Comunicaciones cifradas mediante HTTPS/TLS</li>
                            <li>Control de acceso basado en roles y permisos</li>
                            <li>Copias de seguridad periodicas</li>
                            <li>Monitoreo de accesos y deteccion de actividades sospechosas</li>
                            <li>Aislamiento de datos entre organizaciones (multi-tenancy seguro)</li>
                        </ul>
                        <p>
                            A pesar de estas medidas, ningun sistema es completamente seguro.
                            En caso de una brecha de seguridad que afecte tus datos personales,
                            te notificaremos en un plazo razonable conforme a la legislacion
                            aplicable.
                        </p>

                        <h2>8. Conservacion de datos</h2>
                        <p>
                            Conservamos tus datos personales durante el tiempo que mantengas
                            una cuenta activa en la Plataforma y durante el periodo necesario
                            para cumplir con las finalidades descritas en esta politica.
                        </p>
                        <ul>
                            <li>
                                <strong>Datos de cuenta:</strong> Se conservan mientras la cuenta
                                este activa. Si solicitas la eliminacion, se procedera en un
                                plazo maximo de 30 dias.
                            </li>
                            <li>
                                <strong>Datos de eventos:</strong> Se conservan durante la
                                vigencia del evento y hasta 12 meses despues de su finalizacion
                                para fines estadisticos y de soporte.
                            </li>
                            <li>
                                <strong>Logs de seguridad:</strong> Se conservan por un periodo
                                maximo de 6 meses.
                            </li>
                        </ul>

                        <h2>9. Tus derechos (ARCO)</h2>
                        <p>
                            De conformidad con la Ley Organica de Proteccion de Datos
                            Personales del Ecuador y normativas aplicables, tienes los
                            siguientes derechos:
                        </p>
                        <ul>
                            <li>
                                <strong>Acceso:</strong> Solicitar informacion sobre los datos
                                personales que tenemos sobre ti y como los tratamos.
                            </li>
                            <li>
                                <strong>Rectificacion:</strong> Solicitar la correccion de datos
                                inexactos, incompletos o desactualizados.
                            </li>
                            <li>
                                <strong>Cancelacion/Eliminacion:</strong> Solicitar la eliminacion
                                de tus datos personales cuando ya no sean necesarios para las
                                finalidades para las que fueron recopilados.
                            </li>
                            <li>
                                <strong>Oposicion:</strong> Oponerte al tratamiento de tus datos
                                en determinadas circunstancias.
                            </li>
                            <li>
                                <strong>Portabilidad:</strong> Solicitar una copia de tus datos
                                en un formato estructurado y de uso comun.
                            </li>
                            <li>
                                <strong>Revocacion del consentimiento:</strong> Retirar tu
                                consentimiento en cualquier momento, sin que ello afecte la
                                licitud del tratamiento previo.
                            </li>
                        </ul>
                        <p>
                            Para ejercer cualquiera de estos derechos, puedes contactarnos
                            a traves de los canales indicados al final de esta politica.
                            Responderemos a tu solicitud en un plazo maximo de 15 dias
                            habiles.
                        </p>

                        <h2>10. Cookies y tecnologias similares</h2>
                        <p>
                            La Plataforma utiliza unicamente cookies estrictamente necesarias
                            para su funcionamiento:
                        </p>
                        <ul>
                            <li>
                                <strong>Cookie de sesion:</strong> Mantiene tu sesion activa
                                mientras navegas. Se elimina al cerrar sesion o al expirar.
                            </li>
                            <li>
                                <strong>Cookie CSRF:</strong> Protege contra ataques de
                                falsificacion de solicitudes (Cross-Site Request Forgery).
                            </li>
                        </ul>
                        <p>
                            No utilizamos cookies de seguimiento, cookies publicitarias ni
                            herramientas de analisis de terceros que rastreen tu actividad.
                        </p>

                        <h2>11. Proteccion de datos de menores</h2>
                        <p>
                            BuilderApp no esta dirigida a menores de 16 anos. No recopilamos
                            intencionalmente datos personales de menores de edad. Si
                            descubrimos que hemos recopilado datos de un menor sin el
                            consentimiento de su representante legal, procederemos a
                            eliminarlos de inmediato.
                        </p>

                        <h2>12. Modificaciones a esta politica</h2>
                        <p>
                            Nos reservamos el derecho de actualizar esta politica de
                            privacidad en cualquier momento. Cuando realicemos cambios
                            sustanciales, te notificaremos mediante un aviso visible en
                            la Plataforma o por correo electronico. La fecha de ultima
                            actualizacion al inicio de este documento indica cuando se
                            realizo la revision mas reciente.
                        </p>

                        <h2>13. Legislacion aplicable</h2>
                        <p>
                            Esta politica de privacidad se rige por la Ley Organica de
                            Proteccion de Datos Personales del Ecuador (LOPDP), su
                            reglamento de aplicacion, y demas normativa ecuatoriana
                            aplicable en materia de proteccion de datos personales y
                            comercio electronico.
                        </p>

                        <h2>14. Contacto</h2>
                        <p>
                            Si tienes preguntas, inquietudes o deseas ejercer tus derechos
                            en relacion con el tratamiento de tus datos personales, puedes
                            contactarnos a traves de:
                        </p>
                        <ul>
                            <li>Correo electronico: contacto@builderapp.ec</li>
                            <li>A traves del formulario de contacto disponible en la Plataforma</li>
                        </ul>
                        <p>
                            Si consideras que el tratamiento de tus datos no ha sido
                            atendido adecuadamente, tienes derecho a presentar una
                            reclamacion ante la Superintendencia de Proteccion de Datos
                            Personales del Ecuador.
                        </p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
