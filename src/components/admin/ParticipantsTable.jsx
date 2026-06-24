import { Fragment, useState } from 'react'
import { deleteParticipant, getParticipantTrials } from '../../lib/firestoreService'
import { useMobile } from '../../hooks/useMobile'

const ERROR_LABELS = {
  hit: 'Acierto',
  miss: 'Fallo',
  false_alarm: 'Falsa alarma',
  correct_rejection: 'Rechazo correcto',
}

/* ─── Summary bar ───────────────────────────── */
function SummaryBar({ participants }) {
  const completed = participants.filter(p => p.completed)
  const males   = completed.filter(p => p.gender === 'male')
  const females = completed.filter(p => p.gender === 'female')

  const avgIaf = arr => {
    const vals = arr.filter(p => p.iaf_n1 != null).map(p => (p.iaf_n1 + (p.iaf_n2 ?? p.iaf_n1)) / 2)
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
  }

  const chips = [
    { label: 'Total',       value: participants.length,      sub: 'registrados',   color: 'var(--color-text)' },
    { label: 'Completados', value: completed.length,         sub: `${Math.round(completed.length / Math.max(participants.length, 1) * 100)}%`, color: '#A78BFA' },
    { label: 'Hombres',     value: males.length,             sub: 'completados',   color: '#60A5FA' },
    { label: 'Mujeres',     value: females.length,           sub: 'completadas',   color: '#F472B6' },
    avgIaf(males)   !== null && { label: 'IAF ♂',  value: avgIaf(males).toFixed(3),   sub: avgIaf(males)   > 0 ? '↑ H. apoyada' : '↓ sin ventaja', color: avgIaf(males)   > 0 ? '#4CAF8A' : '#E05C5C' },
    avgIaf(females) !== null && { label: 'IAF ♀',  value: avgIaf(females).toFixed(3), sub: avgIaf(females) > 0 ? '↑ H. apoyada' : '↓ sin ventaja', color: avgIaf(females) > 0 ? '#4CAF8A' : '#E05C5C' },
  ].filter(Boolean)

  return (
    <div style={sum.bar}>
      {chips.map(c => (
        <div key={c.label} style={sum.chip}>
          <span style={sum.chipLabel}>{c.label}</span>
          <span style={{ ...sum.chipValue, color: c.color }}>{c.value}</span>
          <span style={sum.chipSub}>{c.sub}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Mobile card view ──────────────────────── */
function ParticipantCard({ p, loadingId, detailId, trials, onDetail, onDelete }) {
  const isExpanded = detailId === p.id
  const isLoading  = loadingId === p.id
  const fmtDate = ts => ts?.toDate ? ts.toDate().toLocaleString('es', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'
  const fmtIaf = v => v != null ? (v > 0 ? '+' : '') + v.toFixed(3) : '—'

  return (
    <div style={card.wrap}>
      <div style={card.top}>
        <div style={card.left}>
          <span style={{ color: p.gender === 'male' ? '#60A5FA' : '#F472B6', fontWeight: 700, fontSize: 15 }}>
            {p.gender === 'male' ? '♂ Hombre' : '♀ Mujer'}
          </span>
          <span style={card.id}>{p.id.slice(0, 10)}…</span>
          <span style={card.date}>{fmtDate(p.timestamp)}</span>
        </div>
        <span style={{ ...card.status, ...(p.completed ? card.statusDone : card.statusPending) }}>
          {p.completed ? '✓ Completo' : '⏳ Pendiente'}
        </span>
      </div>

      <div style={card.iafRow}>
        <div style={card.iafBox}>
          <span style={card.iafLabel}>N-Back 1</span>
          <span style={{ ...card.iafVal, color: p.iaf_n1 > 0 ? '#4CAF8A' : p.iaf_n1 < 0 ? '#E05C5C' : 'var(--color-text-muted)' }}>
            {fmtIaf(p.iaf_n1)}
          </span>
        </div>
        <div style={card.iafBox}>
          <span style={card.iafLabel}>N-Back 2</span>
          <span style={{ ...card.iafVal, color: p.iaf_n2 > 0 ? '#4CAF8A' : p.iaf_n2 < 0 ? '#E05C5C' : 'var(--color-text-muted)' }}>
            {fmtIaf(p.iaf_n2)}
          </span>
        </div>
      </div>

      <div style={card.actions}>
        <button style={card.btnDetail} onClick={() => onDetail(p.id)} disabled={isLoading}>
          {isExpanded ? 'Cerrar' : isLoading ? '…' : 'Ver ensayos'}
        </button>
        <button style={card.btnDelete} onClick={() => onDelete(p.id)} disabled={isLoading}>
          Eliminar
        </button>
      </div>

      {isExpanded && <TrialDetail trials={trials} />}
    </div>
  )
}

/* ─── Main component ────────────────────────── */
export default function ParticipantsTable({ participants, onRefresh }) {
  const [loadingId, setLoadingId] = useState(null)
  const [detailId, setDetailId]   = useState(null)
  const [trials, setTrials]       = useState([])
  const isMobile = useMobile()

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
      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 60, fontSize: 15 }}>
        No hay participantes registrados aún.
      </p>
    )
  }

  return (
    <div>
      <SummaryBar participants={participants} />

      {isMobile ? (
        /* ── Card list (mobile) ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {participants.map(p => (
            <ParticipantCard
              key={p.id}
              p={p}
              loadingId={loadingId}
              detailId={detailId}
              trials={detailId === p.id ? trials : []}
              onDetail={handleDetail}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        /* ── Table (desktop) ── */
        <div style={{ overflowX: 'auto' }}>
          <table style={tbl.table}>
            <thead>
              <tr>
                {['ID', 'Sexo', 'Fecha', 'N-Back 1 IAF', 'N-Back 2 IAF', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={tbl.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {participants.map(p => (
                <Fragment key={p.id}>
                  <tr style={tbl.tr}>
                    <td style={{ ...tbl.td, fontFamily: 'monospace', fontSize: 12, color: 'var(--color-text-muted)' }}>
                      {p.id.slice(0, 8)}…
                    </td>
                    <td style={tbl.td}>
                      <span style={{ color: p.gender === 'male' ? '#60A5FA' : '#F472B6', fontWeight: 600 }}>
                        {p.gender === 'male' ? '♂ Hombre' : '♀ Mujer'}
                      </span>
                    </td>
                    <td style={{ ...tbl.td, color: 'var(--color-text-muted)', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {p.timestamp?.toDate
                        ? p.timestamp.toDate().toLocaleString('es', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </td>
                    <td style={{ ...tbl.td, fontWeight: 700, color: p.iaf_n1 > 0 ? '#4CAF8A' : p.iaf_n1 < 0 ? '#E05C5C' : 'var(--color-text-muted)' }}>
                      {p.iaf_n1 != null ? (p.iaf_n1 > 0 ? '+' : '') + p.iaf_n1.toFixed(3) : '—'}
                    </td>
                    <td style={{ ...tbl.td, fontWeight: 700, color: p.iaf_n2 > 0 ? '#4CAF8A' : p.iaf_n2 < 0 ? '#E05C5C' : 'var(--color-text-muted)' }}>
                      {p.iaf_n2 != null ? (p.iaf_n2 > 0 ? '+' : '') + p.iaf_n2.toFixed(3) : '—'}
                    </td>
                    <td style={tbl.td}>
                      <span style={{ ...tbl.statusBadge, ...(p.completed ? tbl.statusDone : tbl.statusPending) }}>
                        {p.completed ? '✓ Completo' : '⏳ Pendiente'}
                      </span>
                    </td>
                    <td style={tbl.td}>
                      <button style={tbl.btnDetail} onClick={() => handleDetail(p.id)} disabled={loadingId === p.id}>
                        {detailId === p.id ? 'Cerrar' : loadingId === p.id ? '…' : 'Ver ensayos'}
                      </button>
                      <button style={tbl.btnDelete} onClick={() => handleDelete(p.id)} disabled={loadingId === p.id}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                  {detailId === p.id && (
                    <tr>
                      <td colSpan={7} style={tbl.detailCell}>
                        <TrialDetail trials={trials} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* ─── Trial detail ──────────────────────────── */
function TrialDetail({ trials }) {
  const byBlock = { 1: trials.filter(t => t.block === 1), 2: trials.filter(t => t.block === 2) }
  return (
    <div style={det.wrap}>
      {[1, 2].map(b => byBlock[b].length > 0 && (
        <div key={b}>
          <p style={det.blockTitle}>Bloque N-Back {b} — {byBlock[b].length} ensayos</p>
          <div style={det.grid}>
            {byBlock[b].map(t => (
              <div key={t.id} style={{ ...det.chip, borderColor: t.accuracy === 1 ? 'rgba(76,175,138,0.3)' : 'rgba(224,92,92,0.2)' }}>
                <span style={{ color: t.face_gender === 'female' ? '#F472B6' : '#60A5FA', fontSize: 12 }}>
                  {t.face_gender === 'female' ? '♀' : '♂'}
                </span>
                <span style={{ fontSize: 11, color: t.accuracy === 1 ? '#4CAF8A' : '#E05C5C' }}>
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

/* ─── Styles ─────────────────────────────────── */
const sum = {
  bar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: 10,
    marginBottom: 20,
  },
  chip: {
    background: 'rgba(26,45,66,0.7)',
    border: '1px solid #2A3F5A',
    borderRadius: 12,
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  chipLabel: { fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' },
  chipValue: { fontSize: 20, fontWeight: 800, lineHeight: 1.2 },
  chipSub: { fontSize: 11, color: 'var(--color-text-muted)' },
}

const card = {
  wrap: {
    background: 'rgba(26,45,66,0.7)',
    border: '1px solid #2A3F5A',
    borderRadius: 12,
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  left: { display: 'flex', flexDirection: 'column', gap: 3 },
  id: { fontSize: 11, fontFamily: 'monospace', color: 'var(--color-text-muted)' },
  date: { fontSize: 11, color: 'var(--color-text-muted)' },
  status: { padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, flexShrink: 0 },
  statusDone: { background: 'rgba(76,175,138,0.12)', color: '#4CAF8A', border: '1px solid rgba(76,175,138,0.3)' },
  statusPending: { background: 'rgba(251,191,36,0.1)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.3)' },
  iafRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  iafBox: { background: 'rgba(13,27,42,0.5)', borderRadius: 8, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 2 },
  iafLabel: { fontSize: 10, color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' },
  iafVal: { fontSize: 18, fontWeight: 700 },
  actions: { display: 'flex', gap: 8 },
  btnDetail: { flex: 1, background: 'rgba(42,63,90,0.8)', color: 'var(--color-text)', border: 'none', padding: '9px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 },
  btnDelete: { background: 'rgba(61,26,26,0.8)', color: '#E05C5C', border: 'none', padding: '9px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 },
}

const tbl = {
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 600 },
  th: { padding: '10px 14px', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid #2A3F5A', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid rgba(42,63,90,0.5)' },
  td: { padding: '12px 14px', fontSize: 14 },
  statusBadge: { padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  statusDone: { background: 'rgba(76,175,138,0.12)', color: '#4CAF8A', border: '1px solid rgba(76,175,138,0.3)' },
  statusPending: { background: 'rgba(251,191,36,0.1)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.3)' },
  btnDetail: { background: 'rgba(42,63,90,0.8)', color: 'var(--color-text)', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', marginRight: 8, fontSize: 12, fontWeight: 500 },
  btnDelete: { background: 'rgba(61,26,26,0.8)', color: '#E05C5C', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500 },
  detailCell: { background: 'rgba(13,27,42,0.8)', padding: '14px 16px' },
}

const det = {
  wrap: { display: 'flex', flexDirection: 'column', gap: 14 },
  blockTitle: { fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 },
  grid: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  chip: { background: '#1A2D42', borderRadius: 6, padding: '4px 8px', display: 'flex', gap: 6, fontSize: 12, alignItems: 'center', border: '1px solid' },
}
