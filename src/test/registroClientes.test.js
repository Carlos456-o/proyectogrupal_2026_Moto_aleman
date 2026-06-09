const {
  validarCedula,
  construirCedula,
} = require("./registroClientes");
describe("CP-HF013 - Validación de Cédula de Cliente", () => {
  test("Valida correctamente una cédula con formato XXX-XXXXXX-XXXXD (dígito al final)", () => {
    const errores = validarCedula("121-000000-00000");
    expect(errores).toHaveLength(0);
  });
  test("Rechaza cédula sin guiones", () => {
    const errores = validarCedula("121000000000A");
    expect(errores).toContain('Cédula debe tener el formato: 121-000000-0000X');
  });
  test("Rechaza cédula vacía", () => {
    const errores = validarCedula("");
    expect(errores).toContain("Cédula es obligatoria");
  });
  test("Construye correctamente un objeto con la cédula", () => {
    const construccion = construirCedula("121-000000-0000A");
    expect(construccion).toEqual({
      cedula: "121-000000-0000A",
    });
  });
});