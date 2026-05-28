import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaCliente = ({
  cliente,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  return (
    <Card className="h-100 shadow-sm border-0 client-card">
      <div className="client-image-container">
        <div className="client-placeholder">
          <i className="bi bi-person-fill text-muted fs-1"></i>
        </div>
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title
          className="client-title text-truncate"
          title={`${cliente.nombre1} ${cliente.apellidos1}`}
        >
          {cliente.nombre1} {cliente.nombre2 || ""} {cliente.apellidos1}{" "}
          {cliente.apellidos2 || ""}
        </Card.Title>

        <div className="client-info-section mt-auto">
          {cliente.cedula && (
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small">Cédula:</span>
              <Badge bg="info" className="ms-2">
                {cliente.cedula}
              </Badge>
            </div>
          )}
        </div>

        <div className="d-flex gap-2 mt-2">
          <Button
            variant="outline-primary"
            size="sm"
            className="flex-fill"
            onClick={() => abrirModalEdicion(cliente)}
            title="Editar cliente"
          >
            <i className="bi bi-pencil me-1"></i>
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="flex-fill"
            onClick={() => abrirModalEliminacion(cliente)}
            title="Eliminar cliente"
          >
            <i className="bi bi-trash me-1"></i>
            Eliminar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TarjetaCliente;
