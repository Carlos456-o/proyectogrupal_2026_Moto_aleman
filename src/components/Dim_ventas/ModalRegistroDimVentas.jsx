import React, { useMemo, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

export default function ModalRegistroDimVentas({
  open,
  onClose,
  clientes = [],
  empleados = [],
  productos = [],
  onGuardadoExitoso,
  setToast,
}) {
  const [clienteId, setClienteId] = useState("");
  const [empleadoId, setEmpleadoId] = useState("");

  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState(1);

  const [items, setItems] = useState([]);

  const productoSeleccionado = useMemo(
    () => productos.find((p) => String(p.id) === String(productoId)),
    [productos, productoId],
  );

  const precioUnit = Number(productoSeleccionado?.precioVen ?? 0);
  const subtotalItem = precioUnit * Number(cantidad || 0) || 0;

  const limpiar = () => {
    setClienteId("");
    setEmpleadoId("");
    setProductoId("");
    setCantidad(1);
    setItems([]);
  };

  const handleAgregarItem = () => {
    if (!productoId) return;
    const c = Number(cantidad);
    if (!c || c <= 0) return;

    const p = productos.find((x) => String(x.id) === String(productoId));
    if (!p) return;

    const item = {
      idProducto: p.id,
      nombreProducto: p.nombre,
      precioVen: Number(p.precioVen ?? 0),
      cantidad: c,
      totalVenta: Number(p.precioVen ?? 0) * c,
    };

    setItems((prev) => [...prev, item]);
    setCantidad(1);
  };

  const totalVenta = items.reduce(
    (acc, it) => acc + Number(it.totalVenta || 0),
    0,
  );

  const guardarVenta = async () => {
    if (!clienteId || !empleadoId) {
      setToast?.({
        mostrar: true,
        mensaje: "Selecciona cliente y empleado",
        tipo: "advertencia",
      });
      return;
    }
    if (items.length === 0) {
      setToast?.({
        mostrar: true,
        mensaje: "Agrega al menos 1 producto",
        tipo: "advertencia",
      });
      return;
    }

    try {
      // En tu ETL: la tabla del detalle incluye id_cliente/id_producto/id_empleado/id_tiempo
      // + cantidad_ven/precio_ven/total_venta.
      // Como el componente no tiene UI de tiempo, usamos id_tiempo=1 por defecto (ajustable luego).
      const ID_Tiempo = 1;

      // Insertamos UNA FILA por producto (detalle), incluyendo claves foráneas.
      const inserts = items.map((it) => ({
        id_cliente: Number(clienteId),
        id_empleado: Number(empleadoId),
        id_producto: Number(it.idProducto),
        id_tiempo: Number(ID_Tiempo),
        cantidad_ven: Number(it.cantidad),
        precio_ven: Number(it.precioVen),
        total_venta: Number(it.totalVenta),
      }));

      // Intento principal: columnas en minúsculas (estándar Postgres)
      let { error } = await supabase.from("ventas").insert(inserts);

      // Si falla por columnas no encontradas en el schema cache, reintentamos
      // con una convención alternativa que usa mayúsculas/mixta (ej. ID_Cliente).
      if (error && error.code === "PGRST204") {
        console.warn(
          "Inserción con columnas minúsculas falló, reintentando con nombres en mayúsculas sobre tabla 'ventas'",
          error.message,
        );

        // 1) Intento con columnas mayúsculas pero tabla en minúsculas
        const insertsAlt = items.map((it) => ({
          ID_Cliente: Number(clienteId),
          ID_Empleado: Number(empleadoId),
          ID_Producto: Number(it.idProducto),
          ID_Tiempo: Number(ID_Tiempo),
          Cantidad_ven: Number(it.cantidad),
          Precio_Ven: Number(it.precioVen),
          Total_Venta: Number(it.totalVenta),
        }));

        let altResult = await supabase.from("ventas").insert(insertsAlt);
        error = altResult.error;

        // 2) Si sigue fallando por columnas no encontradas, intentar insertar sólo campos numéricos
        if (error && error.code === "PGRST204") {
          console.warn(
            "Inserción con columnas mayúsculas falló, reintentando sólo con campos numéricos (minúsculas)",
          );
          const minimal = items.map((it) => ({
            cantidad_ven: Number(it.cantidad),
            precio_ven: Number(it.precioVen),
            total_venta: Number(it.totalVenta),
          }));
          let minimalResult = await supabase.from("ventas").insert(minimal);
          error = minimalResult.error;

          // 3) último recurso: minimal con mayúsculas
          if (error && error.code === "PGRST204") {
            console.warn(
              "Inserción minimal (minúsculas) falló, reintentando minimal con mayúsculas",
            );
            const minimalAlt = items.map((it) => ({
              Cantidad_ven: Number(it.cantidad),
              Precio_Ven: Number(it.precioVen),
              Total_Venta: Number(it.totalVenta),
            }));
            const minimalAltResult = await supabase
              .from("ventas")
              .insert(minimalAlt);
            error = minimalAltResult.error;
          }
        }
      }

      if (error) throw error;

      setToast?.({
        mostrar: true,
        mensaje: "Venta registrada correctamente",
        tipo: "exito",
      });
      limpiar();
      onClose?.();
      await onGuardadoExitoso?.();
    } catch (err) {
      console.error(err);
      setToast?.({
        mostrar: true,
        mensaje: "Error al registrar la venta",
        tipo: "error",
      });
    }
  };

  return (
    <Modal
      show={open}
      onHide={onClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Registrar Venta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="cliente">
            <Form.Label>Cliente (por nombre)</Form.Label>
            <Form.Select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
            >
              <option value="">Selecciona cliente...</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="empleado">
            <Form.Label>Empleado (por nombre)</Form.Label>
            <Form.Select
              value={empleadoId}
              onChange={(e) => setEmpleadoId(e.target.value)}
            >
              <option value="">Selecciona empleado...</option>
              {empleados.map((em) => (
                <option key={em.id} value={em.id}>
                  {em.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <hr />

          <div className="d-flex gap-2 align-items-end">
            <div style={{ flex: 1 }}>
              <Form.Label>Producto (por nombre)</Form.Label>
              <Form.Select
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
              >
                <option value="">Selecciona producto...</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </Form.Select>
            </div>

            <div style={{ width: 140 }}>
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </div>

            <Button variant="secondary" onClick={handleAgregarItem}>
              Agregar
            </Button>
          </div>

          <div className="mt-2 text-muted">
            Subtotal ítem: <b>{subtotalItem.toFixed(2)}</b>
          </div>

          <hr />

          <div>
            <div className="fw-bold mb-2">Productos agregados</div>
            {items.length === 0 ? (
              <div className="text-muted">No hay productos agregados.</div>
            ) : (
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="text-end">Precio</th>
                    <th className="text-center">Cant</th>
                    <th className="text-end">Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={`${it.idProducto}-${idx}`}>
                      <td>{it.nombreProducto}</td>
                      <td className="text-end">
                        {Number(it.precioVen).toFixed(2)}
                      </td>
                      <td className="text-center">{it.cantidad}</td>
                      <td className="text-end">
                        {Number(it.totalVenta).toFixed(2)}
                      </td>
                      <td className="text-end">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() =>
                            setItems((prev) => prev.filter((_, i) => i !== idx))
                          }
                        >
                          Quitar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="mt-3">
            <div className="fw-bold">Total venta: {totalVenta.toFixed(2)}</div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={guardarVenta}>
          Guardar Venta
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
