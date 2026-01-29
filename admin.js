// Funciones del admin panel (Supabase se carga en supabase.js)

// Variables globales
let editandoCategoria = null;
let editandoProducto = null;

// Cambiar entre tabs
function cambiarTab(tab) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('activo'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('activo'));
  document.getElementById(`tab-${tab}`).classList.add('activo');
  event.target.classList.add('activo');
  
  if (tab === 'productos') {
    cargarSelectCategorias();
    mostrarProductos();
  } else if (tab === 'stock') {
    if (typeof inicializarControlStock === 'function') {
      inicializarControlStock();
    } else {
      console.error('inicializarControlStock no está disponible');
      document.getElementById('tab-stock').innerHTML = '<div class="sin-contenido">Error al cargar control de stock. Recarga la página.</div>';
    }
  } else {
    mostrarCategorias();
  }
}

// === CATEGORÍAS ===
document.getElementById('form-categoria').addEventListener('submit', async function(e) {
  e.preventDefault();
  const id = document.getElementById('cat-id').value;
  const nombre = document.getElementById('cat-nombre').value.trim();
  const inputImagen = document.getElementById('cat-imagen');

  if (!nombre) {
    mostrarMensaje('Completa todos los campos', 'error');
    return;
  }

  if (inputImagen.files.length === 0 && !id) {
    mostrarMensaje('Selecciona una imagen', 'error');
    return;
  }

  if (inputImagen.files.length > 0) {
    convertirImagenABase64(inputImagen.files[0], async function(base64) {
      if (id) {
        const resultado = await DataManager.editarCategoria(id, nombre, base64);
        if (resultado) {
          mostrarMensaje('Categoría actualizada', 'exito');
        } else {
          mostrarMensaje('Error al actualizar categoría', 'error');
        }
      } else {
        const resultado = await DataManager.agregarCategoria(nombre, base64);
        if (resultado) {
          mostrarMensaje('Categoría agregada', 'exito');
        } else {
          mostrarMensaje('Error al agregar categoría (puede que ya exista)', 'error');
        }
      }
      limpiarFormCategoria();
      mostrarCategorias();
    });
  } else if (id) {
    const categorias = await DataManager.cargarCategorias();
    const cat = categorias.find(c => c.id === id);
    const resultado = await DataManager.editarCategoria(id, nombre, cat.imagen);
    if (resultado) {
      mostrarMensaje('Categoría actualizada', 'exito');
    } else {
      mostrarMensaje('Error al actualizar categoría', 'error');
    }
    limpiarFormCategoria();
    mostrarCategorias();
  } else {
    mostrarMensaje('Selecciona una imagen', 'error');
  }
});

async function mostrarCategorias() {
  const categorias = await DataManager.cargarCategorias();
  const contenedor = document.getElementById('lista-categorias');

  if (categorias.length === 0) {
    contenedor.innerHTML = '<div class="sin-contenido">No hay categorías aún</div>';
    return;
  }

  contenedor.innerHTML = categorias.map(cat => `
    <div class="item-card">
      <img src="${cat.imagen}" alt="${cat.nombre}" class="item-imagen">
      <div class="item-titulo">${cat.nombre}</div>
      <div class="btn-acciones">
        <button class="btn-editar" onclick="editarCategoria(${cat.id})">Editar</button>
        <button class="btn-eliminar" onclick="eliminarCategoria(${cat.id})">Eliminar</button>
      </div>
    </div>
  `).join('');
}

async function editarCategoria(id) {
  const categorias = await DataManager.cargarCategorias();
  const cat = categorias.find(c => c.id === id);
  
  document.getElementById('cat-id').value = id;
  document.getElementById('cat-nombre').value = cat.nombre;
  document.getElementById('cat-preview').src = cat.imagen;
  document.getElementById('cat-preview').style.display = 'block';
  document.getElementById('btn-guardar-cat').textContent = 'Actualizar categoría';
  document.getElementById('btn-cancelar-cat').style.display = 'block';
  
  editandoCategoria = id;
  window.scrollTo(0, 0);
}

async function eliminarCategoria(id) {
  if (confirm('¿Eliminar esta categoría? Los productos asociados se mantendrán.')) {
    await DataManager.eliminarCategoria(id);
    mostrarMensaje('Categoría eliminada', 'exito');
    mostrarCategorias();
  }
}

function limpiarFormCategoria() {
  document.getElementById('form-categoria').reset();
  document.getElementById('cat-id').value = '';
  document.getElementById('cat-preview').style.display = 'none';
  document.getElementById('cat-preview').src = '';
  document.getElementById('cat-imagen').value = '';
  document.getElementById('btn-guardar-cat').textContent = 'Agregar categoría';
  document.getElementById('btn-cancelar-cat').style.display = 'none';
  editandoCategoria = null;
}

