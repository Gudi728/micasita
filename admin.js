
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
document.addEventListener('DOMContentLoaded', function() {
  if (verificarAutenticacion()) {
    inicializarCategoriasDefault();
    cambiarTab('categorias');
  }
});

// Funciones vacías para evitar errores si se usan los botones de exportar/importar
function exportarDatos() {
  alert('Función de exportar datos aún no implementada.');
}
function importarDatos() {
  alert('Función de importar datos aún no implementada.');
}
