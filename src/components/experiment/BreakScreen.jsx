import { useState, useEffect } from 'react'

const BREAK_SECS = 30

export default function BreakScreen({ onContinue }) {
  const [seconds, setSeconds] = useState(BREAK_SECS)

  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  const progress = ((BREAK_SECS - seconds) / BREAK_SECS) * 100
  const ready = seconds <= 0

  return (
    <div style={s.outer}>
      <div style={s.container}>

        {/* Completion banner */}
        <div style={s.banner} className="float-in">
          <span style={s.check}>✓</span>
          <div>
            <h2 style={s.title}>¡Bloque 1 completado!</h2>
            <p style={s.subtitle}>N-Back 1 — listo. Descansa antes del siguiente.</p>
          </div>
        </div>

        {/* What's next card */}
        <div style={s.card} className="float-in-d1">
          <p style={s.cardTitle}>Bloque 2 — N-Back 2</p>
          <p style={s.cardBody}>
            El siguiente bloque funciona igual, pero ahora debes recordar <strong style={{ color: '#A78BFA' }}>2 turnos atrás</strong> en lugar de 1. Es más exigente — tómate el tiempo que necesites.
          </p>

          {/* N-2 mini example */}
          <div style={s.exampleRow}>
            <FaceBox label="A" color="#6C63FF" />
            <Arrow />
            <FaceBox label="B" color="#A78BFA" />
            <Arrow />
            <FaceBox label="A" color="#6C63FF" isTarget />
            <div style={s.exLabel}>
              <span style={{ color: 'var(--color-success)', fontWeight: 700, fontSize: 12 }}>✓ Coinicide</span>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Hace 2 turnos</span>
            </div>
          </div>
        </div>

        {/* Rest timer */}
        <div style={s.timerCard} className="float-in-d1">
          <div style={s.timerTop}>
            <span style={s.timerLabel}>Tiempo de descanso</span>
            <span style={{ ...s.timerNum, color: ready ? 'var(--color-success)' : 'var(--color-accent2)' }}>
              {ready ? '¡Listo!' : `${seconds}s`}
            </span>
          </div>
          <div style={s.timerTrack}>
            <div style={{ ...s.timerFill, width: `${progress}%` }} />
          </div>
        </div>

        {/* Continue button */}
        <div className="float-in-d2">
          <button
            className="btn-primary"
            style={{ opacity: ready ? 1 : 0.4, cursor: ready ? 'pointer' : 'not-allowed' }}
            onClick={onContinue}
            disabled={!ready}
          >
            Continuar al Bloque 2 →
          </button>
        </div>
      </div>
    </div>
  )
}

function FaceBox({ label, color, isTarget }) {
  return (
    <div style={{
      width: 48, height: 48, borderRadius: 9,
      border: isTarget ? '2px solid var(--color-success)' : `2px solid ${color}50`,
      background: isTarget ? 'rgba(76,175,138,0.12)' : `${color}12`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <span style={{ fontSize: 18 }}>👤</span>
      <span style={{ fontSize: 9, fontWeight: 700, color: isTarget ? 'var(--color-success)' : color }}>{label}</span>
    </div>
  )
}

function Arrow() {
  return <span style={{ color: 'var(--color-text-muted)', fontSize: 12, flexShrink: 0 }}>→</span>
}

const s = {
  outer: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', padding: '24px 16px',
  },
  container: {
    maxWidth: 480, width: '100%',
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  banner: {
    background: 'rgba(76,175,138,0.1)',
    border: '1px solid rgba(76,175,138,0.3)',
    borderRadius: 14,
    padding: '18px 20px',
    display: 'flex',
    gap: 16,
    alignItems: 'center',
  },
  check: { fontSize: 32, color: 'var(--color-success)', flexShrink: 0 },
  title: { fontSize: 20, fontWeight: 700, color: 'var(--color-success)', marginBottom: 2 },
  subtitle: { fontSize: 13, color: 'var(--color-text-muted)' },
  card: {
    background: 'rgba(26,45,66,0.7)',
    border: '1px solid rgba(42,63,90,0.6)',
    borderRadius: 14,
    padding: '18px 20px',
  },
  cardTitle: {
    fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: 'var(--color-accent2)', marginBottom: 10,
  },
  cardBody: { fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: 16 },
  exampleRow: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'rgba(13,27,42,0.5)',
    border: '1px solid rgba(42,63,90,0.4)',
    borderRadius: 10, padding: '12px 14px',
    flexWrap: 'wrap',
  },
  exLabel: { display: 'flex', flexDirection: 'column', gap: 2, marginLeft: 4 },
  timerCard: {
    background: 'rgba(26,45,66,0.7)',
    border: '1px solid rgba(42,63,90,0.6)',
    borderRadius: 14,
    padding: '16px 20px',
  },
  timerTop: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,
  },
  timerLabel: { fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 500 },
  timerNum: { fontSize: 18, fontWeight: 700, transition: 'color 0.3s' },
  timerTrack: {
    height: 6, background: 'rgba(42,63,90,0.8)', borderRadius: 3, overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--color-accent), var(--color-accent2))',
    borderRadius: 3,
    transition: 'width 0.9s linear',
  },
}
