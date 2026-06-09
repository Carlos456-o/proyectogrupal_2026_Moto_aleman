const { supabase } = require("../database/supabaseconfig");

function validateProducto(producto) {
  const errors = [];
  
  if (!producto) {
    errors.push("Producto inválido");
    return { valid: false, errors };
  }

  // Validar PrecioC: decimal ≥ 0
  if (producto.preciocompra == null || producto.preciocompra === "") {
    errors.push("PrecioC es obligatorio");
  } else if (isNaN(Number(producto.preciocompra)) || Number(producto.preciocompra) < 0) {
    errors.push("PrecioC debe ser un decimal ≥ 0");
  }

  // Validar PrecioV: decimal ≥ 0
  if (producto.precioventa == null || producto.precioventa === "") {
    errors.push("PrecioV es obligatorio");
  } else if (isNaN(Number(producto.precioventa)) || Number(producto.precioventa) < 0) {
    errors.push("PrecioV debe ser un decimal ≥ 0");
  }

  // Validar Cantidad: entero ≥ 0
  if (producto.cantidad == null || producto.cantidad === "") {
    errors.push("Cantidad es obligatoria");
  } else if (!Number.isInteger(Number(producto.cantidad)) || Number(producto.cantidad) < 0) {
    errors.push("Cantidad debe ser un entero ≥ 0");
  }

  // Validar disponible: true/false
  if (producto.disponible == null || producto.disponible === "") {
    errors.push("disponible es obligatorio");
  } else if (typeof producto.disponible !== "boolean" && 
             (String(producto.disponible).toLowerCase() !== "true" && String(producto.disponible).toLowerCase() !== "false")) {
    errors.push("disponible debe ser true o false");
  }

  return { valid: errors.length === 0, errors };
}

async function registerProducto(producto) {
  const { valid, errors } = validateProducto(producto);
  if (!valid) return { success: false, errors };

  const { data, error } = await supabase.from("productos").insert([producto]);
  if (error)
    return { success: false, errors: [error.message || String(error)] };
  return { success: true, data };
}

module.exports = { validateProducto, registerProducto };
