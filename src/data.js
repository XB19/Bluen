import { Rocket, GraduationCap, Users, Cpu, Wrench, Briefcase, Laptop, FolderOpen } from 'lucide-react';

export const IMG = {
  centraleSol: '/images/centrale-sol.jpg',
  parcSolaire: '/images/parc-solaire.jpg',
  panneauxHerbe: '/images/panneaux-herbe.jpg',
  equipeLagos: '/images/equipe-lagos.jpg',
  reunion: '/images/reunion.jpg',
  reunionEquipe: '/images/reunion-equipe.jpg',
  poigneeMain: '/images/poignee-main.jpg',
  ingenieure: '/images/ingenieure.jpg',
  toitureIndus: '/images/toiture-industrielle.jpg',
  reseau: '/images/reseau-electrique.jpg',
  centraleBatiment: '/images/centrale-batiment.jpg',
  panneauxColline: '/images/panneaux-colline.jpg',
  hybride: '/images/hybride.jpg',
  panneauCiel: '/images/panneau-ciel.jpg',
  vueAerienne: '/images/vue-aerienne.jpg',
  logo: '/images/logo.png',
};

export const CONTACT = {
  adresse: 'Lomé, Togo',
  telephone: '+228 93 17 01 01',
  telephoneHref: 'tel:+22893170101',
  email: 'contact@bluen.tg',
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.8062274319377!2d1.3006441999999998!3d6.156701399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023e41c8343f933%3A0x4f93918e10f3acc6!2sZener%20SA!5e0!3m2!1sfr!2stg!4v1782897621515!5m2!1sfr!2stg',
};

export const NAV = [
  { to: '/catalogue', label: 'Nos produits & Services' },
  { to: '/realisations', label: 'Réalisations' },
  { to: '/apropos', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
  { to: '/bon-plan', label: 'Bons Plans' },
  {
    to: '/carriere',
    label: 'Carrière',
    children: [
      { to: '/carriere/offres', label: "Offres d'emploi", desc: 'Nos postes ouverts', icon: Briefcase },
      { to: '/carriere/candidature', label: 'Candidature', desc: 'Postuler ou candidature spontanée', icon: GraduationCap },
    ],
  },
];

export const FAMILLES = [
  { id: 'solaire', label: 'Solutions Solaires', desc: 'Flexibilité, puissance et durabilité', icon: 'Sun' },
  { id: 'allinone', label: 'Éclairage public', desc: 'Lampadaires solaires All-In-One', icon: 'Lightbulb' },
  { id: 'gpl', label: 'Gas to Power', desc: "L'énergie de transition grâce au GPL", icon: 'Flame' },
];

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export const formatMois = (d) =>
  new Date(d).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

export const STATUTS_AO = {
  OUVERT: { label: 'Ouvert', cls: 'badge-ouvert' },
  EN_COURS: { label: 'En cours', cls: 'badge-encours' },
  FERME: { label: 'Fermé', cls: 'badge-ferme' },
};

export const DOMAINES = [
  { id: 'technique', label: 'Technique', icon: Wrench },
  { id: 'commercial', label: 'Commercial', icon: Briefcase },
  { id: 'informatique', label: 'IT', icon: Laptop },
  { id: 'administratif', label: 'Administratif', icon: FolderOpen },
];

export const domaineLabel = (id) => DOMAINES.find((d) => d.id === id)?.label || (id === 'autre' ? 'Autre' : id);

export const AVANTAGES_CARRIERE = [
  { icon: Rocket, titre: 'Impact réel', texte: "Contribuez directement à la transition énergétique de l'Afrique de l'Ouest." },
  { icon: GraduationCap, titre: 'Évolution de carrière', texte: "Des opportunités de formation et d'évolution dans un secteur en forte croissance." },
  { icon: Users, titre: 'Environnement collaboratif', texte: "Une équipe soudée, des projets ambitieux et une culture d'entreprise bienveillante." },
  { icon: Cpu, titre: 'Technologie de pointe', texte: "Travaillez avec les meilleures technologies du marché de l'énergie solaire et GPL." },
];

export const CONTRATS = ['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance'];

const zencard = (id, titre, image) => ({ id, titre, badge: 'ZenCard', image: `/images/zencard/${image}` });

export const BONS_PLANS_DEFAUT = [
  zencard(1, 'ZenCard — Offre Spéciale', 'zencard_pub2.jpg'),
  zencard(2, 'ZenCard — Promotion Exclusive', 'zencard_pub3.jpg'),
  zencard(3, 'ZenCard — Bon Plan #5', 'zencard_pub5.jpg'),
  zencard(4, 'ZenCard — Bon Plan #6', 'zencard_pub6.jpg'),
  zencard(5, 'ZenCard — Bon Plan #7', 'zencard_pub7.jpg'),
  zencard(6, 'ZenCard — Édition Spéciale', 'zencard_pub5b.jpg'),
  zencard(7, 'ZenCard — Offre Limitée', 'zencard_pub6b.jpg'),
  zencard(8, 'ZenCard — Le Produit', 'zencard_product.jpg'),
  {
    id: 9,
    titre: 'Formation Gratuite : Maîtrisez Excel pour les RH',
    badge: 'Bon Plan',
    description: 'Kapi Consult vous offre un accès gratuit à sa formation en ligne "Excel pour les professionnels RH" pour tout abonnement...',
    lien: 'https://kapiconsult.tg/articles/formation-gratuite-maitrisez-excel-pour-les-rh-69b2408f8940d',
  },
];

export const DISPONIBILITES = {
  DISPONIBLE: { label: 'En stock', cls: 'ok' },
  SUR_COMMANDE: { label: 'Sur commande', cls: 'cmd' },
  RUPTURE: { label: 'Rupture de stock', cls: 'out' },
};
