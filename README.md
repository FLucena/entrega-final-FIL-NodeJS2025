# 🛍️ E-Commerce API - Node.js RESTful API

## 📋 Descripción del Proyecto

Este proyecto es una **API RESTful completa** desarrollada en Node.js para la gestión de productos de una tienda en línea (E-Commerce). La aplicación permite realizar operaciones CRUD completas sobre productos, con autenticación JWT y soporte para múltiples bases de datos.

### 🎯 Objetivos del Proyecto

- ✅ **API RESTful funcional** con endpoints para gestión de productos
- ✅ **Sistema de autenticación** con JWT para usuarios autorizados
- ✅ **Persistencia de datos** en archivos JSON y Firebase/Firestore
- ✅ **Despliegue en producción** con Vercel
- ✅ **Manejo de errores** y validaciones robustas
- ✅ **Arquitectura limpia** con separación clara de responsabilidades

## 🛠️ Tecnologías Utilizadas

### 🎯 Backend

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web para Node.js
- **ES6 Modules** - Sistema de módulos moderno

### 🔐 Autenticación y Seguridad

- **JWT (JSON Web Tokens)** - Autenticación de usuarios
- **bcryptjs** - Encriptación de contraseñas
- **express-rate-limit** - Rate limiting para prevenir ataques
- **Helmet** - Headers de seguridad
- **CORS** - Configuración cross-origin

### 🗄️ Base de Datos

- **Firebase/Firestore** - Base de datos en la nube para producción
- **JSON Files** - Datos mock locales para desarrollo y respaldo
- **firebase-admin** - SDK de Firebase para Node.js

### 🚀 Despliegue

- **Vercel** - Plataforma de despliegue
- **dotenv** - Gestión de variables de entorno

### 🛠️ Desarrollo

- **nodemon** - Reinicio automático en desarrollo

## 🚀 Características Principales

### 🏗️ Arquitectura y Código Limpio

- **Separación de responsabilidades**: Controladores, Servicios y Modelos bien definidos
- **Código DRY**: Sin duplicados, helpers centralizados para respuestas HTTP
- **Respuestas consistentes**: Formato estandarizado en toda la API
- **Manejo de errores unificado**: Sistema centralizado de manejo de errores

### 🔐 Autenticación y Seguridad

- **JWT (JSON Web Tokens)** para autenticación de usuarios
- **Rate limiting** para prevenir ataques de fuerza bruta
- **CORS configurado** para peticiones cross-origin
- **Helmet** para headers de seguridad
- **Validación de datos** en todos los endpoints

### 📦 Gestión de Productos

- **CRUD completo**: Crear, Leer, Actualizar, Eliminar productos
- **Validación de campos** obligatorios
- **Búsqueda por ID** de productos específicos
- **Gestión de stock** con control de inventario

### 🗄️ Base de Datos

- **Datos mock**: Archivos JSON para desarrollo y respaldo
- **Firebase/Firestore**: Base de datos en la nube para producción
- **Fallback automático**: Si Firebase falla, usa datos mock locales
- **Datos de ejemplo**: Productos y usuarios predefinidos para pruebas

## 📁 Estructura del Proyecto

```
Entrega-Final-FIL/
├── 📁 config/                 # Configuraciones (CORS, Firebase)
├── 📁 controllers/            # Orquestadores de la lógica de negocio
│   ├── authController.js      # Orquesta registro/login, delega a servicios
│   └── productController.js   # Orquesta CRUD de productos, delega a servicios
├── 📁 data/                  # Datos mock (JSON)
│   ├── mockProducts.json     # Productos de ejemplo para desarrollo
│   └── mockUsers.json        # Usuarios de ejemplo para desarrollo
├── 📁 middleware/            # Middleware personalizado
│   └── auth.js              # Verificación de JWT
├── 📁 models/               # Modelos de datos (acceso a base de datos)
│   ├── productModel.js      # Modelo de productos (Firestore + JSON)
│   └── userModel.js         # Modelo de usuarios (Firestore + JSON)
├── 📁 routes/               # Definición de rutas
│   ├── authRoutes.js        # Rutas de autenticación
│   └── productRoutes.js     # Rutas de productos
├── 📁 services/             # Lógica de negocio
│   ├── authService.js       # Lógica de registro/login, validaciones
│   └── productService.js    # Lógica CRUD de productos, validaciones
├── 📁 utils/                # Utilidades reutilizables
│   ├── validation.js        # Validaciones de email, password, campos, etc.
│   ├── jwt.js               # Funciones para generar/verificar tokens
│   └── responseHandler.js   # Helpers para manejo de respuestas HTTP
├── 📄 index.js              # Punto de entrada del servidor
├── 📄 package.json          # Dependencias
└── 📄 README.md             # Esta documentación
```

