-- ========================================================
-- MICASITA MULTIRUBRO - SETUP COMPLETO
-- ========================================================
-- INSTRUCCIONES:
-- 1. Ve a Supabase > Tu proyecto > SQL Editor
-- 2. Copia TODO este contenido
-- 3. Pégalo en el SQL Editor
-- 4. Presiona "Run"
-- ========================================================

-- ========================================================
-- PASO 1: CREAR TABLAS PRINCIPALES
-- ========================================================

-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS public.categorias (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  imagen TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS public.productos (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  precio NUMERIC NOT NULL,
  categoria TEXT NOT NULL,
  imagen TEXT NOT NULL,
  descripcion TEXT,
  stock INTEGER DEFAULT 0,
  precio_costo NUMERIC DEFAULT 0,
  precio_venta_admin NUMERIC,
  fecha_ultima_venta TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de historial de ventas
CREATE TABLE IF NOT EXISTS public.ventas (
  id BIGSERIAL PRIMARY KEY,
  producto_id BIGINT NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
  cantidad_vendida INTEGER NOT NULL,
  precio_unitario NUMERIC NOT NULL,
  ganancia_unitaria NUMERIC NOT NULL,
  ganancia_total NUMERIC NOT NULL,
  fecha_venta TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de movimientos de caja
CREATE TABLE IF NOT EXISTS public.movimientos_caja (
  id BIGSERIAL PRIMARY KEY,
  tipo TEXT NOT NULL CHECK (tipo IN ('ingreso', 'egreso', 'venta')),
  monto NUMERIC NOT NULL,
  descripcion TEXT NOT NULL,
  relacionado_a TEXT,
  fecha TIMESTAMP DEFAULT NOW()
);

-- ========================================================
-- PASO 2: HABILITAR ROW LEVEL SECURITY (RLS)
-- ========================================================

ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimientos_caja ENABLE ROW LEVEL SECURITY;

-- ========================================================
-- PASO 3: CONFIGURAR POLÍTICAS DE SEGURIDAD
-- ========================================================

-- POLÍTICAS PARA CATEGORÍAS
DROP POLICY IF EXISTS "Lectura pública categorías" ON public.categorias;
CREATE POLICY "Lectura pública categorías" ON public.categorias
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Insertar categorías" ON public.categorias;
CREATE POLICY "Insertar categorías" ON public.categorias
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Actualizar categorías" ON public.categorias;
CREATE POLICY "Actualizar categorías" ON public.categorias
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Eliminar categorías" ON public.categorias;
CREATE POLICY "Eliminar categorías" ON public.categorias
  FOR DELETE USING (true);

-- POLÍTICAS PARA PRODUCTOS
DROP POLICY IF EXISTS "Lectura pública productos" ON public.productos;
CREATE POLICY "Lectura pública productos" ON public.productos
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Insertar productos" ON public.productos;
CREATE POLICY "Insertar productos" ON public.productos
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Actualizar productos" ON public.productos;
CREATE POLICY "Actualizar productos" ON public.productos
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Eliminar productos" ON public.productos;
CREATE POLICY "Eliminar productos" ON public.productos
  FOR DELETE USING (true);

-- POLÍTICAS PARA VENTAS
DROP POLICY IF EXISTS "Lectura ventas" ON public.ventas;
CREATE POLICY "Lectura ventas" ON public.ventas
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Insertar ventas" ON public.ventas;
CREATE POLICY "Insertar ventas" ON public.ventas
  FOR INSERT WITH CHECK (true);

-- POLÍTICAS PARA MOVIMIENTOS DE CAJA
DROP POLICY IF EXISTS "Lectura movimientos caja" ON public.movimientos_caja;
CREATE POLICY "Lectura movimientos caja" ON public.movimientos_caja
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Insertar movimientos caja" ON public.movimientos_caja;
CREATE POLICY "Insertar movimientos caja" ON public.movimientos_caja
  FOR INSERT WITH CHECK (true);

-- ========================================================
-- PASO 4: INSERTAR CATEGORÍAS POR DEFECTO
-- ========================================================

INSERT INTO public.categorias (nombre, imagen) VALUES
  ('Electrónica', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E🔌%3C/text%3E%3C/svg%3E'),
  ('Juguetes', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E🎮%3C/text%3E%3C/svg%3E'),
  ('Útiles', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E✏️%3C/text%3E%3C/svg%3E'),
  ('Hogar', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E🏠%3C/text%3E%3C/svg%3E'),
  ('Bazar', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E🛒%3C/text%3E%3C/svg%3E'),
  ('Blanquería', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E🛏️%3C/text%3E%3C/svg%3E'),
  ('Freidoras de aire', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E🍟%3C/text%3E%3C/svg%3E'),
  ('Droguería', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E💊%3C/text%3E%3C/svg%3E')
ON CONFLICT (nombre) DO NOTHING;

-- ========================================================
-- ✅ SETUP COMPLETADO
-- ========================================================
-- Ya tienes:
-- ✓ Tablas: categorias, productos, ventas, movimientos_caja
-- ✓ RLS habilitado en todas
-- ✓ Políticas de seguridad configuradas
-- ✓ 8 categorías por defecto insertadas
-- ========================================================
