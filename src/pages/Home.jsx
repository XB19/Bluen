import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import {
  ArrowRight, Sun, Flame, Lightbulb, Zap, ShieldCheck, Leaf, BatteryCharging, Factory, Globe2,
  CheckCircle2, MapPin, Quote, Award, CalendarDays, PackageSearch,
} from 'lucide-react';
import { Reveal, Stagger, StaggerItem, Counter } from '../components/Motion';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid, ErrorState, Empty } from '../components/States';
import { IMG, formatMois } from '../data';
import { useApi } from '../hooks';

const EASE = [0.22, 1, 0.36, 1];

const heroCards = [
  { icon: Sun, titre: 'Énergies renouvelables', sous: 'Solaire, hybride, stockage', statut: 'Actif' },
  { icon: Flame, titre: 'Gas to Power', sous: 'GPL — énergie de transition', statut: 'Actif' },
  { icon: Lightbulb, titre: 'Éclairage public solaire', sous: 'All-In-One autonome', statut: 'Disponible' },
];

const solutions = [
  { icon: Sun, titre: 'Solutions solaires', texte: 'Systèmes résidentiels hybrides, centrales au sol ou en toiture et contrats PPA sans investissement initial.', image: IMG.toitureIndus, lien: '/catalogue?famille=solaire' },
  { icon: Lightbulb, titre: 'Éclairage public All-In-One', texte: 'Lampadaires solaires autonomes : installation rapide, zéro émission et 2 à 3 nuits d’autonomie.', image: IMG.reseau, lien: '/catalogue?famille=allinone' },
  { icon: Flame, titre: 'Gas to Power', texte: 'L’énergie de transition par excellence grâce au GPL : stable, économique et complémentaire du solaire.', image: IMG.centraleBatiment, lien: '/catalogue?famille=gpl' },
];

const marquee = ['Panneaux solaires', 'Onduleurs hybrides', 'Batteries LiFePO4', 'Éclairage All-In-One', 'Gas to Power', 'PPA', 'Maintenance O&M', 'Centrales solaires'];

const atouts = [
  'Une expertise africaine : nous comprenons les réalités du marché ouest-africain.',
  'Un accompagnement structuré, des études à l’optimisation continue.',
  'Des équipements premium pour une performance maximale.',
  'Des projets conçus pour durer et offrir un retour sur investissement solide.',
];

