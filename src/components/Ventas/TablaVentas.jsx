import React from "react";
import { Table, Button } from "react-bootstrap";

const TablaVentas = ({ ventas, verDetalles }) => {
  return (
    <Table striped bordered hover responsive className="align-middle">
      <thead>
        <tr>
          <th>ID Venta</th>
          <th>Cliente</th>
          <th>Cantidad total</th>
          <th>Subtotal</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {ventas.map((venta) => (
          <tr
            key={
              venta.id_detalle_venta ??
              venta.ID_Detalle_Venta ??
              venta.id_venta ??
              venta.id
            }
          >
            <td>
              {venta.id_detalle_venta ??
                venta.ID_Detalle_Venta ??
                venta.id_venta ??
                venta.id ??
                "-"}
            </td>
            <td>
              {venta.clienteNombre ||
                venta.nombre_cliente ||
                venta.Nombre_Cliente ||
                venta.cliente ||
                venta.cliente_nombre ||
                "-"}
            </td>
            <td>{venta.cantidadTotal ?? venta.cantidad_total ?? "-"}</td>
            <td>
              C${" "}
              {parseFloat(
                venta.subtotal ?? venta.total_venta ?? venta.Total_Venta ?? 0,
              ).toFixed(2)}
            </td>
            <td>
              {venta.fecha
                ? new Date(venta.fecha).toLocaleDateString("es-NI")
                : venta.Fecha
                  ? new Date(venta.Fecha).toLocaleDateString("es-NI")
                  : "-"}
            </td>
            <td>
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => verDetalles(venta)}
              >
                Ver detalles
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaVentas;
