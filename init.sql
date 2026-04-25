-- Habilitar extensión para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla de Usuarios (Globales)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Negocios (Tenants)
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL, -- Para la url: mitienda.com/slug
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla Intermedia (Muchos a Muchos: Usuario <-> Negocio)
CREATE TABLE business_members (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'owner', -- owner, employee
    PRIMARY KEY (user_id, business_id)
);

-- 4. Tabla de Productos (Datos de Marketing)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE, -- Soft Delete simplificado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla de Variantes (Datos Transaccionales + Stock + Precios)
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL, -- Precio en centavos
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    
    -- Atributos (pueden ser null si el producto no tiene variantes)
    size VARCHAR(50), 
    color VARCHAR(50),
    
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Unicidad: No puede haber el mismo SKU en el mismo negocio (via join implícito)
    -- Nota: Simplificado para MVP, idealmente se valida en código o trigger complejo
    CONSTRAINT unique_sku_per_product UNIQUE (product_id, sku) 
);