// === PRODUCTOS ===
document.getElementById('form-producto').addEventListener('submit', async function(e) {
  e.preventDefault();
  const id = document.getElementById('prod-id').value ? parseInt(document.getElementById('prod-id').value) : null;
  const nombre = document.getElementById('prod-nombre').value.trim();
  const precio = document.getElementById('prod-precio').value;
  const categoria = document.getElementById('prod-categoria').value;
  const descripcion = document.getElementById('prod-descripcion').value.trim();
  const inputImagen = document.getElementById('prod-imagen');

  // Validaciones básicas
  if (!nombre || !precio || !categoria) {
    mostrarMensaje('Completa los campos requeridos', 'error');
    return;
  }

  // Si es un producto NUEVO, necesita imagen
  if (!id && inputImagen.files.length === 0) {
    mostrarMensaje('Selecciona una imagen para el nuevo producto', 'error');
    return;
  }

  // CASO 1: Agregando nuevo producto CON imagen
  if (!id && inputImagen.files.length > 0) {
    console.log('➕ Agregando nuevo producto con imagen');
    convertirImagenABase64(inputImagen.files[0], async function(base64) {
      const resultado = await DataManager.agregarProducto(nombre, precio, categoria, base64, descripcion);
      if (resultado) {
        console.log('✅ Producto agregado:', resultado);
        mostrarMensaje('Producto agregado', 'exito');
        limpiarFormProducto();
        await mostrarProductos();
      } else {
        console.error('❌ Error al agregar producto');
        mostrarMensaje('Error al agregar producto', 'error');
      }
    });
    return;
  }

  // CASO 2: Editando producto existente
  if (id) {
    console.log('🔄 Editando producto:', id);
    
    // Si cambia imagen, usarla; si no, usar la imagen anterior
    if (inputImagen.files.length > 0) {
      // Hay nueva imagen, convertir y guardar
      convertirImagenABase64(inputImagen.files[0], async function(base64) {
        const resultado = await DataManager.editarProducto(id, nombre, precio, categoria, base64, descripcion);
        if (resultado) {
          console.log('✅ Producto actualizado con nueva imagen:', resultado);
          mostrarMensaje('Producto actualizado', 'exito');
          limpiarFormProducto();
          await mostrarProductos();
          // Recargar control de stock si está abierto
          if (typeof mostrarControlStock === 'function') {
            await mostrarControlStock();
          }
        } else {
          console.error('❌ Error al actualizar producto');
          mostrarMensaje('Error al actualizar producto', 'error');
        }
      });
    } else {
      // Sin nueva imagen, obtener imagen anterior y guardar
      console.log('📦 Buscando producto:', id, 'tipo:', typeof id);
      const productos = await DataManager.cargarProductos();
      console.log('📦 Productos cargados:', productos.length);
      
      const prod = productos.find(p => {
        console.log('🔍 Comparando:', p.id, '===', id, '=', p.id === id);
        return p.id === id;
      });
      
      if (!prod) {
        console.error('❌ Producto no encontrado. ID buscado:', id, 'Productos disponibles:', productos.map(p => ({ id: p.id, nombre: p.nombre })));
        mostrarMensaje('Producto no encontrado', 'error');
        return;
      }

      console.log('✅ Producto encontrado:', prod);
      const resultado = await DataManager.editarProducto(id, nombre, precio, categoria, prod.imagen, descripcion);
      if (resultado) {
        console.log('✅ Producto actualizado sin cambio de imagen:', resultado);
        mostrarMensaje('Producto actualizado', 'exito');
        limpiarFormProducto();
        await mostrarProductos();
        // Recargar control de stock si está abierto
        if (typeof mostrarControlStock === 'function') {
          await mostrarControlStock();
        }
      } else {
        console.error('❌ Error al actualizar producto');
        mostrarMensaje('Error al actualizar producto', 'error');
      }
    }
    return;
  }

  mostrarMensaje('Error en el formulario', 'error');
});

async function cargarSelectCategorias() {
  const categorias = await DataManager.cargarCategorias();
  const select = document.getElementById('prod-categoria');
  select.innerHTML = '<option value="">Selecciona una categoría</option>' + 
    categorias.map(cat => `<option value="${cat.nombre}">${cat.nombre}</option>`).join('');
}

async function mostrarProductos() {
  const productos = await DataManager.cargarProductos();
  const contenedor = document.getElementById('lista-productos');

  if (productos.length === 0) {
    contenedor.innerHTML = '<div class="sin-contenido">No hay productos aún</div>';
    return;
  }

  contenedor.innerHTML = productos.map(prod => `
    <div class="item-card">
      <img src="${prod.imagen}" alt="${prod.nombre}" class="item-imagen">
      <div class="item-titulo">${prod.nombre}</div>
      <div class="item-info">
        <strong>$${parseFloat(prod.precio).toFixed(2)}</strong><br>
        ${prod.categoria}
      </div>
      <div class="btn-acciones">
        <button class="btn-editar" onclick="editarProducto(${prod.id})">Editar</button>
        <button class="btn-eliminar" onclick="eliminarProducto(${prod.id})">Eliminar</button>
      </div>
    </div>
  `).join('');
}

