# BuilderApp - Plataforma SaaS de Gestion de Eventos

## Documento Ejecutivo para CEO

---

## Vision General

**BuilderApp** es una plataforma SaaS multi-tenant de gestion integral de eventos que permite a organizaciones crear, administrar y monetizar eventos de cualquier escala. Desde conferencias tecnologicas hasta congresos empresariales, la plataforma cubre todo el ciclo de vida del evento: creacion, registro, check-in, networking, comunicaciones y reportes.

**Stack tecnologico:** Laravel 12, React 18, Cloudscape Design System (AWS), PostgreSQL, S3, FrankenPHP.

---

## Arquitectura de Usuarios

La plataforma maneja **6 roles** con permisos granulares:

| Rol | Descripcion | Acceso |
|-----|-------------|--------|
| **Super Admin** | Administrador de la plataforma | Panel de administracion completo |
| **Org Admin** | Administrador de organizacion | Dashboard de organizacion + gestion de eventos |
| **Colaborador** | Miembro del equipo organizador | Gestion limitada de eventos y check-in |
| **Participante** | Asistente registrado | Portal del asistente |
| **Speaker** | Ponente del evento | Acceso a informacion de su ponencia |
| **Sponsor** | Patrocinador | Acceso a informacion de patrocinio |

---

## 1. Pagina Publica y Landing

### 1.1 Pagina Principal
- Listado de eventos publicados con busqueda por nombre y ubicacion
- Paginacion automatica (12 eventos por pagina)
- Tarjetas de eventos con imagen de portada, fechas, ubicacion y capacidad
- Acceso directo a registro y detalles del evento
- Call-to-action para organizadores: "Crea tu evento"

### 1.2 Pagina Publica del Evento
Cada evento publicado tiene su propia pagina publica con URL amigable (`/e/nombre-del-evento`):

- **Informacion general**: Nombre, descripcion, fechas, ubicacion, venue, capacidad disponible
- **Speakers**: Perfiles con foto, bio, cargo, empresa y redes sociales
- **Sponsors**: Logotipos organizados por niveles de patrocinio (Oro, Plata, Bronce)
- **Agenda completa**: Horarios, sesiones, ponentes asignados
- **Comunidades**: Logos y enlaces a organizaciones asociadas
- **Boton de registro** con indicador de capacidad disponible

### 1.3 Flujo de Registro Publico
1. Formulario: nombre, apellido, email, telefono, empresa, cargo, pais, ciudad
2. Validacion de capacidad (auto-lista de espera si evento lleno)
3. Generacion automatica de:
   - **Codigo de registro** (8 caracteres alfanumericos)
   - **PIN de networking** (6 caracteres alfanumericos)
   - **Cuenta de usuario** con credenciales enviadas por email
4. Pagina de confirmacion con pasos a seguir
5. Si hay lista de espera: pagina con posicion en la cola

### 1.4 Exportacion de Calendario
- Descarga de evento individual como archivo `.ics`
- Descarga de agenda completa como archivo `.ics`
- Compatible con Google Calendar, Outlook, Apple Calendar

---

## 2. Portal del Asistente

Acceso autenticado para participantes registrados en `/portal`.

### 2.1 Dashboard Principal
- Vista de todos los eventos registrados
- **Pestanas**: Eventos activos y eventos pasados
- Estado de registro por evento (Registrado, Confirmado, Asistio)
- Acceso rapido a entrada digital y networking
- Eventos pasados permiten acceder al historial de contactos

### 2.2 Entrada Digital (Ticket)
- **Codigo QR** generado dinamicamente con enlace al perfil de networking
- **Codigo de registro** visible con boton de copiar al portapapeles
- Informacion del evento: nombre, fecha, lugar
- Datos del asistente: nombre, email, empresa, cargo
- Estado del ticket y tipo (General, VIP, Estudiante)
- **Descargar entrada**: Genera imagen PNG de alta calidad con:
  - Gradiente de colores personalizados por el organizador
  - Codigo QR embebido
  - Logos de sponsors (si estan habilitados)
  - Datos del participante
