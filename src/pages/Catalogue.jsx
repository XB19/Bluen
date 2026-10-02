import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search, Sun, Lightbulb, Flame, Home as HomeIcon, Factory, FileSignature, Check, PackageSearch,
  ChevronLeft, ChevronRight, Zap, Coins, Globe2, ArrowRight,
} from 'lucide-react';
import PageHero from '../components/PageHero';
import ProductCard from '../components/ProductCard';
import { Reveal, Stagger, StaggerItem } from '../components/Motion';
import { SkeletonGrid, ErrorState } from '../components/States';
import { FAMILLES, IMG } from '../data';
import { useApi } from '../hooks';

const ICONS = { Sun, Lightbulb, Flame };
const PAR_PAGE = 8;

const solaires = [
  { icon: HomeIcon, titre: 'Solutions domestiques', points: ['Systèmes résidentiels hybrides avec ou sans batteries LiFePO4', 'Optimisation des consommations'] },
  { icon: Factory, titre: 'Solutions industrielles & tertiaires', points: ['Centrales solaires au sol ou en toiture', 'Systèmes hybrides intelligents', 'Optimisation énergétique pour bâtiments, usines, sites isolés'] },
  { icon: FileSignature, titre: 'PPA – Power Purchase Agreements', points: ["Contrats d'achat d'énergie longue durée", 'Production déléguée sans investissement initial pour le client', 'Garanties de performance'] },
];

const allInOne = [
  'Installation simple et rapide',
  'Solution très rentable',
  'Écologiques et zéro émission',
  'Technologie intelligente intégrée (contrôleurs intelligents, gradation automatique, détection de présence)',
  'Batteries longue durée — autonomie de 2 à 3 nuits en cas de mauvais temps',
  'Faible entretien et durabilité élevée',
  'Poteau en acier galvanisé (Q235)',
  'Adaptés à de nombreuses applications (rues, routes, parcs, campus, zones rurales, chantiers...)',
];

const gpl = {
  atouts: ['Excellente puissance calorifique', 'Grande constance de performance même en conditions difficiles', 'Stockage sécurisé et modulable', 'Approvisionnement fiable et régulier'],
  benefices: ['Coût maîtrisé et compétitif', 'Maintenance réduite', 'Équipements durables'],
  permet: ['Une continuité énergétique stable', "Une réduction des coûts d'exploitation", 'Une diminution des émissions', 'Une parfaite complémentarité avec le solaire'],
};

function Bullets({ items, icon: Icon = Check }) {
  return (
    <ul className="feature-list">
      {items.map((i) => (
        <li key={i}><Icon size={16} /> {i}</li>
      ))}
    </ul>
  );
}

