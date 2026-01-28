# Configuración de Supabase - Micasita Multirubro

## Estado actual
✅ Integración de Supabase completada en el código
✅ Sistema de DataManager con async/await implementado
✅ Archivos de categorías actualizados para cargar desde Supabase

## Pasos pendientes

### PASO 1: Crear las tablas en Supabase

1. Ve a: https://app.supabase.com/
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto: "bondnynacnzvwfojkrpc"
4. Ve a: **SQL Editor** (en el menú izquierdo)
5. Copia y ejecuta el siguiente SQL:

```sql
-- Crear tabla de categorías
CREATE TABLE public.categorias (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  imagen LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de productos
CREATE TABLE public.productos (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  precio NUMERIC NOT NULL,
  categoria TEXT NOT NULL,
  imagen LONGTEXT NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

-- Crear políticas de lectura pública
CREATE POLICY "Lectura pública de categorías" ON public.categorias
  FOR SELECT USING (true);

CREATE POLICY "Lectura pública de productos" ON public.productos
  FOR SELECT USING (true);

-- Crear políticas de escritura pública (sin autenticación)
CREATE POLICY "Insertar categorías" ON public.categorias
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Insertar productos" ON public.productos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Actualizar categorías" ON public.categorias
  FOR UPDATE USING (true);

CREATE POLICY "Actualizar productos" ON public.productos
  FOR UPDATE USING (true);

CREATE POLICY "Eliminar categorías" ON public.categorias
  FOR DELETE USING (true);

CREATE POLICY "Eliminar productos" ON public.productos
  FOR DELETE USING (true);
```

6. Haz clic en el botón **Run** para ejecutar el SQL
7. Deberías ver un mensaje de éxito

### PASO 2: Verificar la configuración

Una vez creadas las tablas:

1. En Supabase, ve a **Table Editor** (en el menú izquierdo)
2. Deberías ver dos tablas nuevas:
   - `categorias`
   - `productos`

### PASO 3: Probar la aplicación

1. Abre tu aplicación en el navegador
2. Ve al panel de admin (botón "⚙️ Admin")
3. Inicia sesión con:
   - Usuario: `micaela`
   - Contraseña: `MyM728`

4. En el panel de admin:
   - Las categorías se cargarán automáticamente desde Supabase
   - Podrás agregar nuevas categorías e imágenes
   - Los datos se sincronizarán en tiempo real entre dispositivos

### PASO 4: Usar desde múltiples dispositivos

Una vez configurado:

1. Entra al panel admin desde cualquier dispositivo o navegador
2. Todos verán los mismos datos en tiempo real
3. Los cambios se sincronizarán automáticamente

## Datos guardados en Supabase

**Tabla: categorias**
- id: Identificador único
- nombre: Nombre de la categoría
- imagen: Imagen en formato base64
- created_at: Fecha de creación

**Tabla: productos**
- id: Identificador único
- nombre: Nombre del producto
- precio: Precio del producto
- categoria: Nombre de la categoría asociada
- imagen: Imagen en formato base64
- descripcion: Descripción del producto
- created_at: Fecha de creación

## Información de tu proyecto

- **URL de Supabase:** https://bondnynacnzvwfojkrpc.supabase.co
- **Anon Public Key:** sb_publishable_15SL0Y_XssCN9EBHk3pP9g_LRwyeiCJ
- **Credenciales de Admin:**
  - Usuario: micaela
  - Contraseña: MyM728

## Troubleshooting

### Los productos no aparecen
1. Verifica que las tablas estén creadas en Supabase
2. Comprueba que tengas datos en la tabla `productos`
3. Abre la consola del navegador (F12) para ver si hay errores

### Error "tabla no existe"
Ejecuta nuevamente el SQL en el SQL Editor de Supabase

### Los cambios no se sincronizan
1. Recarga la página
2. Verifica que tengas conexión a internet
3. Comprueba en Supabase que los datos estén realmente guardados

## Próximos pasos (Opcional)

- Migrar datos antiguos desde localStorage (si existen)
- Configurar backups automáticos en Supabase
- Agregar más columnas según tus necesidades de negocio