export default function Home() {
  const vedettes = useApi('/produits/vedettes');
  const realisations = useApi('/realisations');
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const raysRotate = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <>
      {/* HERO */}
      <section className="hero" ref={heroRef}>
        <motion.div className="hero-rays" style={{ rotate: raysRotate }} />
        <div className="hero-blob b1" />
        <div className="wrap hero-grid">
          <div className="hero-content">
            <motion.div className="eyebrow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              Énergie propre · Togo
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: EASE }}>
              BLUEN SAS,{' '}
              <span className="accent">
                L'énergie réinventée
                <svg className="underline" viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true">
                  <motion.path
                    d="M2 9 C 80 2, 200 2, 298 8"
                    fill="none" stroke="#FBC02D" strokeWidth="4" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 1.1, ease: EASE }}
                  />
                </svg>
              </span>{' '}
              pour TOUS
            </motion.h1>
            <motion.p className="lead" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5, ease: EASE }}>
              BLUEN SAS est une société togolaise spécialisée dans la conception, la fourniture et l'installation de solutions énergétiques innovantes basées sur les{' '}
              <strong>énergies renouvelables</strong> et les <strong>énergies de transition</strong>, dont le <strong>Gas to Power</strong>.
            </motion.p>
            <motion.p className="lead-sub" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.6, ease: EASE }}>
              Nous apportons aux entreprises, institutions et collectivités des solutions flexibles, fiables et adaptées à leurs besoins actuels et futurs.
            </motion.p>
            <motion.div className="hero-actions" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.7, ease: EASE }}>
              <Link to="/catalogue" className="btn btn-primary">
                Voir le catalogue <ArrowRight size={18} />
              </Link>
              <Link to="/devis" className="btn btn-secondary">
                Demander un devis
              </Link>
            </motion.div>
            <motion.div className="hero-stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.9 }}>
              <div>
                <b><Counter value={120} suffix="+" /></b>
                <span>Produits référencés</span>
              </div>
              <div>
                <b><Counter value={45} /></b>
                <span>Réalisations au Togo</span>
              </div>
              <div>
                <b><Counter value={24} suffix="h" /></b>
                <span>Délai de réponse devis</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.92, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
          >
            <motion.div className="hero-sun" animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
              <Sun size={42} strokeWidth={1.6} />
            </motion.div>
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0, y: [0, 8, 0] }}
              transition={{ opacity: { delay: 1.1 }, x: { delay: 1.1, duration: 0.8 }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 } }}
            >
              <div className="ic"><Award size={22} /></div>
              <div>
                <b>Clé en main</b>
                <span>De l'étude à la maintenance</span>
              </div>
            </motion.div>
            <div className="hero-photo">
              <motion.img src={IMG.panneauCiel} alt="Panneaux solaires BLUEN sous un ciel dégagé" style={{ y: photoY }} />
              <div className="hero-panel">
                {heroCards.map((c, i) => (
                  <motion.div
                    key={c.titre}
                    className="hero-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.9 + i * 0.15, ease: EASE }}
                  >
                    <div className="ic"><c.icon size={20} /></div>
                    <div className="txt">
                      <b>{c.titre}</b>
                      <span className="sub">{c.sous}</span>
                    </div>
                    <span className="pill"><span className="dot" />{c.statut}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...marquee, ...marquee].map((m, i) => (
            <span className="marquee-item" key={i}>
              <Zap size={20} /> {m}
            </span>
          ))}
        </div>
      </div>

      {/* SOLUTIONS */}
      <section className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <div>
              <div className="eyebrow">Nos solutions énergétiques</div>
              <h2>Des solutions flexibles, fiables et <span className="accent">adaptées</span></h2>
            </div>
            <Link to="/catalogue" className="link-arrow">
              Découvrir toutes nos solutions <ArrowRight size={16} />
            </Link>
          </Reveal>
          <Stagger className="grid-3" gap={0.15}>
            {solutions.map((s) => (
              <StaggerItem key={s.titre}>
                <Link to={s.lien} className="solution-card">
                  <img src={s.image} alt={s.titre} loading="lazy" />
                  <div className="icon-box"><s.icon size={26} /></div>
                  <h3>{s.titre}</h3>
                  <p>{s.texte}</p>
                  <span className="link-arrow">En savoir plus <ArrowRight size={16} /></span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* PRODUITS PHARES */}
      <section className="section section-alt">
        <div className="wrap">
          <Reveal className="section-head">
            <div>
              <div className="eyebrow">Catalogue</div>
              <h2>Produits phares</h2>
              <p>Une sélection de nos équipements les plus demandés.</p>
            </div>
            <Link to="/catalogue" className="btn btn-secondary">
              Voir tout le catalogue <ArrowRight size={18} />
            </Link>
          </Reveal>
          {vedettes.loading ? (
            <SkeletonGrid count={4} />
          ) : vedettes.error ? (
            <ErrorState error={vedettes.error} onRetry={vedettes.reload} />
          ) : vedettes.data.length === 0 ? (
            <Empty icon={PackageSearch} text="Aucun produit au catalogue pour le moment." />
          ) : (
            <Stagger className="product-grid" gap={0.1}>
              {(vedettes.data || []).map((p) => (
                <StaggerItem key={p.slug}>
                  <ProductCard produit={p} />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>

      {/* POURQUOI */}
      <section className="section">
        <div className="wrap split">
          <Reveal className="split-media" x={-40} y={0}>
            <div className="main"><img src={IMG.ingenieure} alt="Ingénieure BLUEN avec sa tablette dans une salle technique" loading="lazy" /></div>
            <motion.div className="float" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3, ease: EASE }}>
              <img src={IMG.vueAerienne} alt="Vue aérienne d'une centrale solaire" loading="lazy" />
            </motion.div>
          </Reveal>
          <Reveal x={40} y={0}>
            <div className="eyebrow">Notre différence</div>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 44px)' }}>Pourquoi BLUEN est votre <span className="accent">meilleur partenaire</span></h2>
            <p style={{ color: 'var(--gris)', marginTop: 16 }}>
              Avec des solutions solaires de nouvelle génération et des systèmes Gas to Power modulables, BLUEN accélère la transition énergétique en Afrique de l'Ouest.
            </p>
            <ul className="check-list">
              {atouts.map((a) => (
                <li key={a}><CheckCircle2 size={22} /> {a}</li>
              ))}
            </ul>
            <Link to="/apropos" className="btn btn-primary">
              Découvrir BLUEN <ArrowRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      <section style={{ paddingBottom: 110 }}>
        <div className="wrap">
          <Reveal className="stats-band">
            <div><b><Counter value={120} suffix="+" /></b>Produits référencés</div>
            <div><b><Counter value={45} /></b>Réalisations au Togo</div>
            <div><b><Counter value={3} /></b>Pays couverts avec nos partenaires</div>
            <div><b><Counter value={24} suffix="h" /></b>Délai de réponse devis</div>
          </Reveal>
        </div>
      </section>

      {/* ENGAGEMENTS */}
      <section className="section section-dark" style={{ overflow: 'hidden' }}>
        <div className="wrap">
          <Reveal className="section-head center">
            <div className="eyebrow">Nos engagements</div>
            <h2>Une énergie disponible, optimisée, durable et économique</h2>
            <p>Nous intégrons les meilleures technologies du marché, sélectionnées pour leur fiabilité, leur performance et leur rapport qualité-prix.</p>
          </Reveal>
          <Stagger className="grid-4" gap={0.12}>
            {[
              { icon: Zap, t: 'Disponible', d: 'Une continuité énergétique stable, jour et nuit.' },
              { icon: BatteryCharging, t: 'Optimisée', d: 'Systèmes hybrides intelligents et stockage LiFePO4.' },
              { icon: Leaf, t: 'Durable', d: 'Zéro émission et équipements conçus pour durer.' },
              { icon: ShieldCheck, t: 'Économique', d: 'Coûts maîtrisés et retour sur investissement solide.' },
            ].map((e) => (
              <StaggerItem key={e.t} className="partner-card">
                <div className="icon-box" style={{ background: 'rgba(251,192,45,.12)', color: 'var(--jaune)' }}><e.icon size={26} /></div>
                <h4>{e.t}</h4>
                <p style={{ marginBottom: 0 }}>{e.d}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* REALISATIONS */}
      <section className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <div>
              <div className="eyebrow">Nos références terrain</div>
              <h2>Réalisations au Togo</h2>
              <p>Quelques projets menés par BLUEN Togo sur le terrain.</p>
            </div>
            <Link to="/realisations" className="link-arrow">
              Toutes nos réalisations <ArrowRight size={16} />
            </Link>
          </Reveal>
          {realisations.loading && <SkeletonGrid count={3} className="grid-3" height={420} />}
          {realisations.error && <ErrorState error={realisations.error} onRetry={realisations.reload} />}
          {realisations.data && <Stagger className="grid-3" gap={0.15}>
            {realisations.data.slice(0, 3).map((r) => (
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

      {/* QUOTE */}
      <section style={{ paddingBottom: 60 }}>
        <div className="wrap">
          <Reveal className="quote-block">
            <Quote size={44} className="qicon" />
            <p className="big">
              Nous ne fournissons pas seulement de l'énergie, nous construisons l'avenir énergétique de nos partenaires.
            </p>
            <div className="value-chips">
              <span><Factory size={17} /> Entreprises</span>
              <span><Globe2 size={17} /> Institutions</span>
              <span><MapPin size={17} /> Collectivités</span>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
