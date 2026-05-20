import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Nav,
  Navbar,
  Offcanvas,
  Modal,
  Button,
} from "react-bootstrap";
import logo from "../../assets/logo.png";
import { supabase } from "../../database/supabaseconfig";

const Encabezado = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Para detectar la ruta actual

  const manejarToggle = () => setMostrarMenu(!mostrarMenu);

  const manejarNavegacion = (ruta) => {
    navigate(ruta);
    setMostrarMenu(false);
  };

  const abrirConfirmacion = () => {
    setMostrarConfirmacion(true);
  };

  const cerrarConfirmacion = () => {
    setMostrarConfirmacion(false);
  };

  const confirmarCerrarSesion = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.removeItem("usuario-supabase");
      setMostrarMenu(false);
      setMostrarConfirmacion(false);
      navigate("/login");
    } catch (err) {
      console.error("Error cerrando sesión:", err.message);
    }
  };

  const esLogin = location.pathname === "/login";
  const esClientes =
    location.pathname === "/clientes" &&
    localStorage.getItem("usuario-supabase") === null;

  let contenidoMenu;
  if (esLogin) {
    contenidoMenu = (
      <Nav className="ms-auto pe-2">
        <Nav.Link
          onClick={() => manejarNavegacion("/login")}
          className={mostrarMenu ? "color-texto-marca" : "text-black"}
        >
          <i className="bi-person-fill-lock me-2"></i> Iniciar sesión
        </Nav.Link>
      </Nav>
    );
  } else if (esClientes) {
    contenidoMenu = (
      <Nav className="ms-auto pe-2">
        <Nav.Link
          onClick={() => manejarNavegacion("/clientes")}
          className={mostrarMenu ? "color-texto-marca" : "text-black"}
        >
          <i className="bi-images me-2"></i> <strong>Clientes</strong>
        </Nav.Link>
      </Nav>
    );
  } else {
    contenidoMenu = (
      <Nav className="ms-auto pe-2">
        <Nav.Link
          onClick={() => manejarNavegacion("/clientes")}
          className={mostrarMenu ? "color-texto-marca" : "text-black"}
        >
          {mostrarMenu ? <i className="bi-person-fill me-2"></i> : null}{" "}
          <strong>Clientes</strong>
        </Nav.Link>
        <Nav.Link
          onClick={() => manejarNavegacion("/empleados")}
          className={mostrarMenu ? "color-texto-marca" : "text-black"}
        >
          {mostrarMenu ? <i className="bi-bookmark-fill me-2"></i> : null}{" "}
          <strong>Empleados</strong>
        </Nav.Link>
        <Nav.Link
          onClick={() => manejarNavegacion("/productos")}
          className={mostrarMenu ? "color-texto-marca" : "text-black"}
        >
          {mostrarMenu ? <i className="bi-bag-heart-fill me-2"></i> : null}{" "}
          <strong>Productos</strong>
        </Nav.Link>
        <Nav.Link
          onClick={() => manejarNavegacion("/catalogo")}
          className={mostrarMenu ? "color-texto-marca" : "text-black"}
        >
          {mostrarMenu ? <i className="bi-shop me-2"></i> : null}{" "}
          <strong>Catálogo</strong>
        </Nav.Link>
        <Nav.Link
          onClick={() => manejarNavegacion("/Ventas")}
          className={mostrarMenu ? "color-texto-marca" : "text-black"}
        >
          {mostrarMenu ? <i className="bi-images me-2"></i> : null}{" "}
          <strong>Ventas</strong>
        </Nav.Link>
      </Nav>
    );
  }

  return (
    <Navbar
      expand="md"
      fixed="top"
      className="color-navbar shadow-lg"
      variant="dark"
    >
      <Container>
        <Navbar.Brand
          onClick={() => manejarNavegacion(esClientes ? "/clientes" : "/")}
          className="text-black fw-bold d-flex align-items-center"
          style={{ cursor: "pointer" }}
        >
          <img
            alt=""
            src={logo}
            width="45"
            height="45"
            className="d-inline-block me-2"
          />
          <strong>
            <h4 className="mb-0">RevPartsPro</h4>
          </strong>
        </Navbar.Brand>

        {!esLogin && (
          <Navbar.Toggle
            aria-controls="menu-offcanvas"
            onClick={manejarToggle}
          />
        )}

        <Navbar.Offcanvas
          id="menu-offcanvas"
          placement="end"
          show={mostrarMenu}
          onHide={() => setMostrarMenu(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menú RevPartsPro</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {contenidoMenu}
            {!esLogin && mostrarMenu && (
              
              <div className="mt-3 p-3 rounded bg-light text-dark">
                <p className="mb-2">
                  <i className="bi-envelope-fill me-2"></i>{" "}
                  {localStorage.getItem("usuario-supabase")?.toLowerCase() ||
                    "Usuario"}
                </p>
                <button
                  className="btn btn-outline-danger mt-3 w-100"
                  onClick={abrirConfirmacion}
                >
                  <i className="bi-box-arrow-right me-2"></i> Cerrar sesión
                </button>
              </div>
            )}
          </Offcanvas.Body>
        </Navbar.Offcanvas>

        {!esLogin && (
          <Nav className="d-none d-md-flex align-items-center ms-2">
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={abrirConfirmacion}
              title="Cerrar sesión"
            >
              <i className="bi-box-arrow-right me-2"></i>
              <span>Cerrar sesión</span>
            </button>
          </Nav>
        )}

        <Modal show={mostrarConfirmacion} onHide={cerrarConfirmacion} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="bi-question-circle me-2 text-warning"></i>
              Confirmar cierre de sesión
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Estás seguro de que deseas cerrar sesión? Tendrás que iniciar
            sesión nuevamente para acceder a la aplicación.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cerrarConfirmacion}>
              <i className="bi-x-circle me-2"></i>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmarCerrarSesion}>
              <i className="bi-box-arrow-right me-2"></i>
              Sí, cerrar sesión
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Navbar>
  );
};

export default Encabezado;
