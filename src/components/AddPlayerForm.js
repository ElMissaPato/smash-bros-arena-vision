
import React, { useState, useContext, useRef } from 'react';
import { TournamentContext } from '../context/TournamentContext';

const AddPlayerForm = ({ onComplete, tournamentId, tournamentName }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const { addPlayer } = useContext(TournamentContext);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validar que sea una imagen
    if (!file.type.match('image.*')) {
      setError('Por favor selecciona un archivo de imagen válido.');
      return;
    }
    
    // Crear URL para previsualización
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name) {
      setError('Por favor ingresa un nombre para el participante.');
      return;
    }
    
    if (!tournamentId) {
      setError('Debe seleccionar un torneo.');
      return;
    }
    
    const player = addPlayer({ 
      name, 
      image: imagePreview,
      tournamentId,
      tournamentName
    });
    
    if (player) {
      setName('');
      setImagePreview(null);
      setError('');
      if (fileInputRef.current) fileInputRef.current.value = null;
      if (onComplete) onComplete(player);
    } else {
      setError('Error al agregar el participante. Intenta de nuevo.');
    }
  };

  return (
    <div className="bg-black/80 rounded-xl p-6 shadow-lg border-2 border-smash-green animate-fadeIn">
      <h2 className="text-2xl font-bold text-white mb-4 font-game">Nuevo Participante</h2>
      
      {tournamentId && (
        <p className="text-smash-yellow mb-4">
          Torneo: <span className="font-bold">{tournamentName}</span>
        </p>
      )}
      
      {error && (
        <div className="bg-red-500/70 text-white p-3 rounded-lg mb-4 text-center">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="smash-label">Nombre del Participante</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="smash-input w-full"
            placeholder="Ej: Juan Pérez"
          />
        </div>
        
        <div className="mb-6">
          <label className="smash-label">Imagen (Opcional)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-white file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0 file:bg-blue-600 file:text-white
                       hover:file:bg-blue-700 file:cursor-pointer cursor-pointer"
          />
          
          {imagePreview && (
            <div className="mt-4 flex justify-center">
              <img 
                src={imagePreview} 
                alt="Vista previa" 
                className="h-32 w-32 object-cover rounded-lg border-2 border-smash-yellow"
              />
            </div>
          )}
        </div>
        
        <button 
          type="submit"
          className="btn btn-success w-full py-3"
          disabled={!tournamentId}
        >
          AGREGAR PARTICIPANTE
        </button>
      </form>
    </div>
  );
};

export default AddPlayerForm;
