export default function GenderSelector({ onSelect }) {
  return (
    <div style={s.container}>
      <div style={s.orb} />
      <div style={s.card}>
        <div className="float-in" style={s.header}>
          <span style={s.step}>PASO 1 DE 2</span>
          <h2 style={s.title}>¿Cuál es tu sexo?</h2>
          <p style={s.sub}>
            Información confidencial usada únicamente para el análisis científico.
          </p>
        </div>

        <div style={s.options} className="float-in-d1">
          <GenderButton
            label="Hombre"
            icon="♂"
            emoji="👨"
            color="#60A5FA"
            onClick={() => onSelect('male')}
          />
          <GenderButton
            label="Mujer"
            icon="♀"
            emoji="👩"
            color="#F472B6"
            onClick={() => onSelect('female')}
          />
        </div>

        <p style={s.note} className="float-in-d2">
          🔒 Tus datos no incluyen nombre ni información identificable.
        </p>
      </div>
    </div>
  )
}

function GenderButton({ label, icon, emoji, color, onClick }) {
  return (
    <button
      style={{
        ...gb.btn,
        '--gb-color': color,
        '--gb-color-bg': `${color}15`,
        '--gb-color-border': `${color}40`,
        '--gb-color-border-h': `${color}80`,
      }}
      onClick={onClick}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${color}80`
        e.currentTarget.style.background = `${color}20`
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = `0 8px 32px ${color}25`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = `${color}40`
        e.currentTarget.style.background = `${color}10`
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <span style={gb.emoji}>{emoji}</span>
      <span style={{ ...gb.iconSym, color }}>{icon}</span>
      <span style={gb.label}>{label}</span>
    </button>
  )
}

const s = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '24px 16px',
    position: 'relative',
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    top: '30%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400, height: 400,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    maxWidth: 480,
    width: '100%',
    background: 'rgba(26, 45, 66, 0.9)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(108,99,255,0.15)',
    borderRadius: 24,
    padding: '44px 32px',
    textAlign: 'center',
    boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
  },
  header: { marginBottom: 32 },
  step: {
    display: 'inline-block',
    color: 'var(--color-accent)',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.14em',
    marginBottom: 14,
  },
  title: { fontSize: 28, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.01em' },
  sub: { color: 'var(--color-text-muted)', fontSize: 14, lineHeight: 1.6 },
  options: { display: 'flex', gap: 16, marginBottom: 24 },
  note: { fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.6 },
}

const gb = {
  btn: {
    flex: 1,
    padding: '28px 16px',
    borderRadius: 16,
    border: '2px solid',
    background: 'rgba(108,99,255,0.1)',
    borderColor: 'rgba(108,99,255,0.35)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    transition: 'all 0.2s ease',
    WebkitTapHighlightColor: 'transparent',
  },
  emoji: { fontSize: 48, lineHeight: 1 },
  iconSym: { fontSize: 22, fontWeight: 700, lineHeight: 1 },
  label: { fontSize: 18, fontWeight: 700, color: 'var(--color-text)' },
}
