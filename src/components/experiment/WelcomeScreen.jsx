const isMobileDevice = () =>
  typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export default function WelcomeScreen({ onStart }) {
  const isMobile = isMobileDevice()

  return (
    <div style={s.container}>
      <div style={s.orb1} />
      <div style={s.orb2} />
      <div style={s.orb3} />

      <div style={s.card}>
        <div className="float-in" style={s.logoWrap}>
          <div style={s.logoRing}>
            <span style={s.logoIcon}>🧠</span>
          </div>
          <h1 style={s.title}>CogniFace</h1>
          <p style={s.subtitle}>Experimento de Memoria de Trabajo Social</p>
        </div>

        <div style={s.divider} className="float-in-d1" />

        <div className="float-in-d1" style={s.infoGrid}>
          <InfoChip icon="🎯" text="2 bloques cortos" />
          <InfoChip icon="⏱️" text="~10 minutos" />
          <InfoChip icon="🔒" text="Datos anónimos" />
          {isMobile && <InfoChip icon="👆" text="Solo necesitas tocar" />}
        </div>

        <div className="float-in-d1" style={s.bodyWrap}>
          <p style={s.body}>
            Verás una secuencia de <strong style={s.em}>rostros</strong> aparecer
            uno a uno. Tu tarea es detectar cuando el rostro actual coincide
            con uno que viste recientemente.
          </p>
          {!isMobile && (
            <p style={s.keyNote}>
              Usarás la <kbd style={s.kbd}>BARRA ESPACIADORA</kbd> para responder.
            </p>
          )}
        </div>

        <div className="float-in-d2" style={s.btnWrap}>
          <button className="btn-primary" onClick={onStart} style={s.btn}>
            {isMobile ? 'Tocar para comenzar →' : 'Comenzar →'}
          </button>
        </div>

        <p style={s.hint} className="float-in-d2">
          Universidad Técnica del Norte · Investigación de Psicología Cognitiva
        </p>
      </div>
    </div>
  )
}

function InfoChip({ icon, text }) {
  return (
    <div style={ic.chip}>
      <span style={ic.icon}>{icon}</span>
      <span style={ic.text}>{text}</span>
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
    padding: '24px 16px',
    overflow: 'hidden',
  },
  orb1: {
    position: 'absolute', top: '10%', left: '5%',
    width: 320, height: 320, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(108,99,255,0.18) 0%, transparent 70%)',
    animation: 'orbFloat 7s ease-in-out infinite',
    pointerEvents: 'none',
  },
  orb2: {
    position: 'absolute', bottom: '15%', right: '5%',
    width: 260, height: 260, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)',
    animation: 'orbFloat 9s 2s ease-in-out infinite',
    pointerEvents: 'none',
  },
  orb3: {
    position: 'absolute', top: '55%', left: '15%',
    width: 180, height: 180, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(76,175,138,0.1) 0%, transparent 70%)',
    animation: 'orbFloat 11s 4s ease-in-out infinite',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    maxWidth: 540,
    width: '100%',
    background: 'rgba(26, 45, 66, 0.88)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(108,99,255,0.2)',
    borderRadius: 24,
    padding: '44px 36px',
    textAlign: 'center',
    boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
  },
  logoWrap: { marginBottom: 0 },
  logoRing: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: 'rgba(108,99,255,0.15)',
    border: '1px solid rgba(108,99,255,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  logoIcon: { fontSize: 36 },
  title: {
    fontSize: 48,
    fontWeight: 800,
    background: 'linear-gradient(135deg, #6C63FF, #A78BFA, #60A5FA)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.03em',
    marginBottom: 8,
    lineHeight: 1,
  },
  subtitle: { color: 'var(--color-text-muted)', fontSize: 15, marginBottom: 0 },
  divider: {
    height: 1,
    background: 'linear-gradient(90deg, transparent, rgba(108,99,255,0.35), transparent)',
    margin: '24px 0',
  },
  infoGrid: {
    display: 'flex',
    gap: 8,
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  bodyWrap: { marginBottom: 4 },
  body: { fontSize: 15, lineHeight: 1.75, marginBottom: 12, color: 'var(--color-text)' },
  em: { color: 'var(--color-accent2)', fontWeight: 600 },
  keyNote: { fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 0 },
  kbd: {
    background: 'rgba(108,99,255,0.15)',
    border: '1px solid rgba(108,99,255,0.4)',
    padding: '2px 10px',
    borderRadius: 6,
    fontFamily: 'monospace',
    color: 'var(--color-accent2)',
    fontSize: 13,
  },
  btnWrap: { marginTop: 28 },
  btn: { width: '100%' },
  hint: { color: 'var(--color-text-muted)', fontSize: 12, marginTop: 20, lineHeight: 1.5 },
}

const ic = {
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(42,63,90,0.6)',
    border: '1px solid rgba(108,99,255,0.2)',
    padding: '5px 12px',
    borderRadius: 20,
  },
  icon: { fontSize: 14 },
  text: { fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' },
}
