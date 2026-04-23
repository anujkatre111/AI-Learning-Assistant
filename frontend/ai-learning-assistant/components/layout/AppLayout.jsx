import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BrainCircuit, FileText, LayoutDashboard, LogOut, User, Layers, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 p-2 text-white">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">AI Learning Assistant</p>
              <p className="text-xs text-slate-500">Learn from your PDFs faster</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-3">
          <div className="mb-4 rounded-lg bg-emerald-50 p-3">
            <p className="text-sm font-medium">Signed in as</p>
            <p className="truncate text-sm text-slate-600">{user?.email || 'Unknown user'}</p>
          </div>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
                      isActive ? 'bg-emerald-100 text-emerald-700' : 'text-slate-700 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
          <div className="mt-5 rounded-lg border border-dashed border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-700">
            <p className="mb-1 inline-flex items-center gap-1 font-medium">
              <Sparkles className="h-3 w-3" />
              Quick tip
            </p>
            <p>Upload a PDF on Documents, then generate flashcards and quizzes from the detail page.</p>
          </div>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
