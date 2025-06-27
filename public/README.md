# Frontend - Gestión de Productos

Este es el frontend de la aplicación de gestión de productos que permite interactuar con la API RESTful de manera visual e intuitiva.

## Características

### 🎨 **Interfaz Moderna**
- Diseño responsivo que se adapta a diferentes tamaños de pantalla
- Gradientes y animaciones suaves
- Iconos de Font Awesome para mejor experiencia visual
- Paleta de colores moderna y profesional

### 📱 **Funcionalidades Principales**

#### **Gestión de Productos**
- **Ver productos**: Lista todos los productos disponibles con información detallada
- **Crear productos**: Formulario para agregar nuevos productos
- **Editar productos**: Modificar información de productos existentes
- **Eliminar productos**: Eliminar productos con confirmación

#### **Indicadores Visuales**
- **Estado del stock**: Badges de colores (Alto/Medio/Bajo) según la cantidad
- **Notificaciones**: Mensajes de éxito, error e información
- **Loading states**: Indicadores de carga durante las operaciones
- **Validación**: Validación de formularios en tiempo real

### 🔧 **Tecnologías Utilizadas**

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con Grid, Flexbox y animaciones
- **JavaScript ES6+**: Lógica de la aplicación con async/await
- **Font Awesome**: Iconos vectoriales
- **Fetch API**: Comunicación con el backend

### 📋 **Estructura de Archivos**

```
public/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript
└── README.md           # Esta documentación
```

## 🚀 **Cómo Usar**

### **1. Acceder a la Aplicación**
- Abre tu navegador y ve a `http://localhost:3000` (o la URL de tu servidor)
- La interfaz se cargará automáticamente

### **2. Ver Productos**
- Los productos se cargan automáticamente al abrir la página
- Usa el botón "Actualizar" para recargar la lista
- Cada producto muestra:
  - Nombre y precio
  - Descripción
  - Stock con indicador visual
  - Botones de acción

### **3. Crear un Producto**
1. Llena el formulario en la sección izquierda
2. Campos requeridos:
   - **Nombre**: Nombre del producto
   - **Descripción**: Descripción detallada
   - **Precio**: Precio en dólares (con decimales)
   - **Stock**: Cantidad disponible
3. Haz clic en "Guardar Producto"
4. El producto aparecerá en la lista

### **4. Editar un Producto**
1. Haz clic en "Editar" en cualquier producto
2. El formulario se llenará con los datos actuales
3. Modifica los campos que desees
4. Haz clic en "Actualizar Producto"
5. O usa "Cancelar" para descartar cambios

### **5. Eliminar un Producto**
1. Haz clic en "Eliminar" en cualquier producto
2. Confirma la eliminación en el modal
3. El producto se eliminará de la lista

## 🎯 **Funcionalidades Avanzadas**

### **Indicadores de Stock**
- **Verde (Alto)**: Más de 20 unidades
- **Amarillo (Medio)**: Entre 6 y 20 unidades
- **Rojo (Bajo)**: 5 unidades o menos

### **Notificaciones**
- **Verde**: Operaciones exitosas
- **Rojo**: Errores y problemas
- **Azul**: Información general
- Se auto-ocultan después de 5 segundos

### **Responsive Design**
- **Desktop**: Layout de dos columnas
- **Tablet**: Layout adaptativo
- **Mobile**: Layout de una columna optimizado

## 🔗 **Integración con la API**

El frontend se comunica con los siguientes endpoints:

- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener un producto específico
- `POST /api/products` - Crear un nuevo producto
- `PUT /api/products/:id` - Actualizar un producto
- `DELETE /api/products/:id` - Eliminar un producto

### **Manejo de Errores**
- Errores de red se muestran como notificaciones
- Validación de formularios en el cliente
- Fallback a datos mock en caso de error del servidor

## 🛠 **Desarrollo**

### **Modo Desarrollo vs Producción**
- En desarrollo: Usa datos mock del archivo `mockProducts.json`
- En producción: Se conecta a Firebase Firestore
- Fallback automático a datos mock si hay errores

### **Personalización**
Puedes personalizar la aplicación modificando:

- **Colores**: Edita las variables CSS en `styles.css`
- **Funcionalidades**: Modifica la lógica en `script.js`
- **Layout**: Ajusta la estructura en `index.html`

## 📱 **Compatibilidad**

- **Navegadores modernos**: Chrome, Firefox, Safari, Edge
- **Dispositivos**: Desktop, tablet, móvil
- **JavaScript**: ES6+ (async/await, fetch, etc.)

## 🚨 **Notas Importantes**

1. **CORS**: La aplicación está configurada para funcionar con el backend local
2. **Seguridad**: Se incluyen headers de seguridad con Helmet
3. **Performance**: Los archivos estáticos se sirven de manera optimizada
4. **Accesibilidad**: Se incluyen atributos ARIA y navegación por teclado

---

¡Disfruta usando la interfaz de gestión de productos! 🎉 