import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, LayoutDashboard, User as UserIcon, Shield, Bell,
  LogOut, ChevronDown, BellRing,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import NotificationBell from '../context/NotificationBell';
import Avatar from './Avatar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false); // hamburger panel
  const [userMenuOpen, setUserMenuOpen] = useState(false); // desktop avatar dropdown
  const userMenuRef = useRef(null);

  // Close everything when route changes
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Close user menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    const onDoc = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('touchstart', onDoc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('touchstart', onDoc);
    };
  }, [userMenuOpen]);

  // Lock body scroll while the mobile panel is open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const topLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors ${
      isActive ? 'text-brand-600' : 'text-ink/80 hover:text-brand-500'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 py-3 flex justify-between items-center gap-3">
        {/* ---- Brand ---- */}
        <Link to="/" className="flex-shrink-0" aria-label="HelpHub home">
          <Logo size="md" />
        </Link>

        {/* ================= GUEST (not logged in) ================= */}
        {!user && (
          <>
            {/* Desktop / tablet */}
            <div className="hidden sm:flex items-center gap-6">
              <NavLink to="/login" className={topLinkClass}>
                Login
              </NavLink>
              <Link to="/register" className="btn-primary !py-2 !px-5 text-sm">
                Join HelpHub
              </Link>
            </div>

            {/* Mobile */}
            <div className="flex items-center gap-2 sm:hidden">
              <Link
                to="/login"
                className="text-sm font-semibold text-ink/80 hover:text-brand-600 px-3 py-2"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-primary !py-2 !px-4 text-xs"
              >
                Join
              </Link>
            </div>
          </>
        )}

        {/* ================= LOGGED IN ================= */}
        {user && (
          <>
            {/* ---- Desktop / tablet ---- */}
            <div className="hidden sm:flex items-center gap-5">
              <NavLink to="/dashboard" className={topLinkClass}>
                Dashboard
              </NavLink>

              <NotificationBell />

              {/* Avatar dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-2 pl-4 border-l border-line
                             hover:opacity-80 transition-opacity"
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                >
                  <Avatar user={user} size="sm" ring={false} />
                  <div className="text-left">
                    <div className="text-xs font-semibold text-ink leading-tight">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-[10px] text-muted capitalize leading-tight">
                      {user.role}
                    </div>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-muted transition-transform ${
                      userMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {userMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl
                               shadow-2xl border border-line overflow-hidden
                               animate-[fade-up_0.15s_ease-out_both]"
                  >
                    <div className="px-4 py-3 border-b border-line bg-cream/40">
                      <div className="text-xs text-muted">Signed in as</div>
                      <div className="text-sm font-bold text-ink truncate">
                        {user.email}
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink/80
                                 hover:bg-cream transition-colors"
                      role="menuitem"
                    >
                      <UserIcon size={15} className="text-brand-500" />
                      My Profile
                    </Link>

                    <Link
                      to="/change-password"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink/80
                                 hover:bg-cream transition-colors"
                      role="menuitem"
                    >
                      <Shield size={15} className="text-brand-500" />
                      Security
                    </Link>

                    <Link
                      to="/notifications"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink/80
                                 hover:bg-cream transition-colors border-t border-line"
                      role="menuitem"
                    >
                      <Bell size={15} className="text-brand-500" />
                      All Notifications
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold
                                 text-red-600 hover:bg-red-50 transition-colors
                                 border-t border-line text-left"
                      role="menuitem"
                    >
                      <LogOut size={15} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ---- Mobile controls ---- */}
            <div className="flex items-center gap-1 sm:hidden">
              <NotificationBell />
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="p-2 rounded-lg hover:bg-cream active:bg-cream transition-colors"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      {user && mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-[57px] z-40 bg-ink/40 backdrop-blur-sm sm:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Sliding panel */}
          <div
            className="fixed top-[57px] left-0 right-0 z-50 sm:hidden
                       bg-white border-b border-line shadow-2xl
                       max-h-[calc(100vh-57px)] overflow-y-auto
                       animate-[fade-up_0.2s_ease-out_both]"
          >
            {/* User card */}
            <div className="px-4 py-4 border-b border-line bg-cream/40 flex items-center gap-3">
              <Avatar user={user} size="md" ring={false} />
              <div className="min-w-0">
                <div className="text-sm font-bold text-ink truncate">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-xs text-muted capitalize">{user.role}</div>
                <div className="text-[11px] text-muted truncate">{user.email}</div>
              </div>
            </div>

            {/* Nav links */}
            <nav className="p-2">
              <MobileLink
                to="/dashboard"
                icon={<LayoutDashboard size={16} />}
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </MobileLink>

              <MobileLink
                to="/profile"
                icon={<UserIcon size={16} />}
                onClick={() => setMobileOpen(false)}
              >
                My Profile
              </MobileLink>

              <MobileLink
                to="/change-password"
                icon={<Shield size={16} />}
                onClick={() => setMobileOpen(false)}
              >
                Security
              </MobileLink>

              <MobileLink
                to="/notifications"
                icon={<BellRing size={16} />}
                onClick={() => setMobileOpen(false)}
              >
                Notifications
              </MobileLink>
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-line">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                           bg-red-50 text-red-600 font-semibold text-sm
                           hover:bg-red-100 active:bg-red-100 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

/* -------- Mobile link component -------- */
function MobileLink({ to, icon, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
         transition-colors ${
           isActive
             ? 'bg-brand-50 text-brand-700'
             : 'text-ink/80 hover:bg-cream active:bg-cream'
         }`
      }
    >
      <span className="text-brand-500">{icon}</span>
      {children}
    </NavLink>
  );
}
