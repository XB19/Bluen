import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Pencil, Trash2, Save } from 'lucide-react';
import { api } from '../api';
import { useApi } from '../hooks';
import { ErrorState, Empty } from '../components/States';
import { Drawer, ConfirmDialog, useToast } from './ui';
import { FieldControl } from './fields';

export default function ResourcePage({ config }) {
  const { endpoint, singular, columns, fields, empty, searchKeys, icon } = config;
  const list = useApi(`/admin/${endpoint}`);
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const autoNew = params.has('nouveau');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(autoNew ? 'new' : null);
  const [form, setForm] = useState(autoNew ? empty : {});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openNew = () => {
    setEditing('new');
    setForm(empty());
    setErrors({});
  };

  const openEdit = (item) => {
    setEditing(item.id);
    setForm(structuredClone(item));
    setErrors({});
  };

  useEffect(() => {
    if (autoNew) setParams({}, { replace: true });
  }, [autoNew, setParams]);

  const setField = (key) => (v) => setForm((f) => ({ ...f, [key]: typeof v === 'function' ? v(f[key] || []) : v }));

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !list.data) return list.data || [];
    const text = config.searchText || ((item) => searchKeys.map((k) => item[k] ?? '').join(' '));
    return list.data.filter((item) => text(item).toLowerCase().includes(q));
  }, [list.data, query, searchKeys, config.searchText]);

  const save = async () => {
    const err = {};
    fields.forEach((f) => {
      const v = form[f.key];
      if (f.required && (v === undefined || v === null || String(v).trim() === '')) err[f.key] = 'Champ requis';
    });
    setErrors(err);
    if (Object.keys(err).length) return;
    setSaving(true);
    try {
      const body = config.toBody ? config.toBody(form) : form;
      if (editing === 'new') {
        await api(`/admin/${endpoint}`, { method: 'POST', body });
        toast(`${singular} créé(e) avec succès`);
      } else {
        await api(`/admin/${endpoint}/${editing}`, { method: 'PUT', body });
        toast('Modifications enregistrées');
      }
      setEditing(null);
      list.reload();
    } catch (e) {
      setErrors(e.errors || {});
      toast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await api(`/admin/${endpoint}/${toDelete.id}`, { method: 'DELETE' });
      toast(`${singular} supprimé(e)`);
      setToDelete(null);
      list.reload();
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="adm-toolbar">
        <div className="search">
          <Search size={18} />
          <input type="text" placeholder="Rechercher…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <span className="muted" style={{ color: 'var(--gris)', fontSize: 14 }}>{list.data ? `${rows.length} élément(s)` : ''}</span>
        <div className="spacer" />
        <button className="btn btn-primary" onClick={openNew} style={{ padding: '12px 20px' }}>
          <Plus size={17} /> Ajouter
        </button>
      </div>

      {list.error ? (
        <ErrorState error={list.error} onRetry={list.reload} />
      ) : list.loading ? (
        <div className="skeleton" style={{ height: 420 }} />
      ) : rows.length === 0 ? (
        <div className="panel"><Empty icon={icon} text={query ? 'Aucun résultat pour cette recherche.' : 'Aucun élément pour le moment.'} /></div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                {columns.map((c) => <th key={c.label}>{c.label}</th>)}
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, i) => (
                <motion.tr
                  key={item.id}
                  className="clickable"
                  onClick={() => openEdit(item)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.4) }}
                >
                  {columns.map((c) => <td key={c.label}>{c.render(item)}</td>)}
                  <td>
                    <div className="actions" onClick={(e) => e.stopPropagation()}>
                      <button className="icon-btn sm" onClick={() => openEdit(item)} aria-label="Modifier"><Pencil size={15} /></button>
                      <button className="icon-btn sm danger" onClick={() => setToDelete(item)} aria-label="Supprimer"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Drawer
        open={editing !== null}
        onClose={() => !saving && setEditing(null)}
        title={editing === 'new' ? `Nouveau : ${singular.toLowerCase()}` : `Modifier : ${singular.toLowerCase()}`}
        subtitle={editing === 'new' ? 'Renseignez les informations puis enregistrez.' : 'Les changements sont visibles immédiatement sur le site.'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setEditing(null)} disabled={saving}>Annuler</button>
            <button className="btn btn-primary" onClick={save} disabled={saving}>
              {saving ? <><span className="spinner" /> Enregistrement…</> : <><Save size={17} /> Enregistrer</>}
            </button>
          </>
        }
      >
        {editing !== null && (
          <form onSubmit={(e) => { e.preventDefault(); save(); }}>
            <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {fields.map((f) => (
                <div key={f.key} className={`form-field ${errors[f.key] ? 'has-error' : ''}`} style={{ gridColumn: f.half ? 'auto' : '1 / -1' }}>
                  <label>{f.label}{f.required && ' *'}</label>
                  <FieldControl field={f} value={form[f.key]} onChange={setField(f.key)} />
                  {f.suggestions && (
                    <datalist id={`${f.key}-list`}>
                      {f.suggestions.map((s) => <option key={s} value={s} />)}
                    </datalist>
                  )}
                  {f.hint && !errors[f.key] && <span className="field-hint">{f.hint}</span>}
                  {errors[f.key] && <span className="field-error">{errors[f.key]}</span>}
                </div>
              ))}
            </div>
            <button type="submit" hidden />
          </form>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!toDelete}
        title="Confirmer la suppression"
        text={`« ${toDelete?.[config.titleKey] ?? ''} » sera définitivement supprimé(e) du site.`}
        onConfirm={remove}
        onCancel={() => setToDelete(null)}
        busy={deleting}
      />
    </>
  );
}
