import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import '@/styles/static-page.css';

export default function TermsConditions() {
    return (
        <PublicLayout>
            <Head title="Terminos y Condiciones" />

            <div className="static-page">
                <div className="static-page__inner">
                    <h1 className="static-page__title">Terminos y Condiciones</h1>
                    <p className="static-page__date">Ultima actualizacion: Marzo 2026</p>

                    <div className="static-page__content">
                        <h2>1. Aceptacion de los terminos</h2>
                        <p>
                            Al acceder, registrarte o utilizar BuilderApp (en adelante, "la
                            Plataforma"), aceptas estos Terminos y Condiciones en su
                            totalidad, asi como nuestra{' '}
                            <a href="/privacy">Politica de Privacidad</a>. Si no estas de
                            acuerdo con alguno de estos terminos, debes abstenerte de usar
                            la Plataforma.
                        </p>
                        <p>
                            El uso continuado de la Plataforma despues de la publicacion de
                            cambios en estos terminos constituye la aceptacion de dichos
                            cambios.
                        </p>

                        <h2>2. Definiciones</h2>
                        <ul>
                            <li>
                                <strong>Plataforma:</strong> El sitio web y aplicacion
                                BuilderApp, incluyendo todas sus funcionalidades y servicios.
                            </li>
                            <li>
                                <strong>Usuario:</strong> Toda persona que accede o utiliza la
                                Plataforma, independientemente de su rol.
                            </li>
                            <li>
                                <strong>Organizador:</strong> Usuario que crea, administra y
                                gestiona eventos a traves de la Plataforma.
                            </li>
                            <li>
                                <strong>Asistente/Participante:</strong> Usuario que se inscribe
                                o asiste a eventos publicados en la Plataforma.
                            </li>
                            <li>
                                <strong>Speaker:</strong> Usuario que participa como ponente
                                o expositor en un evento.
                            </li>
                            <li>
                                <strong>Contenido:</strong> Toda informacion, texto, imagen,
                                logo o material publicado en la Plataforma por cualquier
                                usuario.
                            </li>
                        </ul>

                        <h2>3. Descripcion del servicio</h2>
                        <p>
                            BuilderApp es una plataforma tecnologica para la creacion,
                            gestion y participacion en eventos, especialmente orientada a
                            comunidades tecnologicas. La Plataforma ofrece, entre otras,
                            las siguientes funcionalidades:
                        </p>
                        <ul>
                            <li>Creacion y publicacion de eventos con informacion detallada</li>
                            <li>Sistema de registro e inscripcion de asistentes</li>
                            <li>Gestion de agenda y sesiones</li>
                            <li>Emision de badges digitales y certificados de asistencia</li>
                            <li>Herramientas de networking entre participantes</li>
                            <li>Sistema de Call for Proposals (CFP) para speakers</li>
                            <li>Encuestas y retroalimentacion post-evento</li>
                            <li>Gestion de sponsors y comunidades asociadas</li>
                        </ul>

                        <h2>4. Registro de cuenta y responsabilidades del usuario</h2>
                        <h3>4.1. Creacion de cuenta</h3>
                        <p>
                            Para acceder a ciertas funcionalidades, deberas crear una cuenta
                            proporcionando informacion veraz, completa y actualizada. Te
                            comprometes a mantener dicha informacion actualizada en todo
                            momento.
                        </p>
                        <h3>4.2. Seguridad de la cuenta</h3>
                        <p>
                            Eres el unico responsable de mantener la confidencialidad de
                            tus credenciales de acceso (correo y contrasena). Cualquier
                            actividad realizada bajo tu cuenta sera considerada como
                            realizada por ti. Debes notificarnos inmediatamente si
                            sospechas de un uso no autorizado de tu cuenta.
                        </p>
                        <h3>4.3. Una cuenta por persona</h3>
                        <p>
                            Cada persona debe mantener una unica cuenta. Nos reservamos el
                            derecho de suspender o eliminar cuentas duplicadas.
                        </p>

                        <h2>5. Uso aceptable</h2>
                        <p>Al usar BuilderApp, te comprometes a:</p>
                        <ul>
                            <li>No utilizar la Plataforma para fines ilegales, fraudulentos o no autorizados</li>
                            <li>No intentar acceder a cuentas, datos o sistemas de otros usuarios</li>
                            <li>No publicar contenido falso, ofensivo, difamatorio, discriminatorio o inapropiado</li>
                            <li>No enviar spam, comunicaciones masivas no solicitadas o contenido publicitario no relacionado con los eventos</li>
                            <li>No interferir con el funcionamiento, seguridad o rendimiento de la Plataforma</li>
                            <li>No realizar ingenieria inversa, descompilar o intentar extraer el codigo fuente de la Plataforma</li>
                            <li>No utilizar bots, scrapers o herramientas automatizadas para acceder a la Plataforma sin autorizacion</li>
                            <li>No suplantar la identidad de otra persona u organizacion</li>
                        </ul>
                        <p>
                            El incumplimiento de estas normas puede resultar en la suspension
                            temporal o permanente de tu cuenta, sin previo aviso.
                        </p>

                        <h2>6. Responsabilidades de los organizadores</h2>
                        <p>Los organizadores de eventos se comprometen a:</p>
                        <ul>
                            <li>
                                Publicar informacion veraz y actualizada sobre sus eventos
                                (fecha, lugar, contenido, requisitos)
                            </li>
                            <li>
                                Cumplir con todos los compromisos adquiridos con los asistentes
                                inscritos en sus eventos
                            </li>
                            <li>
                                Notificar oportunamente cualquier cambio, cancelacion o
                                modificacion del evento a los asistentes registrados
                            </li>
                            <li>
                                Tratar los datos personales de los asistentes conforme a la
                                legislacion vigente y unicamente para los fines relacionados
                                con el evento
                            </li>
                            <li>
                                Cumplir con todas las leyes, regulaciones y permisos necesarios
                                para la realizacion del evento
                            </li>
                            <li>
                                No utilizar la Plataforma para promover actividades ilicitas o
                                que contravengan el orden publico
                            </li>
                        </ul>

                        <h2>7. Responsabilidades de los asistentes</h2>
                        <p>Los asistentes se comprometen a:</p>
                        <ul>
                            <li>Proporcionar datos veridicos al momento de registrarse en un evento</li>
                            <li>Cumplir con las reglas y requisitos establecidos por el organizador del evento</li>
                            <li>Comportarse de manera respetuosa con los demas participantes, speakers y organizadores</li>
                            <li>Notificar con antelacion si no pueden asistir a un evento en el que se inscribieron</li>
                        </ul>

                        <h2>8. Contenido del usuario</h2>
                        <h3>8.1. Responsabilidad sobre el contenido</h3>
                        <p>
                            Cada usuario es el unico responsable del contenido que publica
                            en la Plataforma, incluyendo descripciones de eventos, imagenes,
                            propuestas de charlas y perfiles. BuilderApp no revisa ni aprueba
                            previamente el contenido publicado por los usuarios.
                        </p>
                        <h3>8.2. Licencia sobre el contenido</h3>
                        <p>
                            Al publicar contenido en la Plataforma, otorgas a BuilderApp una
                            licencia no exclusiva, gratuita y mundial para usar, mostrar y
                            distribuir dicho contenido exclusivamente en el contexto de la
                            prestacion del servicio.
                        </p>
                        <h3>8.3. Contenido prohibido</h3>
                        <p>
                            Nos reservamos el derecho de eliminar, sin previo aviso, cualquier
                            contenido que viole estos terminos, sea ilegal, ofensivo o
                            inapropiado, o que infrinja derechos de terceros.
                        </p>

                        <h2>9. Propiedad intelectual</h2>
                        <p>
                            Todo el software, diseno, logotipos, textos, graficos y demas
                            elementos que componen la Plataforma son propiedad de BuilderApp
                            o de sus licenciantes, y estan protegidos por las leyes de
                            propiedad intelectual de la Republica del Ecuador y tratados
                            internacionales aplicables.
                        </p>
                        <p>
                            Queda expresamente prohibido copiar, reproducir, modificar,
                            distribuir o crear obras derivadas de cualquier elemento de la
                            Plataforma sin autorizacion previa y por escrito.
                        </p>

                        <h2>10. Limitacion de responsabilidad</h2>
                        <h3>10.1. Rol de intermediario</h3>
                        <p>
                            BuilderApp actua exclusivamente como intermediario tecnologico
                            que facilita la conexion entre organizadores y asistentes. La
                            Plataforma no organiza, patrocina ni ejecuta los eventos
                            publicados.
                        </p>
                        <h3>10.2. Exclusiones de responsabilidad</h3>
                        <p>BuilderApp no sera responsable por:</p>
                        <ul>
                            <li>La cancelacion, modificacion, calidad o seguridad de los eventos publicados</li>
                            <li>Danos o perjuicios derivados de la asistencia o participacion en eventos</li>
                            <li>La veracidad, exactitud o completitud de la informacion publicada por los organizadores</li>
                            <li>Interrupciones temporales del servicio por mantenimiento, actualizaciones o causas de fuerza mayor</li>
                            <li>Perdidas de datos causadas por eventos fuera de nuestro control razonable</li>
                            <li>Contenido publicado por usuarios que infrinja derechos de terceros</li>
                        </ul>
                        <h3>10.3. Disponibilidad del servicio</h3>
                        <p>
                            Nos esforzamos por mantener la Plataforma disponible de forma
                            continua, pero no garantizamos un funcionamiento ininterrumpido.
                            Podemos realizar mantenimientos programados que pueden afectar
                            temporalmente la disponibilidad del servicio.
                        </p>

                        <h2>11. Suspension y terminacion de cuentas</h2>
                        <p>
                            Nos reservamos el derecho de suspender o eliminar cuentas de
                            usuario que:
                        </p>
                        <ul>
                            <li>Violen estos Terminos y Condiciones</li>
                            <li>Utilicen la Plataforma de manera fraudulenta o abusiva</li>
                            <li>Publiquen contenido que infrinja derechos de terceros o sea ilegal</li>
                            <li>Permanezcan inactivas por un periodo superior a 24 meses</li>
                        </ul>
                        <p>
                            En caso de suspension, se notificara al usuario a traves del
                            correo electronico registrado, indicando los motivos de la
                            decision.
                        </p>

                        <h2>12. Gratuidad del servicio</h2>
                        <p>
                            Actualmente, el uso de BuilderApp es gratuito tanto para
                            organizadores como para asistentes. Nos reservamos el derecho
                            de introducir funcionalidades de pago en el futuro, las cuales
                            seran debidamente informadas antes de su activacion.
                        </p>

                        <h2>13. Indemnizacion</h2>
                        <p>
                            Aceptas indemnizar y mantener indemne a BuilderApp, su equipo y
                            colaboradores frente a cualquier reclamacion, dano, perdida o
                            gasto (incluyendo honorarios legales) derivado de tu uso de la
                            Plataforma, la violacion de estos terminos, o la infraccion de
                            derechos de terceros.
                        </p>

                        <h2>14. Modificaciones a los terminos</h2>
                        <p>
                            Nos reservamos el derecho de modificar estos Terminos y
                            Condiciones en cualquier momento. Los cambios seran publicados
                            en esta pagina con la fecha de actualizacion correspondiente.
                            Cuando los cambios sean sustanciales, notificaremos a los
                            usuarios registrados por correo electronico.
                        </p>
                        <p>
                            El uso continuado de la Plataforma despues de la publicacion
                            de los cambios implica la aceptacion de los nuevos terminos.
                        </p>

                        <h2>15. Legislacion aplicable y jurisdiccion</h2>
                        <p>
                            Estos Terminos y Condiciones se rigen por las leyes de la
                            Republica del Ecuador. Para la resolucion de cualquier
                            controversia derivada del uso de la Plataforma, las partes
                            se someten a la jurisdiccion de los tribunales competentes de
                            la ciudad de Guayaquil, Ecuador, renunciando expresamente a
                            cualquier otro fuero que pudiera corresponderles.
                        </p>

                        <h2>16. Divisibilidad</h2>
                        <p>
                            Si alguna disposicion de estos Terminos y Condiciones fuera
                            declarada nula o inaplicable, las demas disposiciones
                            mantendran su plena vigencia y efecto.
                        </p>

                        <h2>17. Contacto</h2>
                        <p>
                            Para cualquier consulta, reclamacion o solicitud relacionada
                            con estos Terminos y Condiciones, puedes contactarnos a traves
                            de:
                        </p>
                        <ul>
                            <li>Correo electronico: contacto@builderapp.ec</li>
                            <li>A traves del formulario de contacto disponible en la Plataforma</li>
                        </ul>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
