// === CONTROL DE STOCK Y VENTAS ===

// Mostrar control de stock
async function mostrarControlStock() {
  console.log('🔄 Cargando productos para control de stock...');
  const productos = await DataManager.cargarProductosConStock();
  const contenedor = document.getElementById('lista-stock');

  console.log('✅ Productos encontrados:', productos.length);
  if (productos.length > 0) {
    console.log('📦 Primer producto:', productos[0]);
  }

  if (productos.length === 0) {
    console.warn('⚠️ No hay productos en la base de datos');
    contenedor.innerHTML = `
      <div class="sin-contenido">
        <p>No hay productos. Agrega algunos primero.</p>
        <button onclick="mostrarControlStock()" class="btn-refrescar">🔄 Refrescar</button>
      </div>
    `;
    return;
  }

  contenedor.innerHTML = productos.map(prod => `
    <div class="item-stock">
      <div class="stock-info">
        <h3>${prod.nombre}</h3>
        <p class="producto-categoria">Categoría: ${prod.categoria}</p>
        <div class="stock-datos">
          <div class="dato">
            <label>Stock:</label>
            <input type="number" value="${prod.stock || 0}" class="input-stock" data-id="${prod.id}" min="0">
          </div>
          <div class="dato">
            <label>Precio Costo:</label>
            <input type="number" value="${prod.precio_costo || 0}" class="input-costo" data-id="${prod.id}" step="0.01" min="0">
          </div>
          <div class="dato">
            <label>Precio Venta Admin:</label>
            <input type="number" value="${prod.precio_venta_admin || prod.precio || 0}" class="input-venta-admin" data-id="${prod.id}" step="0.01" min="0">
          </div>
          <div class="dato">
            <label>Ganancia (Unitaria):</label>
            <span class="ganancia-unitaria">$${(Math.max(0, (prod.precio_venta_admin || prod.precio || 0) - (prod.precio_costo || 0))).toFixed(2)}</span>
          </div>
        </div>
        <div class="stock-acciones">
          <button class="btn-guardar-stock" onclick="guardarStock(${prod.id})">Guardar Stock</button>
          <button class="btn-venta" onclick="abrirFormularioVenta(${prod.id}, '${prod.nombre}')">Registrar Venta</button>
        </div>
      </div>
    </div>
  `).join('');

  // Agregar listeners para actualizar ganancia en tiempo real
  document.querySelectorAll('.input-venta-admin, .input-costo').forEach(input => {
    input.addEventListener('input', function() {
      const padre = this.closest('.item-stock');
      const costo = parseFloat(padre.querySelector('.input-costo').value) || 0;
      const venta = parseFloat(padre.querySelector('.input-venta-admin').value) || 0;
      const ganancia = Math.max(0, venta - costo);
      padre.querySelector('.ganancia-unitaria').textContent = `$${ganancia.toFixed(2)}`;
    });
  });
}

// Guardar stock actualizado
async function guardarStock(productoId) {
  const inputStock = document.querySelector(`.input-stock[data-id="${productoId}"]`);
  const inputCosto = document.querySelector(`.input-costo[data-id="${productoId}"]`);
  const inputVentaAdmin = document.querySelector(`.input-venta-admin[data-id="${productoId}"]`);

  const nuevoStock = parseInt(inputStock.value) || 0;
  const precioCosto = parseFloat(inputCosto.value) || 0;
  const precioVentaAdmin = parseFloat(inputVentaAdmin.value) || 0;

  if (precioCosto < 0 || precioVentaAdmin < 0) {
    mostrarMensaje('Los precios no pueden ser negativos', 'error');
    return;
  }

  // Actualizar stock
  await DataManager.actualizarStock(productoId, nuevoStock);

  // Actualizar precios
  await DataManager.actualizarPrecios(productoId, precioCosto, precioVentaAdmin);

  mostrarMensaje('Stock y precios guardados correctamente', 'exito');
  mostrarControlStock();
}

