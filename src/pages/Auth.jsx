import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRound, Lock, Mail, AlertCircle, CheckCircle2, LogIn, UserPlus, ArrowLeft } from 'lucide-react';
import { Field, FormAlert } from '../components/Form';
import { IMG } from '../data';
import { api } from '../api';
import { useAuth } from '../auth';
import { isEmail } from '../useForm';

const EASE = [0.22, 1, 0.36, 1];

function AuthLayout({ image, title, text, children }) {
  return (
    <div className="auth-page">
      <div className="auth-visual">
        <motion.img src={image} alt="" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: EASE }} />
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }}>{title}</motion.h2>
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.45 }}>{text}</motion.p>
      </div>
      <div className="auth-form-side">
        <motion.div className="auth-box" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
          <Link to="/" className="back-link" style={{ marginBottom: 20 }}><ArrowLeft size={18} /> Retour au site</Link>
          <img src={IMG.logo} alt="BLUEN Togo" className="logo" />
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!form.username.trim()) err.username = 'Champ requis';
    if (!form.password) err.password = 'Champ requis';
    setErrors(err);
    if (Object.keys(err).length) return;
    setStatus('sending');
    try {
      const user = await login(form.username.trim(), form.password);
      navigate(user.role === 'ADMIN' ? location.state?.from || '/admin' : '/', { replace: true });
    } catch (ex) {
      setMessage(ex.message);
      setStatus('error');
    }
  };

  return (
    <AuthLayout image={IMG.panneauxHerbe} title="L'énergie réinventée pour tous" text="Accédez à votre espace pour suivre vos devis, vos projets et vos équipements.">
      <h1>Connexion</h1>
      <p className="sous-titre">Accédez à la plateforme BLUEN Togo</p>
      <AnimatePresence>
        {status === 'error' && (
          <motion.div className="alert-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0 }}>
            <AlertCircle size={18} /> {message}
          </motion.div>
        )}
      </AnimatePresence>
      <form onSubmit={submit} noValidate>
        <Field label="Identifiant ou email" name="username" icon={UserRound} placeholder="Votre identifiant" autoComplete="username" value={form.username} onChange={set('username')} error={errors.username} />
        <Field label="Mot de passe" name="password" type="password" icon={Lock} placeholder="••••••••" autoComplete="current-password" value={form.password} onChange={set('password')} error={errors.password} />
        <button className="btn btn-primary btn-block" disabled={status === 'sending'}>
          {status === 'sending' ? <><span className="spinner" /> Connexion...</> : <>Se connecter <LogIn size={17} /></>}
        </button>
      </form>
      <p className="auth-switch">Pas encore de compte ? <Link to="/register">Créer un compte</Link></p>
    </AuthLayout>
  );
}

export function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: '', prenom: '', username: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    const err = {};
    if (!form.nom.trim()) err.nom = 'Nom requis';
    if (!form.prenom.trim()) err.prenom = 'Prénom requis';
    if (form.username.trim().length < 3) err.username = 'Minimum 3 caractères';
    if (!isEmail(form.email)) err.email = 'Email invalide';
    if (form.password.length < 8) err.password = 'Minimum 8 caractères';
    if (form.confirm !== form.password) err.confirm = 'Les mots de passe ne correspondent pas';
    setErrors(err);
    if (Object.keys(err).length) return;
    setStatus('sending');
    try {
      const { confirm: _confirm, ...body } = form;
      await api('/auth/register', { method: 'POST', body });
      setStatus('done');
      setTimeout(() => navigate('/login'), 1800);
    } catch (ex) {
      setErrors(ex.errors);
      setMessage(ex.message);
      setStatus('idle');
    }
  };

  return (
    <AuthLayout image={IMG.centraleBatiment} title="Rejoignez la plateforme BLUEN Togo" text="Créez votre compte en quelques secondes pour gérer vos demandes en toute simplicité.">
      <h1>Créer un compte</h1>
      <p className="sous-titre">Rejoignez la plateforme BLUEN Togo</p>
      <AnimatePresence>
        {status === 'done' && (
          <motion.div className="alert-success" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            <CheckCircle2 size={18} /> Compte créé avec succès ! Redirection vers la connexion...
          </motion.div>
        )}
      </AnimatePresence>
      <FormAlert message={message} />
      <form onSubmit={submit} noValidate>
        <div className="form-row">
          <Field label="Nom" name="nom" icon={UserRound} placeholder="Votre nom" value={form.nom} onChange={set('nom')} error={errors.nom} />
          <Field label="Prénom" name="prenom" icon={UserRound} placeholder="Votre prénom" value={form.prenom} onChange={set('prenom')} error={errors.prenom} />
        </div>
        <Field label="Identifiant" name="username" icon={UserRound} placeholder="Minimum 3 caractères" autoComplete="username" value={form.username} onChange={set('username')} error={errors.username} />
        <Field label="Email" name="email" type="email" icon={Mail} placeholder="vous@exemple.com" value={form.email} onChange={set('email')} error={errors.email} />
        <div className="form-row">
          <Field label="Mot de passe" name="password" type="password" icon={Lock} placeholder="Min. 8 caractères" autoComplete="new-password" value={form.password} onChange={set('password')} error={errors.password} />
          <Field label="Confirmation" name="confirm" type="password" icon={Lock} placeholder="Répétez le mot de passe" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} />
        </div>
        <button className="btn btn-primary btn-block" disabled={status !== 'idle'}>
          {status === 'sending' ? <><span className="spinner" /> Création du compte...</> : <>Créer mon compte <UserPlus size={17} /></>}
        </button>
      </form>
      <p className="auth-switch">Déjà inscrit ? <Link to="/login">Se connecter</Link></p>
    </AuthLayout>
  );
}
