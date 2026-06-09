const {
  validarVenta,
  construirVenta,
} = require("./ventas");
describe("CP-HF05 - Registro de venta y validación", () => {
  test("Debe validar que PrecioV sea decimal ≥ 0.00", () => {
    const venta = { precio_ven: -5, total_venta: 10, cantidad_ven: 2, disponible: true };
    const errores = validarVenta(venta);
    expect(errores).toContain("PrecioV debe ser un decimal ≥ 0.00");
  });
  test("Valida correctamente una venta válida con disponible true", () => {
    const venta = { precio_ven: 25.5, total_venta: 51, cantidad_ven: 2, disponible: true };
    const errores = validarVenta(venta);
    expect(errores).toHaveLength(0);
  });
  test("Rechaza strings no numéricos para precios", () => {
    const venta = { precio_ven: "abc", total_venta: "51", cantidad_ven: 2, disponible: true };
    const errores = validarVenta(venta);
    expect(errores).toContain("PrecioV debe ser un decimal ≥ 0.00");
  });
  test("Construye correctamente una venta con los campos convertidos", () => {
    const venta = { precio_ven: "25.5", total_venta: "51", cantidad_ven: "2", disponible: true };
    const construccion = construirVenta(venta);
    expect(construccion).toEqual({
      precio_ven: 25.5,
      total_venta: 51,
      cantidad_ven: 2,
      disponible: true,
    });
  });
});