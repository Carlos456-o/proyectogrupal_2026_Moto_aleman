import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Encabezado from "./components/navegacion/Encabezado";

import inicio from "./views/Inicio";
import login from "./views/Login";
import busquedas from "./views/Busquedas";
import categorias from "./views/Categorias";
import productos from "./views/Productos";
import RutaProtegida from "./components/RutaProtegida";
import Catalogo from "./views/Catalogo";
import Pagina404 from "./views/Pagina484";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Encabezado />
      <main className="margen-superior-main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RutaProtegida><Inicio /></RutaProtegida>} />
          <Route path="/categorias" element={<RutaProtegida><Categorias /></RutaProtegida>} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/productos" element={<RutaProtegida><Productos /></RutaProtegida>} />
          <Route path="*" element={<Pagina404 />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;

