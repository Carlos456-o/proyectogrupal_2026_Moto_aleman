import React, { useState } from "react";
import { Modal, Button, Row, Col, Badge, Alert } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const ModalDetalleCatalogo = ({ mostrar, producto, onCerrar }) => {
  if (!producto) return null;

  const handleCerrar = () => {
    onCerrar();
  };

  const puedeComprar = producto.disponible && producto.cantidad > 0;

  return (
    <Modal
      show={mostrar}
      onHide={handleCerrar}
      size="lg"
      className="modal-catalogo"
    >
      <Modal.Header closeButton className="modal-header-catalogo">
        <Modal.Title>
          <i className="bi bi-box-seam me-2"></i> Detalles del Producto
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="modal-body-catalogo">
        <Row>
          {/* Columna de Imagen */}
          <Col md={5} className="mb-3 mb-md-0">
            <div className="imagen-modal-container">
              {producto.url_imagen ? (
                <img
                  src={producto.url_imagen}
                  alt={producto.nombre_p}
                  className="imagen-modal"
                />
              ) : (
                <div className="placeholder-modal">
                  <i className="bi bi-image fs-1 text-muted"></i>
                </div>
              )}
            </div>
          </Col>

          {/* Columna de Información */}
          <Col md={7}>
            <div className="contenido-detalles">
              {/* Título */}
              <h3 className="titulo-detalle">{producto.nombre_p}</h3>

              {/* Estado */}
              <div className="estado-badges mb-3">
                {producto.disponible ? (
                  <Badge bg="success" className="me-2">
                    <i className="bi bi-check-circle me-1"></i>Disponible
                  </Badge>
                ) : (
                  <Badge bg="secondary" className="me-2">
                    <i className="bi bi-x-circle me-1"></i>No disponible
                  </Badge>
                )}
                {producto.cantidad > 0 ? (
                  <Badge bg="info">
                    <i className="bi bi-box me-1"></i>
                    {producto.cantidad} unidades en stock
                  </Badge>
                ) : (
                  <Badge bg="danger">
                    <i className="bi bi-exclamation-circle me-1"></i>Agotado
                  </Badge>
                )}
              </div>

              {/* Descripción */}
              {producto.descripcion && (
                <div className="seccion-descripcion mb-4">
                  <h6 className="label-seccion">Descripción:</h6>
                  <p className="texto-descripcion">{producto.descripcion}</p>
                </div>
              )}

              {/* Precios */}
              <div className="seccion-precios mb-4">
                <Row>
                  <Col xs={6}>
                    <div className="precio-box">
                      <small className="label-precio">Precio de venta:</small>
                      <div className="precio-venta">
                        C${" "}
                        <span className="numero">
                          {producto.precioventa?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="precio-box">
                      <small className="label-precio">Stock disponible:</small>
                      <div className="stock-badge">
                        {producto.cantidad > 5 ? (
                          <span className="disponible-alto">
                            {producto.cantidad} unidades
                          </span>
                        ) : producto.cantidad > 0 ? (
                          <span className="disponible-bajo">
                            {producto.cantidad} unidades
                          </span>
                        ) : (
                          <span className="agotado">Sin stock</span>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer className="modal-footer-catalogo">
        <Button variant="outline-secondary" onClick={handleCerrar}>
          <i className="bi bi-x-lg me-2"></i>Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetalleCatalogo;
