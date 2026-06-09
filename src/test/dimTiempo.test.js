const {
  validarFecha,
  validarAño,
  construirDimensionTiempo,
} = require("./dimTiempo");
describe("CP-HF014 - Dim_Tiempo (Validación de Fecha y Año)", () => {
  test("Valida correctamente una fecha con formato DD/MM/YYYY", () => {
    const errores = validarFecha("15/06/2026");
    expect(errores).toHaveLength(0);
  });
  test("Rechaza fecha sin guiones", () => {
    const errores = validarFecha("15062026");
    expect(errores).toContain("Fecha debe tener el formato: DD/MM/YYYY (ejemplo: 15/06/2026)");
  });
  test("Valida correctamente un año entero válido", () => {
    const errores = validarAño(2026);
    expect(errores).toHaveLength(0);
  });
  test("Construye correctamente una dimensión de tiempo", () => {
    const construccion = construirDimensionTiempo("15/06/2026", 2026);
    expect(construccion).toEqual({
      fecha: "15/06/2026",
      año: 2026,
    });
  });
});