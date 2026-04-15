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
          <Form.Label>Nombre1</Form.Label>
          <Form.Control
            type="text"
            name="Nombre1"
            value={nuevoCliente.Nombre1}
            onChange={manejoCambioInput}
            placeholder="Ingresa el primer nombre"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Nombre2</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="Nombre2"
            value={nuevoCliente.Nombre2}
            onChange={manejoCambioInput}
            placeholder="Ingresa el segundo nombre"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Apellido1</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="Apellido1"
            value={nuevoCliente.Apellido1}
            onChange={manejoCambioInput}
            placeholder="Ingresa el primer apellido"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Apellido2</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="Apellido2"
            value={nuevoCliente.Apellido2}
            onChange={manejoCambioInput}
            placeholder="Ingresa el segundo apellido"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Cedula</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="Cedula"
            value={nuevoCliente.Cedula}
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
        disabled={nuevoCliente.Nombre1.trim() === "" || deshabilitado}
      >
        Guardar
      </Button>
    </Modal.Footer>
  </Modal>
);
};

export default ModalRegistroClientes;