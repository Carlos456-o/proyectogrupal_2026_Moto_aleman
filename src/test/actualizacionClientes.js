// Helpers para pruebas del flujo de actualización de clientes

function validarClienteEdicion(clienteEditar) {
  const errors = [];

  if (!clienteEditar || typeof clienteEditar !== "object") {
    errors.push("Cliente inválido");
    return errors;
  }

  if (!clienteEditar.nombre1 || String(clienteEditar.nombre1).trim() === "") {
    errors.push("El primer nombre del cliente es obligatorio");
  }

  if (!clienteEditar.apellidos1 || String(clienteEditar.apellidos1).trim() === "") {
    errors.push("El primer apellido del cliente es obligatorio");
  }

  return errors;
}

function prepararDatosClienteActualizado(clienteEditar) {
  if (!clienteEditar || typeof clienteEditar !== "object") {
    return {
      nombre1: "",
      nombre2: "",
      apellidos1: "",
      apellidos2: "",
      cedula: "",
    };
  }

  return {
    nombre1: String(clienteEditar.nombre1 || "").trim(),
    nombre2: String(clienteEditar.nombre2 || "").trim(),
    apellidos1: String(clienteEditar.apellidos1 || "").trim(),
    apellidos2: String(clienteEditar.apellidos2 || "").trim(),
    cedula: String(clienteEditar.cedula || "").trim(),
  };
}

module.exports = {
  validarClienteEdicion,
  prepararDatosClienteActualizado,
};
