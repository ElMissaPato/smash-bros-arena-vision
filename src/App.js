
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Páginas
import Login from './components/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminTournaments from './pages/AdminTournaments';
import AdminPlayers from './pages/AdminPlayers';
import TournamentDetail from './pages/TournamentDetail';
import PublicView from './pages/PublicView';

// Ruta protegida para administrador
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  // Si está cargando, mostrar un loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-white text-2xl">Cargando...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/public" element={<PublicView />} />
      
      {/* Rutas protegidas */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/tournaments" 
        element={
          <ProtectedRoute>
            <AdminTournaments />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/tournaments/:id" 
        element={
          <ProtectedRoute>
            <TournamentDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/players" 
        element={
          <ProtectedRoute>
            <AdminPlayers />
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta por defecto */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
