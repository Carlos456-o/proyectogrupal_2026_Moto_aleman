import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function ModalEdicionDimVentas({ open, onClose, item }) {
  // Edición no implementada por falta de esquema de cabecera vs detalle.
  // Se deja modal para mantener el estilo y evitar romper rutas.
  if (!open) return null;

  return (
    <Modal
      show={open}
      onHide={onClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Venta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-muted">
          Edición no disponible aún para este módulo.
        </div>
        <div className="mt-3">
          ID_Detalle_ven:{" "}
          <b>{item?.idDetalleVen ?? item?.ID_Detalle_ven ?? "-"}</b>
        </div>
        <div>
          Total_Venta:{" "}
          <b>{Number(item?.totalVenta ?? item?.Total_Venta ?? 0).toFixed(2)}</b>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
