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

  const navGroups = [
    {
      group: 'Utama',
      items: [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
      ],
    },
    {
      group: 'Data & Spasial',
      items: [
        { name: 'Data Peternakan', path: '/admin/farms', icon: Building2 },
        { name: 'Validasi Survei', path: '/admin/validations', icon: CheckSquare },
        { name: 'SDSS Multikriteria', path: '/admin/sdss', icon: Calculator },
      ],
    },
    {
      group: 'Konfigurasi Sistem',
      items: [
        { name: 'Master Data', path: '/admin/master', icon: Database },
        { name: 'Manajemen Admin', path: '/admin/users', icon: Users },
      ],
    },
  ];

  const currentPathSegment = location.pathname.split('/')[2] || 'dashboard';
  const getPageTitle = (seg) => {
    const titles = {
      dashboard: 'Dashboard Utama',
      farms: 'Data Peternakan',
      validations: 'Validasi Survei Lapangan',
      sdss: 'Sistem Pengambilan Keputusan (SDSS)',
      master: 'Master Data & Taksonomi',
      users: 'Manajemen Akun Administrator',
    };
    return titles[seg] || 'Portal Admin';
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex font-body text-[#191C19] selection:bg-[#2E7D32] selection:text-white">
      
      {/* Desktop MD3 Tonal Navigation Drawer */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#F1F5F1] text-[#191C19] border-r border-[#C2C9BD]/50 shrink-0 select-none">
        
        {/* Drawer Header */}
        <div className="h-20 px-6 flex items-center gap-3.5 border-b border-[#E2E8E2]">
          <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center shadow-xs">
            <MapPin className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-base font-heading tracking-tight text-[#191C19]">
              Panganspasial<span className="text-[#2E7D32]">.id</span>
            </span>
            <span className="text-[10px] text-[#495348] font-bold uppercase tracking-wider font-mono">
              Admin Workspace
            </span>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 py-5 px-3.5 space-y-6 overflow-y-auto">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 pb-1.5 text-[10px] font-bold font-heading uppercase tracking-wider text-[#495348]/80">
                {group.group}
              </div>
              {group.items.map((item) => {
                const isActive = item.exact
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);

                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`h-11 px-4 rounded-full flex items-center justify-between text-xs font-semibold font-heading transition-all duration-200 ${
                      isActive
                        ? 'bg-[#2E7D32] text-white shadow-xs'
                        : 'text-[#495348] hover:text-[#191C19] hover:bg-[#E2E8E2]/80 active:scale-[0.98]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#495348]'}`} />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Drawer Footer User Dock */}
        <div className="p-4 border-t border-[#E2E8E2] space-y-3 bg-[#E8EFE8]/40">
          <Link
            to="/spasial"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-full bg-white border border-[#C2C9BD]/60 hover:bg-[#F1F5F1] text-[11px] font-semibold font-heading text-[#2E7D32] transition-colors shadow-2xs"
          >
            <span>Buka WebGIS Publik</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#2E7D32]" />
          </Link>

          <div className="flex items-center justify-between p-2 rounded-2xl bg-white border border-[#C2C9BD]/40 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs text-[#191C19] truncate font-heading leading-tight">
                  {user?.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-[#495348] truncate">
                  {typeof user?.role === 'object' && user?.role !== null ? (user.role.name || 'Admin') : (user?.role || 'Admin')}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-full text-[#495348] hover:text-[#BA1A1A] hover:bg-[#FFDAD6]/50 transition-colors shrink-0"
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
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-[#F1F5F1] text-[#191C19] flex flex-col z-10 p-5 space-y-4 shadow-2xl rounded-r-[28px]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8E2]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-sm font-heading text-[#191C19]">
                  Admin Menu
                </span>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-full text-[#495348] hover:text-[#191C19] hover:bg-[#E2E8E2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-5 overflow-y-auto">
              {navGroups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <div className="px-3 pb-1 text-[10px] font-bold font-heading uppercase tracking-wider text-[#495348]/80">
                    {group.group}
                  </div>
                  {group.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`h-11 px-4 rounded-full flex items-center gap-3 text-xs font-semibold font-heading transition-all ${
                        location.pathname === item.path
                          ? 'bg-[#2E7D32] text-white shadow-xs'
                          : 'text-[#495348] hover:bg-[#E2E8E2]'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </nav>

            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-bold font-heading text-[#BA1A1A] bg-[#FFDAD6]/60 hover:bg-[#FFDAD6] transition-colors"
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
        <header className="h-16 bg-white border-b border-[#E2E8E2] px-6 lg:px-8 flex items-center justify-between shrink-0 shadow-2xs">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-2 rounded-full text-[#495348] hover:bg-[#F1F5F1] lg:hidden"
              aria-label="Toggle mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-body">
              <span className="px-2.5 py-1 rounded-full bg-[#E8EFE8] font-bold font-heading text-[#1B5E20] text-[11px]">
                Admin
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#C2C9BD]" />
              <span className="text-[#191C19] font-bold font-heading">
                {getPageTitle(currentPathSegment)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/spasial"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#C2C9BD] hover:bg-[#F1F5F1] text-[11px] font-semibold text-[#2E7D32] transition-colors"
            >
              <span>Lihat WebGIS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-2.5 pl-3 border-l border-[#E2E8E2]">
              <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center font-bold text-xs font-heading">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="text-left hidden md:block">
                <span className="text-xs font-bold text-[#191C19] font-heading block leading-tight">
                  {user?.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-[#495348] font-mono block">
                  {user?.email || 'admin@panganspasial.id'}
                </span>
              </div>
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
