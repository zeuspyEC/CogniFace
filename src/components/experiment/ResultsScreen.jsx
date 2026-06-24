import { useState } from 'react'
import { calculateAccuracy, calculateIAF, calculateMeanRT } from '../../lib/statistics'

const ERROR_LABELS = {
  hit: { label: '✓ Acierto', color: '#4CAF8A' },
  miss: { label: '○ Fallo', color: '#E05C5C' },
  false_alarm: { label: '✗ Falsa alarma', color: '#E05C5C' },
  correct_rejection: { label: '— Correcto', color: '#8892A4' },
}

export default function ResultsScreen({ allTrials, participantGender }) {
  const [showLog, setShowLog] = useState(false)
  // allTrials is always [...block1Trials, ...block2Trials] — split by position, not trial_number
  const block1 = allTrials.slice(0, 20)
  const block2 = allTrials.slice(20)

  const iaf = calculateIAF(allTrials, participantGender)
  const acc = calculateAccuracy(allTrials)
  const rt = calculateMeanRT(allTrials)
  const isPositive = iaf > 0
  const oppositeLabel = participantGender === 'male' ? 'femeninos' : 'masculinos'

  const iaf1 = block1.length > 0 ? calculateIAF(block1, participantGender) : null
  const iaf2 = block2.length > 0 ? calculateIAF(block2, participantGender) : null
  const acc1 = block1.length > 0 ? calculateAccuracy(block1) : null
  const acc2 = block2.length > 0 ? calculateAccuracy(block2) : null

  return (
    <div style={s.outer}>
      <div style={s.card}>
        {/* Header */}
        <div className="float-in" style={s.headerSection}>
          <div style={s.trophy}>
            {isPositive
              ? <span style={{ fontSize: 56 }}>🏆</span>
              : <span style={{ fontSize: 56 }}>🎉</span>
            }
          </div>
          <h2 style={s.title}>¡Completado!</h2>
          <p style={s.subtitle}>Gracias por participar en el experimento</p>
        </div>

        {/* Global metrics */}
        <div style={s.grid} className="float-in-d1">
          <StatCard label="Precisión global" value={`${(acc * 100).toFixed(1)}%`} icon="🎯" />
          <StatCard label="Tiempo de reacción" value={`${rt.toFixed(0)} ms`} icon="⚡" />
          <StatCard label="IAF global" value={iaf.toFixed(3)} icon="🧪" accent />
        </div>

        {/* Block breakdown */}
        {(acc1 !== null || acc2 !== null) && (
          <div style={s.blockGrid} className="float-in-d1">
            <BlockCard n={1} acc={acc1} iaf={iaf1} />
            <BlockCard n={2} acc={acc2} iaf={iaf2} />
          </div>
        )}

        {/* IAF interpretation */}
        <div
          style={{
            ...s.iafBox,
            borderColor: isPositive ? 'rgba(76,175,138,0.4)' : 'rgba(224,92,92,0.3)',
            background: isPositive ? 'rgba(76,175,138,0.06)' : 'rgba(224,92,92,0.05)',
          }}
          className="float-in-d1"
        >
          <div style={{ ...s.iafIcon, color: isPositive ? 'var(--color-success)' : 'var(--color-error)' }}>
            {isPositive ? '✓' : '○'}
          </div>
          <div>
            <p style={s.iafTitle}>
              {isPositive ? 'Hipótesis apoyada' : 'Sin ventaja clara'}
            </p>
            <p style={s.iafText}>
              {isPositive
                ? `Tu IAF de ${iaf.toFixed(3)} indica mejor memoria para rostros ${oppositeLabel}, apoyando la hipótesis de afinidad facial.`
                : `Tu IAF de ${iaf.toFixed(3)} no mostró ventaja significativa hacia rostros ${oppositeLabel}.`
              }
            </p>
          </div>
        </div>

        {/* Trial log toggle */}
        <div className="float-in-d2">
          <button
            style={lg.toggleBtn}
            onClick={() => setShowLog(v => !v)}
          >
            {showLog ? '▲ Ocultar detalle de ensayos' : '▼ Ver registro de ensayos'}
          </button>

          {showLog && (
            <div style={lg.logWrap}>
              <TrialLog trials={block1} blockN={1} />
              {block2.length > 0 && <TrialLog trials={block2} blockN={2} />}
            </div>
          )}
        </div>

        <p style={s.thanks} className="float-in-d2">
          Tus datos contribuyen a la investigación sobre memoria de trabajo social.
          No es necesario hacer nada más. 🙌
        </p>
      </div>
    </div>
  )
}

