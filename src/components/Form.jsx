import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function Field({ label, icon: Icon, error, as = 'input', children, ...props }) {
  const Tag = as;
  return (
    <div className={`form-field ${error ? 'has-error' : ''}`}>
      {label && <label htmlFor={props.id || props.name}>{label}</label>}
      <div className="input-wrap">
        {Icon && <Icon size={18} />}
        <Tag id={props.id || props.name} {...props}>
          {children}
        </Tag>
      </div>
      <AnimatePresence>
        {error && (
          <motion.span className="field-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SuccessBox({ title, text, action, onAction }) {
  return (
    <motion.div className="success-box" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <motion.div className="success-icon" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.15 }}>
        <CheckCircle2 size={42} />
      </motion.div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action && (
        <button className="btn btn-secondary" onClick={onAction}>
          {action}
        </button>
      )}
    </motion.div>
  );
}

export function FormAlert({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div className="alert-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
          <AlertCircle size={18} /> {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
