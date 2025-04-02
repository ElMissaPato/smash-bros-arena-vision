
import React, { useContext, useState } from 'react';
import { TournamentContext } from '../context/TournamentContext';
import TournamentList from './TournamentList';
import Clock from './Clock';

const Dashboard = () => {
  const { activeTournament, tournaments, openPublicView } = useContext(TournamentContext);
  const [publicWindowOpen, setPublicWindowOpen] = useState(false);

  const handleOpenPublicView = () => {
    const window = openPublicView();
    if (window) {
      setPublicWindowOpen(true);
      
      window.addEventListener('beforeunload', () => {
        setPublicWindowOpen(false);
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Clock />
      
      <div className="bg-black/80 rounded-xl p-6 shadow-lg border-2 border-smash-blue mb-6 animate-fadeIn">
        <h1 className="text-3xl font-bold text-white mb-4 font-game">Panel de Control</h1>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-smash-yellow text-xl font-bold">
              {activeTournament 
                ? `Torneo Activo: ${activeTournament.name}` 
                : 'No hay torneos activos'}
            </h2>
            {activeTournament && (
              <p className="text-white">
                Estado: <span className="text-smash-green font-bold">
                  {activeTournament.status === 'active' ? 'En progreso' : 'Completado'}
                </span>
              </p>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={handleOpenPublicView}
              disabled={publicWindowOpen}
              className={`btn ${publicWindowOpen ? 'bg-gray-500' : 'btn-primary'}`}
            >
              {publicWindowOpen ? 'Vista pública abierta' : 'Abrir Vista Pública'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/80 rounded-xl p-6 shadow-lg border-2 border-smash-yellow animate-fadeIn">
          <h2 className="text-2xl font-bold text-white mb-4 font-game">Torneos</h2>
          {tournaments.length > 0 ? (
            <TournamentList tournaments={tournaments} />
          ) : (
            <p className="text-white">No hay torneos creados. Crea uno nuevo para comenzar.</p>
          )}
        </div>
        
        <div className="bg-black/80 rounded-xl p-6 shadow-lg border-2 border-smash-purple animate-fadeIn">
          <h2 className="text-2xl font-bold text-white mb-4 font-game">Estadísticas</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/50 p-4 rounded-lg border border-smash-blue">
              <p className="text-smash-blue font-bold">Total Torneos</p>
              <p className="text-4xl text-white font-bold">{tournaments.length}</p>
            </div>
            
            <div className="bg-black/50 p-4 rounded-lg border border-smash-green">
              <p className="text-smash-green font-bold">Torneos Activos</p>
              <p className="text-4xl text-white font-bold">
                {tournaments.filter(t => t.status === 'active').length}
              </p>
            </div>
            
            <div className="bg-black/50 p-4 rounded-lg border border-smash-yellow">
              <p className="text-smash-yellow font-bold">Torneos Completados</p>
              <p className="text-4xl text-white font-bold">
                {tournaments.filter(t => t.status === 'completed').length}
              </p>
            </div>
            
            <div className="bg-black/50 p-4 rounded-lg border border-smash-red">
              <p className="text-smash-red font-bold">Torneos Pendientes</p>
              <p className="text-4xl text-white font-bold">
                {tournaments.filter(t => t.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
