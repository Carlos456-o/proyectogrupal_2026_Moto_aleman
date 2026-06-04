// Helpers para pruebas del flujo de actualización de productos

function validarProductoEdicion(productoEditar) {
  const errors = [];

  if (!productoEditar?.nombre_p?.trim()) {
    errors.push("El nombre del producto es obligatorio");
  }
  if (productoEditar?.preciocompra == null || Number(productoEditar.preciocompra) <= 0) {
    errors.push("El precio de compra debe ser mayor a 0");
  }
  if (productoEditar?.precioventa == null || Number(productoEditar.precioventa) <= 0) {
    errors.push("El precio de venta debe ser mayor a 0");
  }

  return errors;
}

function prepararDatosActualizados(productoEditar) {
  return {
    nombre_p: productoEditar.nombre_p,
    descripcion: productoEditar.descripcion || null,
    cantidad: parseInt(productoEditar.cantidad, 10) || 0,
    disponible: Boolean(productoEditar.disponible),
    preciocompra: parseFloat(productoEditar.preciocompra),
    precioventa: parseFloat(productoEditar.precioventa),
  };
}

module.exports = {
  validarProductoEdicion,
  prepararDatosActualizados,
};
