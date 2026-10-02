import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import NotificationBell from '../context/NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors ${
      isActive ? 'text-brand-600' : 'text-ink/80 hover:text-brand-500'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-line">
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex justify-between items-center">
        <Link to="/">
          <Logo size="md" />
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>

              <NotificationBell />

              <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-line">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-xs font-bold">
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-ink">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-muted capitalize">{user.role}</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <Link to="/register" className="btn-primary !py-2 !px-5 text-sm">
                Join HelpHub
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}