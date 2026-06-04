// Helpers de ventas para pruebas unitarias

function calcularTotalGeneral(detalles) {
  if (!Array.isArray(detalles)) return 0;
  return detalles.reduce((sum, detalle) => {
    const cantidad = Number(detalle.cantidad || 0);
    const precio = Number(detalle.precio || 0);
    return sum + cantidad * precio;
  }, 0);
}

function validarVenta(detalles) {
  const errors = [];

  if (!Array.isArray(detalles) || detalles.length === 0) {
    errors.push("Agrega al menos un producto para registrar la venta");
    return errors;
  }

  detalles.forEach((detalle, index) => {
    const cantidad = Number(detalle.cantidad);
    const precio = Number(detalle.precio);

    if (!detalle.id_producto) {
      errors.push(`Detalle ${index + 1}: Producto no válido`);
    }
    if (!detalle.nombre_producto) {
      errors.push(`Detalle ${index + 1}: Nombre de producto requerido`);
    }
    if (Number.isNaN(cantidad) || cantidad <= 0) {
      errors.push(`Detalle ${index + 1}: La cantidad debe ser un número positivo`);
    }
    if (Number.isNaN(precio) || precio <= 0) {
      errors.push(`Detalle ${index + 1}: El precio debe ser un número positivo`);
    }
  });

  return errors;
}

function agregarDetalle(prevDetalles, producto, cantidad) {
  if (!producto || cantidad == null || Number(cantidad) <= 0) return prevDetalles;

  const existente = prevDetalles.find((d) => d.id_producto === producto.id_producto);
  if (existente) {
    return prevDetalles.map((d) =>
      d.id_producto === producto.id_producto
        ? { ...d, cantidad: Number(d.cantidad) + Number(cantidad) }
        : d,
    );
  }

  return [
    ...prevDetalles,
    {
      id_producto: producto.id_producto,
      nombre_producto: producto.nombreProducto || producto.nombre_p || producto.nombre || "",
      precio: Number(producto.precioVenta || producto.precio_ven || producto.precio || 0),
      cantidad: Number(cantidad),
    },
  ];
}

function actualizarCantidad(prevDetalles, id_producto, nuevaCantidad) {
  if (Number(nuevaCantidad) <= 0) return prevDetalles;
  return prevDetalles.map((detalle) =>
    detalle.id_producto === id_producto
      ? { ...detalle, cantidad: Number(nuevaCantidad) }
      : detalle,
  );
}

module.exports = {
  calcularTotalGeneral,
  validarVenta,
  agregarDetalle,
  actualizarCantidad,
};
