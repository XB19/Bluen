import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard, Package, FolderKanban, Newspaper, FileText, Handshake, FileSignature, Mail, Briefcase,
  Users, LogOut, ExternalLink, Menu, X, Gift, BriefcaseBusiness, Tags,
} from 'lucide-react';
import { useAuth } from '../auth';
import { api } from '../api';
import { IMG } from '../data';
import { ToastProvider, initials } from './ui';
import './admin.css';

const NAV = [
  { group: 'Pilotage', items: [{ to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true }] },
  {
    group: 'Demandes',
    items: [
      { to: '/admin/devis', label: 'Devis', icon: FileSignature, badge: 'devisNouveaux' },
      { to: '/admin/messages', label: 'Messages', icon: Mail, badge: 'messagesNouveaux' },
      { to: '/admin/candidatures', label: 'Candidatures', icon: Briefcase, badge: 'candidaturesNouvelles' },
    ],
  },
  {
    group: 'Contenu du site',
    items: [
      { to: '/admin/produits', label: 'Produits', icon: Package },
      { to: '/admin/categories', label: 'Catégories', icon: Tags },
      { to: '/admin/realisations', label: 'Réalisations', icon: FolderKanban },
      { to: '/admin/actualites', label: 'Actualités', icon: Newspaper },
      { to: '/admin/appels-offres', label: "Appels d'offres", icon: FileText },
      { to: '/admin/bons-plans', label: 'Bons plans', icon: Gift },
      { to: '/admin/partenaires', label: 'Partenaires', icon: Handshake },
    ],
  },
  { group: 'Recrutement', items: [{ to: '/admin/offres-emploi', label: "Offres d'emploi", icon: BriefcaseBusiness }] },
  { group: 'Administration', items: [{ to: '/admin/utilisateurs', label: 'Utilisateurs', icon: Users }] },
];

const TITLES = Object.fromEntries(NAV.flatMap((g) => g.items.map((i) => [i.to, { label: i.label, group: g.group }])));

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [badges, setBadges] = useState({});

  const base = '/' + location.pathname.split('/').slice(1, 3).join('/');
  const title = TITLES[base] || TITLES['/admin'];

  useEffect(() => {
    api('/admin/dashboard').then((d) => setBadges(d.compteurs)).catch(() => {});
  }, [location.pathname]);

  const onLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <ToastProvider>
      <div className="admin">
        <aside className={`side ${open ? 'open' : ''}`}>
          <button className="side-close" onClick={() => setOpen(false)} aria-label="Fermer le menu"><X size={22} /></button>
          <Link to="/admin" className="side-logo" onClick={() => setOpen(false)}>
            <img src={IMG.logo} alt="BLUEN" />
          </Link>
          <nav>
            {NAV.map((g) => (
              <div key={g.group}>
                <div className="side-group">{g.group}</div>
                {g.items.map((item) => (
                  <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setOpen(false)} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
                    {({ isActive }) => (
                      <>
                        {isActive && <motion.span layoutId="side-active" className="side-active" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
                        <item.icon size={18} />
                        <span>{item.label}</span>
                        {item.badge && badges[item.badge] > 0 && <span className="side-badge">{badges[item.badge]}</span>}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
          <div className="side-foot">
            <a href="/" target="_blank" rel="noreferrer" className="side-link"><ExternalLink size={18} /><span>Voir le site</span></a>
            <button className="side-link" onClick={onLogout} style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', fontFamily: 'inherit', color: 'inherit' }}>
              <LogOut size={18} /><span>Déconnexion</span>
            </button>
          </div>
        </aside>
        <AnimatePresence>
          {open && <motion.div className="overlay" style={{ zIndex: 35 }} onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />}
        </AnimatePresence>

        <div className="admin-main">
          <header className="topbar">
            <button className="icon-btn menu-btn" onClick={() => setOpen(true)} aria-label="Ouvrir le menu"><Menu size={18} /></button>
            <div>
              <div className="crumb">{title.group}</div>
              <h1>{title.label}</h1>
            </div>
            <div className="topbar-right">
              <a href="/" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '9px 16px', fontSize: 13.5 }}>
                <ExternalLink size={15} /> Voir le site
              </a>
              <div className="user-chip">
                <span className="avatar">{initials(user)}</span>
                <div>
                  <b>{user?.prenom} {user?.nom}</b>
                  <small>Administrateur</small>
                </div>
              </div>
            </div>
          </header>
          <AnimatePresence mode="wait">
            <motion.main
              key={location.pathname}
              className="admin-content"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet context={{ refreshBadges: () => api('/admin/dashboard').then((d) => setBadges(d.compteurs)).catch(() => {}) }} />
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </ToastProvider>
  );
}
