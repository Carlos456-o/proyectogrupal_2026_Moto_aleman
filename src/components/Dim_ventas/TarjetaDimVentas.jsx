import React from 'react';

export default function TarjetaDimVentas({ item }) {
  return (
    <div className="tarjeta-dim-ventas">
      <h3>{item?.nombre}</h3>
      <p>ID: {item?.id}</p>
    </div>
  );
}
