// Helpers para pruebas del flujo de actualización de productos

function validarProductoEdicion(productoEditar) {
  const errors = [];

  if (!productoEditar) {
    errors.push("Producto inválido");
    return errors;
  }

  // Validar PrecioC: decimal ≥ 0
  if (productoEditar.preciocompra == null || productoEditar.preciocompra === "") {
    errors.push("PrecioC es obligatorio");
  } else if (isNaN(Number(productoEditar.preciocompra)) || Number(productoEditar.preciocompra) < 0) {
    errors.push("PrecioC debe ser un decimal ≥ 0");
  }

  // Validar PrecioV: decimal ≥ 0
  if (productoEditar.precioventa == null || productoEditar.precioventa === "") {
    errors.push("PrecioV es obligatorio");
  } else if (isNaN(Number(productoEditar.precioventa)) || Number(productoEditar.precioventa) < 0) {
    errors.push("PrecioV debe ser un decimal ≥ 0");
  }

  // Validar Cantidad: entero ≥ 0
  if (productoEditar.cantidad == null || productoEditar.cantidad === "") {
    errors.push("Cantidad es obligatoria");
  } else if (!Number.isInteger(Number(productoEditar.cantidad)) || Number(productoEditar.cantidad) < 0) {
    errors.push("Cantidad debe ser un entero ≥ 0");
  }

  // Validar disponible: true/false
  if (productoEditar.disponible == null || productoEditar.disponible === "") {
    errors.push("disponible es obligatorio");
  } else if (typeof productoEditar.disponible !== "boolean" && 
             (String(productoEditar.disponible).toLowerCase() !== "true" && String(productoEditar.disponible).toLowerCase() !== "false")) {
    errors.push("disponible debe ser true o false");
  }

  return errors;
}

function prepararDatosActualizados(productoEditar) {
  return {
    preciocompra: parseFloat(productoEditar.preciocompra),
    precioventa: parseFloat(productoEditar.precioventa),
    cantidad: parseInt(productoEditar.cantidad, 10),
    disponible: typeof productoEditar.disponible === "boolean" ? productoEditar.disponible : String(productoEditar.disponible).toLowerCase() === "true",
  };
}

module.exports = {
  validarProductoEdicion,
  prepararDatosActualizados,
};
