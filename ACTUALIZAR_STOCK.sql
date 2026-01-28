-- ========================================================
-- ACTUALIZAR TABLA DE PRODUCTOS CON STOCK Y PRECIOS
-- ========================================================
-- Ejecuta este SQL en: Supabase Dashboard > SQL Editor

-- Agregar columnas de stock y precios a la tabla productos
ALTER TABLE public.productos 
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS precio_costo NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS precio_venta_admin NUMERIC,
ADD COLUMN IF NOT EXISTS fecha_ultima_venta TIMESTAMP;

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

-- Habilitar RLS en tabla de ventas
ALTER TABLE public.ventas ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla de ventas (solo lectura y escritura para admin)
DROP POLICY IF EXISTS "Lectura ventas" ON public.ventas;
CREATE POLICY "Lectura ventas" ON public.ventas
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Insertar ventas" ON public.ventas;
CREATE POLICY "Insertar ventas" ON public.ventas
  FOR INSERT WITH CHECK (true);

-- Crear tabla de movimientos de caja
CREATE TABLE IF NOT EXISTS public.movimientos_caja (
  id BIGSERIAL PRIMARY KEY,
  tipo TEXT NOT NULL CHECK (tipo IN ('ingreso', 'egreso', 'venta')),
  monto NUMERIC NOT NULL,
  descripcion TEXT NOT NULL,
  relacionado_a TEXT,
  fecha TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS en tabla de movimientos caja
ALTER TABLE public.movimientos_caja ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla de movimientos caja
DROP POLICY IF EXISTS "Lectura movimientos caja" ON public.movimientos_caja;
CREATE POLICY "Lectura movimientos caja" ON public.movimientos_caja
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Insertar movimientos caja" ON public.movimientos_caja;
CREATE POLICY "Insertar movimientos caja" ON public.movimientos_caja
  FOR INSERT WITH CHECK (true);

-- ========================================================
-- FIN DEL SCRIPT
-- ========================================================
