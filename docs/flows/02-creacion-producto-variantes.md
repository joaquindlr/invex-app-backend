# Flujo: Creación de Producto y Variantes

## 🎯 Objetivo

Describir cómo un usuario autenticado crea un producto con sus variantes asociadas y registra el movimiento de stock inicial, garantizando la consistencia de los datos en una sola transacción.

## 🧠 Reglas de Negocio (Reglas Estrictas para la IA)

1. **Validación de Tenancy:** El usuario debe ser miembro de la empresa (`businessId`) para poder crear productos en ella (`businessRepo.findByUserId(userId)`).
2. **Unicidad de SKU:** El `sku` de cada variante debe ser único dentro de la misma empresa.
3. **Atomicidad (Transacción):** La creación del producto, la inserción de variantes en cascada y el registro de movimientos de stock deben ejecutarse de forma atómica usando un `QueryRunner`.
4. **Trazabilidad de Stock:** Se debe crear un registro de `StockMovementEntity` de tipo `IN_INITIAL` de manera automática únicamente para las variantes ingresadas con un `stock > 0`.

## 🔄 Diagrama de Flujo (Mermaid)

```mermaid
sequenceDiagram
    actor Usuario
    participant API
    participant BD (businesses)
    participant BD (products / variants)
    participant BD (stock_movements)

    Usuario->>API: POST /products (DTO con producto y variantes)
    API->>BD (businesses): Verifica si userId es miembro de businessId
    alt No es miembro
        API-->>Usuario: ForbiddenException
    else Es miembro
        API->>API: Inicia Transacción (QueryRunner)
        API->>API: Inyecta businessId a cada variante
        API->>BD (products / variants): Guarda ProductEntity (Cascade true)
        alt Falla por SKU duplicado
            API->>API: Rollback Transacción
            API-->>Usuario: BadRequestException
        else Éxito al guardar
            loop Por cada variante con stock > 0
                API->>BD (stock_movements): Crea Movimiento IN_INITIAL
            end
            API->>API: Commit Transacción
            API-->>Usuario: 201 Created (Producto guardado)
        end
    end
```
