
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import smashLogo from '../assets/smash-logo.png';
import tecnmLogo from '../assets/tecnm-logo.png';
import iscLogo from '../assets/isc-logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Por favor ingresa nombre de usuario y contraseña.');
      return;
    }

    const success = login(username, password);
    if (!success) {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="bg-black/80 rounded-xl p-8 w-full max-w-md shadow-2xl border-2 border-smash-yellow animate-fadeIn">
        <div className="flex justify-center mb-6">
          <img 
            src={smashLogo} 
            alt="Super Smash Bros Ultimate" 
            className="h-32 animate-pulse"
          />
        </div>
        
        <h2 className="text-2xl text-white font-bold text-center mb-6 font-game">
          ADMINISTRACIÓN DE TORNEO
        </h2>
        
        {error && (
          <div className="bg-red-500/70 text-white p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="smash-label">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="smash-input w-full"
            />
          </div>
          
          <div className="mb-6">
            <label className="smash-label">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="smash-input w-full"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-smash-gradient text-white font-bold py-3 rounded-lg transition-transform hover:scale-105 focus:outline-none shadow-neon"
          >
            INGRESAR
          </button>
        </form>
        
        <div className="mt-8 flex justify-center space-x-6 items-center">
          <img src={tecnmLogo} alt="TECNM Logo" className="h-16" />
          <img src={iscLogo} alt="ISC Logo" className="h-16" />
        </div>
        
        <p className="text-white text-center mt-4 text-xs">
          INGENIERÍA EN SISTEMAS COMPUTACIONALES
        </p>
      </div>
    </div>
  );
};

export default Login;
