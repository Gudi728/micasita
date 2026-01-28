// Configuración de Supabase
const SUPABASE_URL = 'https://bondnynacnzvwfojkrpc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_15SL0Y_XssCN9EBHk3pP9g_LRwyeiCJ';

// Inicializar cliente de Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DataManager actualizado para usar Supabase
const DataManager = {
  // Cargar todas las categorías desde Supabase
  async cargarCategorias() {
    try {
      const { data, error } = await supabaseClient
        .from('categorias')
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      return [];
    }
  },

  // Cargar todos los productos desde Supabase
  async cargarProductos() {
    try {
      const { data, error } = await supabaseClient
        .from('productos')
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al cargar productos:', error);
      return [];
    }
  },

  // Agregar nueva categoría
  async agregarCategoria(nombre, imagen) {
    try {
      const { data, error } = await supabaseClient
        .from('categorias')
        .insert([{ nombre, imagen }])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error al agregar categoría:', error);
      return null;
    }
  },

  // Editar categoría existente
  async editarCategoria(id, nombre, imagen) {
    try {
      const { data, error } = await supabaseClient
        .from('categorias')
        .update({ nombre, imagen })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error al editar categoría:', error);
      return null;
    }
  },

  // Eliminar categoría
  async eliminarCategoria(id) {
    try {
      const { error } = await supabaseClient
        .from('categorias')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      return false;
    }
  },

  // Agregar nuevo producto
  async agregarProducto(nombre, precio, categoria, imagen, descripcion) {
    try {
      const { data, error } = await supabaseClient
        .from('productos')
        .insert([{ nombre, precio, categoria, imagen, descripcion }])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error al agregar producto:', error);
      return null;
    }
  },

  // Editar producto existente
  async editarProducto(id, nombre, precio, categoria, imagen, descripcion) {
    try {
      const { data, error } = await supabaseClient
        .from('productos')
        .update({ nombre, precio, categoria, imagen, descripcion })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error al editar producto:', error);
      return null;
    }
  },

  // Eliminar producto
  async eliminarProducto(id) {
    try {
      const { error } = await supabaseClient
        .from('productos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return false;
    }
  },

  // Obtener productos por categoría
  async obtenerProductosPorCategoria(categoriaNombre) {
    try {
      const { data, error } = await supabaseClient
        .from('productos')
        .select('*')
        .eq('categoria', categoriaNombre);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      return [];
    }
  },

  // Escuchar cambios en tiempo real (categorías)
  onCategoriasChange(callback) {
    return supabaseClient
      .channel('categorias')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categorias' }, (payload) => {
        callback(payload);
      })
      .subscribe();
  },

  // Escuchar cambios en tiempo real (productos)
  onProductosChange(callback) {
    return supabaseClient
      .channel('productos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productos' }, (payload) => {
        callback(payload);
      })
      .subscribe();
  }
};

// Funciones auxiliares
function convertirImagenABase64(archivo, callback) {
  const reader = new FileReader();
  reader.onload = function(e) {
    callback(e.target.result);
  };
  reader.readAsDataURL(archivo);
}

function mostrarMensaje(texto, tipo = 'exito') {
  const mensaje = document.createElement('div');
  mensaje.className = `mensaje-${tipo}`;
  mensaje.textContent = texto;
  document.body.appendChild(mensaje);
  setTimeout(() => mensaje.remove(), 3000);
}
