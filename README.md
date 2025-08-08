# 🛒 eCommerce SaaS Platform

Una aplicación completa de comercio electrónico construida con las tecnologías más modernas de React y Next.js, diseñada para ser escalable, rápida y fácil de administrar.

## 📋 Tabla de Contenidos

- [🚀 Características Principales](#-características-principales)
- [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [⚙️ Instalación y Configuración](#️-instalación-y-configuración)
- [🔧 Configuración del Entorno](#-configuración-del-entorno)
- [📊 Gestión de Estado](#-gestión-de-estado)
- [🎨 Sistema de Diseño](#-sistema-de-diseño)
- [🔐 Autenticación y Autorización](#-autenticación-y-autorización)
- [📱 Funcionalidades](#-funcionalidades)
- [🚀 Despliegue](#-despliegue)
- [📝 Scripts Disponibles](#-scripts-disponibles)

## 🚀 Características Principales

### 🛍️ **Tienda Online Completa**

- ✅ Catálogo de productos con categorías organizadas
- ✅ Sistema de búsqueda y filtrado avanzado
- ✅ Carrito de compras con persistencia
- ✅ Lista de favoritos/wishlist
- ✅ Productos destacados y promociones
- ✅ Sistema de valoraciones y reseñas
- ✅ Checkout completo

### 👨‍💼 **Panel de Administración**

- ✅ Dashboard administrativo completo
- ✅ Gestión de productos (CRUD completo)
- ✅ Gestión de categorías
- ✅ Gestión de banners promocionales
- ✅ Sistema de órdenes y pedidos
- ✅ Configuraciones de la tienda
- ✅ Autenticación de administradores

### 📱 **Experiencia de Usuario**

- ✅ Diseño responsivo (Mobile-first)
- ✅ Interfaz moderna y limpia
- ✅ Navegación intuitiva
- ✅ Notificaciones en tiempo real
- ✅ Optimización de rendimiento

## 🛠️ Tecnologías Utilizadas

### **Frontend & Framework**

- **Next.js 15.4.5** - Framework de React con App Router
- **React 19.1.0** - Biblioteca de interfaces de usuario
- **TypeScript 5** - Tipado estático para JavaScript
- **Tailwind CSS 4** - Framework de CSS utility-first

### **Gestión de Estado**

- **Zustand 5.0.7** - Gestión de estado ligera y moderna
- **React Hook Form 7.62.0** - Manejo de formularios
- **Zod 4.0.15** - Validación de esquemas

### **UI Components**

- **Radix UI** - Componentes primitivos accesibles
- **Lucide React** - Iconos modernos
- **Sonner** - Sistema de notificaciones
- **Embla Carousel** - Carruseles y sliders

### **Autenticación**

- **NextAuth.js 4.24.11** - Autenticación completa
- **bcryptjs** - Hashing de contraseñas

### **Herramientas de Desarrollo**

- **ESLint** - Linter de código
- **PostCSS** - Procesamiento de CSS
- **Turbopack** - Bundler ultrarrápido

## 📁 Estructura del Proyecto

```
eCOMMERCE/
├── 📄 README.md                    # Documentación principal
├── 📄 package.json                 # Dependencias y scripts
├── 📄 next.config.ts               # Configuración de Next.js
├── 📄 tailwind.config.ts          # Configuración de Tailwind
├── 📄 tsconfig.json               # Configuración de TypeScript
├── 📄 .env                        # Variables de entorno
├── 📄 .gitignore                  # Archivos ignorados por Git
│
├── 📁 public/                     # Archivos estáticos públicos
│   ├── 🖼️ file.svg               # Iconos SVG
│   ├── 🖼️ globe.svg
│   ├── 🖼️ next.svg
│   ├── 🖼️ placeholder.svg
│   ├── 🖼️ vercel.svg
│   └── 🖼️ window.svg
│
└── 📁 src/                        # Código fuente principal
    ├── 📁 app/                    # App Router de Next.js 15
    │   ├── 📄 favicon.ico         # Icono de la aplicación
    │   ├── 📄 globals.css         # Estilos globales
    │   ├── 📄 layout.tsx          # Layout principal
    │   ├── 📄 page.tsx            # Página de inicio
    │   │
    │   ├── 📁 admin/              # Panel de administración
    │   │   ├── 📄 page.tsx        # Dashboard principal
    │   │   ├── 📁 banners/        # Gestión de banners
    │   │   │   └── 📄 page.tsx
    │   │   ├── 📁 categories/     # Gestión de categorías
    │   │   │   └── 📄 page.tsx
    │   │   ├── 📁 login/          # Login de administradores
    │   │   │   ├── 📄 page.tsx
    │   │   │   └── 📄 page_clean.tsx
    │   │   ├── 📁 orders/         # Gestión de pedidos
    │   │   │   └── 📄 page.tsx
    │   │   ├── 📁 products/       # Gestión de productos
    │   │   │   └── 📄 page.tsx
    │   │   └── 📁 settings/       # Configuraciones
    │   │       └── 📄 page.tsx
    │   │
    │   ├── 📁 api/                # API Routes
    │   │   └── 📁 auth/           # Endpoints de autenticación
    │   │       └── 📁 [...nextauth]/
    │   │           └── 📄 route.ts
    │   │
    │   ├── 📁 auth/               # Autenticación de usuarios
    │   │   └── 📄 page.tsx
    │   │
    │   ├── 📁 category/           # Páginas de categorías
    │   │   └── 📁 [category]/     # Rutas dinámicas
    │   │       └── 📄 page.tsx
    │   │
    │   ├── 📁 checkout/           # Proceso de compra
    │   │   └── 📄 page.tsx
    │   │
    │   ├── 📁 favorites/          # Lista de favoritos
    │   │   └── 📄 page.tsx
    │   │
    │   ├── 📁 orders/             # Historial de pedidos
    │   │   ├── 📄 page.tsx
    │   │   └── 📁 [id]/           # Detalles de pedido
    │   │       └── 📄 page.tsx
    │   │
    │   └── 📁 product/            # Páginas de productos
    │       └── 📁 [id]/           # Detalles de producto
    │           └── 📄 page.tsx
    │
    ├── 📁 components/             # Componentes reutilizables
    │   ├── 📁 admin/              # Componentes del admin
    │   │   ├── 📄 AdminDashboard.tsx     # Dashboard principal
    │   │   ├── 📄 AdminLayout.tsx        # Layout del admin
    │   │   ├── 📄 BannerForm.tsx         # Formulario de banners
    │   │   ├── 📄 CategoryForm.tsx       # Formulario de categorías
    │   │   ├── 📄 OrderManagement.tsx    # Gestión de pedidos
    │   │   ├── 📄 ProductForm.tsx        # Formulario de productos
    │   │   ├── 📄 ProtectedRoute.tsx     # Rutas protegidas
    │   │   └── 📄 index.ts               # Exports centralizados
    │   │
    │   ├── 📁 providers/          # Context Providers
    │   │   ├── 📄 AuthProvider.tsx       # Proveedor de autenticación
    │   │   └── 📄 StoreProvider.tsx      # Proveedor de estado global
    │   │
    │   ├── 📁 public/             # Componentes públicos
    │   │   ├── 📄 CartButton.tsx         # Botón del carrito
    │   │   ├── 📄 CartSheet.tsx          # Panel lateral del carrito
    │   │   ├── 📄 CategoryGrid.tsx       # Grid de categorías
    │   │   ├── 📄 CheckoutForm.tsx       # Formulario de checkout
    │   │   ├── 📄 Footer.tsx             # Pie de página
    │   │   ├── 📄 HeroBanner.tsx         # Banner principal
    │   │   ├── 📄 Navbar.tsx             # Barra de navegación
    │   │   ├── 📄 OrderDetails.tsx       # Detalles de pedidos
    │   │   ├── 📄 ProductCard.tsx        # Tarjeta de producto
    │   │   ├── 📄 ProductGrid.tsx        # Grid de productos
    │   │   ├── 📄 ProductModal.tsx       # Modal de producto
    │   │   ├── 📄 StoreCounters.tsx      # Contadores de la tienda
    │   │   ├── 📄 UserAuthForm.tsx       # Formulario de autenticación
    │   │   ├── 📄 UserOrdersList.tsx     # Lista de pedidos del usuario
    │   │   └── 📄 index.ts               # Exports centralizados
    │   │
    │   └── 📁 ui/                 # Componentes UI base
    │       ├── 📄 avatar.tsx             # Componente Avatar
    │       ├── 📄 badge.tsx              # Componente Badge
    │       ├── 📄 button.tsx             # Componente Button
    │       ├── 📄 card.tsx               # Componente Card
    │       ├── 📄 custom-modal.tsx       # Modal personalizado
    │       ├── 📄 dialog.tsx             # Componente Dialog
    │       ├── 📄 form.tsx               # Componentes de formulario
    │       ├── 📄 image-upload.tsx       # Subida de imágenes
    │       ├── 📄 input.tsx              # Componente Input
    │       ├── 📄 label.tsx              # Componente Label
    │       ├── 📄 multiple-image-upload.tsx # Subida múltiple
    │       ├── 📄 notifications.tsx      # Sistema de notificaciones
    │       ├── 📄 select.tsx             # Componente Select
    │       ├── 📄 sheet.tsx              # Componente Sheet
    │       ├── 📄 table.tsx              # Componente Table
    │       └── 📄 textarea.tsx           # Componente Textarea
    │
    ├── 📁 lib/                    # Utilidades y configuración
    │   ├── 📄 auth-config.ts             # Configuración de autenticación
    │   ├── 📄 auth.ts                    # Lógica de autenticación
    │   ├── 📄 getStoreData.ts            # Obtención de datos
    │   ├── 📄 utils.ts                   # Utilidades generales
    │   └── 📄 index.ts                   # Exports centralizados
    │
    ├── 📁 store/                  # Gestión de estado con Zustand
    │   ├── 📄 auth-store.ts              # Estado de autenticación
    │   ├── 📄 banner-store.ts            # Estado de banners
    │   ├── 📄 cart-store.tsx             # Estado del carrito
    │   ├── 📄 category-store.ts          # Estado de categorías
    │   ├── 📄 favorites-store.ts         # Estado de favoritos
    │   ├── 📄 notification-store.ts      # Estado de notificaciones
    │   ├── 📄 order-store.ts             # Estado de pedidos
    │   ├── 📄 order-store-updated.ts     # Versión actualizada
    │   └── 📄 product-store.ts           # Estado de productos
    │
    └── 📁 types/                  # Definiciones de TypeScript
        ├── 📄 banner.ts                  # Tipos de banners
        ├── 📄 cart.ts                    # Tipos del carrito
        ├── 📄 category.ts                # Tipos de categorías
        ├── 📄 index.ts                   # Exports centralizados
        ├── 📄 next-auth.d.ts             # Tipos de NextAuth
        ├── 📄 order.ts                   # Tipos de pedidos
        ├── 📄 product.ts                 # Tipos de productos
        └── 📄 store.ts                   # Tipos del store
```

## ⚙️ Instalación y Configuración

### **Prerrequisitos**

- Node.js 18+
- npm o yarn
- Git

### **Pasos de Instalación**

1. **Clonar el repositorio**

```bash
git clone [URL_DEL_REPOSITORIO]
cd eCOMMERCE
```

2. **Instalar dependencias**

```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno**

```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Ejecutar en modo desarrollo**

```bash
npm run dev
```

5. **Abrir en el navegador**

```
http://localhost:3000
```

## 🔧 Configuración del Entorno

### **Variables de Entorno (.env)**

```env
# Configuración de NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_clave_secreta_muy_segura

# Configuración de Base de Datos (si aplica)
DATABASE_URL=tu_string_de_conexion

# Configuración de APIs externas
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Configuración de almacenamiento de imágenes
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

## 📊 Gestión de Estado

### **Stores Principales (Zustand)**

#### **🛒 Cart Store (`cart-store.tsx`)**

- Gestión del carrito de compras
- Persistencia en localStorage
- Cálculos de totales automáticos
- Funciones: `addItem`, `removeItem`, `updateQuantity`, `clearCart`

#### **📦 Product Store (`product-store.ts`)**

- Catálogo de productos
- Filtrado y búsqueda
- Productos destacados (solo promociones)
- Gestión CRUD completa

#### **📂 Category Store (`category-store.ts`)**

- Gestión de categorías
- Jerarquía de categorías
- Funciones de filtrado

#### **❤️ Favorites Store (`favorites-store.ts`)**

- Lista de productos favoritos
- Persistencia local
- Sincronización con usuario

#### **🔐 Auth Store (`auth-store.ts`)**

- Estado de autenticación
- Información del usuario
- Roles y permisos

#### **📋 Order Store (`order-store.ts`)**

- Historial de pedidos
- Estados de pedidos
- Tracking de entregas

## 🎨 Sistema de Diseño

### **Componentes UI Base**

- **Button**: Botones con variantes (primary, secondary, destructive)
- **Card**: Contenedores con sombras y bordes
- **Input**: Campos de entrada con validación
- **Select**: Selectores desplegables
- **Modal/Dialog**: Ventanas modales
- **Sheet**: Paneles laterales deslizantes
- **Table**: Tablas con sorting y paginación

### **Tema y Colores**

- Basado en Tailwind CSS 4
- Modo oscuro/claro automático
- Paleta de colores personalizable
- Componentes responsivos

## 🔐 Autenticación y Autorización

### **NextAuth.js Configuration**

- **Providers**: Email/Password, Google, GitHub
- **Session Strategy**: JWT
- **Roles**: `user`, `admin`
- **Protected Routes**: `/admin/*`, `/orders/*`

### **Rutas Protegidas**

- `/admin/*` - Solo administradores
- `/orders/*` - Usuarios autenticados
- `/favorites` - Usuarios autenticados
- `/checkout` - Usuarios autenticados

## 📱 Funcionalidades

### **🏪 Tienda Online**

#### **Página Principal**

- Hero banner con promociones
- Categorías destacadas
- Productos destacados (solo promociones)
- Footer con información

#### **Catálogo de Productos**

- Grid responsivo de productos
- Filtros por categoría, precio, rating
- Búsqueda en tiempo real
- Paginación automática
- Ordenamiento (precio, popularidad, fecha)

#### **Detalles de Producto**

- Galería de imágenes
- Información detallada
- Valoraciones y reseñas
- Productos relacionados
- Botones de compra y favoritos

#### **Carrito de Compras**

- Panel lateral deslizante
- Actualización de cantidades
- Cálculo de totales
- Persistencia en localStorage
- Aplicación de descuentos

#### **Proceso de Checkout**

- Formulario de datos de envío
- Resumen del pedido
- Métodos de pago
- Confirmación y tracking

### **👨‍💼 Panel de Administración**

#### **Dashboard**

- Métricas de ventas
- Productos más vendidos
- Pedidos recientes
- Gráficos de rendimiento

#### **Gestión de Productos**

- Lista con filtros y búsqueda
- Formulario de creación/edición
- Subida múltiple de imágenes
- Gestión de stock y precios
- Estados (activo/inactivo)

#### **Gestión de Categorías**

- Árbol de categorías
- Creación y edición
- Ordenamiento personalizado
- Imágenes y descripciones

#### **Gestión de Pedidos**

- Lista de todos los pedidos
- Filtros por estado y fecha
- Cambio de estados
- Impresión de facturas
- Comunicación con clientes

#### **Configuraciones**

- Información de la tienda
- Métodos de pago
- Costos de envío
- Notificaciones
- Usuarios administrativos

## 🚀 Despliegue

### **Vercel (Recomendado)**

1. Conectar repositorio en Vercel
2. Configurar variables de entorno
3. Deploy automático

### **Otros Proveedores**

- **Netlify**: Compatible con Next.js
- **Railway**: Base de datos incluida
- **DigitalOcean**: VPS personalizado
- **AWS**: EC2 + RDS

### **Build para Producción**

```bash
npm run build
npm start
```

## 📝 Scripts Disponibles

```bash
# Desarrollo con Turbopack
npm run dev

# Build de producción
npm run build

# Iniciar servidor de producción
npm start

# Linter de código
npm run lint

# Formatear código
npm run format

# Tests (si están configurados)
npm run test
```

## 🛡️ Seguridad

### **Medidas Implementadas**

- ✅ Hashing de contraseñas con bcryptjs
- ✅ Validación de esquemas con Zod
- ✅ Sanitización de inputs
- ✅ Protección CSRF automática
- ✅ Headers de seguridad configurados
- ✅ Validación de tipos con TypeScript

### **Variables de Entorno Seguras**

- Claves de API nunca expuestas al cliente
- Secrets de autenticación seguros
- Configuración de CORS apropiada

## 🐛 Troubleshooting

### **Problemas Comunes**

#### **Error de Build**

```bash
# Limpiar cache y reinstalar
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

#### **Problemas de TypeScript**

```bash
# Reiniciar servidor de TypeScript
npm run build
# O en VS Code: Ctrl+Shift+P > "TypeScript: Restart TS Server"
```

#### **Problemas de Estado**

- Verificar que los stores estén importados correctamente
- Revisar la persistencia en localStorage
- Comprobar la configuración de Zustand

## 📞 Soporte y Contribución

### **Estructura de Issues**

- 🐛 **Bug Report**: Descripción detallada del error
- ✨ **Feature Request**: Nueva funcionalidad propuesta
- 📖 **Documentation**: Mejoras en documentación
- 🔧 **Enhancement**: Mejoras en código existente

### **Guía de Contribución**

1. Fork del repositorio
2. Crear branch feature
3. Hacer commits descriptivos
4. Crear Pull Request
5. Revisar y mergear

---

## 📈 Roadmap Futuro

### **Próximas Funcionalidades**

- [ ] Sistema de pagos con Stripe
- [ ] Notificaciones push
- [ ] Chat en vivo
- [ ] Sistema de cupones avanzado
- [ ] Analytics detallados
- [ ] API REST completa
- [ ] App móvil con React Native
- [ ] Marketplace multi-vendor

### **Optimizaciones Técnicas**

- [ ] Server-side rendering optimizado
- [ ] Cache con Redis
- [ ] CDN para imágenes
- [ ] Lazy loading avanzado
- [ ] Progressive Web App (PWA)

---

**🎉 ¡Tu plataforma eCommerce está lista para crecer y escalar!**

_Documentación actualizada: Agosto 2025_
