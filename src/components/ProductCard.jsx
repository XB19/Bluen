import { Link } from 'react-router-dom';
import { ArrowRight, ImageOff, Tag } from 'lucide-react';
import { DISPONIBILITES } from '../data';

export default function ProductCard({ produit }) {
  const dispo = DISPONIBILITES[produit.disponibilite] || DISPONIBILITES.DISPONIBLE;
  return (
    <Link to={`/catalogue/${produit.slug}`} className="product-card">
      <div className="product-media">
        {produit.images[0] ? <img src={produit.images[0]} alt={produit.nom} loading="lazy" /> : <div className="no-img"><ImageOff size={32} /></div>}
        <span className="product-tag">
          <Tag size={12} /> {produit.categorie?.nom}
        </span>
        <span className={`stock ${dispo.cls}`}>{dispo.label}</span>
      </div>
      <div className="product-body">
        <h4>{produit.nom}</h4>
        <p>{produit.description}</p>
        <div className="product-specs">
          {produit.caracteristiques.slice(0, 2).map((c) => (
            <span key={c.label}>{c.valeur}</span>
          ))}
        </div>
        <span className="link-arrow">
          Voir la fiche <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}
