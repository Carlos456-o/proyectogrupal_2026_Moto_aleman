import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Alert, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalRegistroProducto from "../components/Producto/ModalRegistroProducto";
import TablaProducto from "../components/Producto/TablaProducto";
import TarjetaProducto from "../components/Producto/TarjetaProducto";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import FiltroProductos from "../components/busquedas/FiltroProductos";
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

      // Si hay un nuevo archivo, subirlo y obtener la URL
      if (productoEditar.archivo) {
        const nombreArchivo = `${Date.now()}_${productoEditar.archivo.name}`;
        const { error: uploadError } = await supabase.storage
          .from("imagenes_productos")
          .upload(nombreArchivo, productoEditar.archivo);
        if (uploadError) throw uploadError;

        const { data: urlData } = await supabase.storage
          .from("imagenes_productos")
          .getPublicUrl(nombreArchivo);
        datosActualizados.url_imagen = urlData.publicUrl;
      }

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
        url_imagen: "",
        archivo: null,
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

  const [filtros, setFiltros] = useState({
    disponibles: true,
    noDisponibles: true,
    enStock: true,
    agotado: true,
    precioMinimo: "",
    precioMaximo: "",
  });

  const manejarCambioBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  const manejarCambioFiltro = (e) => {
    const { name, value, type, checked } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      disponibles: true,
      noDisponibles: true,
      enStock: true,
      agotado: true,
      precioMinimo: "",
      precioMaximo: "",
    });
  };

  useEffect(() => {
    // Aplicar filtros de búsqueda y filtros avanzados
    let productosFiltrados = productos;

    // Filtro de texto de búsqueda
    if (textoBusqueda.trim()) {
      const textoLower = textoBusqueda.toLowerCase().trim();
      productosFiltrados = productosFiltrados.filter((prod) => {
        const nombre = prod.nombre_p?.toLowerCase() || "";
        const descripcion = prod.descripcion?.toLowerCase() || "";
        const precio = prod.precioventa?.toString() || "";
        return (
          nombre.includes(textoLower) ||
          descripcion.includes(textoLower) ||
          precio.includes(textoLower)
        );
      });
    }

    // Filtro de disponibilidad
    if (!filtros.disponibles || !filtros.noDisponibles) {
      productosFiltrados = productosFiltrados.filter((prod) => {
        if (filtros.disponibles && !filtros.noDisponibles) {
          return prod.disponible;
        }
        if (!filtros.disponibles && filtros.noDisponibles) {
          return !prod.disponible;
        }
        return true;
      });
    }

    // Filtro de stock
    if (!filtros.enStock || !filtros.agotado) {
      productosFiltrados = productosFiltrados.filter((prod) => {
        if (filtros.enStock && !filtros.agotado) {
          return prod.cantidad > 0;
        }
        if (!filtros.enStock && filtros.agotado) {
          return prod.cantidad === 0;
        }
        return true;
      });
    }

    // Filtro de rango de precio
    if (filtros.precioMinimo || filtros.precioMaximo) {
      productosFiltrados = productosFiltrados.filter((prod) => {
        const precio = prod.precioventa || 0;
        const minPrice = filtros.precioMinimo
          ? parseFloat(filtros.precioMinimo)
          : 0;
        const maxPrice = filtros.precioMaximo
          ? parseFloat(filtros.precioMaximo)
          : Infinity;
        return precio >= minPrice && precio <= maxPrice;
      });
    }

    setProductosFiltrados(productosFiltrados);
    setPaginaActual(1); // Reiniciar a primera página
  }, [textoBusqueda, filtros, productos]);

  const [vistaActual, setVistaActual] = useState("tarjeta"); // "tarjeta" o "tabla"
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
    archivo: null,
  });

  const [productoEditar, setProductoEditar] = useState({
    id_producto: "",
    nombre_p: "",
    descripcion: "",
    cantidad: 0,
    disponible: true,
    preciocompra: 0,
    precioventa: 0,
    url_imagen: "",
    archivo: null,
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

  const manejoCambioArchivo = (e) => {
    const archivo = e.target.files[0];
    setNuevoProducto((prev) => ({
      ...prev,
      archivo: archivo,
    }));
  };

  const manejoCambioArchivoEdicion = (e) => {
    const archivo = e.target.files[0];
    setProductoEditar((prev) => ({
      ...prev,
      archivo: archivo,
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
      url_imagen: producto.url_imagen || "",
      archivo: null,
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
        nuevoProducto.precioventa <= 0 ||
        !nuevoProducto.archivo
      ) {
        setToast({
          mostrar: true,
          mensaje:
            "Completa los campos obligatorios (nombre, precios e imagen)",
          tipo: "advertencia",
        });
        return;
      }

      setMostrarModal(false);

      const nombreArchivo = `${Date.now()}_${nuevoProducto.archivo.name}`;
      const { error: uploadError } = await supabase.storage
        .from("imagenes_productos")
        .upload(nombreArchivo, nuevoProducto.archivo);
      if (uploadError) throw uploadError;

      const { data: urlData } = await supabase.storage
        .from("imagenes_productos")
        .getPublicUrl(nombreArchivo);
      const urlPublica = urlData.publicUrl;

      const { error } = await supabase.from("productos").insert([
        {
          nombre_p: nuevoProducto.nombre_p,
          descripcion: nuevoProducto.descripcion || null,
          cantidad: parseInt(nuevoProducto.cantidad) || 0,
          disponible: nuevoProducto.disponible,
          preciocompra: parseFloat(nuevoProducto.preciocompra),
          precioventa: parseFloat(nuevoProducto.precioventa),
          url_imagen: urlPublica,
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
        archivo: null,
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
            Repuestos
          </h3>
        </Col>
      </Row>
      <Row className="mb-4 align-items-center gap-2">
        <Col md={6} lg={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
            placeholder="Buscar repuestos, piezas, accesorios..."
          />
        </Col>
        <Col md="auto">
          <FiltroProductos
            filtros={filtros}
            manejarCambioFiltro={manejarCambioFiltro}
            limpiarFiltros={limpiarFiltros}
            precioMin={
              productos.length > 0
                ? Math.min(...productos.map((p) => p.precioventa || 0))
                : null
            }
            precioMax={
              productos.length > 0
                ? Math.max(...productos.map((p) => p.precioventa || 0))
                : null
            }
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
            <span className="d-none d-sm-inline ms-2">Agregar Repuesto</span>
          </Button>
        </Col>
      </Row>

      {!cargando && productosFiltrados.length > 0 && (
        <>
          {vistaActual === "tarjeta" ? (
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
          ) : (
            <Row>
              <Col>
                <TablaProducto
                  productos={productosPaginados}
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
        manejoCambioArchivo={manejoCambioArchivo}
        agregarProducto={agregarProducto}
      />

      <ModalEdicionProducto
        mostrarModal={mostrarModalEdicion}
        setMostrarModal={setMostrarModalEdicion}
        productoEditar={productoEditar}
        manejoCambioInput={manejoCambioInputEdicion}
        manejoCambioArchivo={manejoCambioArchivoEdicion}
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