function useDebounced(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function Catalogue() {
  const [params, setParams] = useSearchParams();
  const familleActive = params.get('famille') || 'solaire';
  const categorie = params.get('categorie') || 'Toutes';
  const page = Number(params.get('page')) || 1;
  const [query, setQuery] = useState('');
  const q = useDebounced(query.trim());

  const cats = useApi('/produits/categories', { famille: familleActive });
  const categories = [{ slug: 'Toutes', nom: 'Toutes' }, ...(cats.data || [])];
  const produits = useApi('/produits', {
    famille: familleActive,
    categorie: categorie === 'Toutes' ? undefined : categorie,
    q,
    page,
    size: PAR_PAGE,
  });
  const visibles = produits.data?.content || [];
  const pages = produits.data?.totalPages || 1;

  const update = (next) => {
    const merged = { famille: familleActive, categorie, page, ...next };
    const clean = {};
    Object.entries(merged).forEach(([k, v]) => {
      if (v && v !== 'Toutes' && !(k === 'page' && v === 1)) clean[k] = String(v);
    });
    setParams(clean, { replace: true });
  };

  const choisirFamille = (id) => update({ famille: id, categorie: 'Toutes', page: 1 });
  const setCategorie = (c) => update({ categorie: c, page: 1 });
  const setPage = (p) => update({ page: p });

  return (
    <>
      <PageHero
        crumb="Nos produits & Services"
        eyebrow="Catalogue"
        title="Nos solutions énergétiques"
        text="Filtrez par catégorie, recherchez un produit et consultez les fiches détaillées."
        image={IMG.vueAerienne}
      />

      <section className="section">
        <div className="wrap">
          <Reveal className="family-tabs">
            {FAMILLES.map((f) => {
              const Icon = ICONS[f.icon];
              return (
                <button key={f.id} className={`family-tab ${familleActive === f.id ? 'active' : ''}`} onClick={() => choisirFamille(f.id)}>
                  <div className="icon-box"><Icon size={24} /></div>
                  <div>
                    <b>{f.label}</b>
                    <span>{f.desc}</span>
                  </div>
                </button>
              );
            })}
          </Reveal>

          <AnimatePresence mode="wait">
            <motion.div key={familleActive} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45 }}>
              {familleActive === 'solaire' && (
                <div className="solution-detail">
                  <h3>Nos solutions solaires</h3>
                  <p className="subtitle">Flexibilité, puissance et durabilité</p>
                  {solaires.map((s) => (
                    <div className="sub-family" key={s.titre}>
                      <div className="icon-box"><s.icon size={22} /></div>
                      <div>
                        <h4>{s.titre}</h4>
                        <ul>{s.points.map((p) => <li key={p}><Check size={14} /> {p}</li>)}</ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {familleActive === 'allinone' && (
                <div className="solution-detail">
                  <h3>Éclairage public – ALL IN ONE</h3>
                  <p className="subtitle">Les lampadaires solaires All-In-One réduisent fortement les dépenses d'exploitation grâce à leur autonomie complète.</p>
                  <Bullets items={allInOne} icon={Zap} />
                </div>
              )}
              {familleActive === 'gpl' && (
                <div className="solution-detail">
                  <h3>Gas to Power</h3>
                  <p className="subtitle">L'énergie de transition par excellence — grâce au GPL</p>
                  <div className="sub-family">
                    <div className="icon-box"><Zap size={22} /></div>
                    <div>
                      <h4>Une énergie performante & économique</h4>
                      <p style={{ color: 'var(--gris)', fontSize: 14.5, marginBottom: 12 }}>Le GPL est reconnu pour son excellent rendement énergétique et sa stabilité d'utilisation. Atouts techniques :</p>
                      <Bullets items={gpl.atouts} />
                    </div>
                  </div>
                  <div className="sub-family">
                    <div className="icon-box"><Coins size={22} /></div>
                    <div>
                      <h4>Bénéfices économiques</h4>
                      <Bullets items={gpl.benefices} />
                    </div>
                  </div>
                  <div className="sub-family">
                    <div className="icon-box"><Globe2 size={22} /></div>
                    <div>
                      <h4>Filiale du Groupe ZENER</h4>
                      <p style={{ color: 'var(--gris)', fontSize: 14.5, marginBottom: 12 }}>Nos solutions Gas to Power permettent :</p>
                      <Bullets items={gpl.permet} />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="section section-alt" id="produits">
        <div className="wrap">
          <Reveal className="section-head">
            <div>
              <div className="eyebrow">Produits</div>
              <h2>Parcourez nos produits disponibles</h2>
            </div>
          </Reveal>

          <div className="toolbar">
            <div className="chips">
              {categories.map((c) => (
                <button key={c.slug} className={`chip ${categorie === c.slug ? 'active' : ''}`} onClick={() => setCategorie(c.slug)}>
                  {c.nom}
                </button>
              ))}
            </div>
            <div className="search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Rechercher un produit (ex : panneau, batterie, onduleur...)"
                value={query}
                onChange={(e) => { setQuery(e.target.value); if (page !== 1) setPage(1); }}
              />
            </div>
          </div>

          <p className="result-count">
            <b>{produits.data?.totalElements ?? '…'}</b> produit(s) disponible(s) — sélectionnez une famille puis filtrez par catégorie.
          </p>

          {produits.loading ? (
            <SkeletonGrid count={4} />
          ) : produits.error ? (
            <ErrorState error={produits.error} onRetry={produits.reload} />
          ) : visibles.length === 0 ? (
            <div className="empty-state">
              <PackageSearch size={48} />
              <p>Aucun produit trouvé.</p>
            </div>
          ) : (
            <Stagger key={`${familleActive}-${categorie}-${q}-${page}`} className="product-grid" gap={0.07}>
              {visibles.map((p) => (
                <StaggerItem key={p.slug}>
                  <ProductCard produit={p} />
                </StaggerItem>
              ))}
            </Stagger>
          )}

          {pages > 1 && (
            <div className="chips" style={{ justifyContent: 'center', marginTop: 40 }}>
              <button className="chip" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft size={16} /></button>
              <span className="chip" style={{ cursor: 'default' }}>Page {page} / {pages}</span>
              <button className="chip" disabled={page === pages} onClick={() => setPage(page + 1)}>Suivant <ChevronRight size={16} /></button>
            </div>
          )}

          <Reveal style={{ textAlign: 'center', marginTop: 56 }}>
            <p style={{ color: 'var(--gris)', marginBottom: 18 }}>Vous ne trouvez pas le produit recherché ?</p>
            <Link to="/devis" className="btn btn-primary">Demander un devis personnalisé <ArrowRight size={18} /></Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
