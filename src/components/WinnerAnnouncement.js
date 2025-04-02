
import React, { useEffect, useState } from 'react';

const WinnerAnnouncement = ({ player, onClose }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, 500);
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!player) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="animate-pulse">
        <div className="bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 p-1 rounded-xl shadow-2xl max-w-2xl">
          <div className="bg-black/90 rounded-lg p-8 text-center">
            <h2 className="text-yellow-300 text-5xl font-game mb-6">¡VICTORIA!</h2>
            
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden border-8 border-yellow-500 mb-6 mx-auto animate-pulse">
                {player.image ? (
                  <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-700 flex items-center justify-center text-white text-6xl">
                    {player.name.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="relative">
                <h3 className="text-white text-4xl font-bold relative z-10">{player.name}</h3>
                {/* Efecto de resplandor detrás del texto */}
                <div className="absolute inset-0 blur-xl bg-yellow-400/30 z-0"></div>
              </div>
              
              <p className="text-smash-yellow text-xl mt-6">¡Ha ganado el combate!</p>
            </div>
            
            <button 
              onClick={() => {
                setVisible(false);
                setTimeout(() => {
                  if (onClose) onClose();
                }, 500);
              }}
              className="mt-8 bg-yellow-500 text-black font-bold px-6 py-2 rounded-full hover:bg-yellow-400"
            >
              CERRAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerAnnouncement;
