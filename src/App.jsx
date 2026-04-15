import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Encabezado from "./components/navegacion/Encabezado";

import Inicio from "./views/Inicio";
import Login from "./views/Login";
import Productos from "./views/Productos";
import Empleados from "./views/Empleados";
import RutaProtegida from "./components/rutas/RutaProtegida";

import Pagina404 from "./views/Pagina404";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Encabezado />
      <main className="margen-superior-main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RutaProtegida><Inicio /></RutaProtegida>} />
          <Route path="/empleados" element={<RutaProtegida><Empleados /></RutaProtegida>} />
          <Route path="/productos" element={<RutaProtegida><Productos /></RutaProtegida>} />
          <Route path="*" element={<Pagina404 />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;

