import { useState } from 'react';
import { motion } from 'framer-motion';
import { Table2, BarChart3 } from 'lucide-react';

const W = 640;
const H = 260;
const PAD = { top: 14, right: 8, bottom: 30, left: 34 };
const GAP = 2;

const niceMax = (v) => {
  if (v <= 4) return 4;
  const step = Math.pow(10, Math.floor(Math.log10(v)));
  const n = Math.ceil(v / step);
  return (n <= 2 ? 2 : n <= 5 ? 5 : 10) * step;
};

function barPath(x, y, w, h) {
  if (h <= 0) return '';
  const r = Math.min(4, w / 2, h);
  return `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`;
}

const monthLabel = (ym, style = 'short') => new Date(`${ym}-01T00:00:00`).toLocaleDateString('fr-FR', { month: style, year: style === 'long' ? 'numeric' : undefined });

export default function BarChart({ data, series }) {
  const [hover, setHover] = useState(null);
  const [table, setTable] = useState(false);

  const max = niceMax(Math.max(1, ...data.flatMap((d) => series.map((s) => d[s.key]))));
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const groupW = plotW / data.length;
  const barW = Math.min(18, (groupW * 0.62 - GAP * (series.length - 1)) / series.length);
  const clusterW = barW * series.length + GAP * (series.length - 1);
  const y = (v) => PAD.top + plotH - (v / max) * plotH;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(t * max));

  const hovered = hover !== null ? data[hover] : null;
  const tipX = hover !== null ? ((PAD.left + groupW * hover + groupW / 2) / W) * 100 : 0;
  const tipY = hovered ? (y(Math.max(...series.map((s) => hovered[s.key]))) / H) * 100 : 0;

  return (
    <div>
      <div className="panel-head" style={{ marginBottom: 14 }}>
        <div className="chart-legend">
          {series.map((s) => (
            <span key={s.key}><i style={{ background: s.color }} />{s.label}</span>
          ))}
        </div>
        <button className="link-btn" onClick={() => setTable(!table)}>
          {table ? <><BarChart3 size={15} /> Voir le graphique</> : <><Table2 size={15} /> Voir le tableau</>}
        </button>
      </div>

      {table ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Mois</th>{series.map((s) => <th key={s.key}>{s.label}</th>)}</tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.mois}>
                  <td style={{ textTransform: 'capitalize' }}>{monthLabel(d.mois, 'long')}</td>
                  {series.map((s) => <td key={s.key}>{d[s.key]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="chart-wrap" onMouseLeave={() => setHover(null)}>
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Demandes reçues par mois sur les six derniers mois">
            {ticks.map((t) => (
              <g key={t}>
                <line className="grid-line" x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} />
                <text className="axis-label" x={PAD.left - 10} y={y(t) + 4} textAnchor="end">{t}</text>
              </g>
            ))}
            {data.map((d, i) => {
              const gx = PAD.left + groupW * i;
              const x0 = gx + (groupW - clusterW) / 2;
              return (
                <g key={d.mois}>
                  {hover === i && <rect x={gx + 4} y={PAD.top} width={groupW - 8} height={plotH} rx="10" fill="rgba(233,244,224,.6)" />}
                  {series.map((s, j) => {
                    const v = d[s.key];
                    const by = y(v);
                    return (
                      <motion.path
                        key={s.key}
                        d={barPath(x0 + j * (barW + GAP), by, barW, PAD.top + plotH - by)}
                        fill={s.color}
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        style={{ originY: 1, transformBox: 'fill-box' }}
                        transition={{ duration: 0.7, delay: 0.1 + i * 0.06 + j * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      />
                    );
                  })}
                  <text className="axis-label" x={gx + groupW / 2} y={H - 8} textAnchor="middle" style={{ textTransform: 'capitalize' }}>
                    {monthLabel(d.mois)}
                  </text>
                  <rect x={gx} y={PAD.top} width={groupW} height={plotH + PAD.bottom} fill="transparent" onMouseEnter={() => setHover(i)} />
                </g>
              );
            })}
            <line x1={PAD.left} x2={W - PAD.right} y1={y(0)} y2={y(0)} stroke="rgba(27,94,45,.25)" />
          </svg>
          {hovered && (
            <div className="chart-tip" style={{ left: `${tipX}%`, top: `${tipY}%` }}>
              <b>{monthLabel(hovered.mois, 'long')}</b>
              {series.map((s) => (
                <div key={s.key}><i style={{ background: s.color }} />{s.label} : {hovered[s.key]}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
