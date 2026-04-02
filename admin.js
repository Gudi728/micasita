
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

// Inicializar pestaña por defecto y autenticación al cargar la página

// Renderizar lista de categorías en el admin
async function renderizarCategorias() {
  const lista = document.getElementById('lista-categorias');
  if (!lista) return;
  const categorias = await DataManager.cargarCategorias();
  if (categorias.length === 0) {
    lista.innerHTML = '<div class="sin-contenido">No hay categorías registradas.</div>';
    return;
  }
  lista.innerHTML = categorias.map(cat => `
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

// Lógica para editar categoría
window.editarCategoria = async function(id) {
  const categorias = await DataManager.cargarCategorias();
  const cat = categorias.find(c => c.id === id);
  if (!cat) return;
  document.getElementById('cat-id').value = cat.id;
  document.getElementById('cat-nombre').value = cat.nombre;
  document.getElementById('cat-preview').src = cat.imagen;
  document.getElementById('cat-preview').style.display = 'block';
  document.getElementById('btn-guardar-cat').textContent = 'Guardar cambios';
  document.getElementById('btn-cancelar-cat').style.display = '';
};

// Lógica para eliminar categoría
window.eliminarCategoria = async function(id) {
  if (!confirm('¿Seguro que deseas eliminar esta categoría?')) return;
  await DataManager.eliminarCategoria(id);
  renderizarCategorias();
};

// Limpiar formulario de categoría
window.limpiarFormCategoria = function() {
  document.getElementById('cat-id').value = '';
  document.getElementById('cat-nombre').value = '';
  document.getElementById('cat-imagen').value = '';
  document.getElementById('cat-preview').src = '';
  document.getElementById('cat-preview').style.display = 'none';
  document.getElementById('btn-guardar-cat').textContent = 'Agregar categoría';
  document.getElementById('btn-cancelar-cat').style.display = 'none';
};

// Guardar o editar categoría
document.getElementById('form-categoria').addEventListener('submit', async function(e) {
  e.preventDefault();
  const id = document.getElementById('cat-id').value;
  const nombre = document.getElementById('cat-nombre').value.trim();
  let imagen = document.getElementById('cat-preview').src;
  // Si se seleccionó una nueva imagen, usar la del input
  const fileInput = document.getElementById('cat-imagen');
  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = async function(event) {
      imagen = event.target.result;
      await guardarCategoria(id, nombre, imagen);
    };
    reader.readAsDataURL(fileInput.files[0]);
    return;
  }
  await guardarCategoria(id, nombre, imagen);
});

async function guardarCategoria(id, nombre, imagen) {
  if (!nombre || !imagen) {
    alert('Nombre e imagen son obligatorios');
    return;
  }
  if (id) {
    await DataManager.editarCategoria(Number(id), nombre, imagen);
  } else {
    await DataManager.agregarCategoria(nombre, imagen);
  }
  limpiarFormCategoria();
  renderizarCategorias();
}

// Inicializar pestaña por defecto y autenticación al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  if (verificarAutenticacion()) {
    inicializarCategoriasDefault().then(renderizarCategorias);
    cambiarTab('categorias');
  }
});

  // Funciones eliminadas para evitar errores si se usan los botones de exportar/importar
  // function exportarDatos() {
  //   alert('Función de exportar datos aún no implementada.');
  // }
  // function importarDatos() {
  //   alert('Función de importar datos aún no implementada.');
  // }
