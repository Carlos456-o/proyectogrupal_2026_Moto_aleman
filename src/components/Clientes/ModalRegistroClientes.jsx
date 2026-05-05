import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroClientes = ({
  mostrarModal,
  setMostrarModal,
  nuevoCliente,
  manejoCambioInput,
  agregarCliente,
}) => {const [deshabilitado, setDeshabilitado] = useState(false);

const handleRegistrar = async () => {
  if (deshabilitado) return;
  setDeshabilitado(true);
  await agregarCliente();
  setDeshabilitado(false);
};
return (
  <Modal
    show={mostrarModal}
    onHide={() => setMostrarModal(false)}
    backdrop="static"
    keyboard={false}
    centered
  >
    <Modal.Header closeButton>
      <Modal.Title>Agregar Cliente</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Nombre1 *</Form.Label>
          <Form.Control
            type="text"
            name="nombre1"
            value={nuevoCliente.nombre1}
            onChange={manejoCambioInput}
            placeholder="Ingresa el primer nombre"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Nombre2</Form.Label>
          <Form.Control
            type="text"
            name="nombre2"
            value={nuevoCliente.nombre2}
            onChange={manejoCambioInput}
            placeholder="Ingresa el segundo nombre"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Apellidos1 *</Form.Label>
          <Form.Control
            type="text"
            name="apellidos1"
            value={nuevoCliente.apellidos1}
            onChange={manejoCambioInput}
            placeholder="Ingresa el primer apellido"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Apellidos2</Form.Label>
          <Form.Control
            type="text"
            name="apellidos2"
            value={nuevoCliente.apellidos2}
            onChange={manejoCambioInput}
            placeholder="Ingresa el segundo apellido"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Cédula</Form.Label>
          <Form.Control
            type="text"
            name="cedula"
            value={nuevoCliente.cedula}
            onChange={manejoCambioInput}
            placeholder="Ingresa la cédula"
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setMostrarModal(false)}>
        Cancelar
      </Button>
      <Button
        variant="primary"
        onClick={handleRegistrar}
        disabled={!nuevoCliente.nombre1.trim() || !nuevoCliente.apellidos1.trim() || deshabilitado}
      >
        Guardar
      </Button>
    </Modal.Footer>
  </Modal>
);
};

export default ModalRegistroClientes;