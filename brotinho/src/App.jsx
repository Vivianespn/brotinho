import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PlantsProvider } from './context/PlantsContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import FichaPlanta from './pages/FichaPlanta';
import MinhasPlantas from './pages/MinhasPlantas';
import NovaPlanta from './pages/NovaPlanta';
import MinhaPlantaDetalhes from './pages/MinhaPlantaDetalhes';
import EditarPlanta from './pages/EditarPlanta';
import Sobre from './pages/Sobre';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <PlantsProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="catalogo" element={<Catalogo />} />
            <Route path="catalogo/planta/:id" element={<FichaPlanta />} />
            <Route path="minhas-plantas" element={<MinhasPlantas />} />
            <Route path="minhas-plantas/nova" element={<NovaPlanta />} />
            <Route
              path="minhas-plantas/:id"
              element={<MinhaPlantaDetalhes />}
            />
            <Route
              path="minhas-plantas/:id/editar"
              element={<EditarPlanta />}
            />
            <Route path="sobre" element={<Sobre />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PlantsProvider>
  );
}
