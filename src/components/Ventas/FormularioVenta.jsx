import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";

const FormularioVenta = ({
  mostrar,
  setMostrar,
  clientes,
  empleados,
  productos,
  clienteSeleccionado,
  setClienteSeleccionado,
  empleadoSeleccionado,
  setEmpleadoSeleccionado,
  metodoPago,
  setMetodoPago,
  fechaVenta,
  setFechaVenta,
  detalles,
  totalGeneral,
  agregarDetalle,
  eliminarDetalle,
  actualizarCantidad,
  guardarVenta,
  ventaAEditar,
}) => {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    if (!mostrar) {
      setProductoSeleccionado(null);
      setCantidad(1);
    }
  }, [mostrar]);

  const handleAgregar = () => {
    if (!productoSeleccionado || cantidad <= 0) return;
    agregarDetalle(productoSeleccionado, cantidad);
    setCantidad(1);
    setProductoSeleccionado(null);
  };

  const cerrar = () => {
    setMostrar(false);
  };

  return (
    <Modal
      show={mostrar}
      onHide={cerrar}
      backdrop="static"
      keyboard={false}
      size="xl"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {ventaAEditar ? "Editar Venta" : "Nueva Venta"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="g-3">
          <Col md={6}>
            <Form.Group className="mb-3" controlId="clienteSeleccionado">
              <Form.Label>Cliente *</Form.Label>
              <Form.Select
                value={clienteSeleccionado?.id_cliente ?? ""}
                onChange={(e) => {
                  const cliente = clientes.find(
                    (c) => c.id_cliente === Number(e.target.value),
                  );
                  setClienteSeleccionado(cliente || null);
                }}
              >
                <option value="">Seleccionar cliente...</option>
                {clientes.map((cli) => (
                  <option key={cli.id_cliente} value={cli.id_cliente}>
                    {cli.nombreCompleto ||
                      `${cli.nombre1 || ""} ${cli.apellidos1 || ""}`}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3" controlId="empleadoSeleccionado">
              <Form.Label>Empleado / Mesero *</Form.Label>
              <Form.Select
                value={empleadoSeleccionado?.id_empleado ?? ""}
                onChange={(e) => {
                  const emp = empleados.find(
                    (item) => item.id_empleado === Number(e.target.value),
                  );
                  setEmpleadoSeleccionado(emp || null);
                }}
              >
                <option value="">Seleccionar empleado...</option>
                {empleados.map((emp) => (
                  <option key={emp.id_empleado} value={emp.id_empleado}>
                    {emp.nombreCompleto ||
                      `${emp.nombre || ""} ${emp.apellido || ""}`}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3" controlId="metodoPago">
              <Form.Label>Método de Pago</Form.Label>
              <Form.Select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3" controlId="fechaVenta">
              <Form.Label>Fecha de Venta</Form.Label>
              <Form.Control
                type="date"
                value={fechaVenta}
                onChange={(e) => setFechaVenta(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={6} />

          <Col md={12}>
            <h5>Agregar Producto</h5>
          </Col>

          <Col md={6} lg={5}>
            <Form.Group className="mb-3" controlId="productoSeleccionado">
              <Form.Label>Producto</Form.Label>
              <Form.Select
                value={productoSeleccionado?.id_producto ?? ""}
                onChange={(e) => {
                  const prod = productos.find(
                    (p) => p.id_producto === Number(e.target.value),
                  );
                  setProductoSeleccionado(prod || null);
                }}
              >
                <option value="">Seleccionar producto...</option>
                {productos.map((p) => (
                  <option key={p.id_producto} value={p.id_producto}>
                    {p.nombreProducto} - C${" "}
                    {parseFloat(p.precioVenta || 0).toFixed(2)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3} lg={2}>
            <Form.Group className="mb-3" controlId="cantidadProducto">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={cantidad}
                onChange={(e) =>
                  setCantidad(Math.max(1, Number(e.target.value) || 1))
                }
              />
            </Form.Group>
          </Col>

          <Col
            md={3}
            lg={2}
            className="d-flex align-items-end justify-content-end"
          >
            <Button
              variant="secondary"
              onClick={handleAgregar}
              className="w-100"
            >
              Agregar
            </Button>
          </Col>
        </Row>

        <hr />

        <h5>Productos en esta venta</h5>
        {detalles.length === 0 ? (
          <div className="text-muted">No hay productos agregados aún.</div>
        ) : (
          <Table size="sm" bordered responsive className="mt-3">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((det) => (
                <tr key={det.id_producto}>
                  <td>{det.nombre_producto}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min={1}
                      value={det.cantidad}
                      onChange={(e) =>
                        actualizarCantidad(
                          det.id_producto,
                          Number(e.target.value) || 1,
                        )
                      }
                    />
                  </td>
                  <td>C$ {parseFloat(det.precio || 0).toFixed(2)}</td>
                  <td>
                    C${" "}
                    {(
                      Number(det.cantidad || 0) * Number(det.precio || 0)
                    ).toFixed(2)}
                  </td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => eliminarDetalle(det.id_producto)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <div className="d-flex justify-content-end align-items-center mt-3">
          <div>
            <span className="fw-bold me-2">Total:</span>
            <span>C$ {parseFloat(totalGeneral || 0).toFixed(2)}</span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={cerrar}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={guardarVenta}>
          {ventaAEditar ? "Guardar cambios" : "Registrar Venta"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormularioVenta;
