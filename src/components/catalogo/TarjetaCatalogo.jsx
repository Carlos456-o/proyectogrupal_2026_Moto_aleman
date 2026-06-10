import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaCatalogo = ({ producto, abrirDetalles }) => {
  const estadoDisponible = producto.disponible && producto.cantidad > 0;
  
  // Determinar clase de color basada en stock
  let claseStock = "";
  if (producto.cantidad > 10) {
    claseStock = "stock-verde";
  } else if (producto.cantidad > 0) {
    claseStock = "stock-amarillo";
  } else {
    claseStock = "stock-rojo";
  }

  return (
    <Card className={`tarjeta-catalogo shadow-sm border-0 h-100 ${claseStock}`}>
      <div className="tarjeta-imagen-container">
        {producto.url_imagen ? (
          <img
            src={producto.url_imagen}
            alt={producto.nombre_p}
            className="tarjeta-imagen"
          />
        ) : (
          <div className="tarjeta-placeholder">
            <i className="bi bi-image text-muted fs-1"></i>
          </div>
        )}
        {!estadoDisponible && (
          <div className="overlay-no-disponible">
            <span className="texto-no-disponible">No disponible</span>
          </div>
        )}
        {producto.cantidad === 0 && (
          <Badge bg="danger" className="badge-stock position-absolute top-0 start-0">
            Agotado
          </Badge>
        )}
      </div>

      <Card.Body className="d-flex flex-column pb-3">
        <Card.Title className="titulo-producto text-truncate" title={producto.nombre_p}>
          {producto.nombre_p}
        </Card.Title>

        {producto.descripcion && (
          <Card.Text className="descripcion-producto text-muted small flex-grow-1">
            {producto.descripcion.length > 80
              ? `${producto.descripcion.substring(0, 80)}...`
              : producto.descripcion}
          </Card.Text>
        )}

        <div className="seccion-precio mt-auto mb-3">
          <div className="precio-destacado">
            C$ <span className="numero-precio">{producto.precioventa?.toFixed(2)}</span>
          </div>
          <div className="stock-info">
            {producto.cantidad > 10 ? (
              <span className="stock-disponible">
                <i className="bi bi-check-circle me-1"></i>En stock ({producto.cantidad})
              </span>
            ) : producto.cantidad > 0 ? (
              <span className="stock-bajo">
                <i className="bi bi-exclamation-circle me-1"></i>Stock bajo ({producto.cantidad})
              </span>
            ) : (
              <span className="stock-agotado">
                <i className="bi bi-x-circle me-1"></i>Sin stock
              </span>
            )}
          </div>
        </div>

        <Button
          className="btn-ver-detalles"
          onClick={() => abrirDetalles(producto)}
          disabled={!estadoDisponible}
        >
          Ver detalles
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TarjetaCatalogo;

