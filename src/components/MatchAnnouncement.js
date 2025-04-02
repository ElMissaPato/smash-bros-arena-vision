
import React, { useEffect, useState } from 'react';

const MatchAnnouncement = ({ match, players, onClose }) => {
  const [visible, setVisible] = useState(true);
  
  const player1 = players.find(p => p.id === match.player1Id);
  const player2 = players.find(p => p.id === match.player2Id);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, 500);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="animate-pulse">
        <div className="bg-smash-gradient p-1 rounded-xl shadow-2xl">
          <div className="bg-black/90 rounded-lg p-6 text-center">
            <h2 className="text-smash-yellow text-4xl font-game mb-8">¡PRÓXIMO COMBATE!</h2>
            
            <div className="flex items-center justify-center space-x-6">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-smash-blue mb-4 mx-auto">
                  {player1?.image ? (
                    <img src={player1.image} alt={player1.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-smash-blue flex items-center justify-center text-white text-4xl">
                      {player1?.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="text-white text-2xl font-bold">{player1?.name}</h3>
              </div>
              
              <div className="text-smash-yellow text-5xl font-bold animate-pulse">VS</div>
              
              <div className="text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-smash-red mb-4 mx-auto">
                  {player2?.image ? (
                    <img src={player2.image} alt={player2.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-smash-red flex items-center justify-center text-white text-4xl">
                      {player2?.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="text-white text-2xl font-bold">{player2?.name}</h3>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setVisible(false);
                setTimeout(() => {
                  if (onClose) onClose();
                }, 500);
              }}
              className="mt-8 bg-smash-yellow text-black font-bold px-6 py-2 rounded-full hover:bg-yellow-400"
            >
              CERRAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchAnnouncement;