### 🧩 Arquitectura y Separación de Responsabilidades

#### **Controladores** (`/controllers/`)
- **Responsabilidad**: Reciben las peticiones HTTP, extraen datos y devuelven respuestas
- **No contienen**: Lógica de negocio compleja ni acceso directo a datos
- **Ejemplo**: `productController.js` llama a `productService.js` y maneja respuestas HTTP

#### **Servicios** (`/services/`)
- **Responsabilidad**: Contienen toda la lógica de negocio, validaciones y reglas
- **Usan**: Los modelos para acceder a los datos
- **No acceden**: Directamente a la base de datos
- **Ejemplo**: `productService.js` valida datos y usa `productModel.js` para persistencia

#### **Modelos** (`/models/`)
- **Responsabilidad**: Manejan toda la interacción con la base de datos
- **Soportan**: Firestore (producción) y archivos JSON (desarrollo/fallback)
- **Proporcionan**: API unificada para acceso a datos
- **Ejemplo**: `productModel.js` decide si usar Firestore o JSON según `NODE_ENV`

#### **Middleware** (`/middleware/`)
- **Responsabilidad**: Funciones que se ejecutan entre la petición y la respuesta
- **Ejemplo**: `auth.js` verifica tokens JWT antes de permitir acceso

#### **Utils** (`/utils/`)
- **Responsabilidad**: Funciones reutilizables y helpers
- **Ejemplo**: 
  - `validation.js` - Validaciones de datos
  - `jwt.js` - Funciones para generar/verificar tokens
  - `responseHandler.js` - Helpers para respuestas HTTP consistentes

### 🔄 Flujo de Datos

```
Cliente HTTP → Routes → Controllers → Services → Models → Base de Datos
                ↓           ↓           ↓         ↓
              Middleware  Respuesta  Lógica    Persistencia
```

**Ejemplo de flujo para crear un producto:**

1. **Cliente** envía POST a `/api/products`
2. **Routes** (`productRoutes.js`) recibe la petición
3. **Middleware** (`auth.js`) verifica el token JWT
4. **Controller** (`productController.js`) extrae datos del body
5. **Service** (`productService.js`) valida datos y aplica lógica de negocio
6. **Model** (`productModel.js`) guarda en Firestore o JSON según `NODE_ENV`
7. **Respuesta** fluye de vuelta por la cadena hasta el cliente

Esta arquitectura facilita:
- ✅ **Mantenimiento**: Cambios aislados en cada capa
- ✅ **Testing**: Cada capa puede probarse independientemente
- ✅ **Escalabilidad**: Fácil agregar nuevas funcionalidades
- ✅ **Legibilidad**: Código organizado y fácil de entender
- ✅ **Consistencia**: Respuestas HTTP estandarizadas
- ✅ **DRY**: Sin código duplicado entre capas

## 🛠️ Instalación y Configuración

### Prerrequisitos

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- **Cuenta de Firebase** (para producción)

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd Entrega-Final-FIL
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

#### Para Desarrollo Local

Crea un archivo `.env` en la raíz del proyecto basándote en el ejemplo siguiente:

