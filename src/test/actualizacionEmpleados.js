// Helpers para pruebas del flujo de actualización de empleados

function validarEstadoEdicion(estado) {
  const errors = [];

  if (estado == null || estado === "") {
    errors.push("Estado es obligatorio");
    return errors;
  }

  // Validar que sea boolean o string "true"/"false"
  if (typeof estado !== "boolean" && 
      (String(estado).toLowerCase() !== "true" && String(estado).toLowerCase() !== "false")) {
    errors.push("Estado debe ser true o false");
  }

  return errors;
}

function construirEmpleadoActualizado(estado) {
  return {
    estado: typeof estado === "boolean" ? estado : String(estado).toLowerCase() === "true",
  };
}

module.exports = {
  validarEstadoEdicion,
  construirEmpleadoActualizado,
};
