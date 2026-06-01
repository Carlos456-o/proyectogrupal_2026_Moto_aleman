import React from "react";

export default function TablaDimVentas({
  items = [],
  abrirModalEdicion,
  abrirModalEliminacion,
}) {
  return (
    <table className="tabla-dim-ventas">
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Producto</th>
          <th>Empleado</th>
          <th>ID detalle</th>
          <th>Cantidad</th>
          <th>Total</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {items.map((it) => (
          <tr key={it.idDetalleVen ?? it.ID_Detalle_ven ?? it.id}>
            <td>{it.clienteNombre ?? it.cliente_nombre ?? "-"}</td>
            <td>{it.productoNombre ?? it.producto_nombre ?? "-"}</td>
            <td>{it.empleadoNombre ?? it.empleado_nombre ?? "-"}</td>
            <td>
              {it.idDetalleVen ?? it.id_detalle_ven ?? it.ID_Detalle_ven ?? "-"}
            </td>
            <td className="text-center">
              {it.cantidad ?? it.Cantidad_ven ?? 0}
            </td>
            <td className="text-end">
              {Number(it.totalVenta ?? it.Total_Venta ?? 0).toFixed(2)}
            </td>
            <td>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => abrirModalEdicion?.(it)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => abrirModalEliminacion?.(it)}
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
