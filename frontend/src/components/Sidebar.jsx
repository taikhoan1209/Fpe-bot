import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/risk">Risk Management</Link></li>
      </ul>
    </nav>
  );
}

export default Sidebar;
