import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroEmpleado = ({
  mostrarModal,
  setMostrarModal,
  nuevoEmpleado,
  manejoCambioInput,
  agregarEmpleado,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

const handleRegistrar = async () => {
  if (deshabilitado) return;
  setDeshabilitado(true);
  await agregarEmpleado();
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
      <Modal.Title>Agregar Empleado</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={nuevoEmpleado.nombre}
            onChange={manejoCambioInput}
            placeholder="Ingresa el nombre"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>apellido</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="apellido"
            value={nuevoEmpleado.apellido}
            onChange={manejoCambioInput}
            placeholder="Ingresa el apellido"
          />
          
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>cargo</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="cargo"
            value={nuevoEmpleado.cargo}
            onChange={manejoCambioInput}
            placeholder="Selecciona el cargo"
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
      >
        Guardar
      </Button>
    </Modal.Footer>
  </Modal>
);
};





export default ModalRegistroEmpleado;
