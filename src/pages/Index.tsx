
import React from 'react';
import { Link } from 'react-router-dom';
import smashLogo from '../assets/smash-logo.png';

const Index = () => {
  const handleButtonClick = (sound: string) => {
    if (window.playSoundEffect) {
      window.playSoundEffect(sound);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-black/80 rounded-xl p-8 max-w-3xl w-full shadow-2xl border-2 border-yellow-500 animate-fadeIn">
        <div className="flex justify-center mb-8">
          <img 
            src={smashLogo} 
            alt="Super Smash Bros Ultimate" 
            className="h-40 animate-pulse"
          />
        </div>
        
        <h1 className="text-4xl text-white font-bold text-center mb-8">
          SUPER SMASH BROS
          <span className="block text-yellow-400 mt-2">ARENA VISION</span>
        </h1>
        
        <p className="text-white text-center text-lg mb-10">
          Sistema de gestión y visualización de torneos para Super Smash Bros Ultimate
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link 
            to="/admin" 
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-4 px-6 rounded-lg text-center text-xl transition-transform hover:scale-105 shadow-lg"
            onClick={() => handleButtonClick('select')}
          >
            ADMINISTRACIÓN
          </Link>
          
          <Link 
            to="/public" 
            className="bg-gradient-to-r from-red-600 to-red-800 text-white font-bold py-4 px-6 rounded-lg text-center text-xl transition-transform hover:scale-105 shadow-lg"
            onClick={() => handleButtonClick('select')}
          >
            VISTA PÚBLICA
          </Link>
        </div>
        
        <div className="text-center">
          <p className="text-gray-300 text-sm">
            Desarrollado para torneos competitivos
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
