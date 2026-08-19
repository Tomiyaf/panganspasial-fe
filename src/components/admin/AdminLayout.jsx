import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  CheckSquare,
  Calculator,
  Database,
  Users,
  LogOut,
  Menu,
  X,
  MapPin,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Data Peternakan', path: '/admin/farms', icon: Building2 },
    { name: 'Validasi Survei', path: '/admin/validations', icon: CheckSquare },
    { name: 'SDSS & Kriteria', path: '/admin/sdss', icon: Calculator },
    { name: 'Master Data', path: '/admin/master', icon: Database },
    { name: 'Manajemen Admin', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex font-body text-slate-800">
      
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 select-none">
        
        {/* Sidebar Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/80 bg-slate-950/40">
          <div className="w-8 h-8 rounded-lg bg-[#2E7D32] text-white flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm font-heading tracking-tight text-white">
              Panganspasial<span className="text-emerald-400">.id</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold font-heading transition-all duration-150 ${
                  isActive
                    ? 'bg-[#2E7D32] text-white shadow-md shadow-emerald-950/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer User & Actions */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
          <Link
            to="/spasial"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-[11px] font-medium text-slate-300 transition-colors"
          >
            <span>Buka WebGIS Publik</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="font-bold text-white truncate font-heading">{user?.name || 'Administrator'}</span>
              <span className="text-[10px] text-slate-400 truncate">
                {typeof user?.role === 'object' && user?.role !== null ? (user.role.name || 'Administrator') : (user?.role || 'Administrator')}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* Mobile Drawer Navigation */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-[1200] lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] bg-slate-900 text-slate-300 flex flex-col z-10 p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-extrabold text-sm font-heading text-white">
                Admin Menu
              </span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold font-heading ${
                    location.pathname === item.path
                      ? 'bg-[#2E7D32] text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            <button
              onClick={logout}
              className="flex items-center gap-2 p-2.5 rounded-lg text-xs text-red-400 hover:bg-red-950/30"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar (Logout)</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between shrink-0 shadow-xs">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Toggle mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-body">
              <span className="font-semibold text-slate-700">Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-semibold capitalize font-heading">
                {location.pathname.split('/')[2] || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-slate-900 font-heading block">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {user?.email || 'admin@panganspasial.id'}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#2E7D32] flex items-center justify-center font-bold text-xs font-heading">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>

        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
