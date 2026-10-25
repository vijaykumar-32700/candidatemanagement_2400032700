import React from 'react';
import { Users, RefreshCw } from 'lucide-react';

const Navbar = ({ isRefreshing, onRefresh }) => {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div className="navbar-logo-icon">
            <Users size={22} strokeWidth={2.5} />
          </div>
          <div className="navbar-text">
            <h1>Candidate Management System</h1>
            <p>Manage candidate records and recruitment status</p>
          </div>
        </div>

        <div className="navbar-actions">
          {/* Quick Refresh Button */}
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh candidate records"
            style={{ padding: '7px 12px' }}
          >
            <RefreshCw size={15} className={isRefreshing ? 'spinner' : ''} style={isRefreshing ? { margin: 0, width: 15, height: 15 } : {}} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
