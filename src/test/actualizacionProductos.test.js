const {
  validarProductoEdicion,
  prepararDatosActualizados,
} = require("./actualizacionProductos");

describe("CP-HF02 - Actualización de productos", () => {
  test("valida correctamente un producto válido para edición", () => {
    const producto = {
      nombre_p: "Aceite de motor",
      descripcion: "Óptimo para motores 4T",
      cantidad: "12",
      disponible: true,
      preciocompra: "20.5",
      precioventa: "30.75",
    };

    const errores = validarProductoEdicion(producto);

    expect(errores).toHaveLength(0);
  });

  test("devuelve errores cuando faltan datos obligatorios en la edición", () => {
    const producto = {
      nombre_p: "",
      descripcion: "",
      cantidad: "5",
      disponible: true,
      preciocompra: 0,
      precioventa: -10,
    };

    const errores = validarProductoEdicion(producto);

    expect(errores).toContain("El nombre del producto es obligatorio");
    expect(errores).toContain("El precio de compra debe ser mayor a 0");
    expect(errores).toContain("El precio de venta debe ser mayor a 0");
  });

  test("prepara correctamente los datos actualizados antes de enviarlos al backend", () => {
    const producto = {
      nombre_p: "Filtro de aire",
      descripcion: "Con malla reforzada",
      cantidad: "8",
      disponible: false,
      preciocompra: "15.25",
      precioventa: "25.50",
    };

    const datos = prepararDatosActualizados(producto);

    expect(datos).toEqual({
      nombre_p: "Filtro de aire",
      descripcion: "Con malla reforzada",
      cantidad: 8,
      disponible: false,
      preciocompra: 15.25,
      precioventa: 25.5,
    });
  });

  test("transforma descripción vacía a null y maneja cantidades no numéricas como 0", () => {
    const producto = {
      nombre_p: "Correa de transmisión",
      descripcion: "",
      cantidad: "abc",
      disponible: true,
      preciocompra: "10",
      precioventa: "18",
    };

    const datos = prepararDatosActualizados(producto);

    expect(datos.descripcion).toBeNull();
    expect(datos.cantidad).toBe(0);
  });
});