- **Pantalla completa**: Modal con QR ampliado para escaneo rapido en la entrada

### 2.3 Agenda del Evento
- Programa completo organizado por dia
- Horarios de sesiones con duracion
- Speakers asignados a cada sesion
- Tipos de sesion: ponencia, break, comida

### 2.4 Speakers del Evento
- Perfiles completos de ponentes
- Foto, biografia, empresa, cargo
- Enlaces a redes sociales

### 2.5 Sponsors del Evento
- Patrocinadores organizados por nivel
- Logos, descripcion y sitio web
- Niveles configurables (Oro, Plata, Bronce, etc.)

### 2.6 Networking
- **Busqueda por PIN**: Ingresa el PIN de 6 caracteres de otro participante para encontrarlo
- **Conexion rapida**: Conectar con otro asistente usando su PIN
- **Guardar contacto**: Solicitud de conexion (similar a LinkedIn)
- **Perfil de networking**: Datos profesionales + redes sociales (LinkedIn, GitHub, Instagram, Web, WhatsApp)
- **Visibilidad**: Toggle para aparecer/no aparecer en el directorio publico
- **Escanear QR**: Camara integrada para leer el QR de otro participante

### 2.7 Directorio del Evento
- Lista de todos los participantes con visibilidad habilitada
- Busqueda por nombre, empresa o cargo
- Paginacion automatica
- Acceso al perfil de networking de cada participante

### 2.8 Mis Contactos
- Lista de conexiones guardadas por evento
- Estados de conexion: pendiente, aceptada, rechazada
- Solicitudes entrantes con acciones de aceptar/rechazar
- **Exportar CSV**: Descarga de contactos con nombre, email, empresa, cargo, redes sociales
- Historial de contactos persistente entre eventos

### 2.9 Encuestas
- Lista de encuestas asignadas al evento (pre-evento, post-evento)
- Indicador de estado: respondida o pendiente
- Enlace directo para responder encuestas
- Tipos de preguntas: texto libre, calificacion (1-5), opcion multiple, seleccion unica

### 2.10 Anuncios
- Comunicaciones enviadas por los organizadores
- Historial completo con fecha y hora de envio
- Asunto y cuerpo del mensaje

### 2.11 Mi Perfil
- **Datos personales**: Editar nombre, apellido, email
- **Cambiar contrasena**: Con verificacion de contrasena actual
- **Networking por evento**: Seccion expandible por cada evento con:
  - Crear/actualizar PIN de networking
  - Toggle de visibilidad en directorio
  - Escanear QR de otros participantes
  - Tabla de contactos guardados (nombre, empresa, cargo, email, redes)
  - Exportar contactos del evento

---

## 3. Dashboard del Organizador

Panel completo para la gestion de eventos de una organizacion.

### 3.1 Dashboard Principal
- **Estadisticas globales**: Eventos activos, borradores, completados, total
- **Metricas de participantes**: Total registrados, por estado, por tipo de ticket
- **Graficos interactivos**:
  - Eventos por mes
  - Distribucion de estados de participantes
  - Distribucion de estados de eventos
  - Top eventos por numero de asistentes
- Proximos eventos y eventos recientes

### 3.2 Configuracion de Organizacion
- Nombre, slug, email de contacto, telefono, sitio web
- Direccion completa
- Colores de marca (primario y secundario)
- Logo de la organizacion (subida a almacenamiento)

---

## 4. Gestion de Eventos

### 4.1 CRUD Completo de Eventos
- **Crear evento**: Nombre, descripcion, fechas, ubicacion, venue, coordenadas GPS, capacidad
- **Tipos de registro**: Abierto o solo por invitacion
- **Estados del evento**: Borrador → Publicado → Activo → Completado/Cancelado
- **Imagenes**: Portada del evento e imagen del evento (almacenamiento S3)
- **URL de vista previa**: Enlace temporal firmado para previsualizar antes de publicar
- **Slug automatico**: URL amigable generada desde el nombre

### 4.2 Disenador de Credenciales
Herramienta visual para personalizar la apariencia de las entradas digitales:

