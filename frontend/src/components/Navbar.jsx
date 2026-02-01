import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/employees', label: 'Employees', icon: 'users' },
    { path: '/employees/add', label: 'Add Employee', icon: 'plus' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo and Brand */}
          <div className="navbar-brand">
            <Link to="/dashboard" className="brand-link">
              <div className="brand-logo">
                <span className="logo-text">P</span>
              </div>
              <div className="brand-info">
                <h1 className="brand-title">PRODIGY</h1>
                <p className="brand-subtitle">Employee System</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              >
                <span className={`nav-icon icon-${link.icon}`}></span>
                <span className="nav-label">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* User Profile Dropdown */}
          <div className="profile-dropdown">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="profile-button"
            >
              <div className="profile-avatar">
                <span className="avatar-initial">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="profile-info">
                <p className="profile-name">{user?.username}</p>
                <p className="profile-role">{user?.role}</p>
              </div>
              <div className={`dropdown-arrow ${isProfileOpen ? 'rotated' : ''}`}>
                <span className="icon-chevron-down"></span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    <span>{user?.username?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="dropdown-name">{user?.username}</p>
                    <p className="dropdown-role">{user?.role}</p>
                  </div>
                </div>
                
                <div className="dropdown-items">
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <span className="dropdown-item-icon icon-user"></span>
                    <span>Profile Settings</span>
                  </Link>
                  
                  <Link
                    to="/change-password"
                    className="dropdown-item"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <span className="dropdown-item-icon icon-key"></span>
                    <span>Change Password</span>
                  </Link>
                  
                  <hr className="dropdown-divider" />
                  
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout"
                  >
                    <span className="dropdown-item-icon icon-logout"></span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="mobile-nav">
          <div className="mobile-nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
              >
                <span className={`mobile-nav-icon icon-${link.icon}`}></span>
                <span className="mobile-nav-label">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay for mobile dropdown */}
      {isProfileOpen && (
        <div
          className="dropdown-overlay"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;