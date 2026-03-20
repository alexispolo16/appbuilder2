# BuilderApp - Manual del Administrador

> Guia para administradores de organizacion

## Tabla de Contenido

1. [Inicio de Sesion](#inicio-de-sesion)
2. [Dashboard](#dashboard)
3. [Gestion de Eventos](#gestion-de-eventos)
4. [Participantes](#participantes)
5. [Speakers](#speakers)
6. [Sponsors](#sponsors)
7. [Comunidades](#comunidades)
8. [Agenda](#agenda)
9. [Encuestas](#encuestas)
10. [Comunicaciones](#comunicaciones)
11. [Scanner y Check-in](#scanner-y-check-in)
12. [Insignias](#insignias)
13. [Asistencia por Sesion](#asistencia-por-sesion)
14. [Disenador de Credenciales](#disenador-de-credenciales)
15. [Reportes y Exportaciones](#reportes-y-exportaciones)
16. [Notificaciones Automaticas](#notificaciones-automaticas)
17. [Configuracion de Organizacion](#configuracion-de-organizacion)

---

## Inicio de Sesion

### Acceso

1. Ve a `/login`
2. Ingresa tu **correo electronico** y **contrasena**
3. Haz clic en **"Iniciar sesion"**

> **Nota:** Los organizadores tambien pueden iniciar sesion desde `/organizer/login`.

### Crear cuenta

1. Ve a `/register`
2. Completa: nombre, apellido, email, contrasena
3. Haz clic en **"Registrarse"**
4. Un super admin debe asignarte a una organizacion

> **Nota:** Los organizadores pueden registrarse directamente desde `/organizer/register`.

---

## Dashboard

> Ruta: `/dashboard`

El dashboard muestra metricas y estadisticas de tu organizacion.

### Metricas principales (8 tarjetas)

| Metrica | Descripcion |
|---------|-------------|
| Eventos activos | Eventos en curso |
| Eventos borrador | Eventos sin publicar |
| Total eventos | Todos los eventos |
| Total participantes | Suma de todos los participantes |
| Eventos completados | Eventos finalizados |
| Total speakers | Ponentes registrados |
| Total sponsors | Patrocinadores |

### Graficas

| Grafica | Tipo | Descripcion |
|---------|------|-------------|
| Eventos por mes | Barras | Eventos creados en los ultimos meses |
| Top eventos | Barras | Eventos con mas participantes |
| Estados de eventos | Pie | Distribucion por estado |
| Estados de participantes | Pie | Distribucion por estado |

### Tablas rapidas

- **Proximos eventos**: eventos publicados ordenados por fecha
- **Eventos recientes**: ultimos eventos creados

---

## Gestion de Eventos

> Ruta: `/events`

### Listado

- Vista de tarjetas con: nombre, estado, fecha, ubicacion, capacidad
- **Busqueda** por nombre
- **Filtro** por estado: borrador, publicado, activo, completado, cancelado

### Crear evento

1. Haz clic en **"Crear evento"**
2. Completa el formulario:

| Campo | Requerido | Descripcion |
|-------|-----------|-------------|
| Nombre | Si | Nombre publico del evento |
| Slug | Si | URL amigable (auto-generado) |
| Descripcion | No | Descripcion del evento |
| Fecha inicio | Si | Fecha y hora de inicio |
| Fecha fin | No | Fecha y hora de fin |
| Ciudad | Si | Ciudad del evento |
| Lugar (Venue) | Si | Nombre del recinto |
| Capacidad | Si | Maximo de participantes (0 = sin limite) |
| Tipo de registro | Si | Abierto o por invitacion |
| Imagen de portada | No | Imagen hero del evento |

3. Haz clic en **"Crear"**

### Imagen del Evento

Se pueden subir dos tipos de imagen para cada evento:

| Tipo | Campo | Descripcion |
|------|-------|-------------|
| **Portada** | `cover_image` | Imagen principal (hero) del evento, visible en la pagina publica |
| **Imagen del evento** | `event_image` | Imagen secundaria utilizada en el diseno de tickets y materiales |

- Las imagenes se almacenan en S3 o almacenamiento publico
- Se utilizan en la **pagina publica** del evento y en el **diseno de entradas digitales**
- Formatos soportados: PNG, JPG

### Estados del evento

```
Borrador → Publicado → Activo → Completado
                                    ↓
                               Cancelado
```

| Estado | Descripcion |
|--------|-------------|
| **Borrador** | Solo visible con URL firmada (preview) |
| **Publicado** | Visible publicamente, registro abierto |
| **Activo** | Evento en curso |
| **Completado** | Evento finalizado |
| **Cancelado** | Evento cancelado |

### Tabs del evento

Al entrar a un evento, veras estas pestanas:

| Tab | Contenido |
|-----|-----------|
| General | Detalles y estadisticas |
| Participantes | Gestion de asistentes |
| Speakers | Ponentes |
| Sponsors | Patrocinadores |
| Comunidades | Comunidades asociadas |
| Agenda | Programa del evento |
| Encuestas | Encuestas de feedback |
| Comunicaciones | Mensajes a participantes |
| Scanner | Check-in con QR |
| Disenador | Personalizar entradas digitales |

### Vista previa

Desde la pagina del evento, usa **"Vista previa"** para ver como se ve la pagina publica antes de publicar.

---

## Participantes

> Ruta: `/events/{id}/participants`

### Listado

- Tabla con: nombre, email, empresa, cargo, tipo de ticket, estado
- **Busqueda** por nombre o email
- **Filtros** por estado y tipo de ticket

### Estados de participantes

| Estado | Descripcion |
|--------|-------------|
| Registrado | Registro inicial |
| Confirmado | Registro confirmado |
| Asistido | Check-in realizado |
| Cancelado | Registro cancelado |
| En espera | En lista de espera |

### Agregar participante manual

1. Haz clic en **"Agregar participante"**
2. Completa los datos:

| Campo | Requerido |
|-------|-----------|
| Nombre y apellido | Si |
| Email | Si (unico por evento) |
| Telefono | No |
| Pais y ciudad | Si |
| Empresa y cargo | No |
| Tipo de ticket | Si |
| Estado | Si |
| Notas | No |

### Importar participantes (CSV)

1. Haz clic en **"Importar CSV"**
2. Selecciona archivo con columnas: `first_name, last_name, email, phone, company, job_title, country, city`
3. El sistema valida y crea los participantes

### Exportar participantes

| Formato | Boton | Contenido |
|---------|-------|-----------|
| CSV | "Exportar CSV" | Todos los participantes en formato CSV |
| PDF | "Exportar PDF" | Lista de participantes formateada en PDF |

### Check-in manual

En el listado, haz clic en el icono de **check** junto al participante para marcarlo como asistido.

### Lista de espera

Si el evento tiene capacidad limitada y se llena:
- Nuevos registros van automaticamente a **lista de espera**
- Al cancelar un participante, el primero en lista de espera es **promovido automaticamente**
- El participante promovido recibe un email de notificacion

---

## Speakers

> Ruta: `/events/{id}/speakers`

### Listado

Vista de tarjetas con: foto, nombre, cargo, empresa, estado, redes sociales.

### Crear speaker

| Campo | Requerido |
|-------|-----------|
| Nombre y apellido | Si |
| Cargo | No |
| Empresa | No |
| Bio | No |
| Foto | No |
| Twitter, LinkedIn, Website | No |
| Estado | Si (Invitado/Confirmado/Declinado) |

### Reordenar

Usa los botones de flecha arriba/abajo para cambiar el orden de aparicion en la pagina publica.

---

## Sponsors

> Ruta: `/events/{id}/sponsors`

### Niveles de patrocinio

Antes de agregar sponsors, crea los niveles:

1. Ve a la pagina **General** del evento
2. Seccion **"Niveles de sponsor"**
3. Crea niveles (ej: Diamante, Oro, Plata, Bronce)
4. Reordena segun prioridad de visualizacion

### Crear sponsor

| Campo | Requerido |
|-------|-----------|
| Empresa | Si |
| Persona de contacto | No |
| Email y telefono | No |
| Sitio web | No |
| Logo | No |
| Nivel de patrocinio | Si |
| Notas | No |

Los sponsors se agrupan por nivel en la pagina publica.

---

## Comunidades

> Ruta: `/events/{id}/communities`

Permite asociar comunidades tecnologicas u organizaciones al evento.

### Crear comunidad

| Campo | Requerido |
|-------|-----------|
| Nombre | Si |
| Descripcion | No |
| Logo | No |
| URL | No |

Las comunidades se muestran en la pagina publica con logo y enlace.

---

## Agenda

> Ruta: `/events/{id}/agenda`

### Vistas disponibles

| Vista | Descripcion |
|-------|-------------|
| Timeline | Agenda agrupada por dia, orden cronologico |
| Por salas | Agenda agrupada por ubicacion/sala |
| Calendario | Vista de calendario interactiva |

### Crear item de agenda

| Campo | Requerido |
|-------|-----------|
| Titulo | Si |
| Descripcion | No |
| Fecha | Si |
| Hora inicio | Si |
| Hora fin | No |
| Sala/Ubicacion | No |
| Speaker | No (seleccionable de speakers existentes) |
| Tipo | Si (Sesion, keynote, workshop, break, etc.) |

### Tipos de sesion

| Tipo | Descripcion |
|------|-------------|
| Sesion | Charla normal |
| Keynote | Charla principal |
| Workshop | Taller practico |
| Panel | Mesa redonda |
| Break | Receso/cafe |
| Networking | Sesion de networking |
| Registro | Tiempo de registro |

### Exportar agenda (iCal)

Los participantes pueden descargar la agenda como archivo `.ics` desde la pagina publica:
- `evento.ics` - Solo el evento principal
- `agenda.ics` - Todas las sesiones individuales

---

## Encuestas

> Ruta: `/events/{id}/surveys`

Sistema para recopilar feedback de los participantes.

### Listado de encuestas

Vista con: titulo, tipo, numero de preguntas, respuestas recibidas, estado.

### Crear encuesta

1. Haz clic en **"Nueva encuesta"**
2. Completa:

| Campo | Descripcion |
|-------|-------------|
| Titulo | Nombre de la encuesta |
| Descripcion | Instrucciones para participantes (opcional) |
| Tipo | Pre-evento o Post-evento |

3. Agrega preguntas

### Tipos de preguntas

| Tipo | Descripcion |
|------|-------------|
| **Texto libre** | Respuesta abierta |
| **Calificacion** | Escala de 1-5 estrellas |
| **Seleccion unica** | Una opcion de varias |
| **Seleccion multiple** | Varias opciones |

Para seleccion unica/multiple, agrega las opciones de respuesta.

### Opciones de pregunta

- **Requerida**: El participante debe responder para enviar
- **Opciones**: Para seleccion unica/multiple, agrega opciones

### Estados de encuesta

| Estado | Descripcion |
|--------|-------------|
| **Borrador** | No visible para participantes |
| **Activa** | Aceptando respuestas |
| **Cerrada** | Ya no acepta respuestas |

### Compartir encuesta

Cuando la encuesta esta activa:
1. Ve a la edicion de la encuesta
2. Copia el **enlace publico** mostrado
3. Comparte con participantes (email, chat, etc.)

El enlace tiene formato: `/e/{slug}/survey/{id}`

### Enviar invitacion por email

Usa el mailable `SurveyInvitation` para enviar invitaciones:
```php
Mail::to($participant->email)->send(new SurveyInvitation($participant, $survey));
```

### Ver resultados

1. En el listado, haz clic en **"Resultados"**
2. Ve un resumen de todas las respuestas:

| Tipo de pregunta | Visualizacion |
|------------------|---------------|
| Calificacion | Promedio + grafica de barras |
| Seleccion unica/multiple | Barras de porcentaje por opcion |
| Texto libre | Lista de respuestas textuales |

---

## Comunicaciones

> Ruta: `/events/{id}/communications`

Sistema para enviar mensajes directos a los participantes de un evento.

### Redactar comunicacion

1. Ve a la pestana **Comunicaciones** del evento
2. Haz clic en **"Nueva comunicacion"**
3. Completa el formulario:

| Campo | Descripcion |
|-------|-------------|
| Asunto | Asunto del mensaje |
| Cuerpo | Contenido del mensaje |

### Destinatarios

- Los destinatarios son todos los participantes con estado **confirmado**, **registrado** o **asistido**
- El sistema muestra automaticamente el **conteo de destinatarios** antes de enviar
- No es necesario seleccionar destinatarios manualmente

### Envio

- Al hacer clic en **"Enviar"**, la comunicacion se despacha de forma **asincrona via cola** (queue)
- El envio no bloquea la interfaz; puedes seguir trabajando mientras los emails se procesan en segundo plano
- El sistema cuenta con un **mecanismo de reintento**: si un envio falla, se reintenta hasta **3 veces** con un **intervalo de 60 segundos** entre cada intento

### Historial de comunicaciones

El listado muestra todas las comunicaciones enviadas con:

| Columna | Descripcion |
|---------|-------------|
| Asunto | Asunto del mensaje |
| Fecha | Fecha y hora de envio |
| Remitente | Usuario que envio la comunicacion |
| Destinatarios | Cantidad de participantes que recibieron el mensaje |

### Ver detalle

Haz clic en una comunicacion del historial para ver los detalles completos: asunto, cuerpo, remitente, fecha y cantidad de destinatarios.

---

## Scanner y Check-in

> Ruta: `/events/{id}/scanner`

### Configurar tipos de escaneo

Desde la edicion del evento, seccion **"Configuracion de escaneos"**:

1. **Check-in** viene por defecto (no eliminable)
2. Haz clic en **"Agregar tipo de escaneo"**
3. Ingresa nombre (ej: "Almuerzo", "Kit de bienvenida")
4. Activa/desactiva con toggle
5. Guarda cambios

### Usar el scanner

1. Ve a la pestana **Scanner** del evento
2. Selecciona el **tipo de escaneo**
3. Permite acceso a la camara
4. Apunta al codigo QR del participante

### Resultados del escaneo

| Color | Significado |
|-------|-------------|
| **Verde** | Escaneo exitoso + nombre del participante |
| **Amarillo** | Ya escaneado previamente |
| **Rojo** | Codigo no encontrado o participante cancelado |

### Input manual

Si la camara no funciona:
1. Ingresa el **codigo de registro** manualmente
2. Haz clic en el boton de busqueda

### Estadisticas en tiempo real

En la parte superior del scanner:
- Total de participantes
- Cantidad escaneada por cada tipo
- Porcentaje de avance

---

## Insignias

> Ruta: `/events/{id}/badges`

Sistema para crear insignias y reconocer logros de los participantes. Las insignias pueden ser manuales (asignadas por el admin) o automaticas (otorgadas al cumplir una regla).

### Listado de insignias

Vista con: icono, nombre, tipo, regla, cantidad asignada vs total participantes, estado.

### Crear insignia

1. Haz clic en **"Nueva insignia"**
2. Completa el formulario:

| Campo | Requerido | Descripcion |
|-------|-----------|-------------|
| Nombre | Si | Nombre de la insignia (ej: "Asistencia Completa") |
| Descripcion | No | Descripcion del logro |
| Icono | No | Emoji representativo (default: trofeo) |
| Color | No | Color de la insignia (default: azul) |
| Tipo | Si | Manual o Automatica |

### Tipos de insignia

| Tipo | Descripcion |
|------|-------------|
| **Manual** | El admin asigna la insignia manualmente a participantes seleccionados |
| **Automatica** | Se otorga automaticamente cuando el participante cumple una regla |

### Reglas automaticas

Para insignias automaticas, se configura una regla:

| Regla | Parametro | Descripcion |
|-------|-----------|-------------|
| **Asistencia por sesion** | Sesiones minimas | Se otorga cuando el participante ha asistido al menos N sesiones del evento |

### Asignar insignia manualmente

1. Ve a la edicion de una insignia de tipo **Manual**
2. Haz clic en **"Asignar insignia"**
3. Selecciona uno o mas participantes del listado
4. Opcionalmente agrega una nota
5. Haz clic en **"Asignar"**

### Revocar insignia

1. En la edicion de la insignia, busca al participante en la tabla
2. Haz clic en **"Revocar"**
3. Confirma la accion

### Verificacion publica

Cada insignia asignada genera un **enlace de verificacion unico** que el participante puede compartir:
- URL formato: `/badge/{token}`
- Incluye OG meta tags para LinkedIn (titulo, descripcion, imagen del evento)
- Los participantes comparten este enlace desde su portal

---

## Asistencia por Sesion

> Ruta: `/events/{id}/attendance`

Sistema para registrar la asistencia de participantes a sesiones individuales de la agenda mediante codigos QR.

### Como funciona

1. Cada sesion de la agenda genera automaticamente un **codigo QR unico**
2. El admin proyecta el QR en la pantalla durante la sesion
3. Los participantes escanean el QR con su celular
4. Ingresan su **codigo de registro** (8 caracteres de su ticket)
5. La asistencia queda registrada automaticamente

### Proyectar QR de sesion

1. Ve a la pestana **Asistencia** del evento
2. Busca la sesion en la tabla
3. Haz clic en **"Proyectar QR"**
4. Se abre una pantalla fullscreen con:
   - Nombre del evento y la sesion
   - Codigo QR grande para escanear
   - Contador de asistentes registrados

> **Tip**: Usa el modo pantalla completa del navegador (F11) para una mejor visualizacion.

### Dashboard de asistencia

La pestana **Asistencia** muestra un resumen completo:

**Tarjetas de resumen:**

| Metrica | Descripcion |
|---------|-------------|
| Sesiones totales | Cantidad de items en la agenda |
| Participantes registrados | Total de participantes activos |
| Registros de asistencia | Total de escaneos de asistencia |
| Promedio sesiones/participante | Media de sesiones por asistente |

**Tabla de sesiones:**

| Columna | Descripcion |
|---------|-------------|
| Sesion | Titulo y speaker |
| Fecha | Fecha de la sesion |
| Horario | Hora inicio - hora fin |
| Asistentes | Cantidad registrada |
| Acciones | Boton para proyectar QR |

### Insignias automaticas basadas en asistencia

Para generar certificados de asistencia automaticamente:

1. Ve a **Insignias** → **Nueva insignia**
2. Selecciona tipo **Automatica**
3. Configura la regla: **Sesiones minimas** (ej: 5)
4. Guarda la insignia

Cuando un participante alcance el numero minimo de sesiones, recibira la insignia automaticamente al registrar su asistencia.

---

## Disenador de Credenciales

> Ruta: `/events/{id}/credential-designer`

Editor visual para personalizar el diseno de las entradas digitales (credenciales) de los participantes.

### Acceso

Ve a la pestana **Disenador** del evento para abrir el editor visual.

### Vista previa en vivo

El editor incluye una **vista previa en vivo** que muestra los cambios en tiempo real mientras ajustas los parametros de diseno.

### Opciones de personalizacion

| Opcion | Descripcion |
|--------|-------------|
| Gradiente del encabezado | Dos colores para el degradado del header |
| Texto del encabezado | Etiqueta personalizada en la parte superior |
| Color de acento | Color destacado para elementos decorativos |
| Color de fondo | Color de fondo principal de la credencial |
| Colores de texto | Colores para titulos y contenido |

### Elementos visibles (toggles)

| Toggle | Descripcion |
|--------|-------------|
| Mostrar empresa | Muestra el nombre de la empresa del participante |
| Mostrar cargo | Muestra el cargo del participante |
| Mostrar logos de sponsors | Incluye los logos de los patrocinadores |

### Acciones

| Boton | Descripcion |
|-------|-------------|
| **Descargar muestra** | Descarga un PDF de ejemplo con el diseno actual |
| **Restablecer valores** | Vuelve a la configuracion predeterminada |
| **Guardar** | Guarda el diseno personalizado |

### Almacenamiento

El diseno se guarda en `event.settings.credential_design` como parte de la configuracion del evento.

---

## Reportes y Exportaciones

### Dashboard de reportes

> Ruta: `/reports`

Analiticas a nivel de organizacion:

**Metricas consolidadas (5 tarjetas):**
- Total eventos
- Total participantes
- Check-ins realizados
- Total speakers
- Total sponsors

**Graficas:**
| Grafica | Descripcion |
|---------|-------------|
| Participantes por evento (Top 10) | Barras |
| Tasa de check-in | Porcentaje de asistencia |
| Registros ultimos 30 dias | Tendencia |
| Distribucion de participantes | Por estado |

### Exportar reportes PDF

| Reporte | Ruta | Contenido |
|---------|------|-----------|
| Reporte de organizacion | `/reports/export/pdf` | Metricas globales + lista de eventos |
| Reporte de evento | `/events/{id}/report/pdf` | Metricas del evento + speakers + sponsors |
| Lista de participantes | `/events/{id}/participants/export/pdf` | Tabla de todos los participantes |

### Contenido de reportes PDF

**Reporte de organizacion:**
- Header con nombre de organizacion
- 5 metricas principales
- Tabla de eventos con estadisticas

**Reporte de evento:**
- Header con nombre del evento
- Metricas: participantes, asistencia, speakers, sponsors
- Distribucion por estado y tipo de ticket
- Tabla de speakers
- Tabla de sponsors

**Lista de participantes:**
- Header con nombre del evento
- Tabla: nombre, email, telefono, empresa, cargo, estado, check-in

---

## Notificaciones Automaticas

El sistema envia notificaciones automaticas a los participantes.

### Tipos de notificaciones

| Notificacion | Cuando se envia |
|--------------|-----------------|
| **Confirmacion de registro** | Inmediatamente al registrarse |
| **Confirmacion de lista de espera** | Al ser agregado a lista de espera |
| **Promocion de lista de espera** | Al ser promovido a confirmado |
| **Recordatorio 48h** | 48 horas antes del evento |
| **Recordatorio dia del evento** | El dia del evento |
| **Follow-up** | 24 horas despues del evento |
| **Invitacion a encuesta** | Cuando envias encuesta |

### Comando de recordatorios

Los recordatorios se procesan automaticamente via cron (cada hora):
```bash
php artisan reminders:process
```

### Contenido de emails

Todos los emails incluyen:
- Nombre del evento
- Fecha y ubicacion
- Codigo QR del participante (cuando aplica)
- Enlace a networking
- Enlace a encuestas (cuando aplica)

---

## Configuracion de Organizacion

> Ruta: `/organization`

### Datos de la organizacion

| Campo | Descripcion |
|-------|-------------|
| Nombre | Nombre de la organizacion |
| Slug | Identificador URL |
| Descripcion | Descripcion breve |
| Sitio web | URL del sitio web |
| Email | Correo de contacto |
| Telefono | Telefono de contacto |
| Direccion | Direccion fisica |
| Logo | Logotipo (imagen) |

### Subir logo

1. Haz clic en **"Cambiar logo"**
2. Selecciona una imagen (PNG, JPG)
3. El logo se usa en emails y reportes PDF

---

## Atajos y Mejores Practicas

### Flujo recomendado para nuevo evento

1. **Crear evento** con datos basicos
2. **Subir imagenes** del evento (portada e imagen del evento)
3. **Configurar niveles de sponsor** (si aplica)
4. **Agregar speakers** confirmados
5. **Agregar sponsors** por nivel
6. **Crear agenda** con todas las sesiones
7. **Crear comunidades** asociadas
8. **Personalizar credenciales** en el Disenador antes de publicar
9. **Crear insignias** manuales y/o automaticas (basadas en asistencia)
10. **Crear encuesta post-evento** y dejarla en borrador
11. **Configurar tipos de escaneo** adicionales
12. **Cambiar estado a Publicado** para abrir registro
13. **Compartir enlace** publico

### Tips de productividad

| Tip | Descripcion |
|-----|-------------|
| Preview | Usa "Vista previa" antes de publicar |
| Bulk import | Importa participantes con CSV |
| Scanner movil | Usa tu celular para check-in mas rapido |
| Encuestas | Crea encuesta antes del evento y activala despues |
| Reportes PDF | Descarga reportes para compartir con stakeholders |
| Comunicaciones | Envia anuncios antes, durante y despues del evento |
| Credenciales | Personaliza el diseno de entradas antes de publicar el evento |
| Insignias | Crea insignias automaticas antes del evento para que se otorguen durante las sesiones |
| Asistencia QR | Proyecta el QR de cada sesion para medir asistencia real |

### Capacidad y lista de espera

- Si defines capacidad > 0, el sistema controlara el aforo
- Participantes nuevos iran a lista de espera automaticamente
- Al cancelar, el siguiente en lista es promovido automaticamente

### Encuestas efectivas

- Usa maximo 5-7 preguntas para mejor tasa de respuesta
- Combina preguntas de calificacion con texto libre
- Activa la encuesta justo al terminar el evento
- Envia recordatorio por email a quienes no respondieron
- Crea la encuesta post-evento con anticipacion y activala una vez que el evento haya finalizado

---

## Soporte Tecnico

### Comandos utiles (desarrollo)

```bash
# Procesar recordatorios manualmente
php artisan reminders:process

# Procesar cola de emails
php artisan queue:work

# Ver estado de migraciones
php artisan migrate:status
```

### Logs

Los logs se encuentran en `storage/logs/laravel.log`.

En desarrollo con `MAIL_MAILER=log`, los emails se guardan en el log en lugar de enviarse.

---

*Generado por BuilderApp*