- **Gradiente de cabecera**: Dos colores personalizables
- **Texto de cabecera**: Configurable (ej: "ENTRADA DIGITAL", "VIP PASS")
- **Color de acento**: Para elementos destacados
- **Color de fondo y texto**: Primario y secundario
- **Elementos opcionales**:
  - Mostrar empresa del asistente
  - Mostrar cargo del asistente
  - Mostrar logos de sponsors
- **Vista previa en tiempo real**: Previsualizacion instantanea de cambios
- **Descarga de muestra**: Generar imagen de prueba
- **Restablecer valores**: Volver a configuracion por defecto

### 4.3 Gestion de Participantes
- **Registro manual**: Agregar participantes individualmente
- **Importacion masiva**: Subir archivo CSV con datos de participantes
- **Busqueda y filtros**: Por nombre, email, estado, tipo de ticket
- **Estados**: Registrado, Confirmado, Asistio, En espera, Cancelado
- **Tipos de ticket**: General, VIP, Estudiante
- **Promocion de lista de espera**: Automatica cuando se libera cupo
- **Check-in individual**: Marcar asistencia manualmente
- **Paginacion**: 20 participantes por pagina
- **Exportaciones**:
  - CSV con todos los datos
  - PDF con listado formateado

### 4.4 Gestion de Speakers
- Nombre, email, telefono, empresa, cargo, biografia
- Foto de perfil (subida de imagen)
- Redes sociales (LinkedIn, Twitter, Instagram, Web, Portfolio)
- Estado: Confirmado, Pendiente, Declinado
- Orden personalizable (drag-and-drop)

### 4.5 Gestion de Sponsors
- **Niveles de patrocinio**: Configurables (por defecto: Oro, Plata, Bronce)
  - CRUD de niveles con orden personalizable
- **Datos del sponsor**: Empresa, contacto, email, telefono, sitio web, descripcion
- **Logo**: Subida de imagen
- **Estado**: Pendiente, Confirmado, Pagado
- **Monto pagado**: Registro de pagos (decimal)
- **Orden personalizable**: Por nivel y dentro del nivel

### 4.6 Gestion de Comunidades
- Nombre, URL, descripcion, logo
- Orden personalizable
- Aparecen en la pagina publica del evento
- Ideal para alianzas con comunidades tecnologicas, academicas, etc.

### 4.7 Gestion de Agenda
- **Vista de calendario**: Organizacion por dia
- **Sesiones**: Titulo, descripcion, fecha, hora inicio/fin, ubicacion
- **Tipos**: Sesion/Ponencia, Break, Comida
- **Asignacion de speakers**: Vincular ponente a sesion
- **Orden personalizable**: Drag-and-drop
- **Mover sesiones**: Reubicar entre dias y horarios

### 4.8 Scanner de Check-in
Herramienta de escaneo para la entrada del evento:

- **Camara integrada**: Lectura de codigos QR via webcam/camara del celular
- **Entrada manual**: Ingresar codigo de registro manualmente
- **Tipos de escaneo configurables**: Check-in principal + tipos personalizados
- **Prevencion de duplicados**: No permite escanear dos veces el mismo tipo
- **Feedback audiovisual**:
  - Sonido de exito (880Hz) o error (300Hz)
  - Vibracion haptica
- **Modal de resultado**: Muestra datos del participante, estado, tipo de ticket
- **Estadisticas en tiempo real**: Total de participantes vs escaneados
- **Permisos**: Requiere permiso `participants.checkin`

### 4.9 Comunicaciones / Anuncios
- **Composicion**: Asunto + cuerpo del mensaje
- **Destinatarios**: Todos los participantes activos (registrados, confirmados, asistidos)
- **Envio asincrono**: Cola de trabajos para despacho masivo
- **Historial**: Lista de comunicaciones enviadas con fecha, remitente y conteo
- **Detalle**: Ver comunicacion individual con informacion del emisor
- **Reintentos**: 3 intentos con 60 segundos de espera entre reintentos