async function editarProducto(id) {
  console.log('📝 Cargando producto para editar:', id);
  const productos = await DataManager.cargarProductos();
  const prod = productos.find(p => p.id === id);
  
  if (!prod) {
    console.error('❌ Producto no encontrado:', id);
    mostrarMensaje('Producto no encontrado', 'error');
    return;
  }

  console.log('✅ Producto encontrado:', prod);
  
  await cargarSelectCategorias();
  
  document.getElementById('prod-id').value = id;
  document.getElementById('prod-nombre').value = prod.nombre;
  document.getElementById('prod-precio').value = prod.precio;
  document.getElementById('prod-categoria').value = prod.categoria;
  document.getElementById('prod-descripcion').value = prod.descripcion || '';
  document.getElementById('prod-preview').src = prod.imagen;
  document.getElementById('prod-preview').style.display = 'block';
  document.getElementById('btn-guardar-prod').textContent = 'Actualizar producto';
  document.getElementById('btn-cancelar-prod').style.display = 'block';
  
  editandoProducto = id;
  cambiarTab('productos');
  window.scrollTo(0, 0);
}

async function eliminarProducto(id) {
  if (confirm('¿Eliminar este producto?')) {
    await DataManager.eliminarProducto(id);
    mostrarMensaje('Producto eliminado', 'exito');
    mostrarProductos();
  }
}

function limpiarFormProducto() {
  document.getElementById('form-producto').reset();
  document.getElementById('prod-id').value = '';
  document.getElementById('prod-preview').style.display = 'none';
  document.getElementById('prod-preview').src = '';
  document.getElementById('prod-imagen').value = '';
  document.getElementById('btn-guardar-prod').textContent = 'Agregar producto';
  document.getElementById('btn-cancelar-prod').style.display = 'none';
  editandoProducto = null;
}

// Previsualización de imágenes
document.getElementById('cat-imagen').addEventListener('change', function(e) {
  if (e.target.files.length > 0) {
    const reader = new FileReader();
    reader.onload = (event) => {
      document.getElementById('cat-preview').src = event.target.result;
      document.getElementById('cat-preview').style.display = 'block';
    };
    reader.readAsDataURL(e.target.files[0]);
  }
});

document.getElementById('prod-imagen').addEventListener('change', function(e) {
  if (e.target.files.length > 0) {
    const reader = new FileReader();
    reader.onload = (event) => {
      document.getElementById('prod-preview').src = event.target.result;
      document.getElementById('prod-preview').style.display = 'block';
    };
    reader.readAsDataURL(e.target.files[0]);
  }
});

// Inicializar con categorías por defecto si no hay ninguna
async function inicializarCategoriasDefault() {
  const categorias = await DataManager.cargarCategorias();
  if (categorias.length === 0) {
    const categoriasDefault = [
      { nombre: 'Electrónica', imagen: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E🔌%3C/text%3E%3C/svg%3E' },
      { nombre: 'Juguetes', imagen: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E🎮%3C/text%3E%3C/svg%3E' },
      { nombre: 'Útiles', imagen: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E✏️%3C/text%3E%3C/svg%3E' },
      { nombre: 'Hogar', imagen: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E🏠%3C/text%3E%3C/svg%3E' },
      { nombre: 'Bazar', imagen: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E🛒%3C/text%3E%3C/svg%3E' },
      { nombre: 'Blanquería', imagen: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E🛏️%3C/text%3E%3C/svg%3E' },
      { nombre: 'Freidoras de aire', imagen: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E🍟%3C/text%3E%3C/svg%3E' },
      { nombre: 'Droguería', imagen: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f358ba" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E💊%3C/text%3E%3C/svg%3E' }
    ];
    
    for (const cat of categoriasDefault) {
      await DataManager.agregarCategoria(cat.nombre, cat.imagen);
    }
  }
}

// Verificar autenticación
function verificarAutenticacion() {
  const sesion = sessionStorage.getItem('micasita_admin_auth');
  if (sesion !== 'true') {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Cerrar sesión
function logout() {
  if (confirm('¿Deseas cerrar sesión?')) {
    sessionStorage.removeItem('micasita_admin_auth');
    window.location.href = 'login.html';
  }
}

// Cargar datos al iniciar
if (verificarAutenticacion()) {
  inicializarCategoriasDefault();
  mostrarCategorias();
}
