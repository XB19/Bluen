import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { UserRound, Mail, Phone, Layers, MessageSquare, Send, Briefcase, X, ArrowRight, FileText, Upload } from 'lucide-react';
import PageHero from '../components/PageHero';
import { Reveal } from '../components/Motion';
import { Field, SuccessBox, FormAlert } from '../components/Form';
import { DOMAINES, IMG } from '../data';
import { useApi } from '../hooks';
import { useForm, isEmail } from '../useForm';

const CV_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const CV_MAX = 5 * 1024 * 1024;

const validate = (f) => {
  const err = {};
  if (!f.nom.trim()) err.nom = 'Requis';
  if (!f.prenom.trim()) err.prenom = 'Requis';
  if (!isEmail(f.email)) err.email = 'Email invalide';
  if (!f.domaine) err.domaine = 'Requis';
  if (f.message.trim().length < 50) err.message = 'Minimum 50 caractères requis';
  if (f.cv && !CV_TYPES.includes(f.cv.type)) err.cv = 'Le CV doit être au format PDF, DOC ou DOCX';
  else if (f.cv && f.cv.size > CV_MAX) err.cv = 'Le CV ne doit pas dépasser 5 Mo';
  return err;
};

function CvInput({ file, onChange, error }) {
  const [over, setOver] = useState(false);
  return (
    <div className={`form-field ${error ? 'has-error' : ''}`}>
      <label>CV (optionnel)</label>
      {file ? (
        <div className="cv-file">
          <FileText size={20} />
          <span>
            <b>{file.name}</b>
            <small>{(file.size / 1024 / 1024).toFixed(2)} Mo</small>
          </span>
          <button type="button" onClick={() => onChange(null)} aria-label="Retirer le CV"><X size={16} /></button>
        </div>
      ) : (
        <label
          className={`cv-drop ${over ? 'over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => { e.preventDefault(); setOver(false); onChange(e.dataTransfer.files[0] || null); }}
        >
          <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => onChange(e.target.files[0] || null)} />
          <Upload size={22} />
          <span><b>Glissez votre CV ici</b> ou cliquez pour le choisir</span>
          <small>PDF, DOC ou DOCX — 5 Mo maximum</small>
        </label>
      )}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

function OffreBanner({ id, onReady, onClear }) {
  const { data } = useApi(`/offres-emploi/${id}`);
  useEffect(() => {
    if (data) onReady(data);
  }, [data, onReady]);
  if (!data) return null;
  return (
    <motion.div className="offer-banner" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
      <Briefcase size={18} />
      <span>Vous postulez à : <b>{data.titre}</b> ({data.typeContrat})</span>
      <button type="button" onClick={onClear} aria-label="Candidature spontanée plutôt"><X size={16} /></button>
    </motion.div>
  );
}

export default function Candidature() {
  const [params, setParams] = useSearchParams();
  const offreId = params.get('offre');
  const { values: form, setValues, errors, status, serverError, set, submit, reset } = useForm(
    { nom: '', prenom: '', email: '', telephone: '', domaine: '', offre: '', message: '', cv: null },
    { endpoint: '/candidatures', validate },
  );

  const onOffre = useCallback(
    (o) => setValues((v) => (v.offre === o.titre ? v : { ...v, offre: o.titre, domaine: v.domaine || o.domaine })),
    [setValues],
  );
  const clearOffre = () => {
    setParams({}, { replace: true });
    setValues((v) => ({ ...v, offre: '' }));
  };

  return (
    <>
      <PageHero
        crumb="Carrière · Candidature"
        eyebrow="Rejoignez-nous"
        title={offreId ? 'Postulez à cette offre' : 'Candidature spontanée'}
        text="Envoyez-nous votre candidature, nous vous contacterons dès qu'une opportunité correspondra à votre profil."
        image={IMG.reunionEquipe}
      />

      <section className="section">
        <div className="wrap two-col">
          <div className="sticky-col">
            <Reveal>
              <div className="eyebrow">Recrutement</div>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 38px)', marginBottom: 14 }}>Nous recrutons dans :</h2>
              <div className="domain-tags">
                {DOMAINES.map((d) => <span key={d.id}><d.icon size={16} /> {d.label}</span>)}
              </div>
            </Reveal>
            <Reveal delay={0.15} style={{ marginTop: 30, borderRadius: 22, overflow: 'hidden', aspectRatio: '16/10' }}>
              <img src={IMG.equipeLagos} alt="L'équipe BLUEN" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            </Reveal>
            <Reveal delay={0.25} style={{ marginTop: 24 }}>
              <Link to="/carriere/offres" className="link-arrow">Voir nos offres d'emploi <ArrowRight size={16} /></Link>
            </Reveal>
          </div>

          <Reveal className="form-card" delay={0.15}>
            <AnimatePresence mode="wait">
              {status === 'done' ? (
                <SuccessBox
                  key="ok"
                  title="Candidature envoyée !"
                  text="Nous avons bien reçu votre candidature. Notre équipe RH vous contactera prochainement."
                  action="Envoyer une autre candidature"
                  onAction={reset}
                />
              ) : (
                <form key="form" onSubmit={submit} noValidate>
                  <h3>{offreId ? 'Votre candidature' : 'Candidature spontanée'}</h3>
                  <p className="form-subtitle">Les champs marqués * sont obligatoires.</p>
                  {offreId && <OffreBanner id={offreId} onReady={onOffre} onClear={clearOffre} />}
                  <FormAlert message={serverError} />
                  <div className="form-row">
                    <Field label="Nom *" name="nom" icon={UserRound} placeholder="Votre nom" value={form.nom} onChange={set('nom')} error={errors.nom} />
                    <Field label="Prénom *" name="prenom" icon={UserRound} placeholder="Votre prénom" value={form.prenom} onChange={set('prenom')} error={errors.prenom} />
                  </div>
                  <div className="form-row">
                    <Field label="Email *" name="email" type="email" icon={Mail} placeholder="vous@exemple.com" value={form.email} onChange={set('email')} error={errors.email} />
                    <Field label="Téléphone" name="telephone" type="tel" icon={Phone} placeholder="+228 90 00 00 00" value={form.telephone} onChange={set('telephone')} />
                  </div>
                  <Field label="Domaine *" name="domaine" as="select" icon={Layers} value={form.domaine} onChange={set('domaine')} error={errors.domaine}>
                    <option value="">Choisissez un domaine...</option>
                    {DOMAINES.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
                    <option value="autre">Autre</option>
                  </Field>
                  <Field
                    label="Présentation *" name="message" as="textarea" icon={MessageSquare}
                    placeholder="Présentez-vous, vos expériences, vos motivations et ce que vous pouvez apporter à BLUEN (minimum 50 caractères)..."
                    value={form.message} onChange={set('message')} error={errors.message}
                  />
                  <CvInput file={form.cv} onChange={(cv) => setValues((v) => ({ ...v, cv }))} error={errors.cv} />
                  <button className="btn btn-primary btn-block" disabled={status === 'sending'}>
                    {status === 'sending' ? <><span className="spinner" /> Envoi en cours...</> : <>Envoyer ma candidature <Send size={17} /></>}
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
