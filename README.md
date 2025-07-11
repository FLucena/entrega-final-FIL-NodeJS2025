# 🛍️ E-Commerce API - Node.js RESTful API

## 📋 Descripción del Proyecto

Este proyecto es una **API RESTful completa** desarrollada en Node.js para la gestión de productos de una tienda en línea (E-Commerce). La aplicación permite realizar operaciones CRUD completas sobre productos, con autenticación JWT y soporte para múltiples bases de datos.

### 🎯 Objetivos del Proyecto

- ✅ **API RESTful funcional** con endpoints para gestión de productos
- ✅ **Sistema de autenticación** con JWT para usuarios autorizados
- ✅ **Persistencia de datos** en archivos JSON y Firebase/Firestore
- ✅ **Frontend integrado** con interfaz moderna y responsiva
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
- **Firebase/Firestore** - Base de datos en la nube
- **JSON Files** - Datos locales para desarrollo
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
- **Gestión de stock** con indicadores visuales

### 🗄️ Base de Datos
- **Datos locales**: Archivos JSON para desarrollo
- **Firebase/Firestore**: Base de datos en la nube para producción
- **Fallback automático**: Si Firebase falla, usa datos locales
- **Migración transparente** entre entornos

### 🎨 Frontend Integrado
- **Interfaz moderna** con gradientes y animaciones
- **Diseño responsivo** para desktop, tablet y móvil
- **Gestión visual** de productos con formularios intuitivos
- **Notificaciones** y feedback visual para todas las operaciones

## 📁 Estructura del Proyecto

```
Entrega-Final-FIL/
├── 📁 config/                 # Configuraciones (CORS, Firebase)
├── 📁 controllers/            # Lógica de negocio
│   ├── authController.js      # Autenticación (login/register)
│   └── productController.js   # Gestión de productos
├── 📁 data/                  # Datos mock (JSON)
│   ├── mockProducts.json     # Productos de ejemplo
│   └── mockUsers.json        # Usuarios de ejemplo
├── 📁 middleware/            # Middleware personalizado
│   └── auth.js              # Verificación de JWT
├── 📁 models/               # Modelos de datos
│   ├── productModel.js      # Modelo de productos
│   └── userModel.js         # Modelo de usuarios
├── 📁 public/               # Frontend de la aplicación
├── 📁 routes/               # Definición de rutas
│   ├── authRoutes.js        # Rutas de autenticación
│   └── productRoutes.js     # Rutas de productos
├── 📁 services/             # Servicios (Firestore)
├── 📁 tests/                # Pruebas unitarias
├── 📄 index.js              # Punto de entrada del servidor
├── 📄 package.json          # Dependencias y scripts
└── 📄 README.md             # Esta documentación
```

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
Crea un archivo `.env` en la raíz del proyecto:

```env
# Configuración del servidor
PORT=3000

# JWT Secret
JWT_SECRET=tu-secreto-jwt-super-seguro

# Firebase (opcional para desarrollo)
FIREBASE_PROJECT_ID=tu-proyecto-firebase
FIREBASE_CLIENT_EMAIL=tu-email@proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

#### Sobre NODE_ENV y nodemon
- Cuando usas `npm run dev` (o ejecutas nodemon), el valor de `NODE_ENV` se toma automáticamente del archivo `nodemon.json`.
  - Si en `nodemon.json` tienes:
    - `"NODE_ENV": "development"` → Usarás datos mock (JSON local)
    - `"NODE_ENV": "production"` → Usarás Firestore real
- **Solo necesitas definir `NODE_ENV` en `.env` si ejecutas la app con `node index.js` o `npm start` directamente.**

Ejemplo de `.env` para producción:
```env
PORT=3000
NODE_ENV=production
JWT_SECRET=tu-secreto
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

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

- **Frontend**: http://localhost:3000
- **API Base URL**: http://localhost:3000/api

## 📡 Endpoints de la API

### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Registrar nuevo usuario | ❌ No requiere |
| `POST` | `/api/auth/login` | Iniciar sesión | ❌ No requiere |

### 📦 Productos (`/api/products`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `GET` | `/api/products` | Obtener todos los productos | ❌ No requiere |
| `GET` | `/api/products/:id` | Obtener producto por ID | ❌ No requiere |
| `POST` | `/api/products` | Crear nuevo producto | ✅ Requiere JWT |
| `PUT` | `/api/products/:id` | Actualizar producto completo | ✅ Requiere JWT |
| `PATCH` | `/api/products/:id` | Actualizar producto parcialmente | ✅ Requiere JWT |
| `DELETE` | `/api/products/:id` | Eliminar producto | ✅ Requiere JWT |



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
curl -X PATCH http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -d '{
    "price": 89.99,
    "stock": 50
  }'
```

### 6. Actualizar Producto Completo (Requiere Token)
```bash
curl -X PUT http://localhost:3000/api/products/1 \
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
curl -X DELETE http://localhost:3000/api/products/1 \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

## 🧪 Pruebas con Postman

### Configuración Inicial

1. **Crear Colección**: "E-Commerce API"
2. **Configurar Variables de Entorno**:
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
```env
JWT_SECRET=secreto-super-seguro-produccion
FIREBASE_PROJECT_ID=tu-proyecto-firebase
FIREBASE_CLIENT_EMAIL=tu-email@proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

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
- ✅ **Frontend integrado** - Interfaz moderna y responsiva
- ✅ **Base de datos** - JSON local + Firebase/Firestore
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