### 4.10 Gestion de Encuestas
- **Crear encuesta**: Titulo, tipo (pre-evento, post-evento), preguntas
- **Tipos de preguntas**:
  - Texto libre
  - Calificacion (1-5 estrellas)
  - Opcion multiple
  - Seleccion unica
- **Estados**: Borrador, Activa, Cerrada
- **URL publica**: Enlace compartible con codigo de registro
- **Prevencion de duplicados**: Un participante solo responde una vez
- **Dashboard de resultados**:
  - Promedio de calificaciones con histograma
  - Distribucion de respuestas con porcentajes
  - Primeras 20 respuestas de texto

---

## 5. Panel de Super Administracion

Acceso exclusivo para administradores de la plataforma en `/admin`.

### 5.1 Dashboard de Plataforma
- **Metricas globales**:
  - Total de organizaciones (activas, inactivas, pendientes)
  - Total de usuarios en la plataforma
  - Total de eventos creados
  - Usuarios por rol
- **Top 5 organizaciones** por cantidad de eventos
- **Proximos eventos** de todas las organizaciones
- **Graficos de crecimiento mensual**: Usuarios y organizaciones
- **Actividad reciente**: Ultimas organizaciones, usuarios y eventos creados

### 5.2 Gestion de Organizaciones
- **CRUD completo**: Crear, ver, editar, eliminar organizaciones
- **Busqueda y filtros**: Por nombre, email, slug, estado de activacion, estado de aprobacion
- **Indicador de pendientes**: Badge con cantidad de organizaciones por aprobar
- **Detalle de organizacion**: Usuarios, eventos, estadisticas
- **Flujo de aprobacion**:
  - Nueva organizacion registrada → Estado "Pendiente"
  - **Aprobar**: Activa la organizacion + envia email de bienvenida
  - **Rechazar**: Desactiva + envia email con motivo de rechazo
- **Activar/Desactivar**: Toggle de acceso a la plataforma

### 5.3 Gestion de Usuarios
- CRUD de usuarios en toda la plataforma
- Busqueda y paginacion (15 por pagina)
- Asignacion de roles
- Activacion/desactivacion de cuentas

### 5.4 Impersonacion de Organizaciones
Funcionalidad clave para soporte tecnico:

1. Super admin selecciona una organizacion
2. Activa impersonacion → el sistema cambia el contexto
3. Todas las consultas se filtran a la organizacion seleccionada
4. **Banner visual** (Cloudscape Flashbar) indica que esta en modo impersonacion
5. Puede gestionar eventos, participantes, etc. como si fuera el org admin
6. Detener impersonacion para volver al contexto de super admin

### 5.5 Configuracion SMTP
- **Servidor de correo**: Host, puerto, usuario, contrasena
- **Cifrado**: TLS, SSL o ninguno
- **Remitente**: Direccion y nombre para mostrar
- **Prueba de conexion**: Enviar email de prueba a direccion especifica
- Contrasena enmascarada en la interfaz

---

## 6. Reportes y Analitica

### 6.1 Dashboard de Reportes (Organizacion)
- Participantes por evento (top 10)
- Tasas de check-in por evento
- Distribucion global de estados
- Tendencias de registro (ultimos 30 dias)
- Metricas globales de la organizacion

### 6.2 Exportaciones PDF
- **Reporte de organizacion**: Resumen de todos los eventos con estadisticas
- **Reporte de evento**: Detalle individual con metricas
- **Lista de participantes**: Listado formateado para impresion

### 6.3 Exportaciones CSV
- Participantes del evento (todos los campos)
- Contactos de networking del asistente

---

## 7. Sistema de Emails Automaticos

La plataforma despacha **10 tipos de correos electronicos** automaticos:

| Email | Disparador | Contenido |
|-------|-----------|-----------|
| **Bienvenida del asistente** | Registro exitoso | Credenciales de acceso al portal |
| **Confirmacion de registro** | Registro en evento | Datos del evento + codigo de registro |
| **Confirmacion de lista de espera** | Evento lleno | Posicion en la cola |
| **Promocion de espera** | Cupo liberado | Notificacion de confirmacion |
| **Comunicacion del evento** | Organizador envia anuncio | Asunto + cuerpo del mensaje |
| **Recordatorio de evento** | Programado | Recordatorio previo al evento |
| **Invitacion a encuesta** | Encuesta activa | Enlace a la encuesta |
| **Organizacion aprobada** | Admin aprueba | Bienvenida + acceso habilitado |
| **Organizacion rechazada** | Admin rechaza | Motivo del rechazo |
| **Nuevo registro (admin)** | Nueva organizacion | Alerta para revision |

