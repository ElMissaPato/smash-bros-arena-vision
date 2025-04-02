
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import AddTournamentForm from '../components/AddTournamentForm';
import TournamentList from '../components/TournamentList';
import Clock from '../components/Clock';
import { useContext } from 'react';
import { TournamentContext } from '../context/TournamentContext';

const AdminTournaments = () => {
  const { tournaments } = useContext(TournamentContext);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleTournamentAdded = () => {
    // Forzar actualización del componente
    setRefreshKey(oldKey => oldKey + 1);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <Clock />
      
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-black/80 rounded-xl p-6 shadow-lg border-2 border-smash-yellow mb-6 animate-fadeIn">
              <h1 className="text-3xl font-bold text-white mb-4 font-game">Gestión de Torneos</h1>
              
              <div className="mb-6">
                <TournamentList tournaments={tournaments} key={refreshKey} />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <AddTournamentForm onComplete={handleTournamentAdded} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTournaments;
