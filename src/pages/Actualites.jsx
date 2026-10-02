import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Newspaper, ClipboardList, CalendarDays, ArrowRight, Download, FileText, CircleDot } from 'lucide-react';
import PageHero from '../components/PageHero';
import { Stagger, StaggerItem } from '../components/Motion';
import { SkeletonGrid, ErrorState, Empty } from '../components/States';
import { IMG, STATUTS_AO, formatDate } from '../data';
import { useApi } from '../hooks';

const ONGLETS = [
  { id: 'actualites', label: 'Actualités', icon: Newspaper, empty: 'Aucune actualité pour le moment. Revenez bientôt !' },
  { id: 'appels', label: "Appels d'offres", icon: ClipboardList, empty: "Aucun appel d'offres pour le moment." },
];

export default function Actualites() {
  const [onglet, setOnglet] = useState('actualites');
  const actus = useApi('/actualites');
  const appels = useApi('/appels-offres');
  const current = onglet === 'actualites' ? actus : appels;
  const meta = ONGLETS.find((o) => o.id === onglet);

  return (
    <>
      <PageHero
        crumb="Actualités"
        eyebrow="Restez informé"
        title="Actualités & appels d'offres"
        text="Retrouvez nos actualités, événements et appels d'offres en cours."
        image={IMG.panneauxColline}
      />

      <section className="section">
        <div className="wrap">
          <div style={{ textAlign: 'center' }}>
            <div className="tabs" role="tablist">
              {ONGLETS.map((t) => (
                <button key={t.id} role="tab" aria-selected={onglet === t.id} className={`tab ${onglet === t.id ? 'active' : ''}`} onClick={() => setOnglet(t.id)}>
                  {onglet === t.id && <motion.span layoutId="tab-bg" className="tab-bg" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                  <t.icon size={17} /> {t.label}
                </button>
              ))}
            </div>
          </div>

          {current.loading && <SkeletonGrid count={3} className="grid-3" height={400} />}
          {current.error && <ErrorState error={current.error} onRetry={current.reload} />}
          {current.data?.length === 0 && <Empty icon={meta.icon} text={meta.empty} />}

          <AnimatePresence mode="wait">
            {current.data?.length > 0 && (
              <motion.div key={onglet} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
                {onglet === 'actualites' ? (
                  <Stagger className="grid-3" gap={0.1}>
                    {actus.data.map((a) => (
                      <StaggerItem key={a.id} className="actu-card">
                        <div className="actu-img">
                          {a.image ? <img src={a.image} alt={a.titre} loading="lazy" /> : <div className="no-img"><Newspaper size={36} /></div>}
                          {a.categorie && <span className="actu-badge">{a.categorie}</span>}
                        </div>
                        <div className="actu-body">
                          <span className="actu-date"><CalendarDays size={14} /> {formatDate(a.date)}</span>
                          <h3>{a.titre}</h3>
                          <p>{a.resume}</p>
                          {a.contenu && a.contenu !== a.resume && (
                            <details className="actu-more">
                              <summary className="link-arrow">Lire la suite <ArrowRight size={16} /></summary>
                              <p>{a.contenu}</p>
                            </details>
                          )}
                        </div>
                      </StaggerItem>
                    ))}
                  </Stagger>
                ) : (
                  <Stagger className="info-stack" gap={0.1}>
                    {appels.data.map((ao) => (
                      <StaggerItem key={ao.id} className="ao-card">
                        <div className="ao-left">
                          <div className="icon-box" style={{ margin: 0, flexShrink: 0 }}><FileText size={24} /></div>
                          <div>
                            <span className="ao-ref">{ao.reference}</span>
                            <h3>{ao.titre}</h3>
                            {ao.description && <p style={{ color: 'var(--gris)', fontSize: 14.5, marginBottom: 6 }}>{ao.description}</p>}
                            <span className="ao-date"><CalendarDays size={14} /> Date limite : {formatDate(ao.dateLimite)}</span>
                          </div>
                        </div>
                        <div className="ao-right">
                          <span className={`badge ${STATUTS_AO[ao.statut].cls}`}><CircleDot size={12} /> {STATUTS_AO[ao.statut].label}</span>
                          {ao.fichierUrl && ao.statut !== 'FERME' && (
                            <a href={ao.fichierUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '11px 18px' }}>
                              <Download size={16} /> Télécharger
                            </a>
                          )}
                        </div>
                      </StaggerItem>
                    ))}
                  </Stagger>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
