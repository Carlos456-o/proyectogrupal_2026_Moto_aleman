const {
  validarRegistroCliente,
  prepararClienteParaRegistro,
} = require("./registroClientes");

describe("CP-HF013 - Registro de clientes", () => {
  test("valida un cliente con datos completos y opcionales", () => {
    const cliente = {
      nombre1: "Pedro",
      nombre2: "Alberto",
      apellidos1: "Hernández",
      apellidos2: "Flores",
      cedula: "9876543210",
    };

    const errores = validarRegistroCliente(cliente);

    expect(errores).toHaveLength(0);
  });

  test("detecta campos obligatorios incompletos", () => {
    const cliente = {
      nombre1: " ",
      nombre2: "",
      apellidos1: "",
      apellidos2: "García",
      cedula: "",
    };

    const errores = validarRegistroCliente(cliente);

    expect(errores).toContain("El primer nombre del cliente es obligatorio");
    expect(errores).toContain("El primer apellido del cliente es obligatorio");
  });

  test("prepara los datos del cliente recortando espacios", () => {
    const cliente = {
      nombre1: "  Ana  ",
      nombre2: "  María ",
      apellidos1: " Torres  ",
      apellidos2: "  Pérez",
      cedula: "  1234567890  ",
    };

    const datos = prepararClienteParaRegistro(cliente);

    expect(datos).toEqual({
      nombre1: "Ana",
      nombre2: "María",
      apellidos1: "Torres",
      apellidos2: "Pérez",
      cedula: "1234567890",
    });
  });

  test("permite registro cuando solo se completan los campos obligatorios", () => {
    const cliente = {
      nombre1: "Lucía",
      nombre2: "",
      apellidos1: "Cruz",
      apellidos2: "",
      cedula: "",
    };

    const errores = validarRegistroCliente(cliente);

    expect(errores).toHaveLength(0);
  });
});
