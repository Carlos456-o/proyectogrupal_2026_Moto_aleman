import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaEmpleado = ({
  empleado,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  return (
    <Card className="h-100 shadow-sm border-0 employee-card">
      <div className="employee-image-container">
        <div className="employee-placeholder">
          <i className="bi bi-person-fill text-muted fs-1"></i>
        </div>
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title
          className="employee-title text-truncate"
          title={`${empleado.nombre} ${empleado.apellido}`}
        >
          {empleado.nombre} {empleado.apellido}
        </Card.Title>

        <div className="employee-info-section mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted small">Cargo:</span>
            <Badge bg="primary" className="ms-2">
              {empleado.cargo}
            </Badge>
          </div>
        </div>

        <div className="d-flex gap-2 mt-2">
          <Button
            variant="outline-primary"
            size="sm"
            className="flex-fill"
            onClick={() => abrirModalEdicion(empleado)}
            title="Editar empleado"
          >
            <i className="bi bi-pencil me-1"></i>
            Editar
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            className="flex-fill"
            onClick={() => abrirModalEliminacion(empleado)}
            title="Eliminar empleado"
          >
            <i className="bi bi-trash me-1"></i>
            Eliminar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TarjetaEmpleado;
