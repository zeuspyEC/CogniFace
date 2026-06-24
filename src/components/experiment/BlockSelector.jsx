import { ThemeToggle } from '../shared/ThemeToggle'

export default function BlockSelector({ onSelect }) {
  return (
    <div style={s.container}>
      <div style={s.themeBtn}><ThemeToggle /></div>
      <div style={s.card}>
        <div className="float-in" style={s.header}>
          <span style={s.badge}>SELECCIÓN DE BLOQUE</span>
          <h2 style={s.title}>¿En qué bloque participas?</h2>
          <p style={s.sub}>
            El investigador te indicará qué bloque debes realizar.
          </p>
        </div>

        <div style={s.options} className="float-in-d1">
          <BlockCard
            n={1}
            label="N-Back 1"
            difficulty="Nivel Básico"
            desc="Responde cuando el rostro actual coincida con el visto hace 1 turno atrás."
            example="Cara A → Cara A ← ESPACIO"
            color="#60A5FA"
            onSelect={() => onSelect(1)}
          />
          <BlockCard
            n={2}
            label="N-Back 2"
            difficulty="Nivel Avanzado"
            desc="Responde cuando el rostro actual coincida con el visto hace 2 turnos atrás."
            example="Cara A → Cara B → Cara A ← ESPACIO"
            color="#A78BFA"
            onSelect={() => onSelect(2)}
          />
        </div>

        <p style={s.note} className="float-in-d2">
          Cada bloque tiene 5 ensayos de práctica y 20 ensayos experimentales.
        </p>
      </div>
    </div>
  )
}

function BlockCard({ n, label, difficulty, desc, example, color, onSelect }) {
  return (
    <button
      style={{ ...bc.btn, '--bc': color, borderColor: `${color}35`, background: `${color}08` }}
      onClick={onSelect}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}70`; e.currentTarget.style.background = `${color}15`; e.currentTarget.style.transform = 'translateY(-3px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}35`; e.currentTarget.style.background = `${color}08`; e.currentTarget.style.transform = 'none' }}
    >
      <div style={bc.top}>
        <div style={{ ...bc.nBadge, background: `${color}22`, color }}>N-{n}</div>
        <span style={{ ...bc.difficulty, color }}>{difficulty}</span>
      </div>
      <p style={bc.label}>{label}</p>
      <p style={bc.desc}>{desc}</p>
      <div style={{ ...bc.example, borderColor: `${color}30`, background: `${color}08` }}>
        <p style={bc.exampleLabel}>Ejemplo:</p>
        <p style={{ ...bc.exampleText, color }}>{example}</p>
      </div>
      <div style={{ ...bc.startBtn, background: color }}>
        Elegir N-Back {n} →
      </div>
    </button>
  )
}

const s = {
  container: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px 16px', background: 'var(--color-bg)' },
  themeBtn: { position: 'fixed', top: 16, right: 16, zIndex: 100 },
  card: { maxWidth: 640, width: '100%', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 20, padding: '36px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  header: { textAlign: 'center', marginBottom: 28 },
  badge: { fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--color-accent2)', background: 'rgba(108,99,255,0.12)', padding: '3px 10px', borderRadius: 20 },
  title: { fontSize: 24, fontWeight: 700, marginTop: 10, marginBottom: 6, color: 'var(--color-text)' },
  sub: { fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 },
  options: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 20 },
  note: { textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 12 },
}

const bc = {
  btn: { display: 'flex', flexDirection: 'column', gap: 10, padding: '20px', borderRadius: 16, border: '2px solid', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease', background: 'none' },
  top: { display: 'flex', alignItems: 'center', gap: 8 },
  nBadge: { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 },
  difficulty: { fontSize: 11, fontWeight: 700, letterSpacing: '0.08em' },
  label: { fontSize: 20, fontWeight: 800, color: 'var(--color-text)', margin: 0 },
  desc: { fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 },
  example: { border: '1px solid', borderRadius: 8, padding: '10px 12px' },
  exampleLabel: { fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: 4 },
  exampleText: { fontSize: 12, fontWeight: 600, fontFamily: 'monospace', letterSpacing: '0.04em', margin: 0 },
  startBtn: { color: '#fff', border: 'none', borderRadius: 10, padding: '10px 16px', fontWeight: 700, fontSize: 14, textAlign: 'center', marginTop: 4 },
}
