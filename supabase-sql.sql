-- ========================================================
-- MICASITA MULTIRUBRO - SCRIPT SQL PARA SUPABASE
-- ========================================================
-- Ejecuta este SQL completo en: Supabase Dashboard > SQL Editor
-- ========================================================

-- Crear tabla de categorías
CREATE TABLE public.categorias (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  imagen TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de productos
CREATE TABLE public.productos (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  precio NUMERIC NOT NULL,
  categoria TEXT NOT NULL,
  imagen TEXT NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

-- Políticas de LECTURA (SELECT) - Público
CREATE POLICY "Lectura pública categorías" ON public.categorias
  FOR SELECT USING (true);

CREATE POLICY "Lectura pública productos" ON public.productos
  FOR SELECT USING (true);

-- Políticas de INSERCIÓN (INSERT) - Público (sin autenticación)
CREATE POLICY "Insertar categorías" ON public.categorias
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Insertar productos" ON public.productos
  FOR INSERT WITH CHECK (true);

-- Políticas de ACTUALIZACIÓN (UPDATE) - Público
CREATE POLICY "Actualizar categorías" ON public.categorias
  FOR UPDATE USING (true);

CREATE POLICY "Actualizar productos" ON public.productos
  FOR UPDATE USING (true);

-- Políticas de ELIMINACIÓN (DELETE) - Público
CREATE POLICY "Eliminar categorías" ON public.categorias
  FOR DELETE USING (true);

CREATE POLICY "Eliminar productos" ON public.productos
  FOR DELETE USING (true);

-- ========================================================
-- INSERTAR CATEGORÍAS POR DEFECTO
-- ========================================================

INSERT INTO public.categorias (nombre, imagen) VALUES
  ('Electrónica', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E🔌%3C/text%3E%3C/svg%3E'),
  ('Juguetes', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E🎮%3C/text%3E%3C/svg%3E'),
  ('Útiles', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E✏️%3C/text%3E%3C/svg%3E'),
  ('Hogar', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E🏠%3C/text%3E%3C/svg%3E'),
  ('Bazar', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E🛒%3C/text%3E%3C/svg%3E'),
  ('Blanquería', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E🛏️%3C/text%3E%3C/svg%3E'),
  ('Freidoras de aire', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E🍟%3C/text%3E%3C/svg%3E'),
  ('Droguería', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E💊%3C/text%3E%3C/svg%3E');

-- ========================================================
-- FIN DEL SCRIPT - Después de ejecutar:
-- 1. Abre Table Editor en Supabase
-- 2. Verifica que existan las tablas: categorias y productos
-- 3. La aplicación ya podrá agregar datos
-- ========================================================
