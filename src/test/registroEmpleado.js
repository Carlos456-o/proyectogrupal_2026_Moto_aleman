// Helpers para pruebas de registro de empleado

function validarRegistroEmpleado(nuevoEmpleado) {
  const errors = [];

  if (!nuevoEmpleado?.nombre?.trim()) {
    errors.push("El nombre del empleado es obligatorio");
  }
  if (!nuevoEmpleado?.apellido?.trim()) {
    errors.push("El apellido del empleado es obligatorio");
  }
  if (!nuevoEmpleado?.cargo?.trim()) {
    errors.push("El cargo del empleado es obligatorio");
  }

  return errors;
}

function prepararEmpleadoParaRegistro(nuevoEmpleado) {
  return {
    nombre: nuevoEmpleado.nombre?.trim() || "",
    apellido: nuevoEmpleado.apellido?.trim() || "",
    cargo: nuevoEmpleado.cargo?.trim() || "",
  };
}

module.exports = {
  validarRegistroEmpleado,
  prepararEmpleadoParaRegistro,
};
