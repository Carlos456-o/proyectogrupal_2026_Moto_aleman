import React from 'react';

export default function TablaDimVentas({ items = [] }) {
  return (
    <table className="tabla-dim-ventas">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {items.map((it) => (
          <tr key={it.id}>
            <td>{it.id}</td>
            <td>{it.nombre}</td>
            <td />
          </tr>
        ))}
      </tbody>
    </table>
  );
}
