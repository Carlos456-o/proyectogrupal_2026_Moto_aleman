const {
  validarVentaEdicion,
  construirVentaActualizada,
} = require("./actualizacionVentas");
describe("CP-HF06 - Actualización de ventas", () => {
  test("Debe validar que TotalVenta sea decimal ≥ 0.00", () => {
    const venta = { precio_ven: 25.5, total_venta: -10, cantidad_ven: 2, disponible: true };
    const errores = validarVentaEdicion(venta);
    expect(errores).toContain("TotalVenta debe ser un decimal ≥ 0.00");
  });
  test("Valida correctamente una venta válida para edición con disponible false", () => {
    const venta = { precio_ven: 30.75, total_venta: 61.5, cantidad_ven: 2, disponible: false };
    const errores = validarVentaEdicion(venta);
    expect(errores).toHaveLength(0);
  });
  test("Retorna error cuando falta Cantidad_ven", () => {
    const venta = { precio_ven: 25.5, total_venta: 51, disponible: true };
    const errores = validarVentaEdicion(venta);
    expect(errores).toContain("Cantidad_ven es obligatoria");
  });
  test("Construye correctamente una venta actualizada con los campos convertidos", () => {
    const venta = { precio_ven: "25.5", total_venta: "51", cantidad_ven: "2", disponible: true };
    const construccion = construirVentaActualizada(venta);
    expect(construccion).toEqual({
      precio_ven: 25.5,
      total_venta: 51,
      cantidad_ven: 2,
      disponible: true,
    });
  });
});