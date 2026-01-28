// === CONTROL DE STOCK Y VENTAS ===

// Mostrar control de stock
async function mostrarControlStock() {
  const productos = await DataManager.cargarProductosConStock();
  const contenedor = document.getElementById('lista-stock');

  if (productos.length === 0) {
    contenedor.innerHTML = '<div class="sin-contenido">No hay productos. Agrega algunos primero.</div>';
    return;
  }

  contenedor.innerHTML = productos.map(prod => `
    <div class="item-stock">
      <div class="stock-info">
        <h3>${prod.nombre}</h3>
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
    mostrarMensaje(`Venta registrada. Ganancia: $${resultado.ganancia.toFixed(2)}`, 'exito');
    cerrarModalVenta();
    mostrarControlStock();
    mostrarHistorialVentas();
  } else {
    mostrarMensaje('Error al registrar la venta', 'error');
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
}