Todos los emails se procesan de forma **asincrona** mediante colas de trabajo para no bloquear la aplicacion.

---

## 8. Seguridad y Cumplimiento

### 8.1 Autenticacion y Autorizacion
- **Verificacion de email** obligatoria
- **Rate limiting** en endpoints criticos:
  - Login: 5 intentos por minuto
  - Registro: 5 intentos por minuto
  - Verificacion de email: 6 por minuto
  - API: 60 requests por minuto
- **Roles y permisos granulares** (Spatie Laravel Permission)
- **Politicas de autorizacion** por modelo (Event, Participant, Speaker, Sponsor, Community, Survey)

### 8.2 Seguridad Tecnica
- **Headers de seguridad** personalizados (CSP, HSTS, X-Frame-Options, etc.)
- **Proteccion CSRF**: Token en todas las solicitudes POST/PUT/DELETE
- **Soft Deletes**: Los datos no se eliminan fisicamente, se marcan como eliminados
- **ULID**: Identificadores no secuenciales para prevenir enumeracion
- **Validacion de datos**: Request classes para toda entrada de usuario
- **Almacenamiento seguro**: Credenciales SMTP enmascaradas, S3 para archivos

### 8.3 Multi-tenancy
- **Aislamiento por organizacion**: Scope global automatico en todas las consultas
- **Impersonacion controlada**: Solo super admins con registro en sesion
- **Separacion de flujos**: Autenticacion independiente para asistentes y organizadores

---

## 9. API REST (Mobile/Integraciones)

Endpoints disponibles en `/api/v1`:

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| `GET` | `/health` | Health check de la plataforma |
| `GET` | `/events` | Listado de eventos publicos |
| `GET` | `/events/featured` | Eventos destacados |
| `GET` | `/events/{slug}` | Detalle del evento con speakers, sponsors, agenda |

Rate limit: 60 requests por minuto.

---

## 10. Flujos de Trabajo Principales

### 10.1 Ciclo de Vida del Evento
```
Borrador → Publicado → Activo → Completado
                                → Cancelado
```

### 10.2 Flujo de Registro de Asistente
```
Visita pagina del evento
  → Llena formulario de registro
    → Sistema verifica capacidad
      → Si hay cupo: Confirmado + credenciales por email
      → Si lleno: Lista de espera + email de confirmacion
        → Si se libera cupo: Promocion automatica + email
```

### 10.3 Flujo de Networking
```
Participante establece PIN
  → Otro participante busca por PIN o escanea QR
    → Solicita conexion
      → Participante acepta/rechaza
        → Si acepta: Contacto guardado (bidireccional)
          → Exportar a CSV en cualquier momento
```

### 10.4 Flujo de Aprobacion de Organizacion
```
Organizador se registra
  → Estado: Pendiente
    → Super admin revisa
      → Aprueba: Acceso habilitado + email
      → Rechaza: Acceso denegado + email con motivo
```

### 10.5 Flujo de Check-in
```
Staff abre scanner en tablet/celular
  → Escanea QR del asistente
    → Sistema valida codigo
      → Si valido y no duplicado: Check-in exitoso + audio + haptica
      → Si duplicado: Alerta de duplicado
      → Si no encontrado: Error con notificacion
```

---

## 11. Interfaz de Usuario

### Diseno
- **Cloudscape Design System** (AWS): Interfaz profesional, consistente y accesible
- **Componentes**: Tables, Cards, Forms, Modals, Tabs, Navigation, Charts
- **Responsive**: Adaptable a desktop, tablet y movil
- **SideNavigation**: Menu lateral contextual por seccion
- **TopNavigation**: Barra superior con menu de usuario

