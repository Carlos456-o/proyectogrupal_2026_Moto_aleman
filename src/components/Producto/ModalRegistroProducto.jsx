import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroProducto = ({
  mostrarModal,
  setMostrarModal,
  nuevoProducto,
  manejoCambioInput,
  agregarProducto,
}) => 
  {const [deshabilitado, setDeshabilitado] = useState(false);
  
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
            <Form.Label>Nombre_P</Form.Label>
            <Form.Control
              type="text"
              name="Nombre_P"
              value={nuevoCliente.Nombre_P}
              onChange={manejoCambioInput}
              placeholder="Ingresa el nombre del producto"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripcion</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="Descripcion"
              value={nuevoCliente.Descripcion}
              onChange={manejoCambioInput}
              placeholder="Ingresa la descripción del producto"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="Cantidad"
              value={nuevoCliente.Cantidad}
              onChange={manejoCambioInput}
              placeholder="Ingresa la cantidad del producto"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Disponible</Form.Label>
            <Form.Control
              as="radio"
              rows={3}
              name="Disponible"
              value={nuevoCliente.Disponible}
              onChange={manejoCambioInput}
              placeholder="Ingresa si el producto está disponible"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>PrecioCompra</Form.Label>
            <Form.Control
              as="number"
              rows={3}
              name="PrecioCompra"
              value={nuevoCliente.PrecioCompra}
              onChange={manejoCambioInput}
              placeholder="Ingresa el precio de compra"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>PrecioVenta</Form.Label>
            <Form.Control
              as="number"
              rows={3}
              name="PrecioVenta"
              value={nuevoCliente.PrecioVenta}
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
          onClick={handleRegistrar}
          disabled={nuevoProducto.Nombre_P.trim() === "" || deshabilitado}
        >
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProducto;