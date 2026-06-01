import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function ModalEliminacionDimVentas({
  open,
  onClose,
  onConfirm,
  item,
}) {
  if (!open) return null;

  const id = item?.idDetalleVen ?? item?.ID_Detalle_ven ?? item?.id ?? "";

  return (
    <Modal
      show={open}
      onHide={onClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Venta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          ¿Desea eliminar la venta con ID detalle <b>{id}</b>?
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={() => onConfirm?.(item)}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
