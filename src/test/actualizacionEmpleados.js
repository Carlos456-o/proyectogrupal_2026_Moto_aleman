// Helpers para pruebas del flujo de actualización de empleados

function validarEmpleadoEdicion(empleadoEditar) {
  const errors = [];

  if (!empleadoEditar || typeof empleadoEditar !== "object") {
    errors.push("Empleado inválido");
    return errors;
  }

  if (!empleadoEditar.nombre || String(empleadoEditar.nombre).trim() === "") {
    errors.push("El nombre del empleado es obligatorio");
  }

  if (!empleadoEditar.apellido || String(empleadoEditar.apellido).trim() === "") {
    errors.push("El apellido del empleado es obligatorio");
  }

  if (!empleadoEditar.cargo || String(empleadoEditar.cargo).trim() === "") {
    errors.push("El cargo del empleado es obligatorio");
  }

  return errors;
}

function prepararDatosEmpleadoActualizado(empleadoEditar) {
  return {
    nombre: String(empleadoEditar.nombre || "").trim(),
    apellido: String(empleadoEditar.apellido || "").trim(),
    cargo: String(empleadoEditar.cargo || "").trim(),
  };
}

module.exports = {
  validarEmpleadoEdicion,
  prepararDatosEmpleadoActualizado,
};
