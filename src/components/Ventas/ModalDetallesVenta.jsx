import React from "react";
import { Button, Col, Modal, Row, Table } from "react-bootstrap";

const ModalDetallesVenta = ({ mostrar, onCerrar, venta }) => {
  if (!venta) return null;

  return (
    <Modal show={mostrar} onHide={onCerrar} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Detalles de la venta #
          {venta.id_detalle_venta ??
            venta.ID_Detalle_Venta ??
            venta.id_venta ??
            venta.id}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col>
            <strong>Cliente:</strong>{" "}
            {venta.clienteNombre ||
              venta.nombre_cliente ||
              venta.Nombre_Cliente ||
              "-"}
          </Col>
          <Col>
            <strong>Empleado:</strong>{" "}
            {venta.empleadoNombre ||
              venta.nombre_empleado ||
              venta.Nombre_Empleado ||
              "-"}
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <strong>Fecha:</strong>{" "}
            {venta.fecha
              ? new Date(venta.fecha).toLocaleDateString("es-NI")
              : venta.Fecha
                ? new Date(venta.Fecha).toLocaleDateString("es-NI")
                : "-"}
          </Col>
          <Col>
            <strong>Cantidad total:</strong>{" "}
            {venta.cantidadTotal ?? venta.cantidad_total ?? "-"}
          </Col>
          <Col>
            <strong>Subtotal:</strong> C${" "}
            {parseFloat(
              venta.subtotal ?? venta.total_venta ?? venta.Total_Venta ?? 0,
            ).toFixed(2)}
          </Col>
        </Row>

        <Table striped bordered hover responsive size="sm">
          <thead>
            <tr>
              <th>Producto</th>
              <th>ID Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {(venta.detalles || []).map((item, index) => (
              <tr key={index}>
                <td>
                  {item.nombreProducto ||
                    item.Nombre_P ||
                    item.nombre_p ||
                    item.nombre_producto ||
                    "-"}
                </td>
                <td>
                  {item.id_producto ??
                    item.ID_Producto ??
                    item.producto_id ??
                    "-"}
                </td>
                <td>
                  {item.Cantidad ?? item.cantidad ?? item.cantidad_ven ?? "-"}
                </td>
                <td>
                  C${" "}
                  {parseFloat(
                    item.Precio_Ven ?? item.precio_ven ?? item.precio ?? 0,
                  ).toFixed(2)}
                </td>
                <td>
                  C${" "}
                  {parseFloat(
                    item.Total_Venta ?? item.total_venta ?? item.subtotal ?? 0,
                  ).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCerrar}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetallesVenta;
