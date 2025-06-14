# Entrega Final - Talento Tech Node.js

## Descripción General

Este proyecto es la **entrega final** para el curso de Node.js de Talento Tech. El objetivo es diseñar, desarrollar y desplegar una API RESTful funcional que permita gestionar los productos de una tienda en línea (E-Commerce). El sistema permite a usuarios autorizados realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre los productos, almacenando los datos tanto localmente (en archivos JSON) como en la nube (Firebase/Firestore).

## Estructura del Proyecto

- `/controllers`: Contiene la lógica de negocio (controladores de productos, autenticación, etc).
- `/routes`: Define las rutas de acceso a la API.
- `/models`: Define la estructura de los datos y el acceso a ellos.
- `/services`: Gestiona el acceso a datos y la interacción con la base de datos (opcional).
- `/data`: Archivos JSON que simulan la base de datos local.
- `index.js`: Punto de entrada del servidor Express.

## Funcionalidades

- **Gestión de productos:** Crear, listar, actualizar y eliminar productos (CRUD).
- **Autenticación JWT:** Registro y login de usuarios, protección de rutas.
- **Persistencia:** Datos almacenados en archivos JSON y migración a Firestore.
- **CORS y manejo de errores global.**

## Requerimientos Específicos

1. **Estructura del Proyecto:**
   - Carpetas principales: `/controllers`, `/models`, `/routes`, `/services`, `/public` (opcional).
2. **Funcionalidades:**
   - Gestión de productos (CRUD).
   - Manejo de errores y respuestas adecuadas.
   - Configuración CORS.
3. **Seguridad:**
   - Autenticación y autorización mediante JWT.
4. **Base de Datos:**
   - Acceso inicial a datos mediante archivos JSON.
   - Migración a Firebase/Firestore.
5. **Despliegue:**
   - Subir la API a un servicio de producción (Vercel, Railway, etc.).

## Funcionalidades principales

- La API responde correctamente a los métodos HTTP (GET, POST, PUT, PATCH, DELETE).
- Devuelve productos o el producto seleccionado.
- Las rutas son claras y tienen una responsabilidad única.
- Manejo de errores comunes (404, 500) con mensajes claros.
- Almacenamiento y recuperación correcta de datos en JSON y Firestore.
- Uso de la herramienta solo para usuarios autorizados y autenticados.

## Uso

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Inicia el servidor:
   ```bash
   node index.js
   ```
3. Usa herramientas como Postman o curl para interactuar con la API:
   - Registro: `POST /api/auth/register` (body: email, password)
   - Login: `POST /api/auth/login` (body: email, password)
   - Todas las rutas de productos (`/api/productos`) requieren el header `Authorization: Bearer <token>`

## Agradecimientos

Gracias a Talento Tech y a los instructores por el acompañamiento y los conocimientos brindados durante el curso.

## Configuración de Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Ve a Configuración del Proyecto > Cuentas de servicio
3. Genera una nueva clave privada
4. Renombra el archivo descargado a `firebase-service-account.json`
5. Coloca el archivo en la raíz del proyecto

**Nota:** El archivo `firebase-service-account.json` contiene credenciales sensibles y está incluido en `.gitignore`. No lo subas al repositorio.

## Configuración de Variables de Entorno

### Desarrollo Local
1. Crea un archivo `.env` en la raíz del proyecto
2. Copia el contenido de `.env.example` y rellena los valores con tus credenciales

### Despliegue en Vercel
1. Ve a la sección "Settings" de tu proyecto
2. Navega a "Environment Variables"
3. Agrega cada variable de entorno con sus respectivos valores
4. Para la `FIREBASE_PRIVATE_KEY`, asegúrate de escapar los saltos de línea con `\n`

### Despliegue en Railway
1. Ve a la sección "Variables" de tu proyecto
2. Agrega cada variable de entorno con sus respectivos valores
3. Para la `FIREBASE_PRIVATE_KEY`, asegúrate de escapar los saltos de línea con `\n`

### Despliegue en Render
1. Ve a la sección "Environment" de tu servicio
2. Agrega cada variable de entorno con sus respectivos valores
3. Para la `FIREBASE_PRIVATE_KEY`, asegúrate de escapar los saltos de línea con `\n`

**Nota:** Nunca subas el archivo `.env` al repositorio. Está incluido en `.gitignore` por seguridad.

---

**Autor:** Francisco Lucena