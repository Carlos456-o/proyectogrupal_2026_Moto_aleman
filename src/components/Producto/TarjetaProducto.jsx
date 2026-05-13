import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaProducto = ({
  producto,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  return (
    <Card className="h-100 shadow-sm border-0 product-card">
      <div className="product-image-container">
        {producto.url_imagen ? (
          <img
            src={producto.url_imagen}
            alt={producto.nombre_p}
            className="product-image"
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              backgroundColor: "#f0f0f0",
            }}
          />
        ) : (
          <div className="product-placeholder">
            <i className="bi bi-gear-wide-connected text-muted fs-1"></i>
          </div>
        )}
        {!producto.disponible && (
          <Badge bg="secondary" className="position-absolute top-0 end-0 m-2">
            No disponible
          </Badge>
        )}
        {producto.cantidad === 0 && (
          <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
            Agotado
          </Badge>
        )}
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title
          className="product-title text-truncate"
          title={producto.nombre_p}
        >
          {producto.nombre_p}
        </Card.Title>

        <Card.Text className="product-description text-muted small flex-grow-1">
          {producto.descripcion || "Sin descripción"}
        </Card.Text>

        <div className="product-price-section mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted small">Precio:</span>
            <span className="product-price fw-bold text-success">
              C$ {producto.precioventa?.toFixed(2)}
            </span>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted small">Stock:</span>
            <Badge
              bg={
                producto.cantidad > 10
                  ? "success"
                  : producto.cantidad > 0
                    ? "warning"
                    : "danger"
              }
            >
              {producto.cantidad} unidades
            </Badge>
          </div>
        </div>

        <div className="d-flex gap-2 mt-2">
          <Button
            variant="outline-primary"
            size="sm"
            className="flex-fill"
            onClick={() => abrirModalEdicion(producto)}
            title="Editar producto"
          >
            <i className="bi bi-pencil me-1"></i>
            Editar
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            className="flex-fill"
            onClick={() => abrirModalEliminacion(producto)}
            title="Eliminar producto"
          >
            <i className="bi bi-trash me-1"></i>
            Eliminar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TarjetaProducto;
