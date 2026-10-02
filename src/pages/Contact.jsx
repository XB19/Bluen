import { AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, UserRound, MessageSquare, Send } from 'lucide-react';
import PageHero from '../components/PageHero';
import { Reveal, Stagger, StaggerItem } from '../components/Motion';
import { Field, SuccessBox, FormAlert } from '../components/Form';
import { FacebookIcon, LinkedinIcon, InstagramIcon, WhatsappIcon } from '../components/SocialIcons';
import { CONTACT, IMG } from '../data';
import { useForm, isEmail } from '../useForm';

const validate = (f) => {
  const err = {};
  if (!f.nom.trim()) err.nom = 'Nom requis';
  if (!isEmail(f.email)) err.email = 'Email invalide';
  if (!f.message.trim()) err.message = 'Message requis';
  return err;
};

const infos = [
  { icon: MapPin, label: 'Adresse', value: CONTACT.adresse },
  { icon: Phone, label: 'Téléphone', value: CONTACT.telephone, href: CONTACT.telephoneHref },
  { icon: Mail, label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { icon: Clock, label: 'Horaires', value: 'Lun – Ven · 8h – 18h' },
];

export default function Contact() {
  const form = useForm({ nom: '', email: '', telephone: '', message: '' }, { endpoint: '/contact', validate });
  const { values, errors, status, set } = form;

  return (
    <>
      <PageHero
        crumb="Contact"
        eyebrow="Parlons de votre projet"
        title="Contactez-nous"
        text="Une question, un projet ? Notre équipe vous répond rapidement."
        image={IMG.poigneeMain}
      />

      <section className="section">
        <div className="wrap">
          <div className="two-col">
            <div>
              <Stagger className="info-stack" gap={0.1}>
                {infos.map((i) => {
                  const content = (
                    <>
                      <div className="icon-box"><i.icon size={24} /></div>
                      <div>
                        <small>{i.label}</small>
                        <b>{i.value}</b>
                      </div>
                    </>
                  );
                  return (
                    <StaggerItem key={i.label}>
                      {i.href ? <a href={i.href} className="info-card">{content}</a> : <div className="info-card">{content}</div>}
                    </StaggerItem>
                  );
                })}
              </Stagger>
              <Reveal delay={0.3} className="socials" style={{ marginTop: 26 }}>
                {[FacebookIcon, LinkedinIcon, InstagramIcon, WhatsappIcon].map((Icon, i) => (
                  <a key={i} href="#" style={{ background: 'var(--vert-fonce)' }} aria-label="Réseau social"><Icon /></a>
                ))}
              </Reveal>
            </div>

            <Reveal className="form-card" delay={0.15}>
              <AnimatePresence mode="wait">
                {status === 'done' ? (
                  <SuccessBox
                    key="ok"
                    title="Message envoyé !"
                    text="Merci, notre équipe vous répondra très rapidement."
                    action="Envoyer un autre message"
                    onAction={form.reset}
                  />
                ) : (
                  <form key="form" onSubmit={form.submit} noValidate>
                    <h3>Écrivez-nous</h3>
                    <p className="form-subtitle">Nous revenons vers vous dans les meilleurs délais.</p>
                    <FormAlert message={form.serverError} />
                    <div className="form-row">
                      <Field label="Nom complet *" name="nom" icon={UserRound} placeholder="Votre nom" value={values.nom} onChange={set('nom')} error={errors.nom} />
                      <Field label="Email *" name="email" type="email" icon={Mail} placeholder="vous@exemple.com" value={values.email} onChange={set('email')} error={errors.email} />
                    </div>
                    <Field label="Téléphone" name="telephone" type="tel" icon={Phone} placeholder="+228 90 00 00 00" value={values.telephone} onChange={set('telephone')} />
                    <Field label="Message *" name="message" as="textarea" icon={MessageSquare} placeholder="Votre message..." value={values.message} onChange={set('message')} error={errors.message} />
                    <button className="btn btn-primary btn-block" disabled={status === 'sending'}>
                      {status === 'sending' ? <><span className="spinner" /> Envoi...</> : <>Envoyer le message <Send size={17} /></>}
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </Reveal>
          </div>

          <Reveal className="map-container">
            <iframe src={CONTACT.mapEmbed} title="Localisation BLUEN à Lomé" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
