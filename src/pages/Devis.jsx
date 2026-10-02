import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { UserRound, Mail, Phone, Building2, Package, MessageSquare, Send, Clock, BadgeCheck, Lightbulb } from 'lucide-react';
import PageHero from '../components/PageHero';
import { Reveal, Stagger, StaggerItem } from '../components/Motion';
import { Field, SuccessBox, FormAlert } from '../components/Form';
import { IMG } from '../data';
import { useApi } from '../hooks';
import { useForm, isEmail } from '../useForm';

const avantages = [
  { icon: Clock, titre: 'Réponse sous 24h', texte: 'Notre équipe revient vers vous rapidement.' },
  { icon: BadgeCheck, titre: 'Devis gratuit et sans engagement', texte: 'Une proposition claire, adaptée à votre budget.' },
  { icon: Lightbulb, titre: 'Conseil personnalisé', texte: 'Dimensionnement et choix des équipements avec un expert.' },
];

const validate = (f) => {
  const err = {};
  if (f.nom.trim().length < 2) err.nom = 'Nom requis (min. 2 caractères)';
  if (!isEmail(f.email)) err.email = 'Email invalide';
  if (!f.telephone.trim()) err.telephone = 'Téléphone requis';
  if (!f.message.trim()) err.message = 'Message requis';
  return err;
};

export default function Devis() {
  const [params] = useSearchParams();
  const produits = useApi('/produits', { size: 100 });
  const form = useForm(
    { nom: '', email: '', telephone: '', entreprise: '', produit: params.get('produit') || '', message: '' },
    { endpoint: '/devis', validate },
  );
  const { values, errors, status, set } = form;
  const liste = produits.data?.content || [];

  return (
    <>
      <PageHero
        crumb="Devis"
        eyebrow="Devis gratuit"
        title="Demandez votre devis"
        text="Sélectionnez un produit, partagez vos besoins, et notre équipe vous répond rapidement avec une proposition adaptée."
        image={IMG.toitureIndus}
      />

      <section className="section">
        <div className="wrap two-col">
          <div className="sticky-col">
            <Reveal>
              <div className="eyebrow">Pourquoi passer par nous</div>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 38px)', marginBottom: 26 }}>Un projet énergétique sur mesure, simplement</h2>
            </Reveal>
            <Stagger className="info-stack" gap={0.12}>
              {avantages.map((a) => (
                <StaggerItem key={a.titre} className="info-card">
                  <div className="icon-box"><a.icon size={24} /></div>
                  <div>
                    <b>{a.titre}</b>
                    <small>{a.texte}</small>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <Reveal className="form-card" delay={0.15}>
            <AnimatePresence mode="wait">
              {status === 'done' ? (
                <SuccessBox
                  key="ok"
                  title="Demande envoyée !"
                  text="Notre équipe vous contactera dans les 24h."
                  action="Faire une nouvelle demande"
                  onAction={form.reset}
                />
              ) : (
                <form key="form" onSubmit={form.submit} noValidate>
                  <h3>Vos informations</h3>
                  <p className="form-subtitle">Les champs marqués * sont obligatoires.</p>
                  <FormAlert message={form.serverError} />
                  <div className="form-row">
                    <Field label="Nom complet *" name="nom" icon={UserRound} placeholder="Ex : Akossiwa Mensah" value={values.nom} onChange={set('nom')} error={errors.nom} />
                    <Field label="Email *" name="email" type="email" icon={Mail} placeholder="vous@exemple.com" value={values.email} onChange={set('email')} error={errors.email} />
                  </div>
                  <div className="form-row">
                    <Field label="Téléphone *" name="telephone" type="tel" icon={Phone} placeholder="+228 90 00 00 00" value={values.telephone} onChange={set('telephone')} error={errors.telephone} />
                    <Field label="Entreprise (optionnel)" name="entreprise" icon={Building2} placeholder="Nom de votre entreprise" value={values.entreprise} onChange={set('entreprise')} />
                  </div>
                  <Field label="Produit concerné" name="produit" as="select" icon={Package} value={values.produit} onChange={set('produit')}>
                    <option value="">Choisir un produit...</option>
                    {liste.map((p) => <option key={p.slug} value={p.slug}>{p.nom}</option>)}
                    <option value="autre">Autre / non listé</option>
                  </Field>
                  <Field label="Votre besoin *" name="message" as="textarea" icon={MessageSquare} placeholder="Décrivez votre projet : type de site, consommation, délais..." value={values.message} onChange={set('message')} error={errors.message} />
                  <button className="btn btn-orange btn-block" disabled={status === 'sending'}>
                    {status === 'sending' ? <><span className="spinner" /> Envoi en cours...</> : <>Envoyer ma demande <Send size={17} /></>}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </section>
    </>
  );
}
