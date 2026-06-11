// Helpers de ventas para pruebas unitarias

function validarVenta(venta) {
  const errors = [];

  if (!venta) {
    errors.push("Venta inválida");
    return errors;
  }

  // Validar PrecioV: decimal ≥ 0.00
  if (venta.precio_ven == null || venta.precio_ven === "") {
    errors.push("PrecioV es obligatorio");
  } else if (isNaN(Number(venta.precio_ven)) || Number(venta.precio_ven) < 0) {
    errors.push("PrecioV debe ser un decimal ≥ 0.00");
  }

  // Validar TotalVenta: decimal ≥ 0.00
  if (venta.total_venta == null || venta.total_venta === "") {
    errors.push("TotalVenta es obligatorio");
  } else if (isNaN(Number(venta.total_venta)) || Number(venta.total_venta) < 0) {
    errors.push("TotalVenta debe ser un decimal ≥ 0.00");
  }

  // Validar Cantidad_ven: entero ≥ 0
  if (venta.cantidad_ven == null || venta.cantidad_ven === "") {
    errors.push("Cantidad_ven es obligatoria");
  } else if (!Number.isInteger(Number(venta.cantidad_ven)) || Number(venta.cantidad_ven) < 0) {
    errors.push("Cantidad_ven debe ser un entero ≥ 0");
  }

  // Validar disponible: true/false
  if (venta.disponible == null || venta.disponible === "") {
    errors.push("disponible es obligatorio");
  } else if (typeof venta.disponible !== "boolean" && 
             (String(venta.disponible).toLowerCase() !== "true" && String(venta.disponible).toLowerCase() !== "false")) {
    errors.push("disponible debe ser true o false");
  }

  return errors;
}

function construirVenta(venta) {
  return {
    precio_ven: parseFloat(venta.precio_ven),
    total_venta: parseFloat(venta.total_venta),
    cantidad_ven: parseInt(venta.cantidad_ven, 10),
    disponible: typeof venta.disponible === "boolean" ? venta.disponible : String(venta.disponible).toLowerCase() === "true",
  };
}

module.exports = {
  validarVenta,
  construirVenta,
};
