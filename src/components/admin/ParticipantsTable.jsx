import { Fragment, useState } from 'react'
import { deleteParticipant, getParticipantTrials } from '../../lib/firestoreService'

const ERROR_LABELS = {
  hit: 'Acierto',
  miss: 'Fallo',
  false_alarm: 'Falsa alarma',
  correct_rejection: 'Rechazo correcto',
}

function SummaryBar({ participants }) {
  const completed = participants.filter(p => p.completed)
  const males = completed.filter(p => p.gender === 'male')
  const females = completed.filter(p => p.gender === 'female')
  const avgIaf = arr => {
    const vals = arr.filter(p => p.iaf_n1 != null).map(p => (p.iaf_n1 + (p.iaf_n2 ?? p.iaf_n1)) / 2)
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
  }

  return (
    <div style={sum.bar}>
      <Chip label="Total" value={participants.length} sub="registrados" />
      <Chip label="Completados" value={completed.length} sub={`${Math.round(completed.length / Math.max(participants.length, 1) * 100)}%`} accent />
      <Chip label="Hombres" value={males.length} sub="completados" color="#60A5FA" />
      <Chip label="Mujeres" value={females.length} sub="completadas" color="#F472B6" />
      {avgIaf(males) !== null && <Chip label="IAF medio ♂" value={avgIaf(males).toFixed(3)} sub={avgIaf(males) > 0 ? '↑ H. apoyada' : '↓ sin ventaja'} color={avgIaf(males) > 0 ? '#4CAF8A' : '#E05C5C'} />}
      {avgIaf(females) !== null && <Chip label="IAF medio ♀" value={avgIaf(females).toFixed(3)} sub={avgIaf(females) > 0 ? '↑ H. apoyada' : '↓ sin ventaja'} color={avgIaf(females) > 0 ? '#4CAF8A' : '#E05C5C'} />}
    </div>
  )
}

function Chip({ label, value, sub, accent, color }) {
  const c = color || (accent ? '#A78BFA' : 'var(--color-text)')
  return (
    <div style={sum.chip}>
      <span style={sum.chipLabel}>{label}</span>
      <span style={{ ...sum.chipValue, color: c }}>{value}</span>
      <span style={sum.chipSub}>{sub}</span>
    </div>
  )
}