```env
# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=tu-secreto-jwt-super-seguro

# Firebase Configuration (opcional para desarrollo)
FIREBASE_CLIENT_EMAIL=tu-email@proyecto.iam.gserviceaccount.com
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=tu-proyecto-firebase
FIREBASE_PRIVATE_KEY_ID=id_llave_privada_firebase
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_ID=id_cliente_firebase
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/tu-email%40proyecto.iam.gserviceaccount.com
```

#### Sobre NODE_ENV y nodemon

- Cuando usas `npm run dev` (o ejecutas nodemon), el valor de `NODE_ENV` se toma automáticamente del archivo `nodemon.json`.
  - Si en `nodemon.json` tienes:
    - `"NODE_ENV": "development"` → Usarás datos mock (JSON local)
    - `"NODE_ENV": "production"` → Usarás Firestore real
- **Solo necesitas definir `NODE_ENV` en `.env` si ejecutas la app con `node index.js` o `npm start` directamente.**

#### 🔧 Configuración Recomendada

Para desarrollo local, se recomienda configurar `nodemon.json` con:
```json
{
  "env": {
    "NODE_ENV": "development"
  }
}
```

Esto te permitirá usar datos mock locales durante el desarrollo sin necesidad de configurar Firebase.

#### 🔧 Cómo obtener las credenciales de Firebase:

1. **Ve a la [Consola de Firebase](https://console.firebase.google.com/)**
2. **Selecciona tu proyecto** (o crea uno nuevo)
3. **Ve a Configuración del proyecto** (ícono de engranaje)
4. **Pestaña "Cuentas de servicio"**
5. **Haz clic en "Generar nueva clave privada"**
6. **Descarga el archivo JSON** y copia todos los valores al archivo `.env`

⚠️ **Importante**:

- Nunca subas el archivo `.env` al repositorio
- Asegúrate de que `.env` esté en tu `.gitignore`
- Usa diferentes credenciales para desarrollo y producción

### 4. Ejecutar la Aplicación

#### Modo Desarrollo (con reinicio automático)

```bash
npm run dev
```

#### Modo Producción

```bash
npm start
```

#### Ejecutar directamente

```bash
node index.js
```

## 🌐 Acceso a la Aplicación

Una vez que el servidor esté ejecutándose:

- **API Base URL**: http://localhost:3000/api

## 📡 Endpoints de la API

### 🔐 Autenticación (`/api/auth`)

#### POST `/api/auth/register`
Registra un nuevo usuario.

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "name": "Nombre Usuario"
}
```

**Respuesta exitosa (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "usuario@ejemplo.com",
    "name": "Nombre Usuario"
  },
  "message": "Usuario registrado correctamente"
}
```

