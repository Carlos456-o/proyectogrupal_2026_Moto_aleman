import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Alert, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalRegistroProducto from "../components/Producto/ModalRegistroProducto";
import TablaProducto from "../components/Producto/TablaProducto";
import TarjetaProducto from "../components/Producto/TarjetaProducto";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalEliminacionProducto from "../components/Producto/ModalEliminacionProducto";
import ModalEdicionProducto from "../components/Producto/ModalEdicionProducto";
import Paginacion from "../components/ordenamiento/Paginacion";
import Empleados from "./Empleados";

const Productos = () => {
  const actualizarProducto = async () => {
    try {
      // Verificar que los campos obligatorios estén completos
      if (
        !productoEditar.nombre_p.trim() ||
        productoEditar.preciocompra <= 0 ||
        productoEditar.precioventa <= 0
      ) {
        setToast({
          mostrar: true,
          mensaje: "Completa los campos obligatorios",
          tipo: "advertencia",
        });
        return;
      }

      // Cerrar el modal de edición
      setMostrarModalEdicion(false);

      // Preparar los datos actualizados
      let datosActualizados = {
        nombre_p: productoEditar.nombre_p,
        descripcion: productoEditar.descripcion || null,
        cantidad: parseInt(productoEditar.cantidad) || 0,
        disponible: productoEditar.disponible,
        preciocompra: parseFloat(productoEditar.preciocompra),
        precioventa: parseFloat(productoEditar.precioventa),
      };

      // Actualizar el producto en la base de datos
      const { error } = await supabase
        .from("productos")
        .update(datosActualizados)
        .eq("id_producto", productoEditar.id_producto);
      if (error) throw error;

      // Recargar la lista de productos
      await cargarProductos();

      // Limpiar el estado del producto editado
      setProductoEditar({
        id_producto: "",
        nombre_p: "",
        descripcion: "",
        cantidad: 0,
        disponible: true,
        preciocompra: 0,
        precioventa: 0,
      });

      // Mostrar un mensaje de éxito
      setToast({
        mostrar: true,
        mensaje: "Producto actualizado correctamente",
        tipo: "exito",
      });
    } catch (err) {
      console.error("Error al actualizar:", err);
      setToast({
        mostrar: true,
        mensaje: "Error al actualizar producto",
        tipo: "error",
      });
    }
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value, type, checked } = e.target;
    setProductoEditar((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const manejarCambioBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_p: "",
    descripcion: "",
    cantidad: 0,
    disponible: true,
    preciocompra: 0,
    precioventa: 0,
  });

  const [productoEditar, setProductoEditar] = useState({
    id_producto: "",
    nombre_p: "",
    descripcion: "",
    cantidad: 0,
    disponible: true,
    preciocompra: 0,
    precioventa: 0,
  });

  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "",
  });

  const [registrosPorPagina, setRegistrosPorPagina] = useState(5);
  const [paginaActual, setPaginaActual] = useState(1);

  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina,
  );

  const manejoCambioInput = (e) => {
    const { name, value, type, checked } = e.target;
    setNuevoProducto((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setProductosFiltrados(productos);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();
      const filtrados = productos.filter((prod) => {
        const nombre = prod.nombre_p?.toLowerCase() || "";
        const descripcion = prod.descripcion?.toLowerCase() || "";
        const precio = prod.precioventa?.toString() || "";
        return (
          nombre.includes(textoLower) ||
          descripcion.includes(textoLower) ||
          precio.includes(textoLower)
        );
      });
      setProductosFiltrados(filtrados);
    }
  }, [textoBusqueda, productos]);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("id_producto", { ascending: true });
      if (error) throw error;
      console.log("Productos cargados:", data);
      setProductos(data || []);
      setProductosFiltrados(data || []);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setToast({
        mostrar: true,
        mensaje: "Error al cargar productos",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  const abrirModalEdicion = (producto) => {
    setProductoEditar({
      id_producto: producto.id_producto,
      nombre_p: producto.nombre_p,
      descripcion: producto.descripcion,
      cantidad: producto.cantidad,
      disponible: producto.disponible,
      preciocompra: producto.preciocompra,
      precioventa: producto.precioventa,
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (producto) => {
    setProductoAEliminar(producto);
    setMostrarModalEliminacion(true);
  };

  const eliminarProducto = async () => {
    if (!productoAEliminar) return;
    try {
      setMostrarModalEliminacion(false);
      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id_producto", productoAEliminar.id_producto);
      if (error) throw error;
      await cargarProductos();
      setToast({
        mostrar: true,
        mensaje: `Producto ${productoAEliminar.nombre_p} eliminado correctamente`,
        tipo: "exito",
      });
      setProductoAEliminar(null);
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      setToast({
        mostrar: true,
        mensaje: "Error al eliminar producto",
        tipo: "error",
      });
    }
  };

  const agregarProducto = async () => {
    try {
      if (
        !nuevoProducto.nombre_p.trim() ||
        nuevoProducto.preciocompra <= 0 ||
        nuevoProducto.precioventa <= 0
      ) {
        setToast({
          mostrar: true,
          mensaje: "Completa los campos obligatorios (nombre, precios)",
          tipo: "advertencia",
        });
        return;
      }

      setMostrarModal(false);

      const { error } = await supabase.from("productos").insert([
        {
          nombre_p: nuevoProducto.nombre_p,
          descripcion: nuevoProducto.descripcion || null,
          cantidad: parseInt(nuevoProducto.cantidad) || 0,
          disponible: nuevoProducto.disponible,
          preciocompra: parseFloat(nuevoProducto.preciocompra),
          precioventa: parseFloat(nuevoProducto.precioventa),
        },
      ]);
      if (error) throw error;

      await cargarProductos();

      setNuevoProducto({
        nombre_p: "",
        descripcion: "",
        cantidad: 0,
        disponible: true,
        preciocompra: 0,
        precioventa: 0,
      });

      setToast({
        mostrar: true,
        mensaje: "Producto registrado correctamente",
        tipo: "exito",
      });
    } catch (err) {
      console.error("Error al agregar producto:", err);
      setToast({
        mostrar: true,
        mensaje: "Error al registrar producto",
        tipo: "error",
      });
    }
  };

  return (
    <Container style={{ marginTop: "2cm" }}>
      <Row className="mb-3">
        <Col>
          <h3 className="mb-0">
            <i className="bi bi-gear-wide-connected me-2 text-primary"></i>{" "}
            Catálogo de Repuestos
          </h3>
        </Col>
      </Row>
      <Row className="mb-4 align-items-center">
        <Col md={6} lg={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
            placeholder="Buscar repuestos, piezas, accesorios..."
          />
        </Col>
        <Col md={6} lg={7} className="text-end">
          <Button onClick={() => setMostrarModal(true)} size="md">
            <i className="bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-2">Agregar Repuesto</span>
          </Button>
        </Col>
      </Row>

      {!cargando && productosFiltrados.length > 0 && (
        <>
          <Row className="g-4">
            {productosPaginados.map((producto) => (
              <Col
                key={producto.id_producto}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
              >
                <TarjetaProducto
                  producto={producto}
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminacion}
                />
              </Col>
            ))}
          </Row>
          <Row className="mt-4">
            <Col>
              <Paginacion
                registrosPorPagina={registrosPorPagina}
                totalRegistros={productosFiltrados.length}
                paginaActual={paginaActual}
                establecerPaginaActual={setPaginaActual}
                establecerRegistrosPorPagina={setRegistrosPorPagina}
              />
            </Col>
          </Row>
        </>
      )}

      {!cargando && textoBusqueda.trim() && productosFiltrados.length === 0 && (
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i>
              No se encontraron productos que coincidan con "{textoBusqueda}".
            </Alert>
          </Col>
        </Row>
      )}

      {!cargando && productos.length === 0 && !textoBusqueda.trim() && (
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i>
              No hay repuestos registrados. Agrega un nuevo repuesto para
              comenzar tu catálogo.
            </Alert>
          </Col>
        </Row>
      )}

      {cargando && (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3 text-muted">
              Cargando catálogo de repuestos ...
            </p>
          </Col>
        </Row>
      )}

      <ModalRegistroProducto
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={nuevoProducto}
        manejoCambioInput={manejoCambioInput}
        agregarProducto={agregarProducto}
      />

      <ModalEdicionProducto
        mostrarModal={mostrarModalEdicion}
        setMostrarModal={setMostrarModalEdicion}
        productoEditar={productoEditar}
        manejoCambioInput={manejoCambioInputEdicion}
        actualizarProducto={actualizarProducto}
      />

      <ModalEliminacionProducto
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarProducto={eliminarProducto}
        producto={productoAEliminar}
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

export default Productos;
