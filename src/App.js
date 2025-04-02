
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AdminDashboard from './pages/AdminDashboard';
import AdminTournaments from './pages/AdminTournaments';
import AdminPlayers from './pages/AdminPlayers';
import TournamentDetail from './pages/TournamentDetail';
import Login from './components/Login';
import { TournamentContext } from './context/TournamentContext';
import { AuthContext } from './context/AuthContext';
import PublicView from './pages/PublicView';
import SoundEffects from './components/SoundEffects';

function App() {
  return (
    <Router>
      <AuthContext>
        <TournamentContext>
          <SoundEffects />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/tournaments" element={<AdminTournaments />} />
            <Route path="/admin/tournaments/:id" element={<TournamentDetail />} />
            <Route path="/admin/players" element={<AdminPlayers />} />
            <Route path="/public" element={<PublicView />} />
          </Routes>
        </TournamentContext>
      </AuthContext>
    </Router>
  );
}

export default App;
