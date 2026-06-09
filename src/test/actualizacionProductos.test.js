const {
  validarProductoEdicion,
  prepararDatosActualizados,
} = require("./actualizacionProductos");
describe("CP-HF02 - Actualización de productos", () => {
  test("Debe validar que PrecioC sea decimal ≥ 0", () => {
    const producto = { preciocompra: -5, precioventa: 10, cantidad: 5, disponible: true };
    const errores = validarProductoEdicion(producto);
    expect(errores).toContain("PrecioC debe ser un decimal ≥ 0");
  });
  test("Valida correctamente un producto válido para edición", () => {
    const producto = {
      preciocompra: "20.5",
      precioventa: "30.75",
      cantidad: "12",
      disponible: true,
    };
    const errores = validarProductoEdicion(producto);
    expect(errores).toHaveLength(0);
  });
  test("Retorna error cuando falta disponible", () => {
    const producto = { preciocompra: 10, precioventa: 20, cantidad: 5 };
    const errores = validarProductoEdicion(producto);
    expect(errores).toContain("disponible es obligatorio");
  });
  test("Prepara correctamente los datos actualizados", () => {
    const producto = {
      preciocompra: "15.25",
      precioventa: "25.50",
      cantidad: "8",
      disponible: false,
    };
    const datos = prepararDatosActualizados(producto);
    expect(datos).toEqual({
      preciocompra: 15.25,
      precioventa: 25.5,
      cantidad: 8,
      disponible: false,
    });
  });
});