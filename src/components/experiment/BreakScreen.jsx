import { useState, useEffect } from 'react'

export default function BreakScreen({ onContinue }) {
  const [seconds, setSeconds] = useState(30)

  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  const progress = ((30 - seconds) / 30) * 100
  const ready = seconds <= 0

  return (
    <div style={s.container}>
      <div style={s.card}>
        <div style={s.check} className="float-in">✓</div>
        <h2 style={s.title} className="float-in">¡Bloque 1 completado!</h2>
        <p style={s.body} className="float-in">
          Descansa un momento. El segundo bloque usa la misma lógica pero con una regla diferente.
        </p>

        <div style={s.timerWrap} className="float-in-d1">
          <div style={s.timerBar}>
            <div style={{ ...s.timerFill, width: `${progress}%` }} />
          </div>
          <div style={{ ...s.timerNum, color: ready ? 'var(--color-success)' : 'var(--color-accent)' }}>
            {ready ? '¡Listo!' : `${seconds}s`}
          </div>
        </div>

        <div className="float-in-d2">
          <button
            className="btn-primary"
            style={{ opacity: ready ? 1 : 0.45, cursor: ready ? 'pointer' : 'not-allowed' }}
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

const s = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24 },
  card: {
    maxWidth: 480,
    width: '100%',
    background: 'rgba(26, 45, 66, 0.85)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(108,99,255,0.15)',
    borderRadius: 24,
    padding: '48px 40px',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
  },
  check: { fontSize: 48, color: 'var(--color-success)', marginBottom: 12 },
  title: { fontSize: 26, fontWeight: 700, color: 'var(--color-success)', marginBottom: 12 },
  body: { fontSize: 15, lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: 32 },
  timerWrap: { marginBottom: 32 },
  timerBar: { height: 6, background: '#2A3F5A', borderRadius: 3, overflow: 'hidden', marginBottom: 12 },
  timerFill: { height: '100%', background: 'linear-gradient(90deg, var(--color-accent), var(--color-accent2))', borderRadius: 3, transition: 'width 0.9s linear' },
  timerNum: { fontSize: 20, fontWeight: 700 },
}