### Layouts Separados
| Layout | Uso | Estilo |
|--------|-----|--------|
| **PublicLayout** | Paginas publicas de eventos | Minimalista con footer |
| **GuestLayout** | Login/Registro de asistentes | Mensajes orientados al participante |
| **GuestOrganizerLayout** | Login/Registro de organizadores | Mensajes orientados al organizador |
| **AttendeeLayout** | Portal del asistente | SideNavigation contextual por evento |
| **AuthenticatedLayout** | Dashboard del organizador | SideNavigation completa + impersonacion |

---

## 12. Capacidades Tecnicas Clave

| Capacidad | Implementacion |
|-----------|---------------|
| **Multi-tenancy** | Scope global por organizacion |
| **Colas asincronas** | Jobs para emails y tareas pesadas |
| **Almacenamiento cloud** | S3 para imagenes y archivos |
| **Exportaciones** | PDF (DomPDF) y CSV |
| **Calendario** | iCal (.ics) para eventos y agenda |
| **QR codes** | Generacion y lectura (html5-qrcode + qrcode.react) |
| **Real-time stats** | Estadisticas de scanner en tiempo real |
| **Canvas rendering** | Generacion de tickets con diseno personalizado |
| **Busqueda** | Filtros y busqueda en todas las tablas |
| **Paginacion** | Server-side en todas las listas |
| **Soft deletes** | Recuperacion de datos eliminados |
| **URL firmadas** | Vista previa segura de eventos no publicados |

---

## 13. Resumen de Modulos

| Modulo | Organizador | Asistente | Admin |
|--------|:-----------:|:---------:|:-----:|
| Dashboard con analitica | SI | SI | SI |
| Gestion de eventos | SI | - | - |
| Gestion de participantes | SI | - | - |
| Gestion de speakers | SI | - | - |
| Gestion de sponsors | SI | - | - |
| Gestion de comunidades | SI | - | - |
| Disenador de credenciales | SI | - | - |
| Agenda interactiva | SI | SI | - |
| Scanner de check-in | SI | - | - |
| Comunicaciones masivas | SI | SI (receptor) | - |
| Encuestas | SI | SI | - |
| Networking (PIN + QR) | - | SI | - |
| Directorio de asistentes | - | SI | - |
| Gestion de contactos | - | SI | - |
| Entrada digital con QR | - | SI | - |
| Exportar contactos CSV | - | SI | - |
| Reportes PDF | SI | - | - |
| Gestion de organizaciones | - | - | SI |
| Gestion de usuarios | - | - | SI |
| Impersonacion | - | - | SI |
| Configuracion SMTP | - | - | SI |
| Aprobacion de organizaciones | - | - | SI |

---

## 14. Metricas del Sistema

| Concepto | Cantidad |
|----------|----------|
| Modelos de datos | 18 |
| Controladores | 23 |
| Paginas React (JSX) | 70+ |
| Roles de usuario | 6 |
| Tipos de email | 10 |
| Endpoints de API | 4 |
| Jobs asincronos | 7 |
| Politicas de autorizacion | 6 |
| Middleware personalizado | 5 |

---

## 15. Ventajas Competitivas

1. **Multi-organizacion**: Una sola plataforma sirve a multiples organizaciones con datos aislados
2. **Networking integrado**: Sistema de contactos profesionales con PIN, QR y directorio
3. **Credenciales personalizables**: Disenador visual de entradas con marca del organizador
4. **Flujo de aprobacion**: Control de calidad sobre organizaciones que usan la plataforma
5. **Impersonacion**: Soporte tecnico eficiente sin compartir credenciales
6. **Check-in inteligente**: Scanner con feedback audiovisual y prevencion de duplicados
7. **Comunicaciones masivas**: Emails asincronos con reintentos automaticos
8. **Encuestas integradas**: Pre y post-evento con dashboard de resultados
9. **Exportaciones profesionales**: PDF y CSV para reportes y contactos
10. **Portal dedicado del asistente**: Experiencia completa sin depender del organizador

---

*BuilderApp - Gestion de eventos profesional, escalable y segura.*
