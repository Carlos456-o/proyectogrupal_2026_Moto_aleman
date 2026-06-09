const {
  validarEstadoEdicion,
  construirEmpleadoActualizado,
} = require("./actualizacionEmpleados");
describe("CP-HF011 - Validación de Estado en Actualización de Empleado", () => {
  test("Valida correctamente estado como false", () => {
    const errores = validarEstadoEdicion(false);
    expect(errores).toHaveLength(0);
  });
  test("Rechaza estado como número 1", () => {
    const errores = validarEstadoEdicion(1);
    expect(errores).toContain("Estado debe ser true o false");
  });
  test("Rechaza estado vacío", () => {
    const errores = validarEstadoEdicion("");
    expect(errores).toContain("Estado es obligatorio");
  });
  test("Construye correctamente un empleado actualizado con estado como string 'TRUE'", () => {
    const construccion = construirEmpleadoActualizado("TRUE");
    expect(construccion).toEqual({
      estado: true,
    });
  });
});