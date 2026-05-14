import { supabase } from "../database/supabaseconfig";
import ModalRegistroClientes from "../components/Clientes/ModalRegistroClientes";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import NotificacionOperacion from "../components/NotificacionOperacion";
import TarjetaCliente from "../components/Clientes/TarjetaCliente";
import ModalEdicionClientes from "../components/Clientes/ModalEdicionClientes";
import ModalEliminacionClientes from "../components/Clientes/ModalEliminacionClientes";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import { Alert } from "react-bootstrap";
import TablaClientes from "../components/Clientes/TablaClientes";
import Paginacion from "../components/ordenamiento/Paginacion";

const Clientes = () => {
  const [vistaActual, setVistaActual] = useState("tabla"); // "tarjeta" o "tabla"
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [mostrarModal, setMostrarModal] = useState(false);

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre1: "",
    nombre2: "",
    apellidos1: "",
    apellidos2: "",
    cedula: "",
  });

  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [clienteEditar, setClienteEditar] = useState({
    id_cliente: "",
    nombre1: "",
    nombre2: "",
    apellidos1: "",
    apellidos2: "",
    cedula: "",
  });

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState([]);

  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);

  const clientesPaginados = clientesFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina,
  );

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setClientesFiltrados(clientes);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();
      const filtradas = clientes.filter(
        (cli) =>
          cli.nombre1.toLowerCase().includes(textoLower) ||
          (cli.apellidos1 && cli.apellidos1.toLowerCase().includes(textoLower)),
      );
      setClientesFiltrados(filtradas);
    }
  }, [textoBusqueda, clientes]);

  const eliminarCliente = async () => {
    if (!clienteAEliminar) return;
    try {
      setMostrarModalEliminacion(false);

      const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id_cliente", clienteAEliminar.id_cliente);

      if (error) {
        console.error("Error al eliminar cliente:", error.message);
        setToast({
          mostrar: true,
          mensaje: `Error al eliminar el cliente ${clienteAEliminar.nombre1}.`,
          tipo: "error",
        });
        return;
      }

      await cargarClientes();

      setToast({
        mostrar: true,
        mensaje: `Cliente ${clienteAEliminar.nombre1} eliminado exitosamente.`,
        tipo: "exito",
      });
    } catch (err) {
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al eliminar cliente.",
        tipo: "error",
      });
      console.error("Excepción al eliminar cliente:", err.message);
    }
  };

  const actualizarCliente = async () => {
    try {
      if (!clienteEditar.nombre1.trim() || !clienteEditar.apellidos1.trim()) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar los campos obligatorios.",
          tipo: "advertencia",
        });
        return;
      }

      setMostrarModalEdicion(false);

      const { error } = await supabase
        .from("clientes")
        .update({
          nombre1: clienteEditar.nombre1,
          nombre2: clienteEditar.nombre2,
          apellidos1: clienteEditar.apellidos1,
          apellidos2: clienteEditar.apellidos2,
          cedula: clienteEditar.cedula,
        })
        .eq("id_cliente", clienteEditar.id_cliente);

      if (error) {
        console.error("Error al actualizar cliente:", error.message);
        setToast({
          mostrar: true,
          mensaje: `Error al actualizar el cliente ${clienteEditar.nombre1}.`,
          tipo: "error",
        });
        return;
      }

      await cargarClientes();

      setToast({
        mostrar: true,
        mensaje: `Cliente ${clienteEditar.nombre1} actualizado exitosamente.`,
        tipo: "exito",
      });
    } catch (err) {
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al actualizar cliente.",
        tipo: "error",
      });
      console.error("Excepción al actualizar cliente:", err.message);
    }
  };

  const abrirModalEdicion = (cliente) => {
    setClienteEditar({
      id_cliente: cliente.id_cliente,
      nombre1: cliente.nombre1,
      nombre2: cliente.nombre2,
      apellidos1: cliente.apellidos1,
      apellidos2: cliente.apellidos2,
      cedula: cliente.cedula,
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (cliente) => {
    setClienteAEliminar(cliente);
    setMostrarModalEliminacion(true);
  };

  const cargarClientes = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("id_cliente", { ascending: true });

      if (error) {
        console.error("Error al cargar clientes:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al cargar clientes.",
          tipo: "error",
        });
        return;
      }

      setClientes(data || []);
    } catch (err) {
      console.error("Excepción al cargar clientes:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al cargar clientes.",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setClienteEditar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoCliente((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const agregarCliente = async () => {
    try {
      if (!nuevoCliente.nombre1.trim() || !nuevoCliente.apellidos1.trim()) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar los campos obligatorios.",
          tipo: "advertencia",
        });
        return;
      }

      const { error } = await supabase.from("clientes").insert([
        {
          nombre1: nuevoCliente.nombre1,
          nombre2: nuevoCliente.nombre2,
          apellidos1: nuevoCliente.apellidos1,
          apellidos2: nuevoCliente.apellidos2,
          cedula: nuevoCliente.cedula,
        },
      ]);

      if (error) {
        console.error("Error al agregar cliente:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al registrar cliente.",
          tipo: "error",
        });
        return;
      }

      setToast({
        mostrar: true,
        mensaje: `Cliente "${nuevoCliente.nombre1}" registrado exitosamente.`,
        tipo: "exito",
      });

      cargarClientes();

      setNuevoCliente({
        nombre1: "",
        nombre2: "",
        apellidos1: "",
        apellidos2: "",
        cedula: "",
      });
      setMostrarModal(false);
    } catch (err) {
      console.error("Excepción al agregar cliente:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al registrar cliente.",
        tipo: "error",
      });
    }
  };

  return (
    <Container style={{ marginTop: "2cm" }}>
      <Row className="mb-3">
        <Col>
          <h3 className="mb-0">
            <i className="bi-person-fill me-2 text-primary"></i> Clientes
          </h3>
        </Col>
      </Row>

      <Row className="mb-4 align-items-center gap-2">
        <Col md={6} lg={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
            placeholder="Buscar por nombre o apellidos..."
          />
        </Col>
        <Col md="auto">
          <div className="btn-group" role="group">
            <Button
              variant={vistaActual === "tarjeta" ? "primary" : "outline-primary"}
              onClick={() => setVistaActual("tarjeta")}
              title="Vista de tarjetas"
              className="d-none d-sm-inline-block"
            >
              <i className="bi bi-square-fill"></i>
              <span className="d-none d-md-inline ms-2">Tarjetas</span>
            </Button>
            <Button
              variant={vistaActual === "tabla" ? "primary" : "outline-primary"}
              onClick={() => setVistaActual("tabla")}
              title="Vista de tabla"
              className="d-none d-sm-inline-block"
            >
              <i className="bi bi-table"></i>
              <span className="d-none d-md-inline ms-2">Tabla</span>
            </Button>
          </div>
        </Col>
        <Col md="auto" className="ms-auto">
          <Button onClick={() => setMostrarModal(true)} size="md">
            <i className="bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-2">Nuevo Cliente</span>
          </Button>
        </Col>
      </Row>

      {!cargando && textoBusqueda.trim() && clientesFiltrados.length === 0 && (
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i>
              No se encontraron clientes que coincidan con "{textoBusqueda}".
            </Alert>
          </Col>
        </Row>
      )}

      {cargando && (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3 text-muted">Cargando clientes ...</p>
          </Col>
        </Row>
      )}

      {!cargando && clientes.length > 0 && (
        <>
          {vistaActual === "tarjeta" ? (
            <Row className="g-4">
              {clientesPaginados.map((cliente) => (
                <Col key={cliente.id_cliente} xs={12} sm={6} md={4} lg={3} xl={3}>
                  <TarjetaCliente
                    cliente={cliente}
                    abrirModalEdicion={abrirModalEdicion}
                    abrirModalEliminacion={abrirModalEliminacion}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Row>
              <Col>
                <TablaClientes
                  clientes={clientesPaginados}
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminacion}
                />
              </Col>
            </Row>
          )}
          <Row className="mt-4">
            <Col>
              <Paginacion
                registrosPorPagina={registrosPorPagina}
                totalRegistros={clientesFiltrados.length}
                paginaActual={paginaActual}
                establecerPaginaActual={establecerPaginaActual}
                establecerRegistrosPorPagina={establecerRegistrosPorPagina}
              />
            </Col>
          </Row>
        </>
      )}

      <ModalRegistroClientes
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoCliente={nuevoCliente}
        manejoCambioInput={manejoCambioInput}
        agregarCliente={agregarCliente}
      />

      <ModalEliminacionClientes
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarCliente={eliminarCliente}
        cliente={clienteAEliminar}
      />

      <ModalEdicionClientes
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        clienteEditar={clienteEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        actualizarCliente={actualizarCliente}
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

export default Clientes;
