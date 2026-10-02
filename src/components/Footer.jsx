import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';
import { CONTACT, IMG } from '../data';
import { Reveal } from './Motion';
import { FacebookIcon, LinkedinIcon, InstagramIcon, WhatsappIcon } from './SocialIcons';

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ height: 120, background: 'var(--creme)' }} />
      <div className="wrap" style={{ marginTop: -120 }}>
        <Reveal className="footer-cta">
          <div className="rays" />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3>Prêt à passer à une énergie propre et fiable ?</h3>
            <p>Devis gratuit et sans engagement — réponse sous 24h.</p>
          </div>
          <Link to="/devis" className="btn btn-primary">
            Demander un devis <ArrowRight size={18} />
          </Link>
        </Reveal>
      </div>

      <div className="wrap foot-wrap-pull">
        <div className="foot-grid">
          <div>
            <Link to="/" className="foot-logo">
              <img src={IMG.logo} alt="Logo BLUEN Togo" />
            </Link>
            <p>Votre partenaire pour des solutions d'énergie propre, du foyer à l'entreprise.</p>
            <div className="socials">
              <a href="#" aria-label="Facebook"><FacebookIcon /></a>
              <a href="#" aria-label="LinkedIn"><LinkedinIcon /></a>
              <a href="#" aria-label="Instagram"><InstagramIcon /></a>
              <a href={`https://wa.me/${CONTACT.telephone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><WhatsappIcon /></a>
            </div>
          </div>
          <div>
            <h5>Catalogue</h5>
            <ul>
              <li><Link to="/catalogue?famille=solaire&categorie=panneaux-solaires"><ChevronRight size={14} />Panneaux solaires</Link></li>
              <li><Link to="/catalogue?famille=solaire&categorie=onduleurs"><ChevronRight size={14} />Onduleurs</Link></li>
              <li><Link to="/catalogue?famille=solaire&categorie=batteries"><ChevronRight size={14} />Batteries</Link></li>
              <li><Link to="/catalogue?famille=allinone"><ChevronRight size={14} />Éclairage solaire</Link></li>
              <li><Link to="/catalogue?famille=gpl"><ChevronRight size={14} />Gas to Power</Link></li>
            </ul>
          </div>
          <div>
            <h5>Entreprise</h5>
            <ul>
              <li><Link to="/apropos"><ChevronRight size={14} />À propos</Link></li>
              <li><Link to="/realisations"><ChevronRight size={14} />Réalisations</Link></li>
              <li><Link to="/bon-plan"><ChevronRight size={14} />Bons Plans &amp; ZenCard</Link></li>
              <li><Link to="/actualites"><ChevronRight size={14} />Actualités</Link></li>
              <li><Link to="/carriere/offres"><ChevronRight size={14} />Offres d'emploi</Link></li>
              <li><Link to="/carriere/candidature"><ChevronRight size={14} />Candidature</Link></li>
              <li><Link to="/devis"><ChevronRight size={14} />Demander un devis</Link></li>
            </ul>
          </div>
          <div>
            <h5>Contact</h5>
            <ul className="foot-contact">
              <li><MapPin size={17} /> {CONTACT.adresse}</li>
              <li><Phone size={17} /> <a href={CONTACT.telephoneHref}>{CONTACT.telephone}</a></li>
              <li><Mail size={17} /> <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {YEAR} BLUEN Togo — Tous droits réservés</span>
          <span>BLUEN SAS · Filiale du Groupe ZENER</span>
        </div>
      </div>
    </footer>
  );
}
