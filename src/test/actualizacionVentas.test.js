const {
  calcularTotalGeneral,
  validarVenta,
  actualizarCantidad,
} = require("./actualizacionVentas");

describe("CP-HF06 - Actualización de ventas", () => {
  test("actualiza la cantidad de un detalle existente y recalcula el total general", () => {
    const detallesIniciales = [
      { id_producto: 1, nombre_producto: "Bujía", precio: 100, cantidad: 2 },
      { id_producto: 2, nombre_producto: "Filtro", precio: 50, cantidad: 1 },
    ];

    const detallesActualizados = actualizarCantidad(detallesIniciales, 1, 5);
    const total = calcularTotalGeneral(detallesActualizados);

    expect(detallesActualizados).toHaveLength(2);
    expect(detallesActualizados[0].cantidad).toBe(5);
    expect(total).toBe(5 * 100 + 1 * 50);
  });

  test("no permite actualizar la cantidad a un valor inválido y mantiene los detalles originales", () => {
    const detallesIniciales = [
      { id_producto: 1, nombre_producto: "Bujía", precio: 100, cantidad: 2 },
    ];

    const detallesActualizados = actualizarCantidad(detallesIniciales, 1, 0);

    expect(detallesActualizados).toEqual(detallesIniciales);
  });

  test("valida que una venta editada con detalles inválidos no sea aceptada", () => {
    const detallesInvalidos = [
      { id_producto: null, nombre_producto: "", precio: 100, cantidad: 2 },
      { id_producto: 2, nombre_producto: "Filtro", precio: -20, cantidad: 1 },
    ];

    const errores = validarVenta(detallesInvalidos);

    expect(errores).toContain("Detalle 1: Producto no válido");
    expect(errores).toContain("Detalle 1: Nombre de producto requerido");
    expect(errores).toContain("Detalle 2: El precio debe ser un número positivo");
  });
});
