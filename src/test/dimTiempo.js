// Helpers para pruebas de Dim_Tiempo (Dimensión de Tiempo)

function validarFecha(fecha) {
  const errors = [];

  if (!fecha || fecha === "") {
    errors.push("Fecha es obligatoria");
    return errors;
  }

  // Formato: DD/MM/YYYY
  const formatoValido = /^\d{2}\/\d{2}\/\d{4}$/.test(fecha);

  if (!formatoValido) {
    errors.push("Fecha debe tener el formato: DD/MM/YYYY (ejemplo: 15/06/2026)");
    return errors;
  }

  // Validar que sea una fecha válida
  const partes = fecha.split("/");
  const dia = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10);
  const año = parseInt(partes[2], 10);

  if (mes < 1 || mes > 12) {
    errors.push("Mes debe estar entre 01 y 12");
  }

  if (dia < 1 || dia > 31) {
    errors.push("Día debe estar entre 01 y 31");
  }

  // Validar rango de años razonable
  if (año < 1900 || año > 2100) {
    errors.push("Año debe estar entre 1900 y 2100");
  }

  return errors;
}

function validarAño(año) {
  const errors = [];

  if (año == null || año === "") {
    errors.push("Año es obligatorio");
    return errors;
  }

  if (!Number.isInteger(Number(año))) {
    errors.push("Año debe ser un entero");
    return errors;
  }

  const añoNum = Number(año);

  if (añoNum < 1900 || añoNum > 2100) {
    errors.push("Año debe estar entre 1900 y 2100");
  }

  return errors;
}

function construirDimensionTiempo(fecha, año) {
  return {
    fecha: String(fecha || "").trim(),
    año: parseInt(año, 10),
  };
}

module.exports = {
  validarFecha,
  validarAño,
  construirDimensionTiempo,
};
