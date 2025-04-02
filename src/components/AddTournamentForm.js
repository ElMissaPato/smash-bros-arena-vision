
import React, { useState, useContext } from 'react';
import { TournamentContext } from '../context/TournamentContext';

const AddTournamentForm = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const { addTournament } = useContext(TournamentContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name) {
      setError('Por favor ingresa un nombre para el torneo.');
      return;
    }
    
    const tournament = addTournament({ name, description });
    
    if (tournament) {
      setName('');
      setDescription('');
      setError('');
      if (onComplete) onComplete(tournament);
    } else {
      setError('Error al crear el torneo. Intenta de nuevo.');
    }
  };

  return (
    <div className="bg-black/80 rounded-xl p-6 shadow-lg border-2 border-smash-blue animate-fadeIn">
      <h2 className="text-2xl font-bold text-white mb-4 font-game">Nuevo Torneo</h2>
      
      {error && (
        <div className="bg-red-500/70 text-white p-3 rounded-lg mb-4 text-center">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="smash-label">Nombre del Torneo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="smash-input w-full"
            placeholder="Ej: Grand Prix Smash 2023"
          />
        </div>
        
        <div className="mb-6">
          <label className="smash-label">Descripción (Opcional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="smash-input w-full h-32 resize-none"
            placeholder="Describe el torneo, reglas, premios, etc."
          />
        </div>
        
        <button 
          type="submit"
          className="btn btn-primary w-full py-3"
        >
          CREAR TORNEO
        </button>
      </form>
    </div>
  );
};

export default AddTournamentForm;
