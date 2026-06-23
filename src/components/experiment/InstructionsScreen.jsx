export default function InstructionsScreen({ n, onReady }) {
  const blockNum = n === 1 ? 1 : 2
  return (
    <div style={s.container}>
      <div style={s.card}>
        <span style={s.chip} className="float-in">Bloque {blockNum} · N-Back {n}</span>

        <h2 style={s.title} className="float-in">
          {n === 1 ? 'Recuerda el turno anterior' : 'Recuerda 2 turnos atrás'}
        </h2>

        <p style={s.body} className="float-in">
          Presiona <kbd style={s.kbd}>ESPACIO</kbd> cuando el rostro actual sea{' '}
          <strong style={s.em}>
            idéntico al que viste hace {n === 1 ? '1 turno' : '2 turnos'}
          </strong>.
        </p>

        <div style={s.example} className="float-in-d1">
          <p style={s.exLabel}>Ejemplo {n === 1 ? 'N-1' : 'N-2'}</p>
          <div style={s.sequence}>
            {n === 1 ? (
              <>
                <div style={s.face}>A</div>
                <div style={{ ...s.face, ...s.faceTarget }}>A ✓</div>
              </>
            ) : (
              <>
                <div style={s.face}>A</div>
                <div style={s.face}>B</div>
                <div style={{ ...s.face, ...s.faceTarget }}>A ✓</div>
              </>
            )}
          </div>
        </div>

        <p style={s.hint} className="float-in-d1">
          Primero harás 5 ensayos de práctica con retroalimentación visual.
        </p>

        <div className="float-in-d2" style={{ marginTop: 32 }}>
          <button className="btn-primary" onClick={onReady}>
            Comenzar práctica →
          </button>
        </div>
      </div>
    </div>
  )
}

const s = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24 },
  card: {
    maxWidth: 540,
    width: '100%',
    background: 'rgba(26, 45, 66, 0.85)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(108,99,255,0.15)',
    borderRadius: 24,
    padding: '48px 40px',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
  },
  chip: {
    display: 'inline-block',
    background: 'rgba(108,99,255,0.2)',
    border: '1px solid rgba(108,99,255,0.4)',
    color: 'var(--color-accent2)',
    padding: '4px 14px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.04em',
    marginBottom: 20,
  },
  title: { fontSize: 26, fontWeight: 700, marginBottom: 20, letterSpacing: '-0.01em' },
  body: { fontSize: 16, lineHeight: 1.75, color: 'var(--color-text)', marginBottom: 24 },
  em: { color: 'var(--color-accent2)', fontWeight: 600 },
  kbd: {
    background: 'rgba(108,99,255,0.15)',
    border: '1px solid rgba(108,99,255,0.4)',
    padding: '2px 10px',
    borderRadius: 6,
    fontFamily: 'monospace',
    color: 'var(--color-accent2)',
    fontSize: 14,
  },
  example: {
    background: 'rgba(13,27,42,0.6)',
    border: '1px solid #2A3F5A',
    borderRadius: 12,
    padding: '20px 24px',
    marginBottom: 20,
  },
  exLabel: { color: 'var(--color-text-muted)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 14, textTransform: 'uppercase' },
  sequence: { display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' },
  face: {
    width: 52, height: 52, borderRadius: 8,
    background: '#2A3F5A',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: 16, color: 'var(--color-text-muted)',
  },
  faceTarget: {
    background: 'rgba(108,99,255,0.25)',
    border: '2px solid var(--color-accent)',
    color: 'var(--color-accent2)',
    fontSize: 13,
  },
  hint: { color: 'var(--color-text-muted)', fontSize: 14, lineHeight: 1.6 },
}
