import React from 'react';

export default function ModalEdicionDimVentas({ open, onClose, item }) {
  if (!open) return null;
  return (
    <div className="modal">
      <h2>Editar Dimensión de Ventas</h2>
      <div>Nombre: {item?.nombre}</div>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
}
