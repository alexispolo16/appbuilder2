# EventFlow SaaS - Roadmap de Implementacion

## Resumen de Progreso

| Fase | Modulo | Estado |
|------|--------|--------|
| 1 | Infraestructura Base | ✅ Completado |
| 2 | M1: Eventos (CRUD) | ✅ Completado |
| 2 | M2: Participantes | ✅ Completado |
| 2 | M3: Speakers | ✅ Completado |
| 2 | M4: Agenda | ✅ Completado |
| 3 | M5: Sponsors | ✅ Completado |
| 3 | M6: Comunidades | ✅ Completado |
| 4 | M7: Networking | ✅ Completado |
| 4 | M8: Registro Completo | ✅ Completado |
| 5 | M9: Check-in & Scanner | ✅ Completado |
| 5 | M10: Reportes & Metricas | ✅ Completado |
| 5 | Encuestas | ✅ Completado |
| 5 | Comunicaciones Masivas | ✅ Completado |
| 6 | Disenador de Credenciales | ✅ Completado |
| 6 | Exportaciones PDF | ✅ Completado |
| 6 | Calendario iCal | ✅ Completado |
| 6 | API REST v1 | ✅ Completado |
| 7 | Portal del Asistente | ✅ Completado |
| 8 | Mejoras Finales | ✅ Completado |
| 9 | Insignias + Asistencia por Sesion | ✅ Completado |
| 10 | Integraciones Avanzadas & Polish | ⬜ Pendiente |

---

## ✅ Completado

### Fase 1 - Infraestructura Base
- Laravel 12 + Inertia.js + React 18 + Cloudscape
- Autenticacion, roles (Spatie), ULIDs
- Panel admin + impersonacion
- Multi-tenant por organizacion

### Fase 2 - Modulos Core
- **Eventos**: CRUD, estados, cover image, vista publica
- **Participantes**: CRUD, check-in, export CSV, import masivo
- **Speakers**: CRUD, foto, reorder, links sociales
- **Agenda**: CRUD, agrupacion por dia, reorder, speaker asociado

### Fase 3 - Sponsors + Comunidades
- **Sponsors**: Niveles, CRUD, logo, reorder, montos, estados
- **Comunidades**: CRUD catalogo, logo, reorder, vista publica

### Fase 4 - Networking + Registro Completo
- **Networking**: PIN, perfiles, directorio, conexiones, busqueda por PIN
- **Registro completo**:
  - Formulario publico con pais/ciudad buscables, telefono con codigo de pais
  - Validacion de capacidad (cupos disponibles)
  - Email de confirmacion con entrada digital (QR + datos)
  - Pagina de exito tipo boleto con descarga de entrada digital PNG
  - Acceso de participantes ya registrados ("Ya te registraste?" en pagina del evento)

### Fase 5 - Check-in, Reportes, Encuestas & Comunicaciones
- **Scanner QR movil**: camara, input manual, tabs por tipo de escaneo
- **Tipos de escaneo configurables**: Check-in, Almuerzo, Kit, etc.
- **Tabla `participant_scans`**: registro de escaneos con prevencion de duplicados
- **Stats en tiempo real** por tipo de escaneo
- **M10: Reportes & Metricas**:
  - Dashboard de metricas por evento con graficas (charts)
  - Reportes de asistencia y sponsors
  - Exportacion de reportes en PDF
- **Encuestas**:
  - Encuestas pre y post evento
  - 4 tipos de preguntas (texto, seleccion unica, seleccion multiple, escala)
  - Dashboard de resultados con visualizacion
- **Comunicaciones masivas**:
  - Envio de email asincrono a participantes del evento

### Fase 6 - Credenciales, Exportaciones, Calendario & API
- **Disenador de credenciales**:
  - Editor visual de entradas/credenciales para eventos
- **Exportaciones PDF**:
  - Exportacion PDF de organizacion
  - Exportacion PDF de evento
  - Exportacion PDF de participantes
- **Calendario iCal**:
  - Generacion de archivos .ics para eventos
- **API REST v1**:
  - API publica con endpoints para integracion externa

### Fase 7 - Portal del Asistente
- **Portal del asistente** (dashboard completo para participantes):
  - Dashboard principal con resumen del evento
  - Ticket QR digital
  - Agenda del evento
  - Speakers del evento
  - Sponsors del evento
  - Networking y directorio de asistentes
  - Contactos y conexiones
  - Encuestas disponibles
  - Anuncios del evento
  - Perfil del asistente

### Fase 8 - Mejoras Finales
- **Flujos de autenticacion separados**: registro/login independiente para asistentes vs organizadores
- **Workflow de aprobacion de organizaciones**: flujo de solicitud y aprobacion para nuevas organizaciones
- **Configuracion SMTP**: configuracion de servidor de correo por organizacion
- **Estadisticas dinamicas en landing**: metricas en tiempo real en la pagina principal
- **Optimizacion Dockerfile**: multi-stage build para produccion
- **Subida de imagenes de eventos**: soporte S3 para cover images

---

### Fase 9 - Insignias + Asistencia por Sesion
- **Sistema de Insignias (Badges)**:
  - CRUD de insignias por evento (nombre, icono emoji, color, descripcion)
  - Tipo manual: el admin asigna manualmente a participantes
  - Tipo automatico: se asigna al cumplir regla de asistencia (min_sessions)
  - Asignacion masiva con Multiselect + revocacion individual
  - Verificacion publica con OG meta tags para LinkedIn
  - Compartir en LinkedIn desde el portal del asistente
- **Asistencia por Sesion**:
  - Cada item de agenda genera automaticamente un codigo QR unico (12 chars)
  - Pantalla QR fullscreen para proyectar en la sesion
  - Participante escanea QR → ingresa su codigo de registro → asistencia registrada
  - Auto-evaluacion de insignias automaticas post-asistencia
  - Dashboard admin con resumen de asistencia por sesion
- **Portal del Asistente**:
  - Seccion "Mis Insignias" con cards y progreso de asistencia
  - Boton "Compartir en LinkedIn" y "Copiar enlace"

---

## ⬜ Pendiente

### Fase 10 - Integraciones Avanzadas & Polish

#### Integraciones
- Pasarela de pago (registro pagado)
- Integracion con Google Calendar
- Integracion con plataformas de streaming
- Webhooks para eventos del sistema

#### Polish & UX
- Optimizacion de performance
- PWA / modo offline para check-in
- Accesibilidad (a11y)
- Internacionalizacion (i18n)
- Tests automatizados (Feature + Unit)
- CI/CD pipeline

---

## Stack Tecnico

| Componente | Tecnologia |
|------------|-----------|
| Backend | Laravel 12 (PHP 8.3) |
| Frontend | React 18 + Inertia.js |
| UI Library | Cloudscape Design System (AWS) |
| Base de datos | PostgreSQL |
| Roles/Permisos | Spatie Laravel Permission |
| Primary Keys | ULIDs |
| Servidor | FrankenPHP |
| Almacenamiento | S3 (archivos) / public disk (local dev) |

## Credenciales Demo

| Rol | Email | Password |
|-----|-------|----------|
| Super Admin | superadmin@eventflow.app | password |
| Org Admin | admin@eventflow.app | password |
| Collaborator | maria@eventflow.app | password |
