// Helpers para pruebas de Dim_tiempo en ventas

function construirInsertsVentas(items, clienteId, empleadoId, idTiempo = 1) {
  return items.map((it) => ({
    id_cliente: Number(clienteId),
    id_empleado: Number(empleadoId),
    id_producto: Number(it.idProducto),
    id_tiempo: Number(idTiempo),
    cantidad_ven: Number(it.cantidad),
    precio_ven: Number(it.precioVen),
    total_venta: Number(it.totalVenta),
  }));
}

function construirInsertsVentasAlt(items, clienteId, empleadoId, idTiempo = 1) {
  return items.map((it) => ({
    ID_Cliente: Number(clienteId),
    ID_Empleado: Number(empleadoId),
    ID_Producto: Number(it.idProducto),
    ID_Tiempo: Number(idTiempo),
    Cantidad_ven: Number(it.cantidad),
    Precio_Ven: Number(it.precioVen),
    Total_Venta: Number(it.totalVenta),
  }));
}

function construirMinimalInputs(items) {
  return items.map((it) => ({
    cantidad_ven: Number(it.cantidad),
    precio_ven: Number(it.precioVen),
    total_venta: Number(it.totalVenta),
  }));
}

function construirMinimalAltInputs(items) {
  return items.map((it) => ({
    Cantidad_ven: Number(it.cantidad),
    Precio_Ven: Number(it.precioVen),
    Total_Venta: Number(it.totalVenta),
  }));
}

module.exports = {
  construirInsertsVentas,
  construirInsertsVentasAlt,
  construirMinimalInputs,
  construirMinimalAltInputs,
};
