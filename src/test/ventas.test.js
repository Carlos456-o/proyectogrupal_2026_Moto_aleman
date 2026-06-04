const {
  calcularTotalGeneral,
  validarVenta,
  agregarDetalle,
  actualizarCantidad,
} = require("./ventas");

describe("CP-HF05 - Registro de venta y validación de cálculos", () => {
  test("calcula correctamente el total general de los detalles de venta", () => {
    const detalles = [
      { id_producto: 1, nombre_producto: "Bujía", precio: 100, cantidad: 2 },
      { id_producto: 2, nombre_producto: "Filtro", precio: 50, cantidad: 3 },
    ];

    const total = calcularTotalGeneral(detalles);

    expect(total).toBe(350);
  });

  test("agrega detalle existente sumando cantidad sin duplicar el producto", () => {
    const producto = {
      id_producto: 1,
      nombreProducto: "Bujía",
      precioVenta: 100,
    };
    const detallesIniciales = [
      { id_producto: 1, nombre_producto: "Bujía", precio: 100, cantidad: 2 },
    ];

    const detallesActualizados = agregarDetalle(detallesIniciales, producto, 3);

    expect(detallesActualizados).toHaveLength(1);
    expect(detallesActualizados[0].cantidad).toBe(5);
    expect(detallesActualizados[0].precio).toBe(100);
  });

  test("actualiza la cantidad de un detalle existente cuando la nueva cantidad es válida", () => {
    const detallesIniciales = [
      { id_producto: 1, nombre_producto: "Bujía", precio: 100, cantidad: 2 },
    ];

    const detallesActualizados = actualizarCantidad(detallesIniciales, 1, 5);

    expect(detallesActualizados[0].cantidad).toBe(5);
    expect(detallesActualizados[0].precio).toBe(100);
  });

  test("no permite registrar venta sin productos y devuelve el mensaje de error correspondiente", () => {
    const errores = validarVenta([]);

    expect(errores).toContain(
      "Agrega al menos un producto para registrar la venta",
    );
  });

  test("valida los cálculos y datos del detalle antes de registrar la venta", () => {
    const detallesInvalidos = [
      { id_producto: 1, nombre_producto: "Bujía", precio: -10, cantidad: 2 },
      { id_producto: null, nombre_producto: "", precio: 20, cantidad: 0 },
    ];

    const errores = validarVenta(detallesInvalidos);

    expect(errores).toContain(
      "Detalle 1: El precio debe ser un número positivo",
    );
    expect(errores).toContain(
      "Detalle 2: Producto no válido",
    );
    expect(errores).toContain(
      "Detalle 2: Nombre de producto requerido",
    );
    expect(errores).toContain(
      "Detalle 2: La cantidad debe ser un número positivo",
    );
  });
});
