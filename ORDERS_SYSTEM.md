# Sistema de Gestión de Órdenes

Este documento explica cómo funciona el sistema de órdenes implementado en el eCommerce.

## Funcionalidades Implementadas

### Para Usuarios

1. **Checkout**: Los usuarios pueden proceder al checkout desde el carrito
2. **Crear Órdenes**: Completar formulario con información de envío
3. **Ver Mis Órdenes**: Lista de todas las órdenes del usuario
4. **Detalles de Orden**: Ver información completa de cada orden
5. **Cancelar Órdenes**: Los usuarios pueden cancelar órdenes pendientes o confirmadas

### Para Administradores

1. **Dashboard**: Resumen general con estadísticas de órdenes
2. **Gestión de Órdenes**: Ver y administrar todas las órdenes del sistema
3. **Cambio de Estado**: Actualizar el estado de las órdenes (pendiente → confirmado → enviado → entregado)
4. **Filtros**: Filtrar órdenes por estado
5. **Estadísticas**: Métricas de ventas, ingresos y estado de órdenes

## Estados de Órdenes

Las órdenes pueden tener los siguientes estados:

- **Pendiente** (pending): Orden recién creada, esperando confirmación
- **Confirmado** (confirmed): Orden confirmada por el administrador
- **Enviado** (shipped): Orden enviada, en camino al cliente
- **Entregado** (delivered): Orden entregada exitosamente
- **Cancelado** (cancelled): Orden cancelada por el usuario o administrador

## Navegación

### Para Usuarios

- **Carrito → Checkout**: Botón azul "Proceder al Checkout" en el carrito
- **Navbar**: Icono de paquete (📦) para acceder a "Mis Órdenes" (solo visible si el usuario está logueado)
- **Órdenes**: Lista de órdenes en `/orders`
- **Detalle**: Clic en "Ver Detalles" para ver orden específica en `/orders/[id]`

### Para Administradores

- **Sidebar Admin**: Enlace "Órdenes" en el menú lateral
- **Dashboard**: Página principal del admin muestra estadísticas
- **Gestión**: Página completa de gestión en `/admin/orders`

## Uso del Sistema

### Como Usuario

1. **Hacer un Pedido**:

   - Agregar productos al carrito
   - Ir al carrito y hacer clic en "Proceder al Checkout"
   - Completar el formulario con información de envío
   - Confirmar la orden

2. **Ver Mis Órdenes**:

   - Hacer clic en el icono de paquete en la navegación
   - Ver lista de todas tus órdenes
   - Hacer clic en "Ver Detalles" para más información

3. **Cancelar una Orden**:
   - Ir a los detalles de la orden
   - Hacer clic en "Cancelar Orden" (solo disponible para órdenes pendientes o confirmadas)

### Como Administrador

1. **Ver Dashboard**:

   - Ir a `/admin` para ver el resumen general
   - Estadísticas de órdenes, ingresos y productos

2. **Gestionar Órdenes**:

   - Ir a `/admin/orders` para ver todas las órdenes
   - Usar filtros para encontrar órdenes específicas
   - Cambiar estado de órdenes usando el dropdown

3. **Cambiar Estado de Órdenes**:
   - En la tabla de órdenes, usar el selector de estado
   - Los cambios se guardan automáticamente

## Estructura de Archivos

### Tipos

- `src/types/order.ts`: Definiciones de tipos para órdenes

### Stores (Zustand)

- `src/store/order-store.ts`: Estado global para órdenes

### Componentes Públicos

- `src/components/public/CheckoutForm.tsx`: Formulario de checkout
- `src/components/public/OrderDetails.tsx`: Detalles de una orden
- `src/components/public/UserOrdersList.tsx`: Lista de órdenes del usuario

### Componentes Admin

- `src/components/admin/AdminDashboard.tsx`: Dashboard del administrador
- `src/components/admin/OrderManagement.tsx`: Gestión completa de órdenes

### Páginas

- `src/app/checkout/page.tsx`: Página de checkout
- `src/app/orders/page.tsx`: Lista de órdenes del usuario
- `src/app/orders/[id]/page.tsx`: Detalles de orden específica
- `src/app/admin/orders/page.tsx`: Gestión admin de órdenes

## Almacenamiento

Las órdenes se almacenan en localStorage usando Zustand con persistencia. En un entorno de producción, esto se reemplazaría con una base de datos real.

## Próximas Mejoras

1. **Notificaciones**: Sistema de notificaciones para cambios de estado
2. **Tracking**: Número de seguimiento para órdenes enviadas
3. **Reportes**: Reportes detallados de ventas por período
4. **Exportación**: Exportar órdenes a CSV/PDF
5. **Filtros Avanzados**: Filtros por fecha, cliente, monto, etc.
6. **Pagos**: Integración con sistemas de pago reales
7. **Email**: Envío de emails automáticos para cambios de estado

## Integración con Base de Datos

Para conectar con una base de datos real:

1. Reemplazar los stores de Zustand con llamadas a API
2. Crear endpoints en `/api/orders/` para CRUD de órdenes
3. Implementar autenticación real para asociar órdenes a usuarios
4. Agregar validaciones del lado del servidor

## Consideraciones de Seguridad

- Los usuarios solo pueden ver y cancelar sus propias órdenes
- Los administradores pueden ver y modificar todas las órdenes
- La validación de permisos se hace en cada componente
- En producción, agregar validaciones del lado del servidor
