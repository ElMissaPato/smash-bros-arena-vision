
import React, { useEffect, useState } from 'react';

const WinnerAnnouncement = ({ player, onClose }) => {
  const [visible, setVisible] = useState(true);
  const [animateIn, setAnimateIn] = useState(true);
  
  useEffect(() => {
    // Reproducir sonido de victoria al aparecer
    if (window.playSoundEffect) {
      window.playSoundEffect('win');
    }
    
    const timer = setTimeout(() => {
      setAnimateIn(false);
      setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          if (onClose) onClose();
        }, 500);
      }, 1000);
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!player) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className={`transition-all duration-1000 ${animateIn ? 'scale-100' : 'scale-110 opacity-0'}`}>
        <div className="bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 p-1.5 rounded-xl shadow-2xl max-w-2xl animate-pulse">
          <div className="bg-black/95 rounded-lg p-10 text-center">
            <div className="mb-6 transform -rotate-3">
              <h2 className="text-yellow-300 text-5xl font-game animate-pulse">¡VICTORIA!</h2>
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent mt-2"></div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden border-8 border-yellow-500 mb-8 mx-auto relative">
                {player.image ? (
                  <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-700 to-purple-700 flex items-center justify-center text-white text-6xl">
                    {player.name.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Efecto de rayos */}
                <div className="absolute -inset-4 bg-yellow-400/30 blur-xl animate-pulse rounded-full z-[-1]"></div>
              </div>
              
              <div className="relative">
                <h3 className="text-white text-4xl font-bold relative z-10 mb-2">{player.name}</h3>
                {/* Efecto de resplandor detrás del texto */}
                <div className="absolute inset-0 blur-xl bg-yellow-400/30 z-0"></div>
              </div>
              
              <p className="text-smash-yellow text-xl mt-4 font-game tracking-wider">¡HA GANADO EL COMBATE!</p>
              
              <div className="mt-6 w-full max-w-xs h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-yellow-500 to-yellow-300 animate-pulse"></div>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setAnimateIn(false);
                setTimeout(() => {
                  setVisible(false);
                  setTimeout(() => {
                    if (onClose) onClose();
                  }, 500);
                }, 1000);
              }}
              className="mt-8 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-bold px-8 py-3 rounded-full hover:from-yellow-400 hover:to-yellow-200 transform transition-transform hover:scale-105"
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
