import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Menu, X, UserRound, FileText, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { NAV, IMG } from '../data';
import { useAuth } from '../auth';

function Dropdown({ item }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const active = pathname.startsWith(item.to);

  return (
    <div
      className={`nav-item ${open ? 'open' : ''}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
    >
      <button className={`nav-trigger ${active ? 'active' : ''}`} aria-expanded={open} aria-haspopup="true" onClick={() => setOpen(!open)}>
        {active && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
        {item.label} <ChevronDown size={15} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-dropdown"
            initial={{ opacity: 0, y: 10, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 6, x: '-50%' }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {item.children.map((c) => (
              <NavLink key={c.to} to={c.to} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>
                <span className="icon-box"><c.icon size={18} /></span>
                <span>
                  <b>{c.label}</b>
                  <small>{c.desc}</small>
                </span>
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <>
      <motion.header
        className={`header ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -90 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="nav">
          <Link to="/" className="nav-logo" aria-label="Accueil BLUEN Togo">
            <img src={IMG.logo} alt="Logo BLUEN Togo" />
          </Link>

          <div className="nav-links">
            {NAV.map((item) => item.children ? (
              <Dropdown key={item.to} item={item} />
            ) : (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                {({ isActive }) => (
                  <>
                    {isActive && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="nav-right">
            <Link to="/devis" className="nav-cta">
              <FileText size={16} /> Demander un devis
            </Link>
            {isAdmin && (
              <Link to="/admin" className="nav-login" title="Tableau de bord" aria-label="Tableau de bord">
                <LayoutDashboard size={18} />
              </Link>
            )}
            {user ? (
              <button className="nav-login" onClick={logout} title="Se déconnecter" aria-label="Se déconnecter">
                <LogOut size={18} />
              </button>
            ) : (
              <Link to="/login" className="nav-login" title="Connexion" aria-label="Connexion">
                <UserRound size={18} />
              </Link>
            )}
            <button className="burger" onClick={() => setOpen(true)} aria-label="Ouvrir le menu">
              <Menu size={28} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'circle(0% at 95% 4%)' }}
            animate={{ clipPath: 'circle(150% at 95% 4%)' }}
            exit={{ clipPath: 'circle(0% at 95% 4%)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mobile-menu-top">
              <span style={{ background: 'var(--creme)', borderRadius: 12, padding: '8px 12px' }}>
                <img src={IMG.logo} alt="BLUEN" style={{ height: 36 }} />
              </span>
              <button onClick={() => setOpen(false)} aria-label="Fermer le menu">
                <X size={30} />
              </button>
            </div>
            <nav>
              {[{ to: '/', label: 'Accueil' }, ...NAV].map((item, i) => (
                <motion.div key={item.to} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                  {item.children ? (
                    <>
                      <span className={`mobile-parent ${pathname.startsWith(item.to) ? 'active' : ''}`}>{item.label}</span>
                      <div className="mobile-sub">
                        {item.children.map((c) => (
                          <NavLink key={c.to} to={c.to} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>
                            {c.label} <ArrowRight size={16} />
                          </NavLink>
                        ))}
                      </div>
                    </>
                  ) : (
                    <NavLink to={item.to} end={item.to === '/'} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>
                      {item.label} <ArrowRight size={20} />
                    </NavLink>
                  )}
                </motion.div>
              ))}
            </nav>
            <Link to="/devis" className="btn btn-orange" onClick={() => setOpen(false)}>
              Demander un devis <ArrowRight size={18} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
