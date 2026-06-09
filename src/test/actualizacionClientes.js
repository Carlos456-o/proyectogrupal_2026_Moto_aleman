// Helpers para pruebas del flujo de actualización de clientes

function validarCedulaEdicion(cedula) {
  const errors = [];

  if (!cedula || cedula === "") {
    errors.push("Cédula es obligatoria");
    return errors;
  }

  // Formato: XXX-XXXXXX-XXXXK donde X es dígito y K es dígito o letra
  const formatoValido = /^\d{3}-\d{6}-\d{4}[0-9A-Za-z]$/.test(cedula);

  if (!formatoValido) {
    errors.push('Cédula debe tener el formato: 121-000000-0000X');
  }

  return errors;
}

function construirCedulaActualizada(cedula) {
  return {
    cedula: String(cedula || "").trim(),
  };
}

module.exports = {
  validarCedulaEdicion,
  construirCedulaActualizada,
};
