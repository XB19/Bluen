import { Link } from 'react-router-dom';
import {
  FileSignature, Mail, Briefcase, Package, FolderKanban, FileText, Users, ArrowUpRight, Plus, BriefcaseBusiness,
} from 'lucide-react';
import { Stagger, StaggerItem, Counter } from '../components/Motion';
import { ErrorState } from '../components/States';
import { useApi } from '../hooks';
import BarChart from './BarChart';
import { StatusPill, formatDateTime } from './ui';

const SERIES = [
  { key: 'devis', label: 'Devis', color: '#2E8540' },
  { key: 'messages', label: 'Messages', color: '#3A78C9' },
  { key: 'candidatures', label: 'Candidatures', color: '#C2710A' },
];

export default function Dashboard() {
  const { data, loading, error, reload } = useApi('/admin/dashboard');

  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (loading) {
    return (
      <>
        <div className="tiles">{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 150 }} />)}</div>
        <div className="dash-grid"><div className="skeleton" style={{ height: 380 }} /><div className="skeleton" style={{ height: 380 }} /></div>
      </>
    );
  }

  const c = data.compteurs;
  const tiles = [
    { to: '/admin/devis', icon: FileSignature, value: c.devisNouveaux, label: 'Devis à traiter', hint: `${c.devisTotal} au total`, hero: true },
    { to: '/admin/messages', icon: Mail, value: c.messagesNouveaux, label: 'Nouveaux messages' },
    { to: '/admin/candidatures', icon: Briefcase, value: c.candidaturesNouvelles, label: 'Nouvelles candidatures' },
    { to: '/admin/produits', icon: Package, value: c.produits, label: 'Produits au catalogue' },
    { to: '/admin/realisations', icon: FolderKanban, value: c.realisations, label: 'Réalisations publiées' },
    { to: '/admin/appels-offres', icon: FileText, value: c.appelsOuverts, label: "Appels d'offres ouverts" },
    { to: '/admin/offres-emploi', icon: BriefcaseBusiness, value: c.offresEmploi, label: "Offres d'emploi publiées" },
    { to: '/admin/utilisateurs', icon: Users, value: c.utilisateurs, label: 'Comptes utilisateurs' },
  ];

  return (
    <>
      <Stagger className="tiles" gap={0.06}>
        {tiles.map((t) => (
          <StaggerItem key={t.to + t.label}>
            <Link to={t.to} className={`tile ${t.hero ? 'hero' : ''}`}>
              <div className="tile-top">
                <div className="icon-box"><t.icon size={22} /></div>
                {t.hint ? <span className="hint">{t.hint}</span> : <ArrowUpRight size={18} color="var(--gris)" />}
              </div>
              <div className="value"><Counter value={t.value} duration={1.2} /></div>
              <div className="label">{t.label}</div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="dash-grid">
        <section className="panel">
          <div className="panel-head" style={{ marginBottom: 8 }}>
            <div>
              <h2>Demandes reçues</h2>
              <p>Six derniers mois</p>
            </div>
          </div>
          <BarChart data={data.evolution} series={SERIES} />
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Derniers devis</h2>
              <p>Demandes les plus récentes</p>
            </div>
            <Link to="/admin/devis" className="link-btn">Tout voir <ArrowUpRight size={15} /></Link>
          </div>
          {data.derniersDevis.length === 0 ? (
            <p className="muted" style={{ color: 'var(--gris)', padding: '20px 0' }}>Aucune demande de devis pour le moment.</p>
          ) : (
            <div className="recent">
              {data.derniersDevis.map((d) => (
                <Link to="/admin/devis" key={d.id} className="recent-item">
                  <span className="avatar">{d.nom.slice(0, 2).toUpperCase()}</span>
                  <div className="info">
                    <b>{d.nom}</b>
                    <small>{d.produit || 'Demande générale'} · {formatDateTime(d.createdAt)}</small>
                  </div>
                  <StatusPill value={d.statut} />
                </Link>
              ))}
            </div>
          )}
          <div className="quick">
            <Link to="/admin/produits?nouveau=1"><Plus size={16} /> Nouveau produit</Link>
            <Link to="/admin/realisations?nouveau=1"><Plus size={16} /> Nouvelle réalisation</Link>
            <Link to="/admin/actualites?nouveau=1"><Plus size={16} /> Nouvelle actualité</Link>
            <Link to="/admin/offres-emploi?nouveau=1"><Plus size={16} /> Offre d'emploi</Link>
          </div>
        </section>
      </div>
    </>
  );
}
