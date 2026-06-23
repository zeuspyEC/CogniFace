export default function GenderSelector({ onSelect }) {
  return (
    <div style={s.container}>
      <div style={s.card}>
        <p style={s.label} className="float-in">PASO 1 DE 2</p>
        <h2 style={s.title} className="float-in">¿Cuál es tu sexo?</h2>
        <p style={s.sub} className="float-in">
          Esta información es confidencial y se usa únicamente para el análisis científico.
        </p>

        <div style={s.options} className="float-in-d1">
          <button className="btn-secondary" style={s.option} onClick={() => onSelect('male')}>
            <span style={s.icon}>♂</span>
            <span style={s.optLabel}>Hombre</span>
          </button>
          <button className="btn-secondary" style={s.option} onClick={() => onSelect('female')}>
            <span style={s.icon}>♀</span>
            <span style={s.optLabel}>Mujer</span>
          </button>
        </div>
      </div>
    </div>
  )
}

const s = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24 },
  card: {
    maxWidth: 500,
    width: '100%',
    background: 'rgba(26, 45, 66, 0.85)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(108,99,255,0.15)',
    borderRadius: 24,
    padding: '48px 40px',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
  },
  label: { color: 'var(--color-accent)', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 16 },
  title: { fontSize: 30, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.01em' },
  sub: { color: 'var(--color-text-muted)', marginBottom: 36, fontSize: 14, lineHeight: 1.6 },
  options: { display: 'flex', gap: 20 },
  option: { flex: 1 },
  icon: { fontSize: 52, lineHeight: 1, display: 'block' },
  optLabel: { fontSize: 18, fontWeight: 600 },
}
