import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, Trash2, Save, Reply, ChevronLeft, ChevronRight, Inbox, FileText, Download } from 'lucide-react';
import { api, downloadFile } from '../api';
import { useApi } from '../hooks';
import { ErrorState, Empty } from '../components/States';
import { Drawer, ConfirmDialog, Segmented, StatusPill, STATUTS, useToast, formatDateTime } from './ui';

const FILTRES = [{ value: '', label: 'Toutes' }, ...Object.entries(STATUTS).map(([value, label]) => ({ value, label }))];

export default function InboxPage({ config }) {
  const { endpoint, singular } = config;
  const toast = useToast();
  const { refreshBadges } = useOutletContext();
  const [statut, setStatut] = useState('');
  const [page, setPage] = useState(1);
  const list = useApi(`/admin/${endpoint}`, { statut, page, size: 15 });
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const changeStatut = (s) => {
    setStatut(s);
    setPage(1);
  };

  const open = async (item) => {
    setSelected(item);
    setNotes(item.notes || '');
    if (item.statut === 'NOUVEAU') {
      const updated = await api(`/admin/${endpoint}/${item.id}`, { method: 'PATCH', body: { statut: 'EN_COURS' } }).catch(() => null);
      if (updated) {
        setSelected(updated);
        list.reload();
        refreshBadges();
      }
    }
  };

  const update = async (body, message) => {
    setSaving(true);
    try {
      const updated = await api(`/admin/${endpoint}/${selected.id}`, { method: 'PATCH', body });
      setSelected(updated);
      toast(message);
      list.reload();
      refreshBadges();
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await api(`/admin/${endpoint}/${selected.id}`, { method: 'DELETE' });
      toast(`${singular} supprimé(e)`);
      setConfirm(false);
      setSelected(null);
      list.reload();
      refreshBadges();
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const data = list.data;

  return (
    <>
      <div className="adm-toolbar">
        <Segmented options={FILTRES} value={statut} onChange={changeStatut} layoutId={`seg-${endpoint}`} />
        <div className="spacer" />
        {data && <span style={{ color: 'var(--gris)', fontSize: 14 }}>{data.totalElements} élément(s)</span>}
      </div>

      {list.error ? (
        <ErrorState error={list.error} onRetry={list.reload} />
      ) : list.loading && !data ? (
        <div className="skeleton" style={{ height: 420 }} />
      ) : data.content.length === 0 ? (
        <div className="panel"><Empty icon={Inbox} text="Aucune demande dans cette catégorie." /></div>
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Contact</th>
                  {config.columns.map((c) => <th key={c.label}>{c.label}</th>)}
                  <th>Reçu le</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {data.content.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    className={`clickable ${item.statut === 'NOUVEAU' ? 'unread' : ''}`}
                    onClick={() => open(item)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.4) }}
                  >
                    <td>
                      <div className="main-cell">
                        <b>{config.nameOf(item)}</b>
                        <small>{item.email}</small>
                      </div>
                    </td>
                    {config.columns.map((c) => <td key={c.label} className="muted">{c.render(item)}</td>)}
                    <td className="muted" style={{ whiteSpace: 'nowrap' }}>{formatDateTime(item.createdAt)}</td>
                    <td><StatusPill value={item.statut} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.totalPages > 1 && (
            <div className="pager">
              <span>Page {data.page} sur {data.totalPages}</span>
              <div className="chips">
                <button className="chip" disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Page précédente"><ChevronLeft size={16} /></button>
                <button className="chip" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)} aria-label="Page suivante"><ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </>
      )}

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? config.nameOf(selected) : ''}
        subtitle={selected ? `${singular} · reçu(e) le ${formatDateTime(selected.createdAt)}` : ''}
        footer={selected && (
          <>
            <button className="btn btn-secondary" onClick={() => setConfirm(true)} style={{ marginRight: 'auto' }}>
              <Trash2 size={16} /> Supprimer
            </button>
            <a className="btn btn-primary" href={`mailto:${selected.email}?subject=${encodeURIComponent(config.sujet)}`}>
              <Reply size={16} /> Répondre par email
            </a>
          </>
        )}
      >
        {selected && (
          <>
            <div className="detail-grid">
              <div className="detail-item"><small>Email</small><a href={`mailto:${selected.email}`}><Mail size={13} /> {selected.email}</a></div>
              <div className="detail-item"><small>Téléphone</small>{selected.telephone ? <a href={`tel:${selected.telephone}`}><Phone size={13} /> {selected.telephone}</a> : <span>—</span>}</div>
              {config.details(selected).map(([label, value]) => (
                <div className="detail-item" key={label}><small>{label}</small><span>{value || '—'}</span></div>
              ))}
            </div>

            {selected.avecCv && (
              <div className="cv-download">
                <div className="icon-box"><FileText size={20} /></div>
                <span>
                  <b>{selected.cvNom || 'CV'}</b>
                  <small>CV joint par le candidat</small>
                </span>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '9px 16px' }}
                  onClick={() => downloadFile(`/admin/${endpoint}/${selected.id}/cv`, 'cv').catch((e) => toast(e.message, 'error'))}
                >
                  <Download size={16} /> Télécharger
                </button>
              </div>
            )}

            <div className="section-label">Message</div>
            <div className="message-box">{selected.message}</div>

            <div className="section-label">Statut</div>
            <div className="status-pick">
              {Object.entries(STATUTS).map(([value, label]) => (
                <button key={value} className={selected.statut === value ? 'active' : ''} disabled={saving} onClick={() => update({ statut: value }, `Statut : ${label}`)}>
                  {label}
                </button>
              ))}
            </div>

            <div className="section-label">Notes internes</div>
            <div className="form-field">
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Suivi, rappel, montant proposé… (non visible par le client)" />
            </div>
            <button className="btn btn-secondary" disabled={saving || notes === (selected.notes || '')} onClick={() => update({ notes }, 'Notes enregistrées')}>
              <Save size={16} /> Enregistrer les notes
            </button>
          </>
        )}
      </Drawer>

      <ConfirmDialog
        open={confirm}
        title="Supprimer cette demande ?"
        text="Elle sera définitivement retirée de la base de données."
        onConfirm={remove}
        onCancel={() => setConfirm(false)}
        busy={deleting}
      />
    </>
  );
}
