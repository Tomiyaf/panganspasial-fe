import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import SpasialPage from './pages/SpasialPage';
import StatistikPage from './pages/StatistikPage';
import RekomendasiPage from './pages/RekomendasiPage';
import TentangPage from './pages/TentangPage';
import KontakPage from './pages/KontakPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50 antialiased selection:bg-emerald-500 selection:text-white">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/spasial" element={<SpasialPage />} />
            <Route path="/statistik" element={<StatistikPage />} />
            <Route path="/rekomendasi" element={<RekomendasiPage />} />
            <Route path="/tentang" element={<TentangPage />} />
            <Route path="/kontak" element={<KontakPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
