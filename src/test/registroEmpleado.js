// Helpers para pruebas de registro de empleado
function validarEstado(estado) {
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
function construirEmpleado(estado) {
  return {
    estado: typeof estado === "boolean" ? estado : String(estado).toLowerCase() === "true",
  };
}
module.exports = {
  validarEstado,
  construirEmpleado,
};
