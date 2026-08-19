import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import HomePage from './pages/HomePage';
import SpasialPage from './pages/SpasialPage';
import StatistikPage from './pages/StatistikPage';
import RekomendasiPage from './pages/RekomendasiPage';
import TentangPage from './pages/TentangPage';
import KontakPage from './pages/KontakPage';

// Admin Pages & Layout
import AdminLoginPage from './pages/admin/AdminLoginPage';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminFarmsListPage from './pages/admin/farms/AdminFarmsListPage';
import AdminFarmFormPage from './pages/admin/farms/AdminFarmFormPage';
import AdminValidationsPage from './pages/admin/validations/AdminValidationsPage';
import AdminSDSSPage from './pages/admin/sdss/AdminSDSSPage';
import AdminMasterDataPage from './pages/admin/master/AdminMasterDataPage';
import AdminUsersPage from './pages/admin/users/AdminUsersPage';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Show Public Navbar & Footer only on Public routes */}
      {!isAdminRoute && <Navbar />}

      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/spasial" element={<SpasialPage />} />
          <Route path="/statistik" element={<StatistikPage />} />
          <Route path="/rekomendasi" element={<RekomendasiPage />} />
          <Route path="/tentang" element={<TentangPage />} />
          <Route path="/kontak" element={<KontakPage />} />

          {/* Admin Auth */}
          <Route path="/login" element={<AdminLoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="farms" element={<AdminFarmsListPage />} />
            <Route path="farms/new" element={<AdminFarmFormPage />} />
            <Route path="farms/:id/edit" element={<AdminFarmFormPage />} />
            <Route path="validations" element={<AdminValidationsPage />} />
            <Route path="sdss" element={<AdminSDSSPage />} />
            <Route path="master" element={<AdminMasterDataPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
        </Routes>
      </div>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
