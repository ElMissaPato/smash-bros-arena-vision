
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import smashLogo from '../assets/smash-logo.png';
import tecnmLogo from '../assets/tecnm-logo.png';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav className="bg-black/90 py-2 px-6 shadow-lg border-b-2 border-smash-yellow">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src={smashLogo} alt="Super Smash Bros Logo" className="h-12" />
          <img src={tecnmLogo} alt="TECNM Logo" className="h-10" />
          <span className="text-white font-bold text-sm">
            INGENIERÍA EN SISTEMAS COMPUTACIONALES
          </span>
        </div>
        
        {isAuthenticated && (
          <div className="flex items-center space-x-4">
            <Link to="/admin/dashboard" className="text-white hover:text-smash-yellow transition">
              Dashboard
            </Link>
            <Link to="/admin/tournaments" className="text-white hover:text-smash-yellow transition">
              Torneos
            </Link>
            <Link to="/admin/players" className="text-white hover:text-smash-yellow transition">
              Participantes
            </Link>
            <button 
              onClick={logout}
              className="bg-smash-red px-3 py-1 rounded text-white hover:bg-red-700 transition"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
