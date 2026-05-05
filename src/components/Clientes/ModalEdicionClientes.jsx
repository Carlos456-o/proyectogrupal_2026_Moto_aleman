import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionClientes = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  clienteEditar,
  manejoCambioInputEdicion,
  actualizarCliente,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleActualizar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await actualizarCliente();
    setDeshabilitado(false);
  };

  return (
    <Modal
      show={mostrarModalEdicion}
      onHide={() => setMostrarModalEdicion(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre1 *</Form.Label>
            <Form.Control
              type="text"
              name="nombre1"
              value={clienteEditar.nombre1 || ""}
              onChange={manejoCambioInputEdicion}
              placeholder="Ingresa el primer nombre"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nombre2</Form.Label>
            <Form.Control
              type="text"
              name="nombre2"
              value={clienteEditar.nombre2 || ""}
              onChange={manejoCambioInputEdicion}
              placeholder="Ingresa el segundo nombre"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Apellidos1 *</Form.Label>
            <Form.Control
              type="text"
              name="apellidos1"
              value={clienteEditar.apellidos1 || ""}
              onChange={manejoCambioInputEdicion}
              placeholder="Ingresa el primer apellido"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Apellidos2</Form.Label>
            <Form.Control
              type="text"
              name="apellidos2"
              value={clienteEditar.apellidos2 || ""}
              onChange={manejoCambioInputEdicion}
              placeholder="Ingresa el segundo apellido"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cédula</Form.Label>
            <Form.Control
              type="text"
              name="cedula"
              value={clienteEditar.cedula || ""}
              onChange={manejoCambioInputEdicion}
              placeholder="Ingresa la cédula"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModalEdicion(false)}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleActualizar}
          disabled={!clienteEditar?.nombre1?.trim() || !clienteEditar?.apellidos1?.trim() || deshabilitado}
        >
          Actualizar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionClientes;