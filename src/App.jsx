import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Encabezado from "./components/navegacion/Encabezado";

import Inicio from "./views/Inicio";
import Login from "./views/Login";
import Registro from "./views/Registro";
import Productos from "./views/Productos";
import Empleados from "./views/Empleados";
import Clientes from "./views/Clientes";
import Catalogo from "./views/Catalogo";
import Ventas from "./views/Ventas";
import Dashboard from "./components/Dashboard";
import RutaProtegida from "./components/rutas/RutaProtegida";


import Pagina404 from "./views/Pagina404";
import "./App.css";

const AppContent = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const whiteBgRoutes = [
    "/clientes",
    "/empleados",
    "/ventas",
    "/productos",
    "/catalogo",
    "/dashboard",
  ];
  const isWhitePage = whiteBgRoutes.includes(location.pathname.toLowerCase());

  useEffect(() => {
    if (isWhitePage) {
      document.body.classList.add("white-page");
    } else {
      document.body.classList.remove("white-page");
    }
  }, [isWhitePage]);

  return (
    <>
      <Encabezado />
      <main className={`margen-superior-main${isHome ? " home-page" : ""}${isWhitePage ? " white-page" : ""}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route
            path="/"
            element={
              <RutaProtegida>
                <Inicio />
              </RutaProtegida>
            }
          />
          <Route
            path="/empleados"
            element={
              <RutaProtegida>
                <Empleados />
              </RutaProtegida>
            }
          />
          <Route
            path="/clientes"
            element={
              <RutaProtegida>
                <Clientes />
              </RutaProtegida>
            }
          />
          <Route
            path="/productos"
            element={
              <RutaProtegida>
                <Productos />
              </RutaProtegida>
            }
          />
          <Route
            path="/Ventas"
            element={
              <RutaProtegida>
                <Ventas />
              </RutaProtegida>
            }
          />
          <Route
            path="/Dashboard"
            element={
              <RutaProtegida>
                <Dashboard />
              </RutaProtegida>
            }
          />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="*" element={<Pagina404 />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
