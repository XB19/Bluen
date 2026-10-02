import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, ShieldOff, Trash2, Users as UsersIcon, UserCheck, UserX } from 'lucide-react';
import { api } from '../api';
import { useApi } from '../hooks';
import { useAuth } from '../auth';
import { ErrorState, Empty } from '../components/States';
import { ConfirmDialog, StatusPill, useToast, initials, formatDateTime } from './ui';

const ROLES = { ADMIN: 'Administrateur', CLIENT: 'Client' };

export default function Users() {
  const { user: me } = useAuth();
  const list = useApi('/admin/utilisateurs');
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (list.data || []).filter((u) => !q || `${u.nom} ${u.prenom} ${u.username} ${u.email}`.toLowerCase().includes(q));
  }, [list.data, query]);

  const patch = async (u, body, message) => {
    try {
      await api(`/admin/utilisateurs/${u.id}`, { method: 'PATCH', body });
      toast(message);
      list.reload();
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await api(`/admin/utilisateurs/${toDelete.id}`, { method: 'DELETE' });
      toast('Compte supprimé');
      setToDelete(null);
      list.reload();
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="adm-toolbar">
        <div className="search">
          <Search size={18} />
          <input type="text" placeholder="Rechercher un utilisateur…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="spacer" />
        {list.data && <span style={{ color: 'var(--gris)', fontSize: 14 }}>{rows.length} compte(s)</span>}
      </div>

      {list.error ? (
        <ErrorState error={list.error} onRetry={list.reload} />
      ) : list.loading ? (
        <div className="skeleton" style={{ height: 360 }} />
      ) : rows.length === 0 ? (
        <div className="panel"><Empty icon={UsersIcon} text="Aucun utilisateur trouvé." /></div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Utilisateur</th><th>Identifiant</th><th>Rôle</th><th>État</th><th>Inscrit le</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
            </thead>
            <tbody>
              {rows.map((u, i) => {
                const self = u.id === me?.id;
                return (
                  <motion.tr key={u.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.4) }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span className="avatar">{initials(u)}</span>
                        <div className="main-cell"><b>{u.prenom} {u.nom}{self && ' (vous)'}</b><small>{u.email}</small></div>
                      </div>
                    </td>
                    <td className="muted">{u.username}</td>
                    <td><StatusPill value={u.role} labels={ROLES} /></td>
                    <td>
                      <span className={u.actif ? 'dot-yes' : 'dot-no'} style={{ display: 'inline-flex', gap: 6, alignItems: 'center', fontSize: 13.5 }}>
                        {u.actif ? <UserCheck size={16} /> : <UserX size={16} />}
                        <span style={{ color: 'var(--encre)' }}>{u.actif ? 'Actif' : 'Désactivé'}</span>
                      </span>
                    </td>
                    <td className="muted">{formatDateTime(u.createdAt)}</td>
                    <td>
                      {!self && (
                        <div className="actions">
                          <button
                            className="icon-btn sm"
                            title={u.role === 'ADMIN' ? 'Retirer les droits admin' : 'Promouvoir administrateur'}
                            onClick={() => patch(u, { role: u.role === 'ADMIN' ? 'CLIENT' : 'ADMIN' }, u.role === 'ADMIN' ? 'Droits administrateur retirés' : 'Utilisateur promu administrateur')}
                          >
                            {u.role === 'ADMIN' ? <ShieldOff size={15} /> : <ShieldCheck size={15} />}
                          </button>
                          <button
                            className="icon-btn sm"
                            title={u.actif ? 'Désactiver le compte' : 'Réactiver le compte'}
                            onClick={() => patch(u, { actif: !u.actif }, u.actif ? 'Compte désactivé' : 'Compte réactivé')}
                          >
                            {u.actif ? <UserX size={15} /> : <UserCheck size={15} />}
                          </button>
                          <button className="icon-btn sm danger" title="Supprimer" onClick={() => setToDelete(u)}><Trash2 size={15} /></button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer ce compte ?"
        text={`Le compte de ${toDelete?.prenom ?? ''} ${toDelete?.nom ?? ''} sera définitivement supprimé.`}
        onConfirm={remove}
        onCancel={() => setToDelete(null)}
        busy={busy}
      />
    </>
  );
}