export default function ParticipantsTable({ participants, onRefresh }) {
  const [loadingId, setLoadingId] = useState(null)
  const [detailId, setDetailId] = useState(null)
  const [trials, setTrials] = useState([])

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este participante y todos sus datos?')) return
    setLoadingId(id)
    await deleteParticipant(id)
    onRefresh()
    setLoadingId(null)
  }

  async function handleDetail(id) {
    if (detailId === id) { setDetailId(null); return }
    setLoadingId(id)
    const t = await getParticipantTrials(id)
    setTrials(t)
    setDetailId(id)
    setLoadingId(null)
  }

  if (participants.length === 0) {
    return (
      <div>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 60, fontSize: 15 }}>
          No hay participantes registrados aún.<br />
          <span style={{ fontSize: 13, opacity: 0.7 }}>Los datos aparecerán aquí cuando alguien complete el experimento.</span>
        </p>
      </div>
    )
  }

  return (
    <div>
      <SummaryBar participants={participants} />

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['ID', 'Sexo', 'Fecha', 'N-Back 1 IAF', 'N-Back 2 IAF', 'Estado', 'Acciones'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {participants.map(p => (
              <Fragment key={p.id}>
                <tr style={styles.tr}>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: 12, color: 'var(--color-text-muted)' }}>
                    {p.id.slice(0, 8)}…
                  </td>
                  <td style={styles.td}>
                    <span style={{ color: p.gender === 'male' ? '#60A5FA' : '#F472B6', fontWeight: 600 }}>
                      {p.gender === 'male' ? '♂ Hombre' : '♀ Mujer'}
                    </span>
                  </td>
                  <td style={{ ...styles.td, color: 'var(--color-text-muted)', fontSize: 12 }}>
                    {p.timestamp?.toDate
                      ? p.timestamp.toDate().toLocaleString('es', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
                      : '—'}
                  </td>
                  <td style={{ ...styles.td, fontWeight: 700, color: p.iaf_n1 > 0 ? 'var(--color-success)' : p.iaf_n1 < 0 ? 'var(--color-error)' : 'var(--color-text-muted)' }}>
                    {p.iaf_n1 != null ? (p.iaf_n1 > 0 ? '+' : '') + p.iaf_n1.toFixed(3) : '—'}
                  </td>
                  <td style={{ ...styles.td, fontWeight: 700, color: p.iaf_n2 > 0 ? 'var(--color-success)' : p.iaf_n2 < 0 ? 'var(--color-error)' : 'var(--color-text-muted)' }}>
                    {p.iaf_n2 != null ? (p.iaf_n2 > 0 ? '+' : '') + p.iaf_n2.toFixed(3) : '—'}
                  </td>
                  <td style={styles.td}>
                    <span style={{ ...styles.statusBadge, ...(p.completed ? styles.statusDone : styles.statusPending) }}>
                      {p.completed ? '✓ Completo' : '⏳ Pendiente'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.btnDetail} onClick={() => handleDetail(p.id)} disabled={loadingId === p.id}>
                      {detailId === p.id ? 'Cerrar' : loadingId === p.id ? '…' : 'Ver ensayos'}
                    </button>
                    <button style={styles.btnDelete} onClick={() => handleDelete(p.id)} disabled={loadingId === p.id}>
                      Eliminar
                    </button>
                  </td>
                </tr>
                {detailId === p.id && (
                  <tr>
                    <td colSpan={7} style={styles.detailCell}>
                      <TrialDetail trials={trials} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TrialDetail({ trials }) {
  const byBlock = {
    1: trials.filter(t => t.block === 1),
    2: trials.filter(t => t.block === 2),
  }

  return (
    <div style={det.wrap}>
      {[1, 2].map(b => byBlock[b].length > 0 && (
        <div key={b} style={det.block}>
          <p style={det.blockTitle}>Bloque N-Back {b} — {byBlock[b].length} ensayos</p>
          <div style={det.grid}>
            {byBlock[b].map(t => (
              <div key={t.id} style={{ ...det.chip, borderColor: t.accuracy === 1 ? 'rgba(76,175,138,0.3)' : 'rgba(224,92,92,0.2)' }}>
                <span style={{ color: t.face_gender === 'female' ? '#F472B6' : '#60A5FA', fontSize: 13 }}>
                  {t.face_gender === 'female' ? '♀' : '♂'}
                </span>
                <span style={{ fontSize: 11, color: t.accuracy === 1 ? 'var(--color-success)' : 'var(--color-error)' }}>
                  {ERROR_LABELS[t.error_type] ?? t.error_type}
                </span>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                  {t.reaction_time ? `${Math.round(t.reaction_time)}ms` : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Styles ──────────────────────────────── */
const sum = {
  bar: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  chip: {
    background: 'rgba(26,45,66,0.7)',
    border: '1px solid #2A3F5A',
    borderRadius: 12,
    padding: '12px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    minWidth: 90,
  },
  chipLabel: { fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' },
  chipValue: { fontSize: 22, fontWeight: 800, lineHeight: 1.1 },
  chipSub: { fontSize: 11, color: 'var(--color-text-muted)' },
}

const styles = {
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 640 },
  th: { padding: '10px 14px', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid #2A3F5A' },
  tr: { borderBottom: '1px solid rgba(42,63,90,0.5)', transition: 'background 0.1s' },
  td: { padding: '12px 14px', fontSize: 14 },
  statusBadge: { padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  statusDone: { background: 'rgba(76,175,138,0.12)', color: 'var(--color-success)', border: '1px solid rgba(76,175,138,0.3)' },
  statusPending: { background: 'rgba(251,191,36,0.1)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.3)' },
  btnDetail: { background: 'rgba(42,63,90,0.8)', color: 'var(--color-text)', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', marginRight: 8, fontSize: 12, fontWeight: 500 },
  btnDelete: { background: 'rgba(61,26,26,0.8)', color: 'var(--color-error)', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500 },
  detailCell: { background: 'rgba(13,27,42,0.8)', padding: '16px 20px' },
}

const det = {
  wrap: { display: 'flex', flexDirection: 'column', gap: 16 },
  block: {},
  blockTitle: { fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 },
  grid: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  chip: { background: '#1A2D42', borderRadius: 6, padding: '5px 10px', display: 'flex', gap: 8, fontSize: 12, alignItems: 'center', border: '1px solid' },
}
