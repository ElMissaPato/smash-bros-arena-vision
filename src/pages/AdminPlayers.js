
import React, { useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import AddPlayerForm from '../components/AddPlayerForm';
import PlayerList from '../components/PlayerList';
import Clock from '../components/Clock';
import { TournamentContext } from '../context/TournamentContext';

const AdminPlayers = () => {
  const { tournaments } = useContext(TournamentContext);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handlePlayerAdded = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  // Obtener el torneo seleccionado
  const tournament = selectedTournament 
    ? tournaments.find(t => t.id === selectedTournament) 
    : null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <Clock />
      
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-black/80 rounded-xl p-6 shadow-lg border-2 border-smash-yellow mb-6 animate-fadeIn">
              <h1 className="text-3xl font-bold text-white mb-4 font-game">Gestión de Participantes</h1>
              
              <div className="mb-6">
                <label className="smash-label block mb-2">Seleccionar Torneo:</label>
                <select 
                  className="smash-input w-full"
                  value={selectedTournament || ''}
                  onChange={(e) => setSelectedTournament(e.target.value)}
                >
                  <option value="">Todos los participantes</option>
                  {tournaments.map(tournament => (
                    <option key={tournament.id} value={tournament.id}>
                      {tournament.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <PlayerList 
                tournamentId={selectedTournament} 
                key={refreshKey}
              />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <AddPlayerForm 
              onComplete={handlePlayerAdded} 
              tournamentId={selectedTournament}
              tournamentName={tournament?.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPlayers;
