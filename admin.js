// Sistema de gestión de datos con localStorage
const DataManager = {
  // Cargar datos desde localStorage
  cargarCategorias() {
    const datos = localStorage.getItem('micasita_categorias');
    return datos ? JSON.parse(datos) : [];
  },

  cargarProductos() {
    const datos = localStorage.getItem('micasita_productos');
    return datos ? JSON.parse(datos) : [];
  },

  // Guardar datos en localStorage
  guardarCategorias(categorias) {
    localStorage.setItem('micasita_categorias', JSON.stringify(categorias));
  },

  guardarProductos(productos) {
    localStorage.setItem('micasita_productos', JSON.stringify(productos));
  },

  // Operaciones con categorías
  agregarCategoria(nombre, imagen) {
    const categorias = this.cargarCategorias();
    const id = Date.now().toString();
    categorias.push({ id, nombre, imagen });
    this.guardarCategorias(categorias);
    return { id, nombre, imagen };
  },

  editarCategoria(id, nombre, imagen) {
    const categorias = this.cargarCategorias();
    const index = categorias.findIndex(c => c.id === id);
    if (index !== -1) {
      categorias[index] = { id, nombre, imagen };
      this.guardarCategorias(categorias);
      return true;
    }
    return false;
  },

  eliminarCategoria(id) {
    const categorias = this.cargarCategorias();
    const nuevas = categorias.filter(c => c.id !== id);
    this.guardarCategorias(nuevas);
    return true;
  },

  // Operaciones con productos
  agregarProducto(nombre, precio, categoria, imagen, descripcion) {
    const productos = this.cargarProductos();
    const id = Date.now().toString();
    productos.push({ id, nombre, precio, categoria, imagen, descripcion });
    this.guardarProductos(productos);
    return { id, nombre, precio, categoria, imagen, descripcion };
  },

  editarProducto(id, nombre, precio, categoria, imagen, descripcion) {
    const productos = this.cargarProductos();
    const index = productos.findIndex(p => p.id === id);
    if (index !== -1) {
      productos[index] = { id, nombre, precio, categoria, imagen, descripcion };
      this.guardarProductos(productos);
      return true;
    }
    return false;
  },

  eliminarProducto(id) {
    const productos = this.cargarProductos();
    const nuevos = productos.filter(p => p.id !== id);
    this.guardarProductos(nuevos);
    return true;
  },

  obtenerProductosPorCategoria(categoriaNombre) {
    const productos = this.cargarProductos();
    return productos.filter(p => p.categoria === categoriaNombre);
  }
};

// Funciones para convertir imagen a base64
function convertirImagenABase64(archivo, callback) {
  const reader = new FileReader();
  reader.onload = function(e) {
    callback(e.target.result);
  };
  reader.readAsDataURL(archivo);
}

// Mostrar mensaje temporal
function mostrarMensaje(texto, tipo = 'exito') {
  const mensaje = document.createElement('div');
  mensaje.className = `mensaje-${tipo}`;
  mensaje.textContent = texto;
  document.body.appendChild(mensaje);
  setTimeout(() => mensaje.remove(), 3000);
}
