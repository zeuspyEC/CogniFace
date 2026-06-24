import { ThemeToggle } from '../shared/ThemeToggle'

const isMobileDevice = () =>
  typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export default function WelcomeScreen({ onStart }) {
  const isMobile = isMobileDevice()

  return (
    <div style={s.container}>
      <div style={s.orb1} />
      <div style={s.orb2} />
      <div style={s.themeBtn}><ThemeToggle /></div>

      <div style={s.card}>
        <div className="float-in" style={s.institution}>
          <div style={s.utnLogo}><span style={{ fontSize: 22 }}>🎓</span></div>
          <div style={{ textAlign: 'left' }}>
            <p style={s.utnName}>Universidad Técnica del Norte</p>
            <p style={s.utnFaculty}>Facultad de Educación, Ciencia y Tecnología — FECYT</p>
            <p style={s.utnCareer}>Carrera de Psicología</p>
          </div>
        </div>

        <div style={s.divider} className="float-in-d1" />

        <div className="float-in-d1" style={s.logoWrap}>
          <div style={s.logoRing}><span style={{ fontSize: 30 }}>🧠</span></div>
          <h1 style={s.title}>CogniFace</h1>
          <p style={s.subtitle}>Tarea de Memoria de Trabajo Social Facial</p>
        </div>

        <div className="float-in-d1" style={s.descBox}>
          <p style={s.descText}>
            Esta tarea cognitiva evalúa la capacidad de <strong>recordar y actualizar
            información sobre rostros</strong>. Los participantes observan una serie de
            rostros y deben identificar cuándo coinciden con otros vistos anteriormente.
          </p>
        </div>

        <div className="float-in-d1" style={s.infoGrid}>
          <InfoChip icon="⏱️" text="~5 min por bloque" />
          <InfoChip icon="🖼️" text="12 rostros neutros" />
          <InfoChip icon="🔒" text="Datos confidenciales" />
          {!isMobile && <InfoChip icon="⎵" text="Barra espaciadora" />}
        </div>

        <div className="float-in-d2">
          <button className="btn-primary" onClick={onStart} style={{ width: '100%', fontSize: 16 }}>
            Comenzar →
          </button>
        </div>

        <p style={s.hint} className="float-in-d2">
          Investigación en Psicología Cognitiva · UTN · FECYT
        </p>
      </div>
    </div>
  )
}

function InfoChip({ icon, text }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', padding: '5px 12px', borderRadius: 20, fontSize: 13 }}>
      <span>{icon}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>{text}</span>
    </div>
  )
}

const s = {
  container: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px 16px', overflow: 'hidden', background: 'var(--color-bg)' },
  themeBtn: { position: 'fixed', top: 16, right: 16, zIndex: 100 },
  orb1: { position: 'absolute', top: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)', animation: 'orbFloat 7s ease-in-out infinite', pointerEvents: 'none' },
  orb2: { position: 'absolute', bottom: '10%', right: '5%', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)', animation: 'orbFloat 9s 2s ease-in-out infinite', pointerEvents: 'none' },
  card: { position: 'relative', maxWidth: 560, width: '100%', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 24, padding: '36px 32px', textAlign: 'center', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' },
  institution: { display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.18)', borderRadius: 12, padding: '14px 16px' },
  utnLogo: { width: 48, height: 48, borderRadius: '50%', background: 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  utnName: { fontSize: 13, fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.3 },
  utnFaculty: { fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 },
  utnCareer: { fontSize: 11, color: 'var(--color-accent2)', fontWeight: 600, marginTop: 1 },
  divider: { height: 1, background: 'linear-gradient(90deg, transparent, var(--color-border), transparent)', margin: '20px 0' },
  logoWrap: { marginBottom: 16 },
  logoRing: { width: 64, height: 64, borderRadius: '50%', background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' },
  title: { fontSize: 40, fontWeight: 800, background: 'linear-gradient(135deg, #6C63FF, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.03em', marginBottom: 6, lineHeight: 1 },
  subtitle: { color: 'var(--color-text-muted)', fontSize: 14 },
  descBox: { background: 'rgba(108,99,255,0.04)', border: '1px solid var(--color-border)', borderRadius: 12, padding: '14px 18px', margin: '16px 0', textAlign: 'left' },
  descText: { fontSize: 14, lineHeight: 1.75, color: 'var(--color-text)' },
  infoGrid: { display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 },
  hint: { color: 'var(--color-text-muted)', fontSize: 11, marginTop: 16 },
}
