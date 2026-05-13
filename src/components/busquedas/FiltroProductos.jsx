import React, { useState } from "react";
import { Button, Offcanvas, Form, Row, Col } from "react-bootstrap";

const FiltroProductos = ({
  filtros,
  manejarCambioFiltro,
  limpiarFiltros,
  precioMin,
  precioMax,
}) => {
  const [mostrarFiltro, setMostrarFiltro] = useState(false);

  const handleCloseFiltro = () => setMostrarFiltro(false);
  const handleShowFiltro = () => setMostrarFiltro(true);

  return (
    <>
      <Button
        variant="outline-secondary"
        size="md"
        onClick={handleShowFiltro}
        title="Abrir filtros"
      >
        <i className="bi bi-funnel me-2"></i>
        Filtros
      </Button>

      <Offcanvas
        show={mostrarFiltro}
        onHide={handleCloseFiltro}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filtrar Repuestos</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Disponibilidad</Form.Label>
              <Form.Check
                type="checkbox"
                label="Disponibles"
                name="disponibles"
                checked={filtros.disponibles}
                onChange={manejarCambioFiltro}
              />
              <Form.Check
                type="checkbox"
                label="No disponibles"
                name="noDisponibles"
                checked={filtros.noDisponibles}
                onChange={manejarCambioFiltro}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Estado de Stock</Form.Label>
              <Form.Check
                type="checkbox"
                label="En stock"
                name="enStock"
                checked={filtros.enStock}
                onChange={manejarCambioFiltro}
              />
              <Form.Check
                type="checkbox"
                label="Agotado"
                name="agotado"
                checked={filtros.agotado}
                onChange={manejarCambioFiltro}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Rango de Precio (C$)</Form.Label>
              <Row className="g-2">
                <Col xs={6}>
                  <Form.Control
                    type="number"
                    placeholder="Mín"
                    name="precioMinimo"
                    value={filtros.precioMinimo}
                    onChange={manejarCambioFiltro}
                    min="0"
                  />
                </Col>
                <Col xs={6}>
                  <Form.Control
                    type="number"
                    placeholder="Máx"
                    name="precioMaximo"
                    value={filtros.precioMaximo}
                    onChange={manejarCambioFiltro}
                    min="0"
                  />
                </Col>
              </Row>
              {precioMin !== null && precioMax !== null && (
                <Form.Text className="text-muted d-block mt-2">
                  Rango total: C$ {precioMin.toFixed(2)} - C${" "}
                  {precioMax.toFixed(2)}
                </Form.Text>
              )}
            </Form.Group>

            <div className="d-flex gap-2 mt-5">
              <Button
                variant="outline-danger"
                className="flex-fill"
                onClick={limpiarFiltros}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Limpiar
              </Button>
              <Button
                variant="primary"
                className="flex-fill"
                onClick={handleCloseFiltro}
              >
                <i className="bi bi-check-lg me-2"></i>
                Aplicar
              </Button>
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default FiltroProductos;
