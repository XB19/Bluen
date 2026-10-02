import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Target, Eye, Heart, Globe2, ListChecks, Cpu, TrendingUp, Handshake,
  Compass, Landmark, HardHat, PlugZap, Settings, MapPin, CheckCircle2,
} from 'lucide-react';
import PageHero from '../components/PageHero';
import { Reveal, Stagger, StaggerItem } from '../components/Motion';
import { SkeletonGrid } from '../components/States';
import { IMG } from '../data';
import { useApi } from '../hooks';

const valeurs = [
  { icon: Target, titre: 'Mission', texte: "Rendre l'énergie propre accessible à tous, partout au Togo." },
  { icon: Eye, titre: 'Vision', texte: 'Fournir des solutions énergétiques fiables et adaptées.' },
  { icon: Heart, titre: 'Valeurs', texte: 'Durabilité, transparence et proximité client.' },
];

const pourquoi = [
  { icon: Globe2, titre: 'Une expertise africaine', texte: 'Installée au Togo, BLUEN comprend les réalités, les enjeux et les opportunités du marché ouest-africain.' },
  { icon: ListChecks, titre: 'Un accompagnement structuré', texte: 'Études, ingénierie, fourniture, installation, maintenance et optimisation continue.' },
  { icon: Cpu, titre: 'Une technologie de pointe', texte: 'Nous sélectionnons des équipements premium (panneaux, onduleurs, batteries...) pour une performance maximale.' },
  { icon: TrendingUp, titre: 'Une vision long terme', texte: 'Nos projets sont conçus pour durer, évoluer et offrir un retour sur investissement solide.' },
  { icon: Handshake, titre: 'Une approche partenariat', texte: 'Chaque client devient un allié stratégique dans la transition énergétique.' },
];

const etapes = [
  { icon: Compass, titre: 'Ingénierie & Études détaillées', texte: 'Analyse des besoins, dimensionnement, études de faisabilité et conception sur mesure.' },
  { icon: Landmark, titre: 'Structuration financière', texte: 'Montage financier adapté, PPA, financement tiers ou accompagnement bancaire.' },
  { icon: HardHat, titre: 'Fourniture & Construction clé en main', texte: 'Fourniture des équipements premium et installation complète par nos techniciens certifiés.' },
  { icon: PlugZap, titre: 'Mise en service', texte: 'Tests, vérifications, formation des équipes et livraison officielle du projet.' },
  { icon: Settings, titre: 'O&M', texte: 'Opération & Maintenance continue pour garantir performance et longévité.' },
];

export default function Apropos() {
  const partenaires = useApi('/partenaires');
  return (
    <>
      <PageHero
        crumb="À propos"
        eyebrow="Qui sommes-nous"
        title="À propos de BLUEN"
        text="BLUEN Togo accompagne particuliers, entreprises et institutions dans leur transition vers une énergie propre et fiable, à travers un catalogue de produits soigneusement sélectionnés et un accompagnement de proximité."
        image={IMG.centraleSol}
      />

      <section className="section">
        <div className="wrap split">
          <Reveal className="split-media" x={-40} y={0}>
            <div className="main"><img src={IMG.reunion} alt="L'équipe BLUEN en réunion" loading="lazy" /></div>
            <motion.div className="float" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }}>
              <img src={IMG.panneauCiel} alt="Panneau solaire" loading="lazy" />
            </motion.div>
          </Reveal>
          <div>
            <Reveal>
              <div className="eyebrow">BLUEN SAS · Lomé</div>
              <h2 style={{ fontSize: 'clamp(30px, 4vw, 44px)', marginBottom: 16 }}>L'énergie réinventée <span className="accent">pour tous</span></h2>
              <p style={{ color: 'var(--gris)', marginBottom: 30 }}>
                Société togolaise spécialisée dans la conception, la fourniture et l'installation de solutions énergétiques innovantes, basées sur les énergies renouvelables et les énergies de transition, dont le Gas to Power.
              </p>
            </Reveal>
            <Stagger className="info-stack" gap={0.12}>
              {valeurs.map((v) => (
                <StaggerItem key={v.titre} className="info-card">
                  <div className="icon-box"><v.icon size={24} /></div>
                  <div>
                    <b>{v.titre}</b>
                    <small style={{ fontSize: 15 }}>{v.texte}</small>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.2} style={{ marginTop: 30 }}>
              <Link to="/contact" className="btn btn-primary">Nous contacter <ArrowRight size={18} /></Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <Reveal className="section-head center">
            <div className="eyebrow">Notre différence</div>
            <h2>Pourquoi BLUEN est votre Meilleur Partenaire</h2>
            <p>Avec des solutions solaires de nouvelle génération et des systèmes Gas to Power modulables, BLUEN accélère la transition énergétique en Afrique de l'Ouest.</p>
          </Reveal>
          <Stagger className="grid-3" gap={0.1}>
            {pourquoi.map((p) => (
              <StaggerItem key={p.titre} className="card">
                <div className="icon-box"><p.icon size={26} /></div>
                <h3>{p.titre}</h3>
                <p>{p.texte}</p>
              </StaggerItem>
            ))}
            <StaggerItem className="card" style={{ background: 'var(--vert-fonce)', borderColor: 'transparent' }}>
              <div className="icon-box" style={{ background: 'var(--jaune)', color: 'var(--vert-nuit)' }}><CheckCircle2 size={26} /></div>
              <h3 style={{ color: 'var(--creme)' }}>Nous ne fournissons pas seulement de l'énergie,</h3>
              <p style={{ color: 'rgba(255,252,244,.8)' }}>Nous construisons l'avenir énergétique de nos partenaires.</p>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      <section className="section section-dark">
        <div className="wrap">
          <Reveal className="section-head center">
            <div className="eyebrow">Notre méthode</div>
            <h2>Processus d'intervention de BLUEN</h2>
            <p>De l'étude à l'exploitation, nous vous accompagnons à chaque étape.</p>
          </Reveal>
          <div className="timeline">
            <div className="timeline-line">
              <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }} />
            </div>
            {etapes.map((e, i) => (
              <Reveal key={e.titre} className="step" delay={0.2 + i * 0.18}>
                <div className="step-circle">
                  <e.icon size={28} />
                  <span className="step-num">{i + 1}</span>
                </div>
                <h4>{e.titre}</h4>
                <p>{e.texte}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="section-head">
            <div>
              <div className="eyebrow">Ils nous font confiance</div>
              <h2>Nos partenaires</h2>
              <p>BLUEN Togo collabore avec des acteurs de référence dans le secteur de l'énergie en Afrique de l'Ouest.</p>
            </div>
          </Reveal>
          {partenaires.loading && <SkeletonGrid count={3} className="grid-3" height={240} />}
          {partenaires.data && <Stagger className="grid-3" gap={0.1}>
            {partenaires.data.map((p) => (
              <StaggerItem key={p.id} className="partner-card">
                {p.logo
                  ? <img src={p.logo} alt={p.nom} className="partner-logo" style={{ objectFit: 'contain', background: '#fff', padding: 6 }} />
                  : <div className="partner-logo">{p.initiales}</div>}
                <h4>{p.nom}</h4>
                <p>{p.description}</p>
                {p.pays && <span className="country"><MapPin size={13} /> {p.pays}</span>}
              </StaggerItem>
            ))}
          </Stagger>}
        </div>
      </section>
    </>
  );
}
