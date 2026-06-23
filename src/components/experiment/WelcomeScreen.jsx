export default function WelcomeScreen({ onStart }) {
  return (
    <div style={s.container}>
      <div style={s.orb1} />
      <div style={s.orb2} />
      <div style={s.orb3} />

      <div style={s.card}>
        <div className="float-in">
          <div style={s.logo}>
            <span style={s.logoIcon}>🧠</span>
          </div>
          <h1 style={s.title}>CogniFace</h1>
          <p style={s.subtitle}>Experimento de Memoria de Trabajo Social</p>
        </div>

        <div style={s.divider} className="float-in-d1" />

        <div className="float-in-d1">
          <p style={s.body}>
            Verás una secuencia de <strong style={s.em}>rostros</strong> aparecer uno a uno.
            Presiona <kbd style={s.kbd}>ESPACIO</kbd> cuando el rostro actual
            coincida con uno que viste recientemente.
          </p>
          <p style={s.body}>
            Dos bloques cortos · aproximadamente <strong style={s.em}>10 minutos</strong>.
          </p>
        </div>

        <div className="float-in-d2" style={{ marginTop: 36 }}>
          <button className="btn-primary" onClick={onStart}>
            Comenzar experimento →
          </button>
        </div>

        <p style={s.hint} className="float-in-d2">
          Tus datos son completamente anónimos.
        </p>
      </div>
    </div>
  )
}

const s = {
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: 24,
    overflow: 'hidden',
  },
  orb1: {
    position: 'absolute', top: '15%', left: '10%',
    width: 320, height: 320, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(108,99,255,0.18) 0%, transparent 70%)',
    animation: 'orbFloat 7s ease-in-out infinite',
    pointerEvents: 'none',
  },
  orb2: {
    position: 'absolute', bottom: '20%', right: '8%',
    width: 260, height: 260, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)',
    animation: 'orbFloat 9s 2s ease-in-out infinite',
    pointerEvents: 'none',
  },
  orb3: {
    position: 'absolute', top: '60%', left: '20%',
    width: 180, height: 180, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(76,175,138,0.1) 0%, transparent 70%)',
    animation: 'orbFloat 11s 4s ease-in-out infinite',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    maxWidth: 560,
    width: '100%',
    background: 'rgba(26, 45, 66, 0.85)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(108,99,255,0.2)',
    borderRadius: 24,
    padding: '52px 48px',
    textAlign: 'center',
    boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
  },
  logo: { marginBottom: 16 },
  logoIcon: { fontSize: 48 },
  title: {
    fontSize: 52,
    fontWeight: 800,
    background: 'linear-gradient(135deg, #6C63FF, #A78BFA, #60A5FA)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.02em',
    marginBottom: 8,
  },
  subtitle: { color: 'var(--color-text-muted)', fontSize: 17, marginBottom: 0 },
  divider: { height: 1, background: 'linear-gradient(90deg, transparent, rgba(108,99,255,0.4), transparent)', margin: '28px 0' },
  body: { fontSize: 16, lineHeight: 1.75, marginBottom: 12, color: 'var(--color-text)' },
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
  hint: { color: 'var(--color-text-muted)', fontSize: 13, marginTop: 20 },
}
