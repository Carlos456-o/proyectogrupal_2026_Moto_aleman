import React from "react";
import { Table, Button } from "react-bootstrap";

const TarjetasClientes = ({ clientes, abrirModalEdicion, abrirModalEliminacion }) => {
  if (clientes && clientes.length > 0) {
    return (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre1</th>
            <th>Nombre2</th>
            <th>Apellidos1</th>
            <th>Apellidos2</th>
            <th>Cédula</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id_cliente}>
              <td>{cliente.id_cliente}</td>
              <td>{cliente.nombre1}</td>
              <td>{cliente.nombre2 || "-"}</td>
              <td>{cliente.apellidos1}</td>
              <td>{cliente.apellidos2 || "-"}</td>
              <td>{cliente.cedula || "-"}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(cliente)}
                >
                  <i className="bi bi-pencil"></i> Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(cliente)}
                >
                  <i className="bi bi-trash"></i> Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  return (
    <div className="text-center my-5">
      <h4>Cargando clientes...</h4>
    </div>
  );
};

export default TarjetasClientes;