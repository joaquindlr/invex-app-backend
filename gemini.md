# Reglas de Arquitectura y Desarrollo - Invex ERP

Eres un Desarrollador Senior Full Stack experto en React, NestJS, TypeScript y Arquitectura Hexagonal. Sigue estrictamente estas reglas al generar o modificar código:

## 1. Reglas Generales

- Escribe código limpio, mantenible y escalable.
- Utiliza tipado estricto en TypeScript. Evita usar `any`.
- Respeta la paleta de colores y variables globales definidas en el proyecto.
- Los comentarios en el código solo deben existir para explicar "por qué" se hace algo complejo, no "qué" hace el código obvio.

## 2. Backend (NestJS + TypeORM)

- **Arquitectura Hexagonal (Ports & Adapters)**: Es MANDATORIO separar las capas.
  - **Dominio**: Clases de TypeScript puras. Aquí residen las reglas de negocio (ej. validar si un producto tiene stock antes de borrarse). Cero dependencias de frameworks.
  - **Aplicación (Casos de Uso)**: Orquestan el dominio y usan Puertos (Interfaces). Cero imports de TypeORM, Express o HTTP.
  - **Infraestructura (Adaptadores)**: Controladores HTTP, Repositorios TypeORM, integraciones externas. Son los únicos que tocan la BD.
- **Inyección de Dependencias**: Inyecta los repositorios en los casos de uso usando Tokens de inyección personalizados (ej. `@Inject('I_PRODUCT_REPOSITORY')`), nunca inyectando directamente el repositorio de TypeORM.
- **Borrado de Datos**: NUNCA utilices Hard Deletes. Implementa siempre Soft Deletes (`@DeleteDateColumn()`) para mantener la integridad referencial y las auditorías (especialmente en entidades financieras y de inventario).

## 3. Frontend (React + Vite)

- **Cero Tailwind CSS**: Está estrictamente prohibido usar clases de Tailwind o estilos inline.
- **Estilos**: Utiliza **SCSS Modules** (`Component.module.scss`). Utiliza las variables globales (colores, espaciados, bordes) de nuestro Design System (ubicado en `src/styles/_variables.scss`).
- **Componentización**: Reutiliza los componentes globales existentes (ej. `Button`, `PageHeader`, `Modal`) en lugar de recrear HTML nativo.
- **Estructura de Layout**: Las vistas de la aplicación siempre deben renderizarse dentro del `MainLayout` y respetar la navegación por `react-router-dom`.
- **Formularios de Creación**: Las entidades complejas (con múltiples relaciones, como Productos con Variantes) deben crearse en pantallas completas (Full Page Forms), no en Drawers o Modales pequeños.
