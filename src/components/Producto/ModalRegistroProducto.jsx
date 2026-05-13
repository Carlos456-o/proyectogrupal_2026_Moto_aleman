import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroProducto = ({
  mostrarModal,
  setMostrarModal,
  nuevoProducto,
  manejoCambioInput,
  manejoCambioArchivo,
  agregarProducto,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleRegistrar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await agregarProducto();
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
        <Modal.Title>Agregar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre_p"
              value={nuevoProducto.nombre_p}
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
              value={nuevoProducto.descripcion}
              onChange={manejoCambioInput}
              placeholder="Ingresa la descripción del producto"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              name="cantidad"
              value={nuevoProducto.cantidad}
              onChange={manejoCambioInput}
              placeholder="Ingresa la cantidad del producto"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Disponible"
              name="disponible"
              checked={nuevoProducto.disponible}
              onChange={manejoCambioInput}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Precio Compra</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="preciocompra"
              value={nuevoProducto.preciocompra}
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
              value={nuevoProducto.precioventa}
              onChange={manejoCambioInput}
              placeholder="Ingresa el precio de venta"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Imagen del producto *</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={manejoCambioArchivo} required />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleRegistrar}
          disabled={nuevoProducto.nombre_p.trim() === "" || !nuevoProducto.archivo || deshabilitado}
        >
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProducto;
