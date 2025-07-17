# 🛍️ E-Commerce API - Node.js RESTful API

## 📋 Descripción del Proyecto

Este proyecto es una **API RESTful completa** desarrollada en Node.js para la gestión de productos de una tienda en línea (E-Commerce). La aplicación permite realizar operaciones CRUD completas sobre productos, con autenticación JWT y soporte para múltiples bases de datos.

### 🎯 Objetivos del Proyecto

- ✅ **API RESTful funcional** con endpoints para gestión de productos
- ✅ **Sistema de autenticación** con JWT para usuarios autorizados
- ✅ **Persistencia de datos** en archivos JSON y Firebase/Firestore
- ✅ **Despliegue en producción** con Vercel
- ✅ **Manejo de errores** y validaciones robustas

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
├── 📁 models/               # Modelos de datos (mock local)
│   ├── productModel.js      # Modelo de productos
│   └── userModel.js         # Modelo de usuarios
├── 📁 routes/               # Definición de rutas
│   ├── authRoutes.js        # Rutas de autenticación
│   └── productRoutes.js     # Rutas de productos
├── 📁 services/             # Lógica de negocio y acceso a datos
│   ├── authService.js       # Lógica de registro/login, validaciones, mock y Firestore
│   └── productService.js    # Lógica CRUD de productos, mock y Firestore
├── 📁 utils/                # Utilidades reutilizables
│   ├── validation.js        # Validaciones de email, password, campos, etc.
│   └── jwt.js               # Funciones para generar/verificar tokens
├── 📄 index.js              # Punto de entrada del servidor
├── 📄 package.json          # Dependencias
└── 📄 README.md             # Esta documentación
```

### 🧩 Separación de responsabilidades

- **Controladores**: Reciben la request, llaman al servicio correspondiente y devuelven la respuesta. No contienen lógica de negocio compleja.
- **Servicios**: Implementan la lógica de negocio, validaciones, acceso a Firestore o mock, y devuelven los datos listos para responder.
- **Utils**: Funciones reutilizables para validaciones y JWT.

Esta organización facilita el mantenimiento, la escalabilidad y la legibilidad del código.

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


| Método | Endpoint             | Descripción            | Autenticación |
| --------- | ---------------------- | ------------------------- | ---------------- |
| `POST`  | `/api/auth/register` | Registrar nuevo usuario | ❌ No requiere |
| `POST`  | `/api/auth/login`    | Iniciar sesión         | ❌ No requiere |

### 📦 Productos (`/api/products`)


| Método  | Endpoint            | Descripción                     | Autenticación  |
| ---------- | --------------------- | ---------------------------------- | ----------------- |
| `GET`    | `/api/products`     | Obtener todos los productos      | ❌ No requiere  |
| `GET`    | `/api/products/:id` | Obtener producto por ID          | ❌ No requiere  |
| `POST`   | `/api/products`     | Crear nuevo producto             | ✅ Requiere JWT |
| `PUT`    | `/api/products/:id` | Actualizar producto completo     | ✅ Requiere JWT |
| `PATCH`  | `/api/products/:id` | Actualizar producto parcialmente | ✅ Requiere JWT |
| `DELETE` | `/api/products/:id` | Eliminar producto                | ✅ Requiere JWT |

## 🔧 Ejemplos de Uso

### 1. Registro de Usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "123456",
    "name": "Usuario Ejemplo"
  }'
```

### 2. Inicio de Sesión

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "123456"
  }'
```

### 3. Crear Producto (Requiere Token)

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -d '{
    "name": "Producto Ejemplo",
    "description": "Descripción del producto",
    "price": 99.99,
    "stock": 100
  }'
```

### 4. Obtener Todos los Productos

```bash
curl -X GET http://localhost:3000/api/products
```

### 5. Actualizar Producto Parcialmente (Requiere Token)

```bash
curl -X PATCH http://localhost:3000/api/products/:id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -d '{
    "price": 89.99,
    "stock": 50
  }'
```

### 6. Actualizar Producto Completo (Requiere Token)

```bash
curl -X PUT http://localhost:3000/api/products/:id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -d '{
    "name": "Producto Actualizado",
    "description": "Nueva descripción del producto",
    "price": 149.99,
    "stock": 75
  }'
```

### 7. Eliminar Producto (Requiere Token)

```bash
curl -X DELETE http://localhost:3000/api/products/:id \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

## 🧪 Pruebas con Postman

### Configuración Inicial

1. **Crear Colección**: "E-Commerce API"
2. **Configurar Variables de Postman**:
   - `baseUrl`: `http://localhost:3000/api`
   - `token`: (vacío inicialmente)

### Flujo de Pruebas

1. **Registro/Login** → Obtener token JWT
2. **Configurar token** en encabezado de Postman
3. **Probar CRUD** de productos con token

## 🔒 Seguridad

### Rate Limiting

- **Endpoints generales**: 100 requests por 15 minutos
- **Endpoints de auth**: 5 intentos por hora

### Headers de Seguridad

- **Helmet** configurado para prevenir ataques comunes
- **CORS** configurado para orígenes permitidos
- **Content Security Policy** habilitado

### Validaciones

- **Campos requeridos** en todos los endpoints
- **Formato de email** validado
- **Longitud de contraseña** mínima (6 caracteres)
- **Tipos de datos** validados

## 🚀 Despliegue

### Vercel (Recomendado)

1. **Conectar repositorio** a Vercel
2. **Configurar variables de entorno** en el dashboard
3. **Desplegar automáticamente** en cada push

### Variables de Entorno para Producción

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
- ✅ **Documentación** - Completa y actualizada

## 🤝 Contribución

1. **Fork** el repositorio
2. **Crea una rama** para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crea un Pull Request**

## 📝 Licencia

Este proyecto es parte del curso de Node.js de Talento Tech.

## 👨‍💻 Autor

**Francisco Lucena**

- 📧 Email: [franciscolucena90@gmail.com]
- 🔗 LinkedIn: [https://www.linkedin.com/in/franciscoivanlucena/]
- 🐙 GitHub: [https://github.com/FLucena]

---

## 🙏 Agradecimientos

Gracias a **Talento Tech** y a todos los instructores por el acompañamiento y los conocimientos brindados durante el curso de Node.js.
