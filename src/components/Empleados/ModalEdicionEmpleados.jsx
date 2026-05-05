import React, {useState} from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionEmpleado = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  empleadoEditar,
  manejoCambioInputEdicion,
  actualizarEmpleado,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);
const handleActualizar = async () => {
  if (deshabilitado) return;
  setDeshabilitado(true);
  await actualizarEmpleado();
  setDeshabilitado(false);
};

  return (
    // código de componente
    <Modal
  show={mostrarModalEdicion}
  onHide={() => setMostrarModalEdicion(false)}
  backdrop="static"
  keyboard={false}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>Editar Empleado</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          name="nombre"
          value={empleadoEditar.nombre || ""}
          onChange={manejoCambioInputEdicion}
          placeholder="Ingresa el nombre"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Apellido</Form.Label>
        <Form.Control
          type="text"
          name="apellido"
          value={empleadoEditar.apellido || ""}
          onChange={manejoCambioInputEdicion}
          placeholder="Ingresa el apellido"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Cargo</Form.Label>
        <Form.Control
          type="text"
          name="cargo"
          value={empleadoEditar.cargo || ""}
          onChange={manejoCambioInputEdicion}
          placeholder="Ingresa el cargo"
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
      disabled={!empleadoEditar?.nombre?.trim() || deshabilitado}
    >
      Actualizar
    </Button>
  </Modal.Footer>
</Modal>

  );
};

export default ModalEdicionEmpleado;
