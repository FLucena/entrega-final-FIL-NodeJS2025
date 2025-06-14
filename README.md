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
   # Modo producción
   npm start
   # o
   node index.js

   # Modo desarrollo (con reinicio automático)
   npm run dev
   ```

## Guía de Pruebas con Postman

### Configuración Inicial

1. **Crear una colección:**
   - Abre Postman
   - Crea una nueva colección llamada "API Productos"
   - Crea dos carpetas: "Auth" y "Productos"

2. **Configurar variables de entorno:**
   - Crea un nuevo entorno (Environment)
   - Agrega las siguientes variables:
     - `baseUrl`: `http://localhost:3000/api`
     - `token`: (déjalo vacío por ahora)

### Endpoints Disponibles

#### 1. Autenticación (No requiere token)

##### Registro de Usuario
```
POST {{baseUrl}}/auth/register
Content-Type: application/json

{
    "email": "usuario@ejemplo.com",
    "password": "123456",
    "name": "Usuario Ejemplo"
}
```

##### Inicio de Sesión
```
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
    "email": "usuario@ejemplo.com",
    "password": "123456"
}
```
- Guarda el token recibido en la respuesta para usarlo en las siguientes peticiones.

#### 2. Productos (Requiere token)

##### Obtener todos los productos
```
GET {{baseUrl}}/products
```

##### Obtener un producto por ID
```
GET {{baseUrl}}/products/:id
```

##### Crear un producto
```
POST {{baseUrl}}/products
Authorization: Bearer {{token}}
Content-Type: application/json

{
    "name": "Producto Ejemplo",
    "description": "Descripción del producto",
    "price": 99.99,
    "stock": 100
}
```

##### Actualizar un producto
```
PUT {{baseUrl}}/products/:id
Authorization: Bearer {{token}}
Content-Type: application/json

{
    "name": "Producto Actualizado",
    "description": "Nueva descripción",
    "price": 149.99,
    "stock": 50
}
```

##### Eliminar un producto
```
DELETE {{baseUrl}}/products/:id
Authorization: Bearer {{token}}
```

### Flujo de Prueba Recomendado

1. **Registro de Usuario:**
   - Ejecuta la petición de registro
   - Verifica que recibas un token en la respuesta

2. **Inicio de Sesión:**
   - Ejecuta la petición de login
   - Copia el token recibido
   - Configura el token en la variable de entorno `token`

3. **Operaciones CRUD:**
   - Prueba crear un nuevo producto
   - Lista todos los productos
   - Obtén un producto específico por ID
   - Actualiza el producto creado
   - Elimina el producto

### Headers Comunes

- Para todas las peticiones:
  ```
  Content-Type: application/json
  ```

- Para peticiones autenticadas:
  ```
  Authorization: Bearer {{token}}
  ```

### Respuestas Esperadas

- **Registro/Login Exitoso:**
  ```json
  {
    "message": "Usuario registrado correctamente",
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "email": "usuario@ejemplo.com",
      "name": "Usuario Ejemplo"
    }
  }
  ```

- **Producto Creado:**
  ```json
  {
    "message": "Producto creado correctamente",
    "product": {
      "id": "product-id",
      "name": "Producto Ejemplo",
      "description": "Descripción del producto",
      "price": 99.99,
      "stock": 100,
      "createdAt": "2024-03-14T12:00:00.000Z"
    }
  }
  ```

### Solución de Problemas

1. **Error 401 (Unauthorized):**
   - Verifica que el token esté correctamente configurado
   - Asegúrate de incluir el prefijo "Bearer" antes del token

2. **Error 400 (Bad Request):**
   - Verifica que todos los campos requeridos estén presentes
   - Asegúrate de que los tipos de datos sean correctos

3. **Error 404 (Not Found):**
   - Verifica que la URL sea correcta
   - Asegúrate de que el ID del producto exista

## Agradecimientos

Gracias a Talento Tech y a los instructores por el acompañamiento y los conocimientos brindados durante el curso.

## Configuración de Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Ve a Configuración del Proyecto > Cuentas de servicio
3. Genera una nueva clave privada
4. Copia los valores de las credenciales para configurar las variables de entorno

**Nota:** Las credenciales de Firebase son sensibles y deben manejarse a través de variables de entorno. No subas las credenciales directamente al repositorio.

## Configuración de Variables de Entorno

### Desarrollo Local
1. Crea un archivo `.env` en la raíz del proyecto
2. Copia el contenido de `.env.example` y rellena los valores con tus credenciales

### Despliegue en Vercel
1. Ve a la sección "Settings" de tu proyecto
2. Navega a "Environment Variables"
3. Agrega cada variable de entorno con sus respectivos valores
4. Para la `FIREBASE_PRIVATE_KEY`, asegúrate de escapar los saltos de línea con `\n`

**Nota:** Nunca subas el archivo `.env` al repositorio. Está incluido en `.gitignore` por seguridad.

---

**Autor:** Francisco Lucena