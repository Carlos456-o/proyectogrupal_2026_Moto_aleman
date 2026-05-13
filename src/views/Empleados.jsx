import { supabase } from "../database/supabaseconfig";
import ModalRegistroEmpleados from "../components/Empleados/ModalRegistroEmpleados";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import NotificacionOperacion from "../components/NotificacionOperacion";
import TarjetaEmpleado from "../components/Empleados/TarjetaEmpleado";
import ModalEdicionEmpleado from "../components/Empleados/ModalEdicionEmpleados";
import ModalEliminacionEmpleado from "../components/Empleados/ModalEliminacionEmpleados";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import { Alert } from "react-bootstrap";
import Paginacion from "../components/ordenamiento/Paginacion";

const Empleados = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [mostrarModal, setMostrarModal] = useState(false);

  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    apellido: "",
    cargo: "",
  });

  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true); // Estado de carga inicial
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [empleadoEditar, setEmpleadoEditar] = useState({
    id_empleado: "",
    nombre: "",
    apellido: "",
    cargo: "",
  });

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [empleadosFiltrados, setEmpleadosFiltrados] = useState([]);

  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);

  const empleadosPaginados = empleadosFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina,
  );

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setEmpleadosFiltrados(empleados);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();
      const filtradas = empleados.filter(
        (emp) =>
          emp.nombre_empleado.toLowerCase().includes(textoLower) ||
          (emp.descripcion_empleado &&
            emp.descripcion_empleado.toLowerCase().includes(textoLower)),
      );
      setEmpleadosFiltrados(filtradas);
    }
  }, [textoBusqueda, empleados]);

  const eliminarEmpleado = async () => {
    if (!empleadoAEliminar) return;
    try {
      // Ocultar el modal de eliminación
      setMostrarModalEliminacion(false);

      // Eliminar la categoría de la base de datos usando Supabase
      const { error } = await supabase
        .from("empleados")
        .delete()
        .eq("id_empleado", empleadoAEliminar.id_empleado);

      // Manejar errores en la eliminación
      if (error) {
        console.error("Error al eliminar empleado:", error.message);
        setToast({
          mostrar: true,
          mensaje: `Error al eliminar el empleado ${empleadoAEliminar.nombre}.`,
          tipo: "error",
        });
        return;
      }

      // Cargar los empleados actualizados
      await cargarEmpleados();

      // Mostrar un mensaje de éxito
      setToast({
        mostrar: true,
        mensaje: `Empleado ${empleadoAEliminar.nombre} eliminado exitosamente.`,
        tipo: "exito",
      });
    } catch (err) {
      // Manejar errores inesperados
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al eliminar empleado.",
        tipo: "error",
      });
      console.error("Excepción al eliminar empleado:", err.message);
    }
  };

  const actualizarEmpleado = async () => {
    try {
      // Verificar que los campos de nombre y descripción no estén vacíos
      if (
        !empleadoEditar.nombre.trim() ||
        !empleadoEditar.apellido.trim() ||
        !empleadoEditar.cargo.trim()
      ) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar todos los campos.",
          tipo: "advertencia",
        });
        return;
      }

      // Ocultar el modal de edición
      setMostrarModalEdicion(false);

      // Actualizar el empleado en la base de datos usando Supabase
      const { error } = await supabase
        .from("empleados")
        .update({
          nombre: empleadoEditar.nombre,
          apellido: empleadoEditar.apellido,
          cargo: empleadoEditar.cargo,
        })
        .eq("id_empleado", empleadoEditar.id_empleado);

      // Manejar errores en la actualización
      if (error) {
        console.error("Error al actualizar empleado:", error.message);
        setToast({
          mostrar: true,
          mensaje: `Error al actualizar el empleado ${empleadoEditar.nombre}.`,
          tipo: "error",
        });
        return;
      }

      // Cargar los empleados actualizados
      await cargarEmpleados();

      // Mostrar un mensaje de éxito
      setToast({
        mostrar: true,
        mensaje: `Empleado ${empleadoEditar.nombre} actualizado exitosamente.`,
        tipo: "exito",
      });
    } catch (err) {
      // Manejar errores inesperados
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al actualizar empleado.",
        tipo: "error",
      });
      console.error("Excepción al actualizar empleado:", err.message);
    }
  };

  const abrirModalEdicion = (empleado) => {
    setEmpleadoEditar({
      id_empleado: empleado.id_empleado,
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      cargo: empleado.cargo,
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminación = (empleado) => {
    setEmpleadoAEliminar(empleado);
    setMostrarModalEliminacion(true);
  };
  const cargarEmpleados = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("empleados")
        .select("*")
        .order("id_empleado", { ascending: true });

      if (error) {
        console.error("Error al cargar empleados:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al cargar empleados.",
          tipo: "error",
        });
        return;
      }

      setEmpleados(data || []);
    } catch (err) {
      console.error("Excepción al cargar empleados:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al cargar empleados.",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setEmpleadoEditar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoEmpleado((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const agregarEmpleado = async () => {
    await cargarEmpleados();
    try {
      if (
        !nuevoEmpleado.nombre.trim() ||
        !nuevoEmpleado.apellido.trim() ||
        !nuevoEmpleado.cargo.trim()
      ) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar todos los campos.",
          tipo: "advertencia",
        });
        return;
      }

      const { error } = await supabase.from("empleados").insert([
        {
          nombre: nuevoEmpleado.nombre,
          apellido: nuevoEmpleado.apellido,
          cargo: nuevoEmpleado.cargo,
        },
      ]);

      if (error) {
        console.error("Error al agregar Empleado:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al registrar empleado.",
          tipo: "error",
        });
        return;
      }

      // Éxito
      setToast({
        mostrar: true,
        mensaje: `Empleado "${nuevoEmpleado.nombre}" registrado exitosamente.`,
        tipo: "exito",
      });

      cargarEmpleados();

      // Limpiar formulario y cerrar modal
      setNuevoEmpleado({ nombre: "", apellido: "", cargo: "" });
      setMostrarModal(false);
    } catch (err) {
      console.error("Excepción al agregar empleado:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al registrar empleado.",
        tipo: "error",
      });
    }
  };

  return (
    <Container style={{ marginTop: "2cm" }}>
      <Row className="mb-3">
        <Col>
          <h3 className="mb-0">
            <i className="bi-bookmark-plus-fill me-2 text-primary"></i>{" "}
            Empleados
          </h3>
        </Col>
      </Row>

      {/* Cuadro de búsqueda debajo de la línea divisoria */}
      <Row className="mb-4 align-items-center">
        <Col md={6} lg={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
            placeholder="Buscar por nombre o descripción..."
          />
        </Col>
        <Col md={6} lg={7} className="text-end">
          <Button onClick={() => setMostrarModal(true)} size="md">
            <i className="bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-2">Nuevo Empleado</span>
          </Button>
        </Col>
      </Row>

      {/* Mensaje de no coincidencias solo cuando hay búsqueda y no hay resultados */}
      {!cargando && textoBusqueda.trim() && empleadosFiltrados.length === 0 && (
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i>
              No se encontraron empleados que coincidan con "{textoBusqueda}".
            </Alert>
          </Col>
        </Row>
      )}

      {/* Spinner mientras se cargan los empleados */}
      {cargando && (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3 text-muted">Cargando empleados ...</p>
          </Col>
        </Row>
      )}

      {/* Lista de empleados cargados */}
      {!cargando && empleados.length > 0 && (
        <>
          <Row className="g-4">
            {empleadosPaginados.map((empleado) => (
              <Col
                key={empleado.id_empleado}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
              >
                <TarjetaEmpleado
                  empleado={empleado}
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminación}
                />
              </Col>
            ))}
          </Row>
          <Row className="mt-4">
            <Col>
              <Paginacion
                registrosPorPagina={registrosPorPagina}
                totalRegistros={empleadosFiltrados.length}
                paginaActual={paginaActual}
                establecerPaginaActual={establecerPaginaActual}
                establecerRegistrosPorPagina={establecerRegistrosPorPagina}
              />
            </Col>
          </Row>
        </>
      )}

      {/* Modal de Registro */}
      <ModalRegistroEmpleados
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoEmpleado={nuevoEmpleado}
        manejoCambioInput={manejoCambioInput}
        agregarEmpleado={agregarEmpleado}
      />

      <ModalEliminacionEmpleado
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarEmpleado={eliminarEmpleado}
        empleado={empleadoAEliminar}
      />

      <ModalEdicionEmpleado
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        empleadoEditar={empleadoEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        actualizarEmpleado={actualizarEmpleado}
      />

      {/* Notificación */}
      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />
    </Container>
  );
};

export default Empleados;
