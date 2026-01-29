    // Anular (eliminar) movimiento de caja por id
    async anularMovimientoCaja(movimientoId) {
      try {
        const { error } = await supabaseClient
          .from('movimientos_caja')
          .delete()
          .eq('id', movimientoId);
        if (error) throw error;
        return true;
      } catch (error) {
        console.error('Error al anular movimiento de caja:', error);
        return false;
      }
    },
  // Anular (eliminar) una venta por ID
  async anularVenta(ventaId) {
    try {
      const { error } = await supabaseClient
        .from('ventas')
        .delete()
        .eq('id', ventaId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error al anular venta:', error);
      return false;
    }
  },
// Configuración de Supabase
const SUPABASE_URL = 'https://bondnynacnzvwfojkrpc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_15SL0Y_XssCN9EBHk3pP9g_LRwyeiCJ';

// Inicializar cliente de Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DataManager actualizado para usar Supabase
const DataManager = {
  // ========== CATEGORÍAS ==========
  
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

  // Agregar nueva categoría
  async agregarCategoria(nombre, imagen) {
    try {
      if (!nombre || !imagen) {
        console.error('Nombre o imagen vacíos');
        return null;
      }

      const { data, error } = await supabaseClient
        .from('categorias')
        .insert([{ nombre: nombre.trim(), imagen }])
        .select();
      
      if (error) {
        console.error('Error Supabase:', error.message);
        throw error;
      }
      
      console.log('Categoría agregada exitosamente:', data);
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Error al agregar categoría:', error.message);
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

  // ========== PRODUCTOS ==========
  
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

  // Cargar productos con stock (para control de inventario)
  async cargarProductosConStock() {
    try {
      const { data, error } = await supabaseClient
        .from('productos')
        .select('*')
        .order('nombre', { ascending: true });
      
      if (error) {
        console.error('Error Supabase al cargar productos:', error.message);
        throw error;
      }
      
      console.log('Productos cargados:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('Error al cargar productos con stock:', error);
      return [];
    }
  },

  // Obtener valor total del inventario
  async obtenerValorInventario() {
    try {
      const productos = await this.cargarProductosConStock();
      
      let valorCosto = 0;
      let valorVenta = 0;
      
      productos.forEach(prod => {
        const stock = prod.stock || 0;
        const costo = parseFloat(prod.precio_costo) || 0;
        const venta = parseFloat(prod.precio_venta_admin) || parseFloat(prod.precio) || 0;
        
        valorCosto += (stock * costo);
        valorVenta += (stock * venta);
      });
      
      return {
        valorCosto,
        valorVenta,
        gananciaTotal: Math.max(0, valorVenta - valorCosto),
        cantidadProductos: productos.length,
        totalItems: productos.reduce((sum, p) => sum + (p.stock || 0), 0)
      };
    } catch (error) {
      console.error('Error al obtener valor del inventario:', error);
      return { valorCosto: 0, valorVenta: 0, gananciaTotal: 0, cantidadProductos: 0, totalItems: 0 };
    }
  },

  // Obtener productos por categoría (para vista pública)
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

  // Agregar nuevo producto
  async agregarProducto(nombre, precio, categoria, imagen, descripcion, stock = 0, precioCosto = 0) {
    try {
      console.log('➕ Agregando nuevo producto:', { nombre, precio, categoria, descripcion });

      const { data, error } = await supabaseClient
        .from('productos')
        .insert([{ 
          nombre: nombre.trim(), 
          precio: parseFloat(precio),
          categoria: categoria.trim(), 
          imagen, 
          descripcion: descripcion.trim(),
          stock,
          precio_costo: precioCosto
        }])
        .select();
      
      if (error) {
        console.error('Error Supabase al agregar producto:', error.message);
        throw error;
      }

      console.log('✅ Producto agregado exitosamente:', data[0]);
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('❌ Error al agregar producto:', error.message);
      return null;
    }
  },

  // Editar producto existente
  async editarProducto(id, nombre, precio, categoria, imagen, descripcion) {
    try {
      if (!id) {
        console.error('ID de producto no proporcionado');
        return null;
      }

      console.log('📝 Editando producto:', { id, nombre, precio, categoria, descripcion });


      // Siempre actualizar precio_venta_admin con el nuevo precio
      let updateFields = {
        nombre: nombre.trim(),
        precio: parseFloat(precio),
        categoria: categoria.trim(),
        imagen,
        descripcion: descripcion.trim(),
        precio_venta_admin: parseFloat(precio)
      };

      const { data, error } = await supabaseClient
        .from('productos')
        .update(updateFields)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error Supabase al editar producto:', error.message);
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn('⚠️ Producto no encontrado o no actualizado');
        return null;
      }

      console.log('✅ Producto editado exitosamente:', data[0]);
      return data[0];
    } catch (error) {
      console.error('❌ Error al editar producto:', error.message);
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

  // ========== STOCK ==========
  
  // Actualizar stock de un producto
  async actualizarStock(productoId, nuevoStock) {
    try {
      const { data, error } = await supabaseClient
        .from('productos')
        .update({ stock: nuevoStock })
        .eq('id', productoId)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      return null;
    }
  },

  // Actualizar precios de un producto
  async actualizarPrecios(productoId, precioCosto, precioVentaAdmin) {
    try {
      const { data, error } = await supabaseClient
        .from('productos')
        .update({ 
          precio_costo: precioCosto,
          precio_venta_admin: precioVentaAdmin
        })
        .eq('id', productoId)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error al actualizar precios:', error);
      return null;
    }
  },

  // ========== VENTAS ==========
  
  // Registrar una venta
  async registrarVenta(productoId, cantidadVendida, precioUnitario) {
    try {
      // Obtener producto actual
      const { data: producto, error: errorProducto } = await supabaseClient
        .from('productos')
        .select('*')
        .eq('id', productoId)
        .single();
      
      if (errorProducto) throw errorProducto;

      const nuevoStock = Math.max(0, producto.stock - cantidadVendida);
      const gananciaPorUnidad = precioUnitario - (producto.precio_costo || 0);
      const gananciaTotalVenta = gananciaPorUnidad * cantidadVendida;

      // Registrar la venta
      const { data: venta, error: errorVenta } = await supabaseClient
        .from('ventas')
        .insert([{
          producto_id: productoId,
          cantidad_vendida: cantidadVendida,
          precio_unitario: precioUnitario,
          ganancia_unitaria: gananciaPorUnidad,
          ganancia_total: gananciaTotalVenta
        }])
        .select();

      if (errorVenta) throw errorVenta;

      // Actualizar stock del producto
      const { error: errorStock } = await supabaseClient
        .from('productos')
        .update({ 
          stock: nuevoStock,
          fecha_ultima_venta: new Date().toISOString()
        })
        .eq('id', productoId);

      if (errorStock) throw errorStock;

      // Registrar automáticamente en movimientos de caja como "venta"
      await this.registrarMovimientoCaja('venta', precioUnitario * cantidadVendida, `Venta de ${producto.nombre} x${cantidadVendida}`, `venta_${venta[0].id}`);

      return {
        venta: venta[0],
        nuevoStock,
        ganancia: gananciaTotalVenta
      };
    } catch (error) {
      console.error('Error al registrar venta:', error);
      return null;
    }
  },

  // Obtener historial de ventas
  async cargarVentas() {
    try {
      const { data, error } = await supabaseClient
        .from('ventas')
        .select('*')
        .order('fecha_venta', { ascending: false });
      
      if (error) {
        console.error('Error Supabase al cargar ventas:', error.message);
        throw error;
      }

      // Cargar nombres de productos para cada venta
      const ventasConProductos = await Promise.all(data.map(async (venta) => {
        try {
          const { data: producto } = await supabaseClient
            .from('productos')
            .select('nombre, precio')
            .eq('id', venta.producto_id)
            .single();
          
          return {
            ...venta,
            productos: producto || { nombre: 'Producto no encontrado', precio: 0 }
          };
        } catch (e) {
          console.error('Error al cargar producto:', e);
          return {
            ...venta,
            productos: { nombre: 'Producto eliminado', precio: 0 }
          };
        }
      }));

      return ventasConProductos || [];
    } catch (error) {
      console.error('Error al cargar ventas:', error);
      return [];
    }
  },

  // Obtener resumen de ganancias
  async obtenerResumenGanancias() {
    try {
      const { data, error } = await supabaseClient
        .from('ventas')
        .select('ganancia_total');
      
      if (error) throw error;
      
      const totalGanancia = data.reduce((suma, venta) => suma + (venta.ganancia_total || 0), 0);
      return totalGanancia;
    } catch (error) {
      console.error('Error al obtener ganancias:', error);
      return 0;
    }
  },

  // ========== CAJA / MOVIMIENTOS ==========
  
  // Registrar movimiento de caja
  async registrarMovimientoCaja(tipo, monto, descripcion, relacionadoA = null) {
    try {
      const { data, error } = await supabaseClient
        .from('movimientos_caja')
        .insert([{
          tipo,
          monto,
          descripcion,
          relacionado_a: relacionadoA
        }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error al registrar movimiento de caja:', error);
      return null;
    }
  },

  // Obtener movimientos de caja
  async cargarMovimientosCaja() {
    try {
      const { data, error } = await supabaseClient
        .from('movimientos_caja')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al cargar movimientos de caja:', error);
      return [];
    }
  },

  // Obtener saldo de caja
  async obtenerSaldoCaja() {
    try {
      const { data, error } = await supabaseClient
        .from('movimientos_caja')
        .select('tipo, monto');

      if (error) throw error;

      let saldo = 0;
      data.forEach(mov => {
        if (mov.tipo === 'ingreso' || mov.tipo === 'venta') {
          saldo += parseFloat(mov.monto) || 0;
        } else if (mov.tipo === 'egreso') {
          saldo -= parseFloat(mov.monto) || 0;
        }
      });

      return saldo;
    } catch (error) {
      console.error('Error al obtener saldo de caja:', error);
      return 0;
    }
  },

  // ========== ESCUCHAS EN TIEMPO REAL ==========
  
  // Escuchar cambios en categorías
  onCategoriasChange(callback) {
    return supabaseClient
      .channel('categorias')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categorias' }, (payload) => {
        callback(payload);
      })
      .subscribe();
  },

  // Escuchar cambios en productos
  onProductosChange(callback) {
    return supabaseClient
      .channel('productos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productos' }, (payload) => {
        callback(payload);
      })
      .subscribe();
  }
};

// ========== FUNCIONES AUXILIARES ==========

// Convertir imagen a Base64
function convertirImagenABase64(archivo, callback) {
  const reader = new FileReader();
  reader.onload = function(e) {
    callback(e.target.result);
  };
  reader.readAsDataURL(archivo);
}

// Mostrar mensajes en la UI
function mostrarMensaje(texto, tipo = 'exito') {
  const mensaje = document.createElement('div');
  mensaje.className = `mensaje-${tipo}`;
  mensaje.textContent = texto;
  document.body.appendChild(mensaje);
  setTimeout(() => mensaje.remove(), 3000);
}
