import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, X, XCircle } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

export function Drawer({ open, onClose, title, subtitle, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="overlay" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside
            className="drawer"
            role="dialog"
            aria-modal="true"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="drawer-head">
              <div>
                <h3>{title}</h3>
                {subtitle && <small>{subtitle}</small>}
              </div>
              <button className="icon-btn" onClick={onClose} aria-label="Fermer"><X size={18} /></button>
            </div>
            <div className="drawer-body">{children}</div>
            {footer && <div className="drawer-foot">{footer}</div>}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function ConfirmDialog({ open, title, text, confirmLabel = 'Supprimer', onConfirm, onCancel, busy }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="overlay" style={{ zIndex: 105 }} onClick={onCancel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            className="modal"
            role="alertdialog"
            initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-46%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-48%' }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="icon-box"><AlertTriangle size={26} /></div>
            <h3>{title}</h3>
            <p>{text}</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={onCancel} disabled={busy}>Annuler</button>
              <button className="btn btn-danger" onClick={onConfirm} disabled={busy}>
                {busy ? <span className="spinner" /> : confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toasts" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              className={`toast ${t.type}`}
              layout
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {t.type === 'error' ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

export const STATUTS = {
  NOUVEAU: 'Nouveau',
  EN_COURS: 'En cours',
  TRAITE: 'Traité',
  REJETE: 'Rejeté',
  ARCHIVE: 'Archivé',
};

export function StatusPill({ value, labels = STATUTS }) {
  return <span className={`st st-${value}`}><i />{labels[value] || value}</span>;
}

export function Segmented({ options, value, onChange, layoutId }) {
  return (
    <div className="seg" role="tablist">
      {options.map((o) => (
        <button key={o.value} role="tab" aria-selected={value === o.value} className={value === o.value ? 'active' : ''} onClick={() => onChange(o.value)}>
          {value === o.value && <motion.span layoutId={layoutId} className="seg-bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
          <span>{o.label}</span>
          {o.count !== undefined && <span className="count">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

export const initials = (u) => `${u?.prenom?.[0] || ''}${u?.nom?.[0] || ''}`.toUpperCase() || 'B';

export const formatDateTime = (d) =>
  new Date(d).toLocaleString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
