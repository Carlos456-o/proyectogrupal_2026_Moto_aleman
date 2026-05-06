import React from 'react';

export default function ModalEliminacionDimVentas({ open, onClose, onConfirm, item }) {
  if (!open) return null;
  return (
    <div className="modal">
      <h2>Eliminar Dimensión de Ventas</h2>
      <p>¿Desea eliminar "{item?.nombre}"?</p>
      <button onClick={onConfirm}>Eliminar</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
}
