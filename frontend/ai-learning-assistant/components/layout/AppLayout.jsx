import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BrainCircuit, FileText, LayoutDashboard, LogOut, User, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/flashcards', label: 'Flashcards', icon: Layers },
  { to: '/profile', label: 'Profile', icon: User },
];

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-600 p-2 text-white shadow-lg shadow-emerald-500/30 transition-transform duration-300 hover:scale-105">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">AI Learning Assistant</p>
              <p className="text-xs text-slate-500">Clean learning workflow</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-[210px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Signed in as</p>
            <p className="truncate text-xs text-slate-700">{user?.email || 'Unknown user'}</p>
          </div>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                        : 'text-slate-600 hover:bg-slate-100 hover:-translate-y-0.5'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
          <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-[11px] text-slate-600">
            Upload your PDF in Documents to generate flashcards and quizzes.
          </div>
        </aside>

        <main className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