#### POST `/api/auth/login`
Inicia sesión con un usuario existente.

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta exitosa (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "usuario@ejemplo.com",
    "name": "Nombre Usuario"
  },
  "message": "Inicio de sesión exitoso"
}
```

### 📦 Productos (`/api/products`)

**Nota:** Todos los endpoints de productos (excepto GET) requieren autenticación JWT en el header:
```
Authorization: Bearer <token>
```

#### GET `/api/products`
Obtiene todos los productos.

**Respuesta exitosa (200):**
```json
[
  {
    "id": "1",
    "name": "Laptop Gaming",
    "description": "Potente laptop para gaming",
    "price": 1299.99,
    "stock": 10,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### GET `/api/products/:id`
Obtiene un producto específico por ID.

**Respuesta exitosa (200):**
```json
{
  "message": "Producto obtenido correctamente",
  "product": {
    "id": "1",
    "name": "Laptop Gaming",
    "description": "Potente laptop para gaming",
    "price": 1299.99,
    "stock": 10,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### POST `/api/products`
Crea un nuevo producto (requiere autenticación).

**Body:**
```json
{
  "name": "Nuevo Producto",
  "description": "Descripción del producto",
  "price": 99.99,
  "stock": 50
}
```

**Respuesta exitosa (201):**
```json
{
  "product": {
    "id": "2",
    "name": "Nuevo Producto",
    "description": "Descripción del producto",
    "price": 99.99,
    "stock": 50,
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Producto creado correctamente"
}
```

#### PUT `/api/products/:id`
Actualiza completamente un producto (requiere autenticación).

**Body:**
```json
{
  "name": "Producto Actualizado",
  "description": "Nueva descripción",
  "price": 149.99,
  "stock": 25
}
```

**Respuesta exitosa (200):**
```json
{
  "product": {
    "id": "1",
    "name": "Producto Actualizado",
    "description": "Nueva descripción",
    "price": 149.99,
    "stock": 25,
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Producto actualizado correctamente"
}
```

#### PATCH `/api/products/:id`
Actualiza parcialmente un producto (requiere autenticación).

**Body:**
```json
{
  "price": 199.99,
  "stock": 15
}
```

**Respuesta exitosa (200):**
```json
{
  "product": {
    "id": "1",
    "name": "Laptop Gaming",
    "description": "Potente laptop para gaming",
    "price": 199.99,
    "stock": 15,
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Producto actualizado parcialmente correctamente"
}
```

#### DELETE `/api/products/:id`
Elimina un producto (requiere autenticación).

**Respuesta exitosa (200):**
```json
{
  "message": "Producto eliminado correctamente"
}
```

## 🚀 Despliegue en Vercel

### 1. Preparar el Proyecto

Asegúrate de que tu `package.json` tenga los scripts correctos:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

### 2. Configurar Vercel

Crea un archivo `vercel.json` en la raíz del proyecto:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

### 3. Variables de Entorno en Vercel

Para el despliegue en Vercel, configura las siguientes variables en el dashboard:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# JWT Configuration
JWT_SECRET=secreto-super-seguro-produccion

# Firebase Configuration
FIREBASE_CLIENT_EMAIL=tu-email@proyecto.iam.gserviceaccount.com
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=tu-proyecto-firebase
FIREBASE_PRIVATE_KEY_ID=id_llave_privada_firebase
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_ID=id_cliente_firebase
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/tu-email%40proyecto.iam.gserviceaccount.com
```

> **Nota**: Estas son las mismas variables que se configuran localmente, pero con valores de producción.

## 🐛 Solución de Problemas

### Error 404 - Ruta no encontrada

- Verificar que el servidor esté ejecutándose
- Comprobar la URL del endpoint
- Revisar que el puerto sea correcto

### Error 401 - No autorizado

- Verificar que el token JWT sea válido
- Comprobar el formato: `Bearer TOKEN`
- Asegurar que el token no haya expirado

### Error 400 - Bad Request

- Verificar que todos los campos requeridos estén presentes
- Comprobar el formato de los datos enviados
- Validar tipos de datos (string, number, etc.)

### Error 500 - Error interno

- Revisar logs del servidor
- Verificar configuración de Firebase
- Comprobar variables de entorno

## 📊 Estado del Proyecto

- ✅ **API RESTful** - Completamente funcional
- ✅ **Autenticación JWT** - Implementada y probada
- ✅ **CRUD de productos** - Todas las operaciones funcionando
- ✅ **Base de datos** - Datos mock JSON + Firebase/Firestore
- ✅ **Despliegue** - Configurado para Vercel
- ✅ **Arquitectura limpia** - Separación clara de responsabilidades
- ✅ **Manejo de errores** - Robustos y consistentes
- ✅ **Validaciones** - Completas en todos los endpoints
- ✅ **Código DRY** - Sin duplicados, helpers centralizados
- ✅ **Respuestas consistentes** - Formato estandarizado en toda la API

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es parte del curso de Node.js de Talento Tech. Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Francisco Lucena**

- 📧 Email: [franciscolucena90@gmail.com]
- 🔗 LinkedIn: [https://www.linkedin.com/in/franciscoivanlucena/]
- 🐙 GitHub: [https://github.com/FLucena]

---

## 🙏 Agradecimientos

Gracias a **Talento Tech** y a todos los instructores por el acompañamiento y los conocimientos brindados durante el curso de Node.js.
