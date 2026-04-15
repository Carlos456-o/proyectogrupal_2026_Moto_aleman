
import { supabase } from "../database/supabaseconfig";
import ModalRegistroEmpleados from "../components/Empleados/ModalRegistroEmpleados";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import NotificacionOperacion from "../components/NotificacionOperacion";
import TablaEmpleados from "../components/Empleados/TablaEmpleados";




const Empleados = () => {

  useEffect(() => {
    cargarEmpleados();
  }, []);

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



  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [mostrarModal, setMostrarModal] = useState(false);

  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    apellido: "",
    cargo: "",
  });

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
    <Container className="mt-3">
      {/* Título y botón Nueva Categoría */}
      <Row className="align-items-center mb-3">
        <Col xs={9} sm={7} md={7} lg={7} className="d-flex align-items-center">
          <h3 className="mb-0">
            <i className="bi-bookmark-plus-fill me-2"></i> Empleados
          </h3>
        </Col>
        <Col xs={3} sm={5} md={5} lg={5} className="text-end">
          <Button onClick={() => setMostrarModal(true)} size="md">
            <i className="bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-2">Nuevo Empleado</span>
          </Button>
        </Col>
      </Row>
      <hr />
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
  <Row>
    <Col lg={12} className="d-none d-lg-block">
      <TablaEmpleados
        empleados={empleados}
        abrirModalEdicion={abrirModalEdicion}
        abrirModalEliminacion={abrirModalEliminación}
      />
    </Col>
  </Row>
)}

      {/* Modal de Registro */}
      <ModalRegistroEmpleados
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoEmpleado={nuevoEmpleado}
        manejoCambioInput={manejoCambioInput}
        agregarEmpleado={agregarEmpleado}
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
