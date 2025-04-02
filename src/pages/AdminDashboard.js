
import React from 'react';
import Dashboard from '../components/Dashboard';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Dashboard />
    </div>
  );
};

export default AdminDashboard;
