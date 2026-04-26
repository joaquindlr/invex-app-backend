# Flujo: Registro de Usuario y Creación de Empresa

## 🎯 Objetivo

Describir cómo un cliente paga por el servicio, se registra en la plataforma y crea su espacio de trabajo inicial.

## 🧠 Reglas de Negocio (Reglas Estrictas para la IA)

1. **La fuente de verdad del cupo** al registrarse es la tabla `plan_provisioning`.
2. **El límite de creación** de empresas lo dicta el campo `user.maxAllowedBusinesses`, NO el plan provisioning.
3. El email debe estar sanitizado (`.trim().toLowerCase()`) en todas las validaciones.
4. Los empleados (invitados) se registrarán con cupo `0`, pero esto NO debe bloquear que acepten invitaciones a empresas de otros.

## 🔄 Diagrama de Flujo (Mermaid)

```mermaid
sequenceDiagram
    actor Admin (Tú)
    actor Usuario
    participant API
    participant BD (plan_provisioning)
    participant BD (users)
    participant BD (businesses)

    Admin->>BD (plan_provisioning): Inserta email y cupo (Ej: max=1)
    Usuario->>API: POST /users (Registro)
    API->>BD (plan_provisioning): Busca email sanitizado
    alt Existe y no está reclamado
        API->>API: Asigna maxAllowedBusinesses = BD.max
        API->>BD (plan_provisioning): Marca isClaimed = true
    else No existe
        API->>API: Asigna maxAllowedBusinesses = 0
    end
    API->>BD (users): Crea Usuario
    Usuario->>API: POST /businesses (Crear Empresa)
    API->>BD (businesses): Verifica count(owner) < user.maxAllowedBusinesses
    API->>BD (businesses): Crea Empresa y BusinessMember(OWNER)
```