// Abrir formulario para registrar venta
function abrirFormularioVenta(productoId, nombreProducto) {
  const stockActual = parseInt(document.querySelector(`.input-stock[data-id="${productoId}"]`).value) || 0;
  const precioVenta = parseFloat(document.querySelector(`.input-venta-admin[data-id="${productoId}"]`).value) || 0;
  const precioCosto = parseFloat(document.querySelector(`.input-costo[data-id="${productoId}"]`).value) || 0;

  const modal = document.createElement('div');
  modal.className = 'modal-venta';
  modal.innerHTML = `
    <div class="modal-contenido">
      <h3>Registrar Venta: ${nombreProducto}</h3>
      <div class="form-venta">
        <div class="form-group">
          <label>Stock disponible: <strong>${stockActual}</strong></label>
        </div>
        <div class="form-group">
          <label>Cantidad a vender:</label>
          <input type="number" id="cantidad-venta" value="1" min="1" max="${stockActual}">
        </div>
        <div class="form-group">
          <label>Precio de venta:</label>
          <input type="number" id="precio-venta" value="${precioVenta}" step="0.01" min="0">
        </div>
        <div class="venta-info">
          <p>Precio costo: $${precioCosto.toFixed(2)}</p>
          <p id="ganancia-preview">Ganancia por unidad: $${Math.max(0, precioVenta - precioCosto).toFixed(2)}</p>
          <p id="ganancia-total-preview">Ganancia total: $0.00</p>
        </div>
        <div class="modal-botones">
          <button class="btn-confirmar" onclick="confirmarVenta(${productoId})">Confirmar Venta</button>
          <button class="btn-cancelar" onclick="cerrarModalVenta()">Cancelar</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);

  // Actualizar ganancias en tiempo real
  const cantidadInput = modal.querySelector('#cantidad-venta');
  const precioInput = modal.querySelector('#precio-venta');

  const actualizarGanancias = () => {
    const cantidad = parseInt(cantidadInput.value) || 1;
    const precio = parseFloat(precioInput.value) || 0;
    const gananciaPorUnidad = Math.max(0, precio - precioCosto);
    const gananciaTotal = gananciaPorUnidad * cantidad;

    modal.querySelector('#ganancia-preview').textContent = `Ganancia por unidad: $${gananciaPorUnidad.toFixed(2)}`;
    modal.querySelector('#ganancia-total-preview').textContent = `Ganancia total: $${gananciaTotal.toFixed(2)}`;
  };

  cantidadInput.addEventListener('input', actualizarGanancias);
  precioInput.addEventListener('input', actualizarGanancias);
  actualizarGanancias();
}

// Confirmar venta
async function confirmarVenta(productoId) {
  const modal = document.querySelector('.modal-venta');
  const cantidad = parseInt(modal.querySelector('#cantidad-venta').value) || 1;
  const precio = parseFloat(modal.querySelector('#precio-venta').value) || 0;

  const stockActual = parseInt(document.querySelector(`.input-stock[data-id="${productoId}"]`).value) || 0;

  if (cantidad > stockActual) {
    mostrarMensaje('Cantidad superior al stock disponible', 'error');
    return;
  }

  if (cantidad <= 0) {
    mostrarMensaje('La cantidad debe ser mayor a 0', 'error');
    return;
  }

  const resultado = await DataManager.registrarVenta(productoId, cantidad, precio);

  if (resultado) {
    // Registrar en caja automáticamente
    await DataManager.registrarMovimientoCaja('venta', resultado.ganancia * cantidad, `Venta de producto`, 'venta');
    
    mostrarMensaje(`Venta registrada. Ganancia: $${resultado.ganancia.toFixed(2)}`, 'exito');
    cerrarModalVenta();
    mostrarControlStock();
    mostrarHistorialVentas();
    mostrarControlCaja();
  }
}

// Cerrar modal de venta
function cerrarModalVenta() {
  const modal = document.querySelector('.modal-venta');
  if (modal) {
    modal.remove();
  }
}

// Mostrar historial de ventas
async function mostrarHistorialVentas() {
  const ventas = await DataManager.cargarVentas();
  const contenedor = document.getElementById('historial-ventas');

  if (ventas.length === 0) {
    contenedor.innerHTML = '<div class="sin-contenido">No hay ventas registradas</div>';
    return;
  }

  let totalGanancia = 0;

  contenedor.innerHTML = `
    <table class="tabla-ventas">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio Unitario</th>
          <th>Ganancia Unitaria</th>
          <th>Ganancia Total</th>
        </tr>
      </thead>
      <tbody>
        ${ventas.map(venta => {
          totalGanancia += venta.ganancia_total || 0;
          return `
            <tr>
              <td>${new Date(venta.fecha_venta).toLocaleString('es-AR')}</td>
              <td>${venta.productos?.nombre || 'Producto eliminado'}</td>
              <td>${venta.cantidad_vendida}</td>
              <td>$${parseFloat(venta.precio_unitario).toFixed(2)}</td>
              <td>$${parseFloat(venta.ganancia_unitaria).toFixed(2)}</td>
              <td><strong>$${parseFloat(venta.ganancia_total).toFixed(2)}</strong></td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
    <div class="total-ganancias">
      <h3>Ganancia Total: <strong>$${totalGanancia.toFixed(2)}</strong></h3>
    </div>
  `;
}

// Inicializar control de stock
async function inicializarControlStock() {
  await mostrarControlStock();
  await mostrarHistorialVentas();
  await mostrarControlCaja();
}

// === CONTROL DE CAJA ===

// Mostrar control de caja
async function mostrarControlCaja() {
  const movimientos = await DataManager.cargarMovimientosCaja();
  const saldo = await DataManager.obtenerSaldoCaja();
  const contenedor = document.getElementById('control-caja');

  let totalIngresos = 0;
  let totalEgresos = 0;

  movimientos.forEach(mov => {
    if (mov.tipo === 'ingreso' || mov.tipo === 'venta') {
      totalIngresos += parseFloat(mov.monto) || 0;
    } else if (mov.tipo === 'egreso') {
      totalEgresos += parseFloat(mov.monto) || 0;
    }
  });

  contenedor.innerHTML = `
    <div class="caja-resumen">
      <div class="caja-stat total">
        <h4>Saldo Total</h4>
        <p class="saldo-valor">$${saldo.toFixed(2)}</p>
      </div>
      <div class="caja-stat ingresos">
        <h4>Ingresos</h4>
        <p>$${totalIngresos.toFixed(2)}</p>
      </div>
      <div class="caja-stat egresos">
        <h4>Egresos</h4>
        <p>$${totalEgresos.toFixed(2)}</p>
      </div>
    </div>

    <div class="caja-operaciones">
      <h4>Movimientos de Caja</h4>
      <div class="botones-caja">
        <button class="btn-ingreso" onclick="abrirFormularioMovimientoCaja('ingreso')">+ Ingresar Dinero</button>
        <button class="btn-egreso" onclick="abrirFormularioMovimientoCaja('egreso')">- Sacar Dinero</button>
      </div>

      <div class="movimientos-list">
        ${movimientos.length === 0 ? '<div class="sin-contenido">No hay movimientos de caja</div>' : `
          <table class="tabla-movimientos">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              ${movimientos.map(mov => `
                <tr class="movimiento-${mov.tipo}">
                  <td>${new Date(mov.fecha).toLocaleString('es-AR')}</td>
                  <td><span class="tipo-badge tipo-${mov.tipo}">${mov.tipo.charAt(0).toUpperCase() + mov.tipo.slice(1)}</span></td>
                  <td>${mov.descripcion}</td>
                  <td class="monto-${mov.tipo}">${mov.tipo === 'ingreso' || mov.tipo === 'venta' ? '+' : '-'}$${parseFloat(mov.monto).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `}
      </div>
    </div>
  `;
}

// Abrir formulario de movimiento de caja
function abrirFormularioMovimientoCaja(tipo) {
  const modal = document.createElement('div');
  modal.className = 'modal-venta';
  modal.innerHTML = `
    <div class="modal-contenido">
      <h3>${tipo === 'ingreso' ? 'Ingresar Dinero' : 'Sacar Dinero'}</h3>
      <div class="form-venta">
        <div class="form-group">
          <label>Monto ($):</label>
          <input type="number" id="monto-movimiento" step="0.01" min="0.01" placeholder="0.00">
        </div>
        <div class="form-group">
          <label>Descripción:</label>
          <textarea id="descripcion-movimiento" placeholder="Ej: Pago de proveedor, Cambio, etc." rows="3"></textarea>
        </div>
        <div class="modal-botones">
          <button class="btn-confirmar" onclick="confirmarMovimientoCaja('${tipo}')">Confirmar</button>
          <button class="btn-cancelar" onclick="cerrarModalCaja()">Cancelar</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// Confirmar movimiento de caja
async function confirmarMovimientoCaja(tipo) {
  const monto = parseFloat(document.getElementById('monto-movimiento').value);
  const descripcion = document.getElementById('descripcion-movimiento').value.trim();

  if (!monto || monto <= 0) {
    mostrarMensaje('Ingresa un monto válido', 'error');
    return;
  }

  if (!descripcion) {
    mostrarMensaje('Ingresa una descripción', 'error');
    return;
  }

  await DataManager.registrarMovimientoCaja(tipo, monto, descripcion);
  mostrarMensaje(`Movimiento registrado correctamente`, 'exito');
  cerrarModalCaja();
  mostrarControlCaja();
}

// Cerrar modal de caja
function cerrarModalCaja() {
  const modal = document.querySelector('.modal-venta');
  if (modal) {
    modal.remove();
  }
}
