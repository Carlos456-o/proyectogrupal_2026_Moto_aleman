// Helpers para pruebas de registro de clientes

function validarRegistroCliente(nuevoCliente) {
  const errors = [];

  if (!nuevoCliente || typeof nuevoCliente !== "object") {
    errors.push("Cliente inválido");
    return errors;
  }

  if (!nuevoCliente.nombre1 || !String(nuevoCliente.nombre1).trim()) {
    errors.push("El primer nombre del cliente es obligatorio");
  }

  if (!nuevoCliente.apellidos1 || !String(nuevoCliente.apellidos1).trim()) {
    errors.push("El primer apellido del cliente es obligatorio");
  }

  return errors;
}

function prepararClienteParaRegistro(nuevoCliente) {
  if (!nuevoCliente || typeof nuevoCliente !== "object") {
    return {
      nombre1: "",
      nombre2: "",
      apellidos1: "",
      apellidos2: "",
      cedula: "",
    };
  }

  return {
    nombre1: String(nuevoCliente.nombre1 || "").trim(),
    nombre2: String(nuevoCliente.nombre2 || "").trim(),
    apellidos1: String(nuevoCliente.apellidos1 || "").trim(),
    apellidos2: String(nuevoCliente.apellidos2 || "").trim(),
    cedula: String(nuevoCliente.cedula || "").trim(),
  };
}

module.exports = {
  validarRegistroCliente,
  prepararClienteParaRegistro,
};
