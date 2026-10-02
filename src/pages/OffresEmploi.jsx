import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, MapPin, CalendarDays, ChevronDown, Send, Layers, ArrowRight } from 'lucide-react';
import PageHero from '../components/PageHero';
import { Reveal, Stagger, StaggerItem } from '../components/Motion';
import { ErrorState, Empty } from '../components/States';
import { AVANTAGES_CARRIERE, DOMAINES, IMG, domaineLabel, formatDate } from '../data';
import { useApi } from '../hooks';

const EASE = [0.22, 1, 0.36, 1];

function JobCard({ offre, open, onToggle }) {
  return (
    <div>
      <button className="job-card" onClick={onToggle} aria-expanded={open}>
        <div className="icon-box"><Briefcase size={24} /></div>
        <div className="job-main">
          <h3>{offre.titre}</h3>
          <div className="job-tags">
            <span className="contrat">{offre.typeContrat}</span>
            <span><Layers size={13} /> {domaineLabel(offre.domaine)}</span>
            {offre.lieu && <span><MapPin size={13} /> {offre.lieu}</span>}
            {offre.dateLimite && <span><CalendarDays size={13} /> Jusqu'au {formatDate(offre.dateLimite)}</span>}
          </div>
        </div>
        <motion.span className="job-go" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={20} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <div className="form-card job-detail" style={{ marginTop: 12, boxShadow: 'none' }}>
              {offre.description && <p>{offre.description}</p>}
              {offre.missions && (<><h4>Missions</h4><p>{offre.missions}</p></>)}
              {offre.profil && (<><h4>Profil recherché</h4><p>{offre.profil}</p></>)}
              <Link to={`/carriere/candidature?offre=${offre.id}`} className="btn btn-orange" style={{ marginTop: 24 }}>
                Postuler à cette offre <Send size={17} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OffresEmploi() {
  const { data, loading, error, reload } = useApi('/offres-emploi');
  const [domaine, setDomaine] = useState('');
  const [ouverte, setOuverte] = useState(null);

  const offres = (data || []).filter((o) => !domaine || o.domaine === domaine);

  return (
    <>
      <PageHero
        crumb="Carrière · Offres d'emploi"
        eyebrow="Rejoignez-nous"
        title="Construisez l'avenir énergétique avec BLUEN"
        text="Chez BLUEN SAS, nous croyons que nos collaborateurs sont notre plus grande force. Nous recherchons des talents passionnés, engagés et prêts à relever les défis de la transition énergétique en Afrique de l'Ouest."
        image={IMG.equipeLagos}
      />

      <section className="section" style={{ paddingBottom: 60 }}>
        <div className="wrap">
          <Stagger className="career-intro" gap={0.1}>
            {AVANTAGES_CARRIERE.map((a) => (
              <StaggerItem key={a.titre} className="card">
                <div className="icon-box"><a.icon size={24} /></div>
                <h3 style={{ fontSize: 19 }}>{a.titre}</h3>
                <p>{a.texte}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <Reveal className="section-head">
            <div>
              <div className="eyebrow">Offres d'emploi</div>
              <h2>Nos postes ouverts</h2>
              <p>Consultez nos offres et postulez en ligne en quelques minutes.</p>
            </div>
          </Reveal>

          <div className="chips" style={{ marginBottom: 26 }}>
            <button className={`chip ${domaine === '' ? 'active' : ''}`} onClick={() => setDomaine('')}>Tous les domaines</button>
            {DOMAINES.map((d) => (
              <button key={d.id} className={`chip ${domaine === d.id ? 'active' : ''}`} onClick={() => setDomaine(d.id)}>
                <d.icon size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />{d.label}
              </button>
            ))}
          </div>

          {loading && <div className="job-list">{[0, 1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 110 }} />)}</div>}
          {error && <ErrorState error={error} onRetry={reload} />}
          {data && offres.length === 0 && (
            <Empty icon={Briefcase} text={domaine ? 'Aucune offre dans ce domaine pour le moment.' : "Aucune offre d'emploi ouverte pour le moment."} />
          )}
          {offres.length > 0 && (
            <Stagger key={domaine} className="job-list" gap={0.08}>
              {offres.map((o) => (
                <StaggerItem key={o.id}>
                  <JobCard offre={o} open={ouverte === o.id} onToggle={() => setOuverte(ouverte === o.id ? null : o.id)} />
                </StaggerItem>
              ))}
            </Stagger>
          )}

          <Reveal className="spontaneous">
            <div className="rays" />
            <div style={{ position: 'relative' }}>
              <h3>Aucune offre ne correspond à votre profil ?</h3>
              <p>Envoyez-nous une candidature spontanée, nous vous contacterons dès qu'une opportunité correspondra à votre profil.</p>
            </div>
            <Link to="/carriere/candidature" className="btn btn-light" style={{ position: 'relative' }}>
              Candidature spontanée <ArrowRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