function TrialLog({ trials, blockN }) {
  return (
    <div style={lg.block}>
      <p style={lg.blockTitle}>Bloque N-Back {blockN}</p>
      {trials.map((t, i) => {
        const info = ERROR_LABELS[t.error_type] ?? { label: t.error_type, color: '#8892A4' }
        return (
          <div key={i} style={lg.row}>
            <span style={lg.num}>{t.trial_number}</span>
            <span style={{ color: t.face_gender === 'female' ? '#F472B6' : '#60A5FA', fontSize: 13, width: 14 }}>
              {t.face_gender === 'female' ? '♀' : '♂'}
            </span>
            <span style={{ ...lg.tag, ...(t.is_target ? lg.tagTarget : {}) }}>
              {t.is_target ? 'Objetivo' : 'Distractor'}
            </span>
            <span style={{ ...lg.result, color: info.color }}>{info.label}</span>
            <span style={lg.rt}>
              {t.reaction_time ? `${Math.round(t.reaction_time)}ms` : ''}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function StatCard({ label, value, icon, accent }) {
  return (
    <div style={{ ...sc.card, borderColor: accent ? 'rgba(108,99,255,0.35)' : '#2A3F5A' }}>
      <span style={sc.icon}>{icon}</span>
      <div style={sc.label}>{label}</div>
      <div style={{ ...sc.value, color: accent ? 'var(--color-accent2)' : 'var(--color-text)' }}>
        {value}
      </div>
    </div>
  )
}

function BlockCard({ n, acc, iaf }) {
  if (acc === null) return null
  const iafPositive = iaf > 0
  return (
    <div style={bc.card}>
      <p style={bc.label}>BLOQUE N-BACK {n}</p>
      <div style={bc.row}>
        <div>
          <p style={bc.metricLabel}>Precisión</p>
          <p style={bc.metricValue}>{(acc * 100).toFixed(1)}%</p>
        </div>
        {iaf !== null && (
          <div>
            <p style={bc.metricLabel}>IAF</p>
            <p style={{ ...bc.metricValue, color: iafPositive ? 'var(--color-success)' : 'var(--color-error)' }}>
              {iaf > 0 ? '+' : ''}{iaf.toFixed(3)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Styles ──────────────────────────────── */
const s = {
  outer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '24px 16px',
  },
  card: {
    maxWidth: 580,
    width: '100%',
    background: 'rgba(26, 45, 66, 0.9)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(108,99,255,0.15)',
    borderRadius: 24,
    padding: '40px 32px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  headerSection: { textAlign: 'center' },
  trophy: { marginBottom: 12 },
  title: { fontSize: 28, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.02em' },
  subtitle: { color: 'var(--color-text-muted)', fontSize: 14 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 },
  blockGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  iafBox: {
    border: '1px solid',
    borderRadius: 14,
    padding: '18px 20px',
    display: 'flex',
    gap: 14,
    alignItems: 'flex-start',
  },
  iafIcon: { fontSize: 24, fontWeight: 700, flexShrink: 0, marginTop: 2 },
  iafTitle: { fontSize: 15, fontWeight: 700, marginBottom: 4 },
  iafText: { fontSize: 14, lineHeight: 1.7, color: 'var(--color-text-muted)' },
  thanks: { color: 'var(--color-text-muted)', fontSize: 13, lineHeight: 1.7, textAlign: 'center' },
}

const sc = {
  card: {
    background: 'rgba(13,27,42,0.6)',
    border: '1px solid',
    borderRadius: 12,
    padding: '18px 12px',
    textAlign: 'center',
  },
  icon: { fontSize: 24, display: 'block', marginBottom: 8 },
  label: { color: 'var(--color-text-muted)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 },
  value: { fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' },
}

const bc = {
  card: {
    background: 'rgba(13,27,42,0.5)',
    border: '1px solid #2A3F5A',
    borderRadius: 12,
    padding: '14px 16px',
  },
  label: { color: 'var(--color-text-muted)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 10, textTransform: 'uppercase' },
  row: { display: 'flex', gap: 20 },
  metricLabel: { color: 'var(--color-text-muted)', fontSize: 11, marginBottom: 2 },
  metricValue: { fontSize: 22, fontWeight: 700, color: 'var(--color-text)' },
}

const lg = {
  toggleBtn: {
    width: '100%',
    background: 'rgba(26,45,66,0.5)',
    border: '1px solid rgba(42,63,90,0.6)',
    color: 'var(--color-text-muted)',
    padding: '10px',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
    textAlign: 'center',
    marginBottom: 8,
  },
  logWrap: { display: 'flex', flexDirection: 'column', gap: 12 },
  block: {
    background: 'rgba(13,27,42,0.6)',
    border: '1px solid rgba(42,63,90,0.4)',
    borderRadius: 12,
    padding: '14px 16px',
    maxHeight: 280,
    overflowY: 'auto',
  },
  blockTitle: {
    fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
    color: 'var(--color-text-muted)', marginBottom: 10,
  },
  row: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '5px 0', borderBottom: '1px solid rgba(42,63,90,0.3)', fontSize: 12,
  },
  num: { width: 22, color: 'var(--color-text-muted)', fontSize: 11, flexShrink: 0 },
  tag: {
    fontSize: 10, padding: '2px 7px', borderRadius: 10,
    background: 'rgba(42,63,90,0.6)', color: 'var(--color-text-muted)', flexShrink: 0,
  },
  tagTarget: { background: 'rgba(108,99,255,0.2)', color: '#A78BFA' },
  result: { flex: 1, fontWeight: 500 },
  rt: { fontSize: 11, color: 'var(--color-text-muted)', flexShrink: 0, minWidth: 40, textAlign: 'right' },
}
