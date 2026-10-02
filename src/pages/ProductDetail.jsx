import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, ImageOff, PackageX, ShieldCheck, Truck, Wrench } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '../components/Motion';
import ProductCard from '../components/ProductCard';
import { useApi } from '../hooks';
import { DISPONIBILITES } from '../data';

const BADGES = {
  DISPONIBLE: { cls: 'badge-ouvert', icon: CheckCircle2 },
  SUR_COMMANDE: { cls: 'badge-encours', icon: Clock },
  RUPTURE: { cls: 'badge-ferme', icon: PackageX },
};

export default function ProductDetail() {
  const { slug } = useParams();
  const { data, loading, error } = useApi(`/produits/${encodeURIComponent(slug)}`);
  const [selected, setSelected] = useState(0);

  if (loading) {
    return (
      <section className="section" style={{ paddingTop: 60 }}>
        <div className="wrap fiche">
          <div className="skeleton" style={{ aspectRatio: '4 / 3' }} />
          <div className="skeleton" style={{ height: 460 }} />
        </div>
      </section>
    );
  }

  const produit = data?.produit;
  if (error || !produit) {
    return (
      <section className="section">
        <div className="wrap empty-state">
          <PackageX size={52} />
          <p style={{ marginBottom: 24 }}>Produit introuvable.</p>
          <Link to="/catalogue" className="btn btn-primary"><ArrowLeft size={18} /> Retour au catalogue</Link>
        </div>
      </section>
    );
  }

  const similaires = data.similaires;
  const badge = BADGES[produit.disponibilite];
  const images = produit.images.length ? produit.images : [null];

  return (
    <>
      <section className="section" style={{ paddingTop: 60 }}>
        <div className="wrap">
          <Link to={`/catalogue?famille=${produit.famille}`} className="back-link"><ArrowLeft size={18} /> Retour au catalogue</Link>
          <div className="fiche">
            <Reveal x={-30} y={0}>
              <div className="fiche-main">
                <AnimatePresence mode="wait">
                  {images[selected] ? (
                    <motion.img
                      key={selected}
                      src={images[selected]}
                      alt={produit.nom}
                      initial={{ opacity: 0, scale: 1.06 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  ) : (
                    <div className="no-img"><ImageOff size={48} /></div>
                  )}
                </AnimatePresence>
              </div>
              <div className="fiche-thumbs">
                {produit.images.length > 1 && produit.images.map((img, i) => (
                  <button key={img + i} className={selected === i ? 'selected' : ''} onClick={() => setSelected(i)} aria-label={`Image ${i + 1}`}>
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            </Reveal>

            <Reveal className="fiche-info" x={30} y={0} delay={0.1}>
              <div className="eyebrow">{produit.categorie?.nom}</div>
              <h1>{produit.nom}</h1>
              <span className={`badge ${badge.cls}`} style={{ marginBottom: 18 }}>
                <badge.icon size={14} />
                {DISPONIBILITES[produit.disponibilite].label}
              </span>
              <p className="desc" style={{ marginTop: 16 }}>{produit.description}</p>
              <h4 style={{ fontSize: 18, marginBottom: 12 }}>Caractéristiques</h4>
              <ul className="carac-list">
                {produit.caracteristiques.map((c) => (
                  <li key={c.label}><span>{c.label}</span><span>{c.valeur}</span></li>
                ))}
              </ul>
              <Link to={`/devis?produit=${produit.slug}`} className="btn btn-orange btn-block">
                Demander un devis pour ce produit <ArrowRight size={18} />
              </Link>
              <div className="value-chips" style={{ marginTop: 22 }}>
                <span><ShieldCheck size={16} /> Équipement premium</span>
                <span><Wrench size={16} /> Installation certifiée</span>
                <span><Truck size={16} /> Livraison au Togo</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {similaires.length > 0 && (
        <section className="section section-alt">
          <div className="wrap">
            <Reveal className="section-head"><h2>Produits similaires</h2></Reveal>
            <Stagger className="product-grid">
              {similaires.map((p) => (
                <StaggerItem key={p.slug}><ProductCard produit={p} /></StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}
    </>
  );
}
