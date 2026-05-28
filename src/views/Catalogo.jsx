import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  Form,
} from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import TarjetaCatalogo from "../components/catalogo/TarjetaCatalogo";
import ModalDetalleCatalogo from "../components/catalogo/ModalDetalleCatalogo";
import NotificacionOperacion from "../components/NotificacionOperacion";
import "bootstrap-icons/font/bootstrap-icons.css";

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [ordenamiento, setOrdenamiento] = useState("reciente");
  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "",
  });

  // Cargar productos disponibles
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("disponible", true)
        .gt("cantidad", 0)
        .order("id_producto", { ascending: false });

      if (error) throw error;
      setProductos(data || []);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setToast({
        mostrar: true,
        mensaje: "Error al cargar los productos",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  // Filtrar y ordenar productos
  const productosFiltradores = productos
    .filter((prod) => {
      if (!textoBusqueda.trim()) return true;
      const textoLower = textoBusqueda.toLowerCase();
      return (
        prod.nombre_p?.toLowerCase().includes(textoLower) ||
        prod.descripcion?.toLowerCase().includes(textoLower)
      );
    })
    .sort((a, b) => {
      if (ordenamiento === "reciente") return b.id_producto - a.id_producto;
      if (ordenamiento === "precioMenor") return a.precioventa - b.precioventa;
      if (ordenamiento === "precioMayor") return b.precioventa - a.precioventa;
      if (ordenamiento === "nombre")
        return a.nombre_p.localeCompare(b.nombre_p);
      return 0;
    });

  const abrirDetalles = (producto) => {
    setProductoSeleccionado(producto);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setProductoSeleccionado(null);
  };

  return (
    <Container
      style={{ marginTop: "2cm" }}
      className="catalogo-fondo-rayas-rojas"
    >
      {/* Notificación */}
      {toast.mostrar && (
        <NotificacionOperacion
          mostrar={toast.mostrar}
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          onCerrar={() => setToast({ ...toast, mostrar: false })}
        />
      )}

      {/* Encabezado */}
      <Row className="mb-4">
        <Col>
          <div className="header-catalogo">
            <h2>
              <i className="bi bi-shop me-3"></i>Catálogo de Productos
            </h2>
            <p className="text-muted">
              Explora nuestro catálogo de productos disponibles
            </p>
          </div>
        </Col>
      </Row>

      {/* Barra de búsqueda y filtros */}
      <Row className="mb-4 g-3">
        <Col md={6}>
          <div className="busqueda-input-wrapper">
            <i className="bi bi-search"></i>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={textoBusqueda}
              onChange={(e) => setTextoBusqueda(e.target.value)}
              className="busqueda-input"
            />
            {textoBusqueda && (
              <button
                className="btn-limpiar-busqueda"
                onClick={() => setTextoBusqueda("")}
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </Col>

        <Col md={3}>
          <Form.Select
            value={ordenamiento}
            onChange={(e) => setOrdenamiento(e.target.value)}
            className="filtro-ordenamiento"
          >
            <option value="reciente">Más reciente</option>
            <option value="precioMenor">Menor precio</option>
            <option value="precioMayor">Mayor precio</option>
            <option value="nombre">Nombre (A-Z)</option>
          </Form.Select>
        </Col>

        <Col md={3} className="text-end">
          <div className="contador-productos">
            <small className="text-muted">
              <i className="bi bi-box me-1"></i>
              {productosFiltradores.length} producto
              {productosFiltradores.length !== 1 ? "s" : ""}
            </small>
          </div>
        </Col>
      </Row>

      {/* Contenido Principal */}
      {cargando ? (
        <Row className="justify-content-center py-5">
          <Col xs="auto">
            <Spinner animation="border" variant="primary" />
            <p className="text-center mt-3 text-muted">Cargando productos...</p>
          </Col>
        </Row>
      ) : productosFiltradores.length === 0 ? (
        <Row className="justify-content-center py-5">
          <Col md={6} className="text-center">
            <Alert variant="info" className="alerta-sin-productos">
              <i className="bi bi-inbox me-2"></i>
              {textoBusqueda
                ? "No se encontraron productos con esa búsqueda"
                : "No hay productos disponibles en este momento"}
            </Alert>
          </Col>
        </Row>
      ) : (
        <Row className="g-4">
          {productosFiltradores.map((producto) => (
            <Col key={producto.id_producto} xs={12} sm={6} lg={4} xl={3}>
              <TarjetaCatalogo
                producto={producto}
                abrirDetalles={abrirDetalles}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Modal de Detalles */}
      <ModalDetalleCatalogo
        mostrar={mostrarModal}
        producto={productoSeleccionado}
        onCerrar={cerrarModal}
      />
    </Container>
  );
};

export default Catalogo;
