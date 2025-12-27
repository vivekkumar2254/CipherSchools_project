import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout, isAuthenticated, getCurrentUser } from '../services/authService';
import './Navbar.scss';

function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadUser();
  }, [location]);

  useEffect(() => {
    const handleStorageChange = () => {
      loadUser();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadUser = async () => {
    if (isAuthenticated()) {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  if (loading) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          CipherSQL Studio
        </Link>

        <div className="navbar-actions">
          {user ? (
            <>
              <span className="navbar-user">
                Welcome, {user.username}
              </span>
              <button onClick={handleLogout} className="navbar-btn navbar-btn--logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-btn navbar-btn--login">
                Login
              </Link>
              <Link to="/signup" className="navbar-btn navbar-btn--signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
