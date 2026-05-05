import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionEmpleado = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  eliminarEmpleado,
  empleado,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

const handlEliminar = async () => {
  if (deshabilitado) return;
  setDeshabilitado(true);
  await eliminarEmpleado();
  setDeshabilitado(false);
};

  return (
    // código del componente
    <Modal
  show={mostrarModalEliminacion}
  onHide={() => setMostrarModalEliminacion(false)}
  backdrop="static"
  keyboard={false}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>Confirmar Eliminación</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    ¿Estás seguro de que deseas eliminar el empleado "<strong>{empleado?.nombre}</strong>"?
  </Modal.Body>
  <Modal.Footer>
    <Button
      variant="secondary"
      onClick={() => setMostrarModalEliminacion(false)}
    >
      Cancelar
    </Button>
    <Button
      variant="danger"
      onClick={handlEliminar}
      disabled={deshabilitado}
    >
      Eliminar
    </Button>
  </Modal.Footer>
</Modal>

  );
};

export default ModalEliminacionEmpleado;
