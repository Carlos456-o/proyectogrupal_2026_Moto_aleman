const {
  validarEstado,
  construirEmpleado,
} = require("./registroEmpleado");

describe("CP-HF09 - Validación de Estado de Empleado", () => {
  test("Valida correctamente estado como true", () => {
    const errores = validarEstado(true);
    expect(errores).toHaveLength(0);
  });

  test("Rechaza estado como string inválido 'yes'", () => {
    const errores = validarEstado("yes");
    expect(errores).toContain("Estado debe ser true o false");
  });

  test("Rechaza estado nulo", () => {
    const errores = validarEstado(null);
    expect(errores).toContain("Estado es obligatorio");
  });

  test("Construye correctamente un empleado con estado false", () => {
    const construccion = construirEmpleado(false);
    expect(construccion).toEqual({
      estado: false,
    });
  });
});
