import { CalendarDays, MapPin, Zap, CheckCircle2, FolderOpen } from 'lucide-react';
import PageHero from '../components/PageHero';
import { Reveal, Stagger, StaggerItem } from '../components/Motion';
import { SkeletonGrid, ErrorState, Empty } from '../components/States';
import { IMG, formatMois } from '../data';
import { useApi } from '../hooks';

const qualites = ['Disponible', 'Optimisée', 'Durable', 'Économique'];

export default function Realisations() {
  const { data, loading, error, reload } = useApi('/realisations');

  return (
    <>
      <PageHero
        crumb="Réalisations"
        eyebrow="Nos références terrain"
        title="Chez BLUEN, l'innovation au service de la performance"
        image={IMG.parcSolaire}
      />

      <section className="section">
        <div className="wrap">
          <Reveal className="quote-block">
            <p className="big">
              Nous croyons que <span className="accent">CHAQUE CLIENT EST UN PARTENAIRE</span>, et que l'énergie doit être :
            </p>
            <div className="value-chips">
              {qualites.map((q) => (
                <span key={q}><CheckCircle2 size={17} /> {q}</span>
              ))}
            </div>
            <p style={{ color: 'var(--gris)', marginTop: 24, maxWidth: 760 }}>
              C'est pourquoi nous intégrons les meilleures technologies du marché, sélectionnées pour leur fiabilité, leur performance et leur rapport qualité-prix exceptionnel.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <Reveal className="section-head">
            <div>
              <h2>Nos réalisations</h2>
              <p>Quelques projets menés par BLUEN Togo sur le terrain.</p>
            </div>
          </Reveal>
          {loading && <SkeletonGrid count={6} className="grid-3" height={420} />}
          {error && <ErrorState error={error} onRetry={reload} />}
          {data?.length === 0 && <Empty icon={FolderOpen} text="Aucune réalisation publiée pour le moment." />}
          {data?.length > 0 && <Stagger className="grid-3" gap={0.1}>
            {data.map((r) => (
              <StaggerItem key={r.id} className="real-card">
                <div className="real-img">
                  {r.image ? <img src={r.image} alt={r.titre} loading="lazy" /> : <div className="no-img" />}
                  <span className="real-power"><Zap size={14} /> {r.puissance}</span>
                </div>
                <div className="real-body">
                  <div className="real-meta">
                    <span><MapPin size={14} /> {r.lieu}</span>
                    <span><CalendarDays size={14} /> {formatMois(r.date)}</span>
                  </div>
                  <h3>{r.titre}</h3>
                  <p>{r.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>}
        </div>
      </section>
    </>
  );
}
