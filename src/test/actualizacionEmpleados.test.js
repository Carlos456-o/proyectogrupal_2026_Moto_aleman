const {
  validarEmpleadoEdicion,
  prepararDatosEmpleadoActualizado,
} = require("./actualizacionEmpleados");

describe("CP-HF011 - Actualización de empleados", () => {
  test("valida correctamente un empleado válido para edición", () => {
    const empleado = {
      nombre: "Ana",
      apellido: "García",
      cargo: "Contabilidad",
    };

    const errores = validarEmpleadoEdicion(empleado);

    expect(errores).toHaveLength(0);
  });

  test("devuelve errores cuando faltan campos obligatorios", () => {
    const empleado = {
      nombre: "",
      apellido: "   ",
      cargo: "",
    };

    const errores = validarEmpleadoEdicion(empleado);

    expect(errores).toContain("El nombre del empleado es obligatorio");
    expect(errores).toContain("El apellido del empleado es obligatorio");
    expect(errores).toContain("El cargo del empleado es obligatorio");
  });

  test("prepara correctamente los datos recortando espacios en los campos", () => {
    const empleado = {
      nombre: "  José  ",
      apellido: "  López ",
      cargo: "  Ventas  ",
    };

    const datos = prepararDatosEmpleadoActualizado(empleado);

    expect(datos).toEqual({
      nombre: "José",
      apellido: "López",
      cargo: "Ventas",
    });
  });

  test("mantiene los datos válidos y no genera errores al editar solo campos obligatorios", () => {
    const empleado = {
      nombre: "María",
      apellido: "Sánchez",
      cargo: "Soporte",
    };

    const errores = validarEmpleadoEdicion(empleado);

    expect(errores).toEqual([]);
  });
});
