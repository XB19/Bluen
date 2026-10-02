import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, SunDim } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="not-found">
      <div>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', color: 'var(--orange)' }}>
          <SunDim size={64} />
        </motion.div>
        <div className="code">404</div>
        <p>Oups, cette page n'existe pas ou a été déplacée.</p>
        <Link to="/" className="btn btn-primary"><ArrowLeft size={18} /> Retour à l'accueil</Link>
      </div>
    </section>
  );
}
