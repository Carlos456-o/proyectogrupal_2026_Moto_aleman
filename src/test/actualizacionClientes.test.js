const {
  validarCedulaEdicion,
  construirCedulaActualizada,
} = require("./actualizacionClientes");
describe("CP-HF015 - Validación de Cédula en Actualización de Cliente", () => {
  test("Valida correctamente una cédula con formato XXX-XXXXXX-XXXXK (letra al final)", () => {
    const errores = validarCedulaEdicion("121-000000-0000A");
    expect(errores).toHaveLength(0);
  });
  test("Rechaza cédula con guiones en posiciones incorrectas", () => {
    const errores = validarCedulaEdicion("12-1000000-0000A");
    expect(errores).toContain('Cédula debe tener el formato: 121-000000-0000X');
  });
  test("Rechaza cédula nula", () => {
    const errores = validarCedulaEdicion(null);
    expect(errores).toContain("Cédula es obligatoria");
  });
  test("Construye correctamente un objeto con la cédula actualizada", () => {
    const construccion = construirCedulaActualizada("121-000000-0000A");
    expect(construccion).toEqual({
      cedula: "121-000000-0000A",
    });
  });
});