import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import FichaPlanta from './pages/FichaPlanta';
import Sobre from './pages/Sobre';
import EmBreve from './pages/EmBreve';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalogo" element={<Catalogo />} />
          <Route path="catalogo/planta/:id" element={<FichaPlanta />} />
          <Route
            path="minhas-plantas"
            element={<EmBreve titulo="Minhas Plantas" />}
          />
          <Route
            path="minhas-plantas/nova"
            element={<EmBreve titulo="Cadastro de planta" />}
          />
          <Route
            path="minhas-plantas/:id"
            element={<EmBreve titulo="Detalhes da planta" />}
          />
          <Route
            path="minhas-plantas/:id/editar"
            element={<EmBreve titulo="Edição de planta" />}
          />
          <Route path="sobre" element={<Sobre />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
