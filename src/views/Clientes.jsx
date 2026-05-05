import { supabase } from "../database/supabaseconfig";
import ModalRegistroClientes from "../components/Clientes/ModalRegistroClientes";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import NotificacionOperacion from "../components/NotificacionOperacion";
import TarjetasClientes from "../components/Clientes/TarjetasClientes";
import ModalEdicionClientes from "../components/Clientes/ModalEdicionClientes";
import ModalEliminacionClientes from "../components/Clientes/ModalEliminacionClientes";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import { Alert } from "react-bootstrap";
import Paginacion from "../components/ordenamiento/Paginacion";

const Clientes = () => {
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
    paginaActual * registrosPorPagina
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
      const filtradas = clientes.filter((cli) =>
        cli.nombre1.toLowerCase().includes(textoLower) ||
        (cli.apellidos1 && cli.apellidos1.toLowerCase().includes(textoLower))
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

      setNuevoCliente({ nombre1: "", nombre2: "", apellidos1: "", apellidos2: "", cedula: "" });
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
    <Container className="mt-3">
      <Row className="align-items-center mb-3">
        <Col xs={9} sm={7} md={7} lg={7} className="d-flex align-items-center">
          <h3 className="mb-0">
            <i className="bi-person-fill me-2"></i> Clientes
          </h3>
        </Col>
        <Col xs={3} sm={5} md={5} lg={5} className="text-end">
          <Button onClick={() => setMostrarModal(true)} size="md">
            <i className="bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-2">Nuevo Cliente</span>
          </Button>
        </Col>
      </Row>

      <hr />

      <Row className="mb-4">
        <Col md={6} lg={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
            placeholder="Buscar por nombre o apellidos..."
          />
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
        <Row>
          <Col lg={12}>
            <TarjetasClientes
              clientes={clientesPaginados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
        </Row>
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

      {clientesFiltrados.length > 0 && (
        <Paginacion
          registrosPorPagina={registrosPorPagina}
          totalRegistros={clientesFiltrados.length}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          establecerRegistrosPorPagina={establecerRegistrosPorPagina}
        />
      )}

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