import { Package, FolderKanban, Newspaper, FileText, Handshake, CheckCircle2, Circle, Star, Gift, Briefcase, Tags } from 'lucide-react';
import { CONTRATS, DISPONIBILITES, DOMAINES, FAMILLES, STATUTS_AO, domaineLabel, formatDate, formatMois } from '../data';

const famille = (id) => FAMILLES.find((f) => f.id === id)?.label || id;

const Thumb = ({ src }) => (src ? <img className="thumb" src={src} alt="" /> : <span className="thumb" />);

const Bool = ({ value, yes, no }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5 }} className={value ? 'dot-yes' : 'dot-no'}>
    {value ? <CheckCircle2 size={16} /> : <Circle size={16} />} <span style={{ color: 'var(--encre)' }}>{value ? yes : no}</span>
  </span>
);

const STOCK_BADGES = { DISPONIBLE: 'badge-ouvert', SUR_COMMANDE: 'badge-encours', RUPTURE: 'badge-ferme' };

export const RESOURCES = {
  produits: {
    endpoint: 'produits',
    singular: 'Produit',
    icon: Package,
    titleKey: 'nom',
    searchText: (p) => `${p.nom} ${p.categorie?.nom || ''} ${famille(p.famille)} ${p.description || ''}`,
    empty: () => ({ nom: '', categorie: null, description: '', disponibilite: 'DISPONIBLE', vedette: false, actif: true, ordre: 0, images: [], caracteristiques: [], slug: '' }),
    toBody: (f) => ({
      ...f,
      categorie: f.categorie ? { id: f.categorie.id } : null,
      caracteristiques: f.caracteristiques.filter((c) => c.label.trim() && c.valeur.trim()),
    }),
    columns: [
      { label: '', render: (p) => <Thumb src={p.images[0]} /> },
      { label: 'Produit', render: (p) => <div className="main-cell"><b>{p.nom}</b><small>{p.categorie?.nom} · {famille(p.famille)}</small></div> },
      { label: 'Stock', render: (p) => <span className={`badge ${STOCK_BADGES[p.disponibilite]}`}>{DISPONIBILITES[p.disponibilite].label}</span> },
      { label: 'Site', render: (p) => <Bool value={p.actif} yes="Visible" no="Masqué" /> },
      { label: 'Phare', render: (p) => (p.vedette ? <Star size={18} fill="#FBC02D" color="#C2710A" /> : <span className="dot-no">—</span>) },
    ],
    fields: [
      { key: 'nom', label: 'Nom du produit', required: true },
      {
        key: 'categorie', label: 'Catégorie', type: 'relation', required: true, half: true, endpoint: '/admin/categories',
        labelOf: (c) => `${c.nom} — ${famille(c.famille)}`, hint: 'La famille est déduite de la catégorie.',
      },
      { key: 'disponibilite', label: 'Disponibilité', type: 'select', required: true, half: true, options: Object.entries(DISPONIBILITES).map(([value, d]) => ({ value, label: d.label })) },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'images', label: 'Images', type: 'images', hint: 'La première image est utilisée sur les cartes du catalogue.' },
      { key: 'caracteristiques', label: 'Caractéristiques techniques', type: 'kv' },
      { key: 'actif', label: 'Visibilité', type: 'toggle', toggleLabel: 'Visible sur le site', half: true },
      { key: 'vedette', label: "Page d'accueil", type: 'toggle', toggleLabel: 'Produit phare', half: true },
      { key: 'ordre', label: "Ordre d'affichage", type: 'number', half: true },
      { key: 'slug', label: 'Adresse de la fiche (slug)', half: true, placeholder: 'Générée depuis le nom', hint: 'Laisser vide pour la générer automatiquement.' },
    ],
  },

  categories: {
    endpoint: 'categories',
    singular: 'Catégorie',
    icon: Tags,
    titleKey: 'nom',
    searchText: (c) => `${c.nom} ${famille(c.famille)} ${c.description || ''}`,
    empty: () => ({ nom: '', famille: 'solaire', description: '', ordre: 0, slug: '' }),
    columns: [
      { label: 'Catégorie', render: (c) => <div className="main-cell"><b>{c.nom}</b><small>/{c.slug}</small></div> },
      { label: 'Famille', render: (c) => <span className="muted">{famille(c.famille)}</span> },
      { label: 'Description', render: (c) => <div className="cell-clip muted">{c.description || '—'}</div> },
      { label: 'Ordre', render: (c) => <span className="muted">{c.ordre}</span> },
    ],
    fields: [
      { key: 'nom', label: 'Nom', required: true },
      { key: 'famille', label: 'Famille', type: 'select', required: true, half: true, options: FAMILLES.map((f) => ({ value: f.id, label: f.label })) },
      { key: 'ordre', label: "Ordre d'affichage", type: 'number', half: true },
      { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
      { key: 'slug', label: 'Identifiant URL (slug)', placeholder: 'Généré depuis le nom', hint: 'Utilisé dans les liens du catalogue (ex : panneaux-solaires).' },
    ],
  },

  realisations: {
    endpoint: 'realisations',
    singular: 'Réalisation',
    icon: FolderKanban,
    titleKey: 'titre',
    searchKeys: ['titre', 'lieu', 'description', 'puissance'],
    empty: () => ({ titre: '', lieu: '', date: new Date().toISOString().slice(0, 10), puissance: '', image: '', description: '', publiee: true }),
    columns: [
      { label: '', render: (r) => <Thumb src={r.image} /> },
      { label: 'Projet', render: (r) => <div className="main-cell"><b>{r.titre}</b><small>{r.lieu}</small></div> },
      { label: 'Puissance', render: (r) => <span className="muted">{r.puissance || '—'}</span> },
      { label: 'Date', render: (r) => <span className="muted" style={{ textTransform: 'capitalize' }}>{formatMois(r.date)}</span> },
      { label: 'Statut', render: (r) => <Bool value={r.publiee} yes="Publiée" no="Masquée" /> },
    ],
    fields: [
      { key: 'titre', label: 'Titre du projet', required: true },
      { key: 'lieu', label: 'Lieu', required: true, half: true, placeholder: 'Ex : Lomé' },
      { key: 'date', label: 'Date de réalisation', type: 'date', required: true, half: true },
      { key: 'puissance', label: 'Puissance / volume', placeholder: 'Ex : 250 kWc, 120 lampadaires' },
      { key: 'image', label: 'Photo', type: 'image' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'publiee', label: 'Visibilité', type: 'toggle', toggleLabel: 'Publiée sur le site' },
    ],
  },

  actualites: {
    endpoint: 'actualites',
    singular: 'Actualité',
    icon: Newspaper,
    titleKey: 'titre',
    searchKeys: ['titre', 'categorie', 'resume'],
    empty: () => ({ titre: '', date: new Date().toISOString().slice(0, 10), categorie: '', image: '', resume: '', contenu: '', publie: true }),
    columns: [
      { label: '', render: (a) => <Thumb src={a.image} /> },
      { label: 'Titre', render: (a) => <div className="main-cell cell-clip"><b>{a.titre}</b><small>{a.categorie || 'Sans catégorie'}</small></div> },
      { label: 'Date', render: (a) => <span className="muted">{formatDate(a.date)}</span> },
      { label: 'Statut', render: (a) => <Bool value={a.publie} yes="Publiée" no="Brouillon" /> },
    ],
    fields: [
      { key: 'titre', label: 'Titre', required: true },
      { key: 'date', label: 'Date', type: 'date', required: true, half: true },
      { key: 'categorie', label: 'Catégorie', half: true, suggestions: ['Projet', 'Conseil', 'Innovation', 'Événement'] },
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'resume', label: 'Résumé', type: 'textarea', rows: 3, hint: 'Affiché sur la carte de la page Bons Plans.' },
      { key: 'contenu', label: 'Contenu complet', type: 'textarea', rows: 8 },
      { key: 'publie', label: 'Visibilité', type: 'toggle', toggleLabel: 'Publiée sur le site' },
    ],
  },

  'appels-offres': {
    endpoint: 'appels-offres',
    singular: "Appel d'offres",
    icon: FileText,
    titleKey: 'titre',
    searchKeys: ['reference', 'titre', 'description'],
    empty: () => ({ reference: '', titre: '', description: '', dateLimite: '', statut: 'OUVERT', fichierUrl: '', actif: true }),
    columns: [
      { label: 'Référence', render: (a) => <b style={{ color: 'var(--vert-fonce)' }}>{a.reference}</b> },
      { label: 'Intitulé', render: (a) => <div className="cell-clip">{a.titre}</div> },
      { label: 'Date limite', render: (a) => <span className="muted">{formatDate(a.dateLimite)}</span> },
      { label: 'Statut', render: (a) => <span className={`badge ${STATUTS_AO[a.statut].cls}`}>{STATUTS_AO[a.statut].label}</span> },
      { label: 'Site', render: (a) => <Bool value={a.actif} yes="Visible" no="Masqué" /> },
    ],
    fields: [
      { key: 'reference', label: 'Référence', required: true, half: true, placeholder: 'Ex : AO-2026-015' },
      { key: 'dateLimite', label: 'Date limite', type: 'date', required: true, half: true },
      { key: 'titre', label: 'Intitulé', required: true },
      { key: 'statut', label: 'Statut', type: 'select', options: Object.entries(STATUTS_AO).map(([value, s]) => ({ value, label: s.label })) },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'fichierUrl', label: 'Dossier (PDF)', type: 'file' },
      { key: 'actif', label: 'Visibilité', type: 'toggle', toggleLabel: 'Visible sur le site' },
    ],
  },

  'bons-plans': {
    endpoint: 'bons-plans',
    singular: 'Bon plan',
    icon: Gift,
    titleKey: 'titre',
    searchKeys: ['titre', 'badge', 'description'],
    empty: () => ({ titre: '', badge: 'ZenCard', image: '', description: '', lien: '', ordre: 0, actif: true }),
    columns: [
      { label: '', render: (b) => <Thumb src={b.image} /> },
      { label: 'Offre', render: (b) => <div className="main-cell cell-clip"><b>{b.titre}</b><small>{b.badge || '—'}</small></div> },
      { label: 'Ordre', render: (b) => <span className="muted">{b.ordre}</span> },
      { label: 'Statut', render: (b) => <Bool value={b.actif} yes="Active" no="Masquée" /> },
    ],
    fields: [
      { key: 'titre', label: 'Titre', required: true },
      { key: 'badge', label: 'Badge', half: true, suggestions: ['ZenCard', 'Bon Plan', 'Promo', 'Nouveau'] },
      { key: 'ordre', label: "Ordre d'affichage", type: 'number', half: true },
      { key: 'image', label: 'Affiche', type: 'image', hint: "Avec une affiche, la carte s'agrandit au clic. Sans affiche, elle s'affiche en carte texte." },
      { key: 'description', label: 'Description (carte texte)', type: 'textarea', rows: 3 },
      { key: 'lien', label: 'Lien « Voir le détail »', placeholder: 'https://…' },
      { key: 'actif', label: 'Visibilité', type: 'toggle', toggleLabel: 'Offre active sur le site' },
    ],
  },

  'offres-emploi': {
    endpoint: 'offres-emploi',
    singular: "Offre d'emploi",
    icon: Briefcase,
    titleKey: 'titre',
    searchKeys: ['titre', 'domaine', 'lieu', 'typeContrat'],
    empty: () => ({ titre: '', domaine: '', typeContrat: 'CDI', lieu: 'Lomé, Togo', dateLimite: '', description: '', missions: '', profil: '', publiee: true }),
    toBody: (f) => ({ ...f, dateLimite: f.dateLimite || null }),
    columns: [
      { label: 'Poste', render: (o) => <div className="main-cell"><b>{o.titre}</b><small>{domaineLabel(o.domaine)} · {o.lieu || '—'}</small></div> },
      { label: 'Contrat', render: (o) => <span className="badge badge-ouvert">{o.typeContrat}</span> },
      { label: 'Date limite', render: (o) => <span className="muted">{o.dateLimite ? formatDate(o.dateLimite) : '—'}</span> },
      { label: 'Statut', render: (o) => <Bool value={o.publiee} yes="Publiée" no="Brouillon" /> },
    ],
    fields: [
      { key: 'titre', label: 'Intitulé du poste', required: true },
      { key: 'domaine', label: 'Domaine', type: 'select', required: true, half: true, placeholder: 'Choisir…', options: [...DOMAINES.map((d) => ({ value: d.id, label: d.label })), { value: 'autre', label: 'Autre' }] },
      { key: 'typeContrat', label: 'Type de contrat', type: 'select', required: true, half: true, options: CONTRATS.map((c) => ({ value: c, label: c })) },
      { key: 'lieu', label: 'Lieu', half: true },
      { key: 'dateLimite', label: 'Date limite de candidature', type: 'date', half: true },
      { key: 'description', label: 'Présentation du poste', type: 'textarea', rows: 4 },
      { key: 'missions', label: 'Missions', type: 'textarea', rows: 5, hint: 'Une mission par ligne.' },
      { key: 'profil', label: 'Profil recherché', type: 'textarea', rows: 5 },
      { key: 'publiee', label: 'Visibilité', type: 'toggle', toggleLabel: 'Publiée sur le site' },
    ],
  },

  partenaires: {
    endpoint: 'partenaires',
    singular: 'Partenaire',
    icon: Handshake,
    titleKey: 'nom',
    searchKeys: ['nom', 'pays', 'description'],
    empty: () => ({ nom: '', initiales: '', description: '', pays: '', logo: '', ordre: 0 }),
    columns: [
      { label: '', render: (p) => (p.logo ? <Thumb src={p.logo} /> : <span className="partner-logo" style={{ width: 40, height: 40, fontSize: 13, margin: 0, borderRadius: 10 }}>{p.initiales}</span>) },
      { label: 'Partenaire', render: (p) => <div className="main-cell"><b>{p.nom}</b><small>{p.pays}</small></div> },
      { label: 'Description', render: (p) => <div className="cell-clip muted">{p.description}</div> },
      { label: 'Ordre', render: (p) => <span className="muted">{p.ordre}</span> },
    ],
    fields: [
      { key: 'nom', label: 'Nom', required: true },
      { key: 'initiales', label: 'Initiales (si pas de logo)', half: true, placeholder: 'Ex : ZT' },
      { key: 'pays', label: 'Pays / zone', half: true, placeholder: 'Ex : Togo' },
      { key: 'ordre', label: "Ordre d'affichage", type: 'number', half: true },
      { key: 'logo', label: 'Logo', type: 'image' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
  },
};

export const INBOXES = {
  devis: {
    endpoint: 'devis',
    singular: 'Demande de devis',
    nameOf: (d) => d.nom,
    subtitleOf: (d) => d.produit || 'Demande générale',
    columns: [{ label: 'Produit', render: (d) => d.produit || '—' }, { label: 'Entreprise', render: (d) => d.entreprise || '—' }],
    details: (d) => [['Entreprise', d.entreprise], ['Produit concerné', d.produit]],
    sujet: 'Votre demande de devis BLUEN',
  },
  messages: {
    endpoint: 'messages',
    singular: 'Message',
    nameOf: (d) => d.nom,
    subtitleOf: (d) => d.message.slice(0, 60),
    columns: [{ label: 'Message', render: (d) => <div className="cell-clip">{d.message}</div> }],
    details: () => [],
    sujet: 'Votre message à BLUEN',
  },
  candidatures: {
    endpoint: 'candidatures',
    singular: 'Candidature',
    nameOf: (d) => `${d.prenom} ${d.nom}`,
    subtitleOf: (d) => d.offre || domaineLabel(d.domaine),
    columns: [
      { label: 'Poste visé', render: (d) => d.offre || <em style={{ color: 'var(--gris)' }}>Spontanée</em> },
      { label: 'Domaine', render: (d) => domaineLabel(d.domaine) },
    ],
    details: (d) => [['Poste visé', d.offre || 'Candidature spontanée'], ['Domaine', domaineLabel(d.domaine)]],
    sujet: 'Votre candidature chez BLUEN',
  },
};
