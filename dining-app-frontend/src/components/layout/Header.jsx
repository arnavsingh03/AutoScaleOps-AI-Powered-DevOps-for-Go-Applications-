import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-lg font-bold">Dining App</Link>
        <nav>
          <Link to="/login" className="mr-4">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;