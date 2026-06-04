const { supabase } = require("../database/supabaseconfig");

function validateProducto(producto) {
  const errors = [];
  if (!producto) {
    errors.push("Producto inválido");
    return { valid: false, errors };
  }

  if (!producto.nombre_p || String(producto.nombre_p).trim() === "") {
    errors.push("El nombre es obligatorio");
  }

  if (!producto.descripcion || String(producto.descripcion).trim() === "") {
    errors.push("La descripción es obligatoria");
  }

  if (
    producto.cantidad == null ||
    producto.cantidad === "" ||
    Number(producto.cantidad) <= 0
  ) {
    errors.push("La cantidad debe ser un número positivo");
  }

  if (
    producto.preciocompra == null ||
    producto.preciocompra === "" ||
    Number(producto.preciocompra) <= 0
  ) {
    errors.push("El precio de compra debe ser un número positivo");
  }

  if (
    producto.precioventa == null ||
    producto.precioventa === "" ||
    Number(producto.precioventa) <= 0
  ) {
    errors.push("El precio de venta debe ser un número positivo");
  }

  if (!producto.archivo) {
    errors.push("La imagen del producto es obligatoria");
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
