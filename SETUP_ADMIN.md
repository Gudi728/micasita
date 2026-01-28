# 🛠️ Configuración del Panel de Administrador - MiCasita 2.0

## Problema Identificado
Cuando abres el admin y aprietas "Editar Categorías", no aparece nada. Además, algunos textos se veían con caracteres raros.

## Soluciones Aplicadas

### ✅ 1. Codificación UTF-8 Corregida
Se corrigió el archivo `admin.html` que tenía caracteres malformados. Ahora aparecen correctamente:
- "Categorías" (antes: "CategorÃ­as")
- "Administración" (antes: "AdministraciÃ³n")
- "Descripción" (antes: "DescripciÃ³n")

### ✅ 2. Datos Por Defecto Agregados
Se actualizó `supabase-sql.sql` con las 8 categorías por defecto que aparecerán cuando abras el admin.

## 📋 Pasos para Completar la Configuración

### Paso 1: Ejecutar el Script SQL en Supabase
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto: **bondnynacnzvwfojkrpc**
3. Ve a **SQL Editor** → **New Query**
4. Copia todo el contenido de `supabase-sql.sql` (archivo en la carpeta raíz)
5. Pega el código en el editor
6. Presiona **Run** (triángulo verde)

### Paso 2: Verifica que todo esté bien
1. Ve a **Table Editor**
2. Deberías ver dos tablas:
   - `categorias` (con 8 categorías por defecto)
   - `productos` (vacía)

### Paso 3: Prueba el Admin
1. Abre `admin.html` en tu navegador
2. Ingresa la contraseña (si tienes configurada)
3. Haz clic en la pestaña **"Categorías"**
4. Deberías ver las 8 categorías por defecto con sus emojis

## 🎯 Funcionalidades que Ahora Funcionan

✅ **Ver Categorías**: Aparecerá la lista de categorías con sus imágenes  
✅ **Editar Categoría**: Puedes cambiar nombre e imagen  
✅ **Eliminar Categoría**: Puedes borrar categorías  
✅ **Agregar Categoría**: Puedes crear nuevas categorías  
✅ **Gestionar Productos**: Podrás agregar productos a las categorías  

## 📝 Texto Corregido
Los acentos y caracteres especiales ahora se muestran correctamente en:
- Botones de navegación
- Formularios
- Mensajes
- Etiquetas

## 🆘 Si Aún No Ves las Categorías

1. **Limpia la caché del navegador**: Presiona Ctrl+Shift+Delete
2. **Recarga la página**: Presiona Ctrl+R o F5
3. **Abre la consola**: Presiona F12 y revisa la pestaña "Console"
4. **Verifica la conexión**: Asegúrate de tener internet y que el proyecto Supabase esté activo

## 💾 Próximos Pasos

Después de ejecutar el SQL:
1. Agrega productos a través del panel de admin
2. Los productos aparecerán automáticamente en el sitio web
3. Usa la función de "Exportar datos" para hacer backups

---

**Última actualización**: 28 de enero de 2026
