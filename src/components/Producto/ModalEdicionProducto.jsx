import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionProducto = ({
  mostrarModal,
  setMostrarModal,
  productoEditar,
  manejoCambioInput,
  actualizarProducto,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleActualizar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await actualizarProducto();
    setDeshabilitado(false);
  };

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre_p"
              value={productoEditar.nombre_p}
              onChange={manejoCambioInput}
              placeholder="Ingresa el nombre del producto"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={productoEditar.descripcion}
              onChange={manejoCambioInput}
              placeholder="Ingresa la descripción del producto"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              name="cantidad"
              value={productoEditar.cantidad}
              onChange={manejoCambioInput}
              placeholder="Ingresa la cantidad del producto"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Disponible"
              name="disponible"
              checked={productoEditar.disponible}
              onChange={manejoCambioInput}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Precio Compra</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="preciocompra"
              value={productoEditar.preciocompra}
              onChange={manejoCambioInput}
              placeholder="Ingresa el precio de compra"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Precio Venta</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="precioventa"
              value={productoEditar.precioventa}
              onChange={manejoCambioInput}
              placeholder="Ingresa el precio de venta"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleActualizar}
          disabled={productoEditar.nombre_p.trim() === "" || deshabilitado}
        >
          Actualizar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProducto;