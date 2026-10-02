import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { PageTransition } from './components/Motion';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import ProductDetail from './pages/ProductDetail';
import Apropos from './pages/Apropos';
import Realisations from './pages/Realisations';
import BonPlan from './pages/BonPlan';
import Devis from './pages/Devis';
import OffresEmploi from './pages/OffresEmploi';
import Candidature from './pages/Candidature';
import Actualites from './pages/Actualites';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import { Login, Register } from './pages/Auth';
import { RequireAdmin } from './auth';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ResourcePage from './admin/ResourcePage';
import InboxPage from './admin/InboxPage';
import Users from './admin/Users';
import { RESOURCES, INBOXES } from './admin/resources';

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div className="scroll-progress" style={{ scaleX }} />;
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="to-top"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ y: -4 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Revenir en haut"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

const page = (el) => <PageTransition>{el}</PageTransition>;

const AUTH_PATHS = ['/login', '/register'];

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
        <Route index element={<Dashboard />} />
        {Object.entries(RESOURCES).map(([path, config]) => (
          <Route key={path} path={path} element={<ResourcePage key={path} config={config} />} />
        ))}
        {Object.entries(INBOXES).map(([path, config]) => (
          <Route key={path} path={path} element={<InboxPage key={path} config={config} />} />
        ))}
        <Route path="utilisateurs" element={<Users />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  const location = useLocation();
  const isAuth = AUTH_PATHS.includes(location.pathname);

  if (location.pathname.startsWith('/admin')) return <AdminRoutes />;

  return (
    <>
      {!isAuth && <ScrollProgress />}
      {!isAuth && <Navbar />}
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={page(<Home />)} />
          <Route path="/catalogue" element={page(<Catalogue />)} />
          <Route path="/catalogue/:slug" element={page(<ProductDetail />)} />
          <Route path="/apropos" element={page(<Apropos />)} />
          <Route path="/realisations" element={page(<Realisations />)} />
          <Route path="/bon-plan" element={page(<BonPlan />)} />
          <Route path="/devis" element={page(<Devis />)} />
          <Route path="/carriere" element={<Navigate to="/carriere/offres" replace />} />
          <Route path="/carriere/offres" element={page(<OffresEmploi />)} />
          <Route path="/carriere/candidature" element={page(<Candidature />)} />
          <Route path="/actualites" element={page(<Actualites />)} />
          <Route path="/contact" element={page(<Contact />)} />
          <Route path="/login" element={page(<Login />)} />
          <Route path="/register" element={page(<Register />)} />
          <Route path="*" element={page(<NotFound />)} />
        </Routes>
      </AnimatePresence>
      {!isAuth && <Footer />}
      {!isAuth && <BackToTop />}
    </>
  );
}
