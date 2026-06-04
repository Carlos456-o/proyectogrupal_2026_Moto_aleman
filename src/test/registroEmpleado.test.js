const {
  validarRegistroEmpleado,
  prepararEmpleadoParaRegistro,
} = require("./registroEmpleado");

describe("CP-HF09 - Registro de empleado", () => {
  test("valida un empleado completo correctamente", () => {
    const empleado = {
      nombre: "María",
      apellido: "López",
      cargo: "Administradora",
    };

    const errores = validarRegistroEmpleado(empleado);

    expect(errores).toHaveLength(0);
  });

  test("detecta campos obligatorios cuando faltan datos", () => {
    const empleado = {
      nombre: "",
      apellido: "  ",
      cargo: "",
    };

    const errores = validarRegistroEmpleado(empleado);

    expect(errores).toContain("El nombre del empleado es obligatorio");
    expect(errores).toContain("El apellido del empleado es obligatorio");
    expect(errores).toContain("El cargo del empleado es obligatorio");
  });

  test("prepara los datos del empleado para el registro recortando espacios", () => {
    const empleado = {
      nombre: "  Juan  ",
      apellido: " Pérez ",
      cargo: "  Ventas  ",
    };

    const datos = prepararEmpleadoParaRegistro(empleado);

    expect(datos).toEqual({
      nombre: "Juan",
      apellido: "Pérez",
      cargo: "Ventas",
    });
  });

  test("retorna errores si algún campo de texto está vacío o solo tiene espacios", () => {
    const empleado = {
      nombre: "   ",
      apellido: "Gómez",
      cargo: "",
    };

    const errores = validarRegistroEmpleado(empleado);

    expect(errores).toContain("El nombre del empleado es obligatorio");
    expect(errores).toContain("El cargo del empleado es obligatorio");
    expect(errores).not.toContain("El apellido del empleado es obligatorio");
  });
});
