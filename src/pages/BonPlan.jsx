import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CreditCard, ZoomIn, ArrowRight, Lightbulb, X, Construction, Phone, Gift } from 'lucide-react';
import { Reveal, Stagger, StaggerItem, Counter } from '../components/Motion';
import { SkeletonGrid, Empty } from '../components/States';
import { BONS_PLANS_DEFAUT, IMG } from '../data';
import { useApi } from '../hooks';

const EASE = [0.22, 1, 0.36, 1];
const fadeUp = (delay) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay, ease: EASE } });

function RechargeModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="zc-bg" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="zc-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="zc-title"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <button className="zc-close" onClick={onClose} aria-label="Fermer"><X size={20} /></button>
            <div className="zc-icon"><CreditCard size={32} /></div>
            <h2 id="zc-title">Recharge ZenCard</h2>
            <p className="zc-sub">Rechargez votre carte avantages en quelques clics.</p>
            <div className="zc-soon">
              <Construction size={30} />
              <b>Service bientôt disponible</b>
              <span>La recharge en ligne est en cours de déploiement. Contactez-nous pour toute urgence.</span>
            </div>
            <div className="zc-actions">
              <Link to="/contact" className="zc-btn primary" onClick={onClose}><Phone size={16} /> Nous contacter</Link>
              <button className="zc-btn ghost" onClick={onClose}>Fermer</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Lightbox({ items, index, onClose, onMove }) {
  const item = index !== null ? items[index] : null;

  useEffect(() => {
    if (index === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onMove(1);
      if (e.key === 'ArrowLeft') onMove(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, onClose, onMove]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div className="lb-bg" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.figure
            key={item.id}
            className="lb-figure"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <button className="lb-close" onClick={onClose} aria-label="Fermer"><X size={18} /></button>
            <img src={item.image} alt={item.titre} />
            <figcaption>{item.titre}</figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function BonPlan() {
  const api = useApi('/bons-plans');
  const loading = api.loading;
  const data = api.error ? BONS_PLANS_DEFAUT : api.data;
  const [recharge, setRecharge] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const affiches = (data || []).filter((b) => b.image);
  const move = useCallback((step) => setLightbox((i) => (i + step + affiches.length) % affiches.length), [affiches.length]);
  const closeRecharge = useCallback(() => setRecharge(false), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  return (
    <>
      <section className="bp-hero" style={{ backgroundImage: `linear-gradient(135deg, rgba(20,63,31,.9) 0%, rgba(10,32,16,.95) 100%), url(${IMG.vueAerienne})` }}>
        <span className="bp-glow gold" />
        <span className="bp-glow green" />
        <div className="wrap bp-hero-inner">
          <motion.div className="bp-kicker" {...fadeUp(0)}>BLUEN Togo</motion.div>
          <motion.h1 {...fadeUp(0.1)}>
            Bons Plans <span className="bp-amp">&amp;</span> ZenCard
          </motion.h1>
          <motion.p {...fadeUp(0.2)}>Offres spéciales, promotions et avantages exclusifs sélectionnés pour vous.</motion.p>
          <motion.div {...fadeUp(0.35)}>
            <button className="bp-recharge" onClick={() => setRecharge(true)}>
              <CreditCard size={20} /> Recharger ma ZenCard
            </button>
          </motion.div>
          <motion.div className="bp-stats" {...fadeUp(0.5)}>
            <div>
              <b>{data ? <Counter value={data.length} duration={1} /> : '–'}</b>
              <span>Offres actives</span>
            </div>
            <i />
            <div>
              <b className="gold">ZenCard</b>
              <span>Votre carte avantages</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bp-section">
        <div className="wrap">
          <Reveal className="bp-head">
            <span className="bp-tag">Offres &amp; Promotions</span>
            <h2>Nos bons plans du moment</h2>
          </Reveal>

          {loading && <SkeletonGrid count={6} className="bp-grid" height={440} />}
          {data?.length === 0 && <Empty icon={Gift} text="Aucun bon plan pour le moment. Revenez bientôt !" />}

          {data?.length > 0 && (
            <Stagger className="bp-grid" gap={0.05}>
              {data.map((b) => (
                <StaggerItem key={b.id}>
                  {b.image ? (
                    <button className="bp-card" onClick={() => setLightbox(affiches.indexOf(b))}>
                      {b.badge && <span className="bp-badge">{b.badge}</span>}
                      <img className="bp-img" src={b.image} alt={b.titre} loading="lazy" />
                      <span className="bp-overlay"><ZoomIn size={16} /> Agrandir</span>
                      <span className="bp-footer">
                        <span className="bp-name">{b.titre}</span>
                        <ArrowRight size={16} />
                      </span>
                    </button>
                  ) : (
                    <div className="bp-text-card">
                      <div className="bp-text-icon"><Lightbulb size={22} /></div>
                      {b.badge && <span className="bp-text-badge">{b.badge}</span>}
                      <h3>{b.titre}</h3>
                      {b.description && <p>{b.description}</p>}
                      {b.lien && (
                        <a href={b.lien} target="_blank" rel="noreferrer" className="bp-more">
                          Voir le détail <ArrowRight size={14} />
                        </a>
                      )}
                    </div>
                  )}
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>

      <RechargeModal open={recharge} onClose={closeRecharge} />
      <Lightbox items={affiches} index={lightbox} onClose={closeLightbox} onMove={move} />
    </>
  );
}
