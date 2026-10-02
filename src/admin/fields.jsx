import { useRef, useState } from 'react';
import { ImagePlus, Trash2, ArrowLeft, Plus, FileUp, FileText, Link2 } from 'lucide-react';
import { uploadFile } from '../api';
import { useApi } from '../hooks';
import { useToast } from './ui';

function useUpload(onDone) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const upload = async (files) => {
    setBusy(true);
    try {
      for (const f of files) {
        const { url } = await uploadFile(f);
        onDone(url);
      }
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };
  return { busy, upload };
}

function DropZone({ onFiles, busy, accept = 'image/*', multiple, label = 'Ajouter', icon: Icon = ImagePlus }) {
  const [over, setOver] = useState(false);
  const input = useRef(null);
  return (
    <label
      className={`up-drop ${over ? 'over' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); onFiles([...e.dataTransfer.files]); }}
    >
      <input ref={input} type="file" accept={accept} multiple={multiple} onChange={(e) => { onFiles([...e.target.files]); e.target.value = ''; }} />
      {busy ? <span className="spinner dark" /> : <Icon size={22} />}
      {busy ? 'Envoi…' : label}
    </label>
  );
}

function UrlAdder({ onAdd }) {
  const [url, setUrl] = useState('');
  const add = () => {
    if (!url.trim()) return;
    onAdd(url.trim());
    setUrl('');
  };
  return (
    <div className="url-input form-field" style={{ marginBottom: 0 }}>
      <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="… ou coller une URL d'image (ex : /images/centrale-sol.jpg)" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())} />
      <button type="button" className="icon-btn" onClick={add} aria-label="Ajouter l'URL"><Link2 size={16} /></button>
    </div>
  );
}

export function ImagesInput({ value = [], onChange }) {
  const { busy, upload } = useUpload((url) => onChange((v) => [...v, url]));
  const remove = (i) => onChange(value.filter((_, j) => j !== i));
  const first = (i) => onChange([value[i], ...value.filter((_, j) => j !== i)]);
  return (
    <>
      <div className="uploader">
        {value.map((src, i) => (
          <div className="up-item" key={src + i}>
            <img src={src} alt="" />
            {i === 0 && <span className="first">Principale</span>}
            <div className="up-actions">
              {i > 0 && <button type="button" onClick={() => first(i)} title="Définir comme principale"><ArrowLeft size={14} /></button>}
              <button type="button" onClick={() => remove(i)} title="Retirer"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        <DropZone onFiles={upload} busy={busy} multiple label="Glisser ou choisir des images" />
      </div>
      <UrlAdder onAdd={(u) => onChange((v) => [...v, u])} />
    </>
  );
}

export function ImageInput({ value, onChange }) {
  const { busy, upload } = useUpload((url) => onChange(url));
  return (
    <>
      <div className="up-single">
        {value ? (
          <div className="up-item">
            <img src={value} alt="" />
            <div className="up-actions">
              <button type="button" onClick={() => onChange('')} title="Retirer"><Trash2 size={14} /></button>
            </div>
          </div>
        ) : (
          <DropZone onFiles={(f) => upload(f.slice(0, 1))} busy={busy} label="Choisir une image" />
        )}
        <span className="field-hint">JPG, PNG ou WEBP — 10 Mo maximum.</span>
      </div>
      {!value && <UrlAdder onAdd={onChange} />}
    </>
  );
}

export function FileInput({ value, onChange }) {
  const { busy, upload } = useUpload((url) => onChange(url));
  return value ? (
    <div className="check-row" style={{ justifyContent: 'space-between' }}>
      <a href={value} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}><FileText size={18} /> Document joint</a>
      <button type="button" className="icon-btn sm danger" onClick={() => onChange('')} aria-label="Retirer le document"><Trash2 size={14} /></button>
    </div>
  ) : (
    <div className="up-single">
      <DropZone onFiles={(f) => upload(f.slice(0, 1))} busy={busy} accept="application/pdf" label="Joindre un PDF" icon={FileUp} />
      <span className="field-hint">Dossier de consultation téléchargeable depuis le site.</span>
    </div>
  );
}

export function KeyValueInput({ value = [], onChange }) {
  const update = (i, key, v) => onChange(value.map((row, j) => (j === i ? { ...row, [key]: v } : row)));
  return (
    <>
      {value.map((row, i) => (
        <div className="kv-row" key={i}>
          <input placeholder="Caractéristique (ex : Puissance)" value={row.label} onChange={(e) => update(i, 'label', e.target.value)} />
          <input placeholder="Valeur (ex : 550 Wc)" value={row.valeur} onChange={(e) => update(i, 'valeur', e.target.value)} />
          <button type="button" className="icon-btn danger" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Supprimer la ligne"><Trash2 size={15} /></button>
        </div>
      ))}
      <button type="button" className="add-row" onClick={() => onChange([...value, { label: '', valeur: '' }])}>
        <Plus size={15} /> Ajouter une caractéristique
      </button>
    </>
  );
}

export function Toggle({ value, onChange, label }) {
  return (
    <button type="button" className="check-row" onClick={() => onChange(!value)} aria-pressed={!!value} style={{ width: '100%', fontFamily: 'inherit' }}>
      <span className={`toggle ${value ? 'on' : ''}`} />
      {label}
    </button>
  );
}

function RelationSelect({ field, value, onChange }) {
  const { data, loading } = useApi(field.endpoint);
  const options = data || [];
  return (
    <select
      value={value?.id ?? ''}
      disabled={loading}
      onChange={(e) => onChange(options.find((o) => String(o.id) === e.target.value) || null)}
    >
      <option value="">{loading ? 'Chargement…' : field.placeholder || 'Choisir…'}</option>
      {options.map((o) => <option key={o.id} value={o.id}>{field.labelOf(o)}</option>)}
    </select>
  );
}

export function FieldControl({ field, value, onChange }) {
  switch (field.type) {
    case 'relation':
      return <RelationSelect field={field} value={value} onChange={onChange} />;
    case 'textarea':
      return <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} rows={field.rows || 4} />;
    case 'select':
      return (
        <select value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          {field.placeholder && <option value="">{field.placeholder}</option>}
          {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
    case 'toggle':
      return <Toggle value={value} onChange={onChange} label={field.toggleLabel} />;
    case 'images':
      return <ImagesInput value={value} onChange={onChange} />;
    case 'image':
      return <ImageInput value={value} onChange={onChange} />;
    case 'file':
      return <FileInput value={value} onChange={onChange} />;
    case 'kv':
      return <KeyValueInput value={value} onChange={onChange} />;
    default:
      return (
        <input
          type={field.type || 'text'}
          value={value ?? ''}
          onChange={(e) => onChange(field.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
          placeholder={field.placeholder}
          list={field.suggestions ? `${field.key}-list` : undefined}
        />
      );
  }
}
