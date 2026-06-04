const {
  validarClienteEdicion,
  prepararDatosClienteActualizado,
} = require("./actualizacionClientes");

describe("CP-HF015 - Actualización de clientes", () => {
  test("valida correctamente un cliente válido para edición", () => {
    const cliente = {
      nombre1: "Laura",
      nombre2: "Isabel",
      apellidos1: "Ramírez",
      apellidos2: "González",
      cedula: "1234567890",
    };

    const errores = validarClienteEdicion(cliente);

    expect(errores).toHaveLength(0);
  });

  test("devuelve errores cuando faltan campos obligatorios", () => {
    const cliente = {
      nombre1: "",
      nombre2: "María",
      apellidos1: "   ",
      apellidos2: "Pérez",
      cedula: "",
    };

    const errores = validarClienteEdicion(cliente);

    expect(errores).toContain("El primer nombre del cliente es obligatorio");
    expect(errores).toContain("El primer apellido del cliente es obligatorio");
  });

  test("prepara correctamente los datos del cliente recortando espacios", () => {
    const cliente = {
      nombre1: "  Juan  ",
      nombre2: "  Carlos  ",
      apellidos1: "  Mendoza  ",
      apellidos2: "  Díaz  ",
      cedula: "  9876543210  ",
    };

    const datos = prepararDatosClienteActualizado(cliente);

    expect(datos).toEqual({
      nombre1: "Juan",
      nombre2: "Carlos",
      apellidos1: "Mendoza",
      apellidos2: "Díaz",
      cedula: "9876543210",
    });
  });

  test("permite actualizar cuando solo se completan los campos obligatorios", () => {
    const cliente = {
      nombre1: "Ana",
      nombre2: "",
      apellidos1: "Cuevas",
      apellidos2: "",
      cedula: "",
    };

    const errores = validarClienteEdicion(cliente);

    expect(errores).toEqual([]);
  });
});
