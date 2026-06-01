import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import NotificacionOperacion from "../components/NotificacionOperacion";
import FormularioVenta from "../components/Ventas/FormularioVenta";
import TablaVentas from "../components/Ventas/TablaVentas";
import ModalDetallesVenta from "../components/Ventas/ModalDetallesVenta";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

const Ventas = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [ventaAEditar, setVentaAEditar] = useState(null);

  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [detalles, setDetalles] = useState([]);
  const [totalGeneral, setTotalGeneral] = useState(0);
  const [fechaVenta, setFechaVenta] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(8);
  const [paginaActual, establecerPaginaActual] = useState(1);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  const ventasPaginadas = useMemo(
    () =>
      ventasFiltradas.slice(
        (paginaActual - 1) * registrosPorPagina,
        paginaActual * registrosPorPagina,
      ),
    [ventasFiltradas, paginaActual, registrosPorPagina],
  );

  const formateaNombreCliente = (cliente) => {
    if (!cliente) return "";
    return [
      cliente.nombre1,
      cliente.nombre2,
      cliente.apellidos1,
      cliente.apellidos2,
    ]
      .filter(Boolean)
      .join(" ");
  };

  const formateaNombreEmpleado = (empleado) => {
    if (!empleado) return "";
    return [empleado.nombre, empleado.apellido].filter(Boolean).join(" ");
  };

  const getValue = (obj, keys) => {
    if (!obj) return undefined;
    return keys.reduce(
      (value, key) => (value !== undefined ? value : obj[key]),
      undefined,
    );
  };

  const getVentaId = (venta) =>
    getValue(venta, ["id_detalle_venta", "ID_Detalle_Venta", "id"]);

  const getVentaGroupKey = (row) => {
    const cliente =
      row.nombre_cliente || row.Nombre_Cliente || row.cliente || "";
    const empleado =
      row.nombre_empleado || row.Nombre_Empleado || row.empleado || "";
    const fecha =
      getFechaValue(row) || row.Fecha || row.fecha || "";
    return `${cliente}|${empleado}|${fecha}`;
  };

  const getClienteId = (venta) =>
    getValue(venta, ["id_cliente", "ID_Cliente", "cliente_id"]);

  const getEmpleadoId = (venta) =>
    getValue(venta, ["id_empleado", "ID_Empleado", "empleado_id"]);

  const getProductId = (venta) =>
    getValue(venta, [
      "id_producto",
      "ID_Producto",
      "producto_id",
      "idProducto",
      "id",
    ]);

  const getFechaValue = (venta) =>
    getValue(venta, [
      "fecha",
      "Fecha",
      "fecha_venta",
      "created_at",
      "createdAt",
    ]);

  const getProductoNombre = (row) =>
    getValue(row, [
      "nombre_p",
      "Nombre_P",
      "nombre_producto",
      "nombreProducto",
      "nombre",
    ]);

  const groupDetalleVentas = (rows) => {
    const groups = {};

    rows.forEach((row) => {
      const saleKey = getVentaGroupKey(row);
      const saleId = getVentaId(row);
      if (!groups[saleKey]) {
        groups[saleKey] = {
          id_detalle_venta: saleId,
          clienteNombre:
            row.nombre_cliente || row.Nombre_Cliente || row.cliente || "",
          empleadoNombre:
            row.nombre_empleado || row.Nombre_Empleado || row.empleado || "",
          fecha:
            getFechaValue(row) || row.Fecha || row.fecha || "",
          cantidadTotal: 0,
          subtotal: 0,
          detalles: [],
        };
      }

      const cantidad = Number(
        row.cantidad ?? row.Cantidad ?? row.cantidad_ven ?? 0,
      );
      const subtotal = Number(
        row.total_venta ?? row.Total_Venta ?? row.subtotal ?? 0,
      );
      const producto = productos.find(
        (p) =>
          String(getValue(p, ["id_producto", "ID_Producto", "id"])) ===
          String(
            getValue(row, ["id_producto", "ID_Producto", "producto_id"]),
          ),
      );

      groups[saleKey].cantidadTotal += cantidad;
      groups[saleKey].subtotal += subtotal;
      groups[saleKey].detalles.push({
        ...row,
        nombreProducto:
          getProductoNombre(row) ||
          producto?.nombreProducto ||
          producto?.Nombre_P ||
          producto?.nombre_p ||
          producto?.nombre ||
          "",
      });
    });

    return Object.values(groups);
  };

  const abrirDetalles = (venta) => {
    setVentaSeleccionada(venta);
    setMostrarDetalles(true);
  };

  const cerrarDetalles = () => {
    setMostrarDetalles(false);
    setVentaSeleccionada(null);
  };

  const getEntityById = (list, id) => {
    if (!id) return undefined;
    return list.find((item) =>
      [
        "id",
        "id_cliente",
        "ID_Cliente",
        "cliente_id",
        "id_empleado",
        "ID_Empleado",
        "empleado_id",
        "id_producto",
        "ID_Producto",
        "producto_id",
      ].some((key) => String(getValue(item, [key])) === String(id)),
    );
  };

  const getProductName = (venta) => {
    const productId = getProductId(venta);
    const product = getEntityById(productos, productId);
    return (
      getValue(venta, [
        "nombre_producto",
        "producto_nombre",
        "nombre_p",
        "nombre",
      ]) ||
      getValue(product, [
        "nombreProducto",
        "nombre_p",
        "nombre",
        "nombre_producto",
      ]) ||
      ""
    );
  };

  const getClientName = (venta) => {
    const clienteId = getClienteId(venta);
    const cliente = getEntityById(clientes, clienteId);
    return (
      getValue(venta, [
        "cliente_nombre",
        "nombreCompleto",
        "nombre1",
        "nombre",
      ]) ||
      formateaNombreCliente(cliente) ||
      ""
    );
  };

  const getEmployeeName = (venta) => {
    const empleadoId = getEmpleadoId(venta);
    const empleado = getEntityById(empleados, empleadoId);
    return (
      getValue(venta, ["empleado_nombre", "nombreCompleto", "nombre"]) ||
      formateaNombreEmpleado(empleado) ||
      ""
    );
  };

  const getTotalValue = (venta) =>
    getValue(venta, ["total", "total_venta", "Total_Venta"]);

  const getMetodoPagoValue = (venta) =>
    getValue(venta, ["metodo_pago", "metodoPago", "payment_method"]);

  const cargarDatosAuxiliares = async () => {
    try {
      const [cRes, eRes, pRes] = await Promise.all([
        supabase.from("clientes").select("*"),
        supabase.from("empleados").select("*"),
        supabase.from("productos").select("*"),
      ]);

      if (cRes.error) throw cRes.error;
      if (eRes.error) throw eRes.error;
      if (pRes.error) throw pRes.error;

      const clientesNorm = (cRes.data || []).map((cliente) => ({
        ...cliente,
        nombreCompleto: formateaNombreCliente(cliente),
      }));

      const empleadosNorm = (eRes.data || []).map((empleado) => ({
        ...empleado,
        nombreCompleto: formateaNombreEmpleado(empleado),
      }));

      const productosNorm = (pRes.data || []).map((producto) => ({
        ...producto,
        id_producto:
          producto.id_producto ?? producto.ID_Producto ?? producto.id,
        nombreProducto:
          producto.nombre_p ??
          producto.Nombre_P ??
          producto.nombre_producto ??
          producto.nombre,
        precioVenta:
          producto.precio_ven ??
          producto.Precio_Ven ??
          producto.precioventa ??
          producto.precio_venta ??
          producto.precio,
      }));

      setClientes(clientesNorm);
      setEmpleados(empleadosNorm);
      setProductos(productosNorm);

      return {
        clientes: clientesNorm,
        empleados: empleadosNorm,
        productos: productosNorm,
      };
    } catch (err) {
      console.error("Error cargando auxiliares:", err);
      setToast({
        mostrar: true,
        mensaje: "Error al cargar datos auxiliares.",
        tipo: "error",
      });
      return { clientes: [], empleados: [], productos: [] };
    }
  };

  const cargarVentas = async () => {
    try {
      setCargando(true);
      const { data: detalleData, error: detalleError } = await supabase
        .from("detalle_ventas")
        .select("*");

      if (detalleError) {
        console.error("Error al cargar detalle ventas:", detalleError);
        setToast({
          mostrar: true,
          mensaje: "Error al cargar ventas",
          tipo: "error",
        });
        return;
      }

      const ventasNorm = groupDetalleVentas(detalleData || []);

      ventasNorm.sort((a, b) => {
        const fechaA = new Date(a.fecha || 0).getTime();
        const fechaB = new Date(b.fecha || 0).getTime();
        return fechaB - fechaA;
      });

      setVentas(ventasNorm);
      setVentasFiltradas(ventasNorm);
    } catch (err) {
      console.error(err);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al cargar ventas",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    (async () => {
      await cargarDatosAuxiliares();
      await cargarVentas();
    })();
  }, []);

  useEffect(() => {
    if (ventaAEditar) {
      const cliente = clientes.find(
        (c) =>
          String(getValue(c, ["id_cliente", "ID_Cliente", "id"])) ===
          String(getClienteId(ventaAEditar)),
      );
      const empleado = empleados.find(
        (e) =>
          String(getValue(e, ["id_empleado", "ID_Empleado", "id"])) ===
          String(getEmpleadoId(ventaAEditar)),
      );

      setClienteSeleccionado(cliente || null);
      setEmpleadoSeleccionado(empleado || null);
      setMetodoPago(getMetodoPagoValue(ventaAEditar) || "efectivo");
      const fechaInicial =
        getFechaValue(ventaAEditar) ||
        ventaAEditar.fecha ||
        new Date().toISOString().split("T")[0];
      setFechaVenta(new Date(fechaInicial).toISOString().split("T")[0]);

      if (ventaAEditar.detalles_ventas?.length > 0) {
        const detallesFormateados = ventaAEditar.detalles_ventas.map(
          (detalle) => ({
            id_producto: detalle.id_producto,
            nombre_producto:
              detalle.productos?.nombre_p ||
              detalle.productos?.nombreProducto ||
              detalle.productos?.nombre ||
              "Producto",
            precio: detalle.precio_unitario,
            cantidad: detalle.cantidad,
          }),
        );
        setDetalles(detallesFormateados);
      } else {
        setDetalles([]);
      }
    }
  }, [ventaAEditar, clientes, empleados]);

  useEffect(() => {
    const total = detalles.reduce(
      (sum, detalle) =>
        sum + Number(detalle.cantidad || 0) * Number(detalle.precio || 0),
      0,
    );
    setTotalGeneral(total);
  }, [detalles]);

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setVentasFiltradas(ventas);
      return;
    }

    const textoLower = textoBusqueda.toLowerCase();
    const filtradas = ventas.filter((venta) => {
      const cliente = (venta.clienteNombre || "").toLowerCase();
      const empleado = (venta.empleadoNombre || "").toLowerCase();
      return (
        cliente.includes(textoLower) ||
        empleado.includes(textoLower) ||
        String(
          venta.id_venta ||
            venta.id_detalle_venta ||
            venta.id_detalle_ven ||
            "",
        ).includes(textoLower)
      );
    });
    setVentasFiltradas(filtradas);
  }, [textoBusqueda, ventas]);

  const abrirNuevaVenta = () => {
    resetFormulario();
    setMostrarFormulario(true);
  };

  const abrirEdicion = (venta) => {
    setVentaAEditar(venta);
    setMostrarFormulario(true);
  };

  const resetFormulario = () => {
    setClienteSeleccionado(null);
    setEmpleadoSeleccionado(null);
    setMetodoPago("efectivo");
    setDetalles([]);
    setFechaVenta(new Date().toISOString().split("T")[0]);
    setVentaAEditar(null);
  };

  const agregarDetalle = (producto, cantidad) => {
    if (!producto || !cantidad) return;
    setDetalles((prev) => {
      const existe = prev.find((d) => d.id_producto === producto.id_producto);
      if (existe) {
        return prev.map((d) =>
          d.id_producto === producto.id_producto
            ? { ...d, cantidad: d.cantidad + cantidad }
            : d,
        );
      }
      return [
        ...prev,
        {
          id_producto: producto.id_producto,
          nombre_producto: producto.nombreProducto,
          precio: producto.precioVenta,
          cantidad,
        },
      ];
    });
  };

  const eliminarDetalle = (id_producto) => {
    setDetalles((prev) => prev.filter((d) => d.id_producto !== id_producto));
  };

  const actualizarCantidad = (id_producto, nuevaCantidad) => {
    if (nuevaCantidad <= 0) return;
    setDetalles((prev) =>
      prev.map((d) =>
        d.id_producto === id_producto ? { ...d, cantidad: nuevaCantidad } : d,
      ),
    );
  };

  const guardarVenta = async () => {
    if (detalles.length === 0) {
      setToast({
        mostrar: true,
        mensaje: "Agrega al menos un producto para registrar la venta",
        tipo: "advertencia",
      });
      return;
    }

    try {
      const clienteNombre =
        clienteSeleccionado?.nombreCompleto ||
        formateaNombreCliente(clienteSeleccionado) ||
        "";
      const empleadoNombre =
        empleadoSeleccionado?.nombreCompleto ||
        formateaNombreEmpleado(empleadoSeleccionado) ||
        "";
      const fechaVentaValue = fechaVenta;

      if (ventaAEditar) {
        const clienteNombrePrev =
          ventaAEditar.clienteNombre ||
          ventaAEditar.nombre_cliente ||
          ventaAEditar.Nombre_Cliente ||
          ventaAEditar.cliente ||
          "";
        const empleadoNombrePrev =
          ventaAEditar.empleadoNombre ||
          ventaAEditar.nombre_empleado ||
          ventaAEditar.Nombre_Empleado ||
          ventaAEditar.empleado ||
          "";
        const fechaPrev =
          getFechaValue(ventaAEditar) ||
          ventaAEditar.Fecha ||
          ventaAEditar.fecha ||
          "";

        const { error: deleteError } = await supabase
          .from("detalle_ventas")
          .delete()
          .eq("nombre_cliente", clienteNombrePrev)
          .eq("nombre_empleado", empleadoNombrePrev)
          .eq("fecha", fechaPrev);

        if (deleteError) throw deleteError;
      }

      const detallesInsert = detalles.map((d) => ({
        Nombre_Cliente: clienteNombre,
        Nombre_Empleado: empleadoNombre,
        ID_Producto: d.id_producto,
        Nombre_P: d.nombre_producto,
        Cantidad: d.cantidad,
        Precio_Ven: d.precio,
        Total_Venta: d.cantidad * d.precio,
        Fecha: fechaVentaValue,
      }));

      let { error: insertError } = await supabase
        .from("detalle_ventas")
        .insert(detallesInsert);

      if (insertError && ["42703", "PGRST204"].includes(insertError.code)) {
        const fallbackInsert = detallesInsert.map((row) => {
          const { id_venta, ...rest } = row;
          return rest;
        });
        const fallbackResult = await supabase
          .from("detalle_ventas")
          .insert(fallbackInsert);
        insertError = fallbackResult.error;
      }

      if (insertError) throw insertError;

      setToast({
        mostrar: true,
        mensaje: ventaAEditar
          ? "Venta actualizada exitosamente"
          : "Venta registrada exitosamente",
        tipo: "exito",
      });
      resetFormulario();
      setMostrarFormulario(false);
      await cargarVentas();
    } catch (err) {
      console.error(err);
      setToast({
        mostrar: true,
        mensaje: "Error al guardar la venta",
        tipo: "error",
      });
    }
  };

  const manejarBusqueda = (e) => setTextoBusqueda(e.target.value);

  return (
    <Container style={{ marginTop: "2cm" }}>
      <Row className="mb-3">
        <Col>
          <h3 className="mb-0">
            <i className="bi bi-receipt-cutoff me-2 text-dark"></i> Ventas
          </h3>
        </Col>
      </Row>

      <Row className="mb-4 align-items-center gap-2">
        <Col md={6} lg={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
            placeholder="Buscar por cliente, empleado o ID..."
          />
        </Col>
        <Col md="auto" className="ms-auto">
          <Button variant="danger" onClick={abrirNuevaVenta} size="md">
            <i className="bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-2">Nueva Venta</span>
          </Button>
        </Col>
      </Row>

      {cargando ? (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3 text-muted">Cargando ventas...</p>
          </Col>
        </Row>
      ) : ventasFiltradas.length === 0 ? (
        <Row>
          <Col>
            <Alert variant="info" className="text-center">
              No se encontraron ventas para mostrar.
            </Alert>
          </Col>
        </Row>
      ) : (
        <>
          <Row>
            <Col>
              <TablaVentas
                ventas={ventasPaginadas}
                verDetalles={abrirDetalles}
              />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <Paginacion
                registrosPorPagina={registrosPorPagina}
                totalRegistros={ventasFiltradas.length}
                paginaActual={paginaActual}
                establecerPaginaActual={establecerPaginaActual}
                establecerRegistrosPorPagina={establecerRegistrosPorPagina}
              />
            </Col>
          </Row>
        </>
      )}

      <FormularioVenta
        mostrar={mostrarFormulario}
        setMostrar={setMostrarFormulario}
        clientes={clientes}
        empleados={empleados}
        productos={productos}
        clienteSeleccionado={clienteSeleccionado}
        setClienteSeleccionado={setClienteSeleccionado}
        empleadoSeleccionado={empleadoSeleccionado}
        setEmpleadoSeleccionado={setEmpleadoSeleccionado}
        metodoPago={metodoPago}
        setMetodoPago={setMetodoPago}
        fechaVenta={fechaVenta}
        setFechaVenta={setFechaVenta}
        detalles={detalles}
        totalGeneral={totalGeneral}
        agregarDetalle={agregarDetalle}
        eliminarDetalle={eliminarDetalle}
        actualizarCantidad={actualizarCantidad}
        guardarVenta={guardarVenta}
        fechaVenta={fechaVenta}
        setFechaVenta={setFechaVenta}
        ventaAEditar={ventaAEditar}
      />

      <ModalDetallesVenta
        mostrar={mostrarDetalles}
        onCerrar={cerrarDetalles}
        venta={ventaSeleccionada}
        productos={productos}
      />

      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />
    </Container>
  );
};

export default Ventas;
