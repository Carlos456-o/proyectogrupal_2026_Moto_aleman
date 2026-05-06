import React from 'react';

export default function ModalRegistroDimVentas({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="modal">
      <h2>Registrar Dimensión de Ventas</h2>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
}
