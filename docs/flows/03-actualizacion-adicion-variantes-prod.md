# Flujo: Actualización de Producto y Adición de Variantes

## 🎯 Objetivo

Describir el proceso para editar un producto, permitiendo agregar nuevas variantes con su stock inicial correspondiente y modificar atributos de variantes existentes, garantizando en todo momento la inmutabilidad del stock histórico.

## 🧠 Reglas de Negocio (Reglas Estrictas para la IA)

1. **Validación de Tenancy:** El usuario debe pertenecer a la empresa dueña del producto (`businessId`) para poder realizar cualquier modificación.
2. **Diferenciación de Variantes:** - Las variantes en el DTO **SIN** `id` se procesan como _nuevas creaciones_.
   - Las variantes en el DTO **CON** `id` se procesan como _actualizaciones_.
3. **Inmutabilidad del Stock Existente:** El campo `stock` enviado en el DTO es **ignorado** para las variantes que ya existen (que tienen `id`). La única forma de alterar el stock de una variante existente es a través del endpoint dedicado `POST /movements`.
4. **Trazabilidad de Stock Inicial:** Exclusivamente para las variantes **nuevas** (sin `id`) que se declaren con un `stock > 0`, el sistema debe registrar automáticamente un movimiento en `StockMovementEntity` de tipo `IN_INITIAL`.
5. **Fusión de Datos (Preload):** Se debe utilizar el método `preload` del repositorio de TypeORM para combinar los datos enviados en el DTO con el estado actual de la entidad en la base de datos antes de hacer el `.save()`.

## 🔄 Diagrama de Flujo (Mermaid)

```mermaid
sequenceDiagram
    actor Usuario
    participant API
    participant BD (products / variants)
    participant BD (stock_movements)

    Usuario->>API: PATCH /products/:id (DTO con variantes mezcladas)
    API->>API: Verifica si userId es miembro de la empresa
    alt No es miembro
        API-->>Usuario: ForbiddenException
    else Es miembro
        API->>API: Prepara variantes (Inyecta businessId)
        API->>BD (products / variants): Ejecuta preload() con el DTO
        API->>BD (products / variants): Guarda ProductEntity (Cascade true)

        loop Por cada variante en el DTO
            alt Variante NUEVA (sin id) Y stock > 0
                API->>BD (stock_movements): Crea Movimiento IN_INITIAL
            else Variante EXISTENTE (con id)
                API->>API: Ignora el campo stock enviado
            end
        end

        API-->>Usuario: 200 OK (Producto actualizado)
    end

    Note over Usuario,BD (stock_movements): Modificación de stock posterior
    Usuario->>API: POST /movements (Nueva entrada/salida)
    API->>BD (stock_movements): Registra movimiento
    API->>BD (products / variants): Actualiza stock de la variante existente
```
