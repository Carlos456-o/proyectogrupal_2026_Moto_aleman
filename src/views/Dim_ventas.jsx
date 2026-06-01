import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import NotificacionOperacion from "../components/NotificacionOperacion";
import ModalRegistroDimVentas from "../components/Dim_ventas/ModalRegistroDimVentas";
import ModalEdicionDimVentas from "../components/Dim_ventas/ModalEdicionDimVentas";
import ModalEliminacionDimVentas from "../components/Dim_ventas/ModalEliminacionDimVentas";
import TablaDimVentas from "../components/Dim_ventas/TablaDimVentas";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

// Conexión con Supabase usando las tablas y columnas reales:
// - Clientes(ID_Cliente, Nombre1, ...)
// - Productos(ID_Producto, Nombre_P, PrecioVenta)
// - Empleados(ID_Empleado, Nombre, ...)
// - Ventas(ID_Detalle_ven, Cantidad_ven, Precio_Ven, Total_Venta)

const Dim_ventas = () => {
  const [vistaActual, setVistaActual] = useState("tabla");
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  const [dimVentas, setDimVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);

  const [cargando, setCargando] = useState(true);

  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [ventaEliminar, setVentaEliminar] = useState(null);
  const [ventaEditar, setVentaEditar] = useState(null);

  const [registrosPorPagina, setRegistrosPorPagina] = useState(5);
  const [paginaActual, setPaginaActual] = useState(1);

  const ventasPaginadas = useMemo(() => {
    return ventasFiltradas.slice(
      (paginaActual - 1) * registrosPorPagina,
      paginaActual * registrosPorPagina,
    );
  }, [ventasFiltradas, paginaActual, registrosPorPagina]);

  const manejarBusqueda = (e) => setTextoBusqueda(e.target.value);

  useEffect(() => {
    // Cargar auxiliares y luego las ventas
    (async () => {
      const aux = await cargarDatosAuxiliares();
      await cargarVentas(aux || {});
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // aplica busqueda local sobre la tabla (por nombre cliente/empleado)
    const base = dimVentas;
    if (!textoBusqueda.trim()) {
      setVentasFiltradas(base);
      setPaginaActual(1);
      return;
    }

    const t = textoBusqueda.toLowerCase().trim();
    const filtradas = base.filter((v) => {
      const cliente = v?.clienteNombre?.toLowerCase() || "";
      const empleado = v?.empleadoNombre?.toLowerCase() || "";
      return (
        cliente.includes(t) ||
        empleado.includes(t) ||
        String(v?.idDetalleVen || "").includes(t)
      );
    });

    setVentasFiltradas(filtradas);
    setPaginaActual(1);
  }, [textoBusqueda, dimVentas]);

  // Cargar tablas auxiliares: clientes, empleados, productos
  const cargarDatosAuxiliares = async () => {
    try {
      setCargando(true);

      const [cRes, eRes, pRes] = await Promise.all([
        supabase.from("clientes").select("*"),
        supabase.from("empleados").select("*"),
        supabase.from("productos").select("*"),
      ]);

      if (cRes.error) throw cRes.error;
      if (eRes.error) throw eRes.error;
      if (pRes.error) throw pRes.error;

      const cliNorm = (cRes.data || []).map((c) => ({
        id: c.id_cliente ?? c.ID_Cliente ?? c.id,
        nombre: [
          c.nombre1 ?? c.Nombre1 ?? c.nombre1,
          c.nombre2 ?? c.Nombre2 ?? c.nombre2,
        ]
          .filter(Boolean)
          .join(" ")
          .trim(),
      }));

      const empNorm = (e) => ({
        id: e.id_empleado ?? e.ID_Empleado ?? e.id,
        nombre: [
          e.nombre ?? e.Nombre ?? e.Nombre_Empleado,
          e.apellido ?? e.Apellido ?? e.Apellido_Empleado,
        ]
          .filter(Boolean)
          .join(" ")
          .trim(),
      });

      const prodNorm = (p) => ({
        id: p.id_producto ?? p.ID_Producto ?? p.id,
        nombre: p.nombre_p ?? p.Nombre_P ?? p.nombre_p,
        precioVen:
          p.precioventa ?? p.Precio_Ven ?? p.PrecioVenta ?? p.precioventa,
      });

      const empNormArr = (eRes.data || []).map(empNorm);
      const prodNormArr = (pRes.data || []).map(prodNorm);

      setClientes(cliNorm);
      setEmpleados(empNormArr);
      setProductos(prodNormArr);

      // Return normalized catalogs so the caller can use them immediately
      return {
        clientes: cliNorm,
        empleados: empNormArr,
        productos: prodNormArr,
      };
    } catch (err) {
      console.error("Error cargando auxiliares:", err);
      setToast({
        mostrar: true,
        mensaje: "Error al cargar datos auxiliares.",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  // Cargar ventas por separado
  const cargarVentas = async (aux = {}) => {
    try {
      setCargando(true);
      const { data: venData, error: venError } = await supabase
        .from("ventas")
        .select("*");
      if (venError) throw venError;
      // Depuración: mostrar columnas reales devueltas por la consulta
      if (venData && venData.length > 0) {
        console.info(
          "Columnas de 'ventas' detectadas:",
          Object.keys(venData[0]),
        );
        console.table(Object.keys(venData[0]));
      } else {
        console.info(
          "La tabla 'ventas' no devolvió filas para inspección de columnas.",
        );
      }

      const clientesAux = aux.clientes || clientes;
      const empleadosAux = aux.empleados || empleados;
      const productosAux = aux.productos || productos;

      const ventasNorm = (venData || []).map((v) => {
        const idCliente =
          v.id_cliente ?? v.ID_Cliente ?? v.idcliente ?? v.id_cliente;
        const idEmpleado =
          v.id_empleado ?? v.ID_Empleado ?? v.idempleado ?? v.id_empleado;
        const idProducto =
          v.id_producto ?? v.ID_Producto ?? v.idproducto ?? v.id_producto;

        const clienteNombre =
          (clientesAux || []).find((c) => String(c.id) === String(idCliente))
            ?.nombre || "";
        const empleadoNombre =
          (empleadosAux || []).find((e) => String(e.id) === String(idEmpleado))
            ?.nombre || "";
        const productoNombre =
          (productosAux || []).find((p) => String(p.id) === String(idProducto))
            ?.nombre || "";

        return {
          idDetalleVen:
            v.id_detalle_ven ?? v.ID_Detalle_ven ?? v.id ?? v.idDetalleVen,
          totalVenta: Number(
            v.total_venta ?? v.Total_Venta ?? v.totalVenta ?? 0,
          ),
          cantidad: v.cantidad_ven ?? v.Cantidad_ven ?? v.cantidad ?? 0,
          precio: v.precio_ven ?? v.Precio_Ven ?? v.precio ?? 0,
          clienteNombre,
          empleadoNombre,
          productoNombre,
        };
      });

      setDimVentas(ventasNorm);
      setVentasFiltradas(ventasNorm);
    } catch (err) {
      console.error("Error al cargar ventas:", err);
      setToast({
        mostrar: true,
        mensaje: "Error al cargar ventas.",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  // Compatibilidad: función que antes existía (cargarCatalogos)
  const cargarCatalogos = async () => {
    const aux = await cargarDatosAuxiliares();
    await cargarVentas(aux || {});
  };

  const abrirModalEdicion = (item) => {
    setVentaEditar(item);
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (item) => {
    setVentaEliminar(item);
    setMostrarModalEliminacion(true);
  };

  const eliminarVenta = async () => {
    if (!ventaEliminar) return;

    try {
      setMostrarModalEliminacion(false);
      const id = ventaEliminar.idDetalleVen;

      // Eliminación por ID_Detalle_ven
      const { error } = await supabase
        .from("ventas")
        .delete()
        .eq("id_detalle_ven", id);

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: "Venta eliminada correctamente.",
        tipo: "exito",
      });
      await cargarCatalogos();
    } catch (err) {
      console.error("Error al eliminar venta:", err);
      setToast({
        mostrar: true,
        mensaje: "Error al eliminar venta.",
        tipo: "error",
      });
    }
  };

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
            placeholder="Buscar por cliente/empleado o ID..."
          />
        </Col>

        <Col md="auto" className="ms-auto">
          <Button
            variant="danger"
            onClick={() => setMostrarModal(true)}
            size="md"
          >
            <i className="bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-2">Registrar Venta</span>
          </Button>
        </Col>
      </Row>

      {cargando && (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3 text-muted">Cargando ventas...</p>
          </Col>
        </Row>
      )}

      {!cargando && ventasFiltradas.length === 0 && textoBusqueda.trim() && (
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i>
              No se encontraron ventas que coincidan con "{textoBusqueda}".
            </Alert>
          </Col>
        </Row>
      )}

      {!cargando && ventasFiltradas.length > 0 && vistaActual === "tabla" && (
        <>
          <Row>
            <Col>
              <TablaDimVentas
                items={ventasPaginadas}
                abrirModalEdicion={abrirModalEdicion}
                abrirModalEliminacion={abrirModalEliminacion}
              />
            </Col>
          </Row>

          <Row className="mt-4">
            <Col>
              <Paginacion
                registrosPorPagina={registrosPorPagina}
                totalRegistros={ventasFiltradas.length}
                paginaActual={paginaActual}
                establecerPaginaActual={setPaginaActual}
                establecerRegistrosPorPagina={setRegistrosPorPagina}
              />
            </Col>
          </Row>
        </>
      )}

      <ModalRegistroDimVentas
        open={mostrarModal}
        onClose={() => setMostrarModal(false)}
        clientes={clientes}
        empleados={empleados}
        productos={productos}
        onGuardadoExitoso={cargarCatalogos}
        setToast={setToast}
      />

      <ModalEdicionDimVentas
        open={mostrarModalEdicion}
        onClose={() => setMostrarModalEdicion(false)}
        item={ventaEditar}
        onGuardadoExitoso={cargarCatalogos}
        setToast={setToast}
      />

      <ModalEliminacionDimVentas
        open={mostrarModalEliminacion}
        onClose={() => setMostrarModalEliminacion(false)}
        onConfirm={eliminarVenta}
        item={ventaEliminar}
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

export default Dim_ventas;
