import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import logo from '../../assets/logo.png';
import { supabase } from '../../database/supabaseconfig';

const Encabezado = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Para detectar la ruta actual

  const manejarToggle = () => setMostrarMenu(!mostrarMenu);

  const manejarNavegacion = (ruta) => {
    navigate(ruta);
    setMostrarMenu(false);
  };

  const cerrarSesion = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.removeItem('usuario-supabase');
      setMostrarMenu(false);
      navigate('/login');
    } catch (err) {
      console.error('Error cerrando sesión:', err.message);
    }
  };

  const esLogin = location.pathname === '/login';
  const esClientes = location.pathname === '/clientes' && localStorage.getItem('usuario-supabase') === null;

  let contenidoMenu;
  if (esLogin) {
    contenidoMenu = (
      <Nav className="ms-auto pe-2">
        <Nav.Link
          onClick={() => manejarNavegacion('/login')}
          className={mostrarMenu ? 'color-texto-marca' : 'text-black'}
        >
          <i className="bi-person-fill-lock me-2"></i> Iniciar sesión
        </Nav.Link>
      </Nav>
    );
  } else if (esClientes) {
    contenidoMenu = (
      <Nav className="ms-auto pe-2">
        <Nav.Link
          onClick={() => manejarNavegacion('/clientes')}
          className={mostrarMenu ? 'color-texto-marca' : 'text-black'}
        >
          <i className="bi-images me-2"></i> <strong>Clientes</strong>
        </Nav.Link>
      </Nav>
    );
  } else {
    contenidoMenu = (
      <Nav className="ms-auto pe-2">
        <Nav.Link
          onClick={() => manejarNavegacion('/')}
          className={mostrarMenu ? 'color-texto-marca' : 'text-black'}
        >
          {mostrarMenu ? <i className="bi-house-fill me-2"></i> : null} <strong>Clientes</strong>
        </Nav.Link>
        <Nav.Link
          onClick={() => manejarNavegacion('/empleados')}
          className={mostrarMenu ? 'color-texto-marca' : 'text-black'}
        >
          {mostrarMenu ? <i className="bi-bookmark-fill me-2"></i> : null} <strong>Empleados</strong>
        </Nav.Link>
        <Nav.Link
          onClick={() => manejarNavegacion('/productos')}
          className={mostrarMenu ? 'color-texto-marca' : 'text-black'}
        >
          {mostrarMenu ? <i className="bi-bag-heart-fill me-2"></i> : null} <strong>Productos</strong>
        </Nav.Link>
        <Nav.Link
          onClick={() => manejarNavegacion('/Ventas')}
          className={mostrarMenu ? 'color-texto-marca' : 'text-black'}
        >
          {mostrarMenu ? <i className="bi-images me-2"></i> : null} <strong>Ventas</strong>
        </Nav.Link>
      </Nav>
    );
  }

  return (
    <Navbar expand="md" fixed="top" className="color-navbar shadow-lg" variant="dark">
      <Container>
        <Navbar.Brand
          onClick={() => manejarNavegacion(esClientes ? '/clientes' : '/')}
          className="text-white fw-bold d-flex align-items-center"
          style={{ cursor: 'pointer' }}
        >
          <img
            alt=""
            src={logo}
            width="45"
            height="45"
            className="d-inline-block me-2"
          />
          <strong>
            <h4 className="mb-0">Discosa</h4>
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
            <Offcanvas.Title>Menú Discosa</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {contenidoMenu}
            {!esLogin && mostrarMenu && (
              <div className="mt-3 p-3 rounded bg-light text-dark">
                <p className="mb-2">
                  <i className="bi-envelope-fill me-2"></i>{' '}
                  {localStorage.getItem('usuario-supabase')?.toLowerCase() || 'Usuario'}
                </p>
                <button className="btn btn-outline-danger mt-3 w-100" onClick={cerrarSesion}>
                  <i className="bi-box-arrow-right me-2"></i> Cerrar sesión
                </button>
              </div>
            )}
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Encabezado;