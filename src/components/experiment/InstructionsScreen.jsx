import { ThemeToggle } from '../shared/ThemeToggle'

const isMobileDevice = () =>
  typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export default function InstructionsScreen({ n, onReady }) {
  const isMobile = isMobileDevice()

  return (
    <div style={s.outer}>
      <div style={s.themeBtn}><ThemeToggle /></div>
      <div style={s.container}>

        {/* Header */}
        <div className="float-in" style={s.header}>
          <span style={s.blockChip}>N-BACK {n}</span>
          <h2 style={s.title}>
            {n === 1 ? 'Recuerda el turno anterior' : 'Recuerda 2 turnos atrás'}
          </h2>
          <p style={s.subtitle}>
            {n === 1
              ? 'Detecta si el rostro actual es idéntico al de justo antes.'
              : 'Detecta si el rostro actual es idéntico al de hace dos apariciones.'}
          </p>
        </div>

        {/* How it works */}
        <InfoCard title="¿Cómo funciona?" className="float-in-d1">
          <p style={ic.body}>
            Verás rostros aparecer uno a uno. Cada vez que el rostro actual coincida con el de
            {n === 1 ? ' 1 turno atrás' : ' 2 turnos atrás'},
            {isMobile ? ' toca el botón' : ' presiona ESPACIO'}. Si no coincide, no hagas nada.
          </p>
          <div style={ic.exampleWrap}>
            <p style={ic.exLabel}>EJEMPLO N-BACK {n}</p>
            {n === 1 ? <ExampleN1 /> : <ExampleN2 />}
          </div>
        </InfoCard>

        {/* Session structure */}
        <InfoCard title="Estructura de la sesión" className="float-in-d1">
          <div style={pg.grid}>
            <ParamBox val="5"        label="Ensayos de práctica"  color="#FBBF24" />
            <ParamBox val="20"       label="Ensayos reales"       color="#A78BFA" />
            <ParamBox val={`N-${n}`} label="Condición N-Back"     color="#6C63FF" />
            <ParamBox val="12"       label="Rostros únicos"       color="#60A5FA" />
            <ParamBox val="1 000 ms" label="Duración del rostro"  color="var(--color-text-muted)" />
            <ParamBox val="2 000 ms" label="Ventana de respuesta" color="var(--color-text-muted)" />
          </div>
        </InfoCard>

        {/* Rules */}
        <InfoCard title="Reglas" className="float-in-d1">
          <RuleItem icon="✓" color="var(--color-success)"
            text={`${isMobile ? 'Toca' : 'Presiona ESPACIO'} cuando el rostro coincida con hace ${n === 1 ? '1 turno' : '2 turnos'}`} />
          <RuleItem icon="✗" color="var(--color-error)"
            text="No hagas nada si el rostro es diferente" />
          <RuleItem icon="💬" color="var(--color-text-muted)"
            text="Los primeros 5 ensayos son de práctica — recibirás retroalimentación inmediata. Los 20 reales no tienen feedback." />
        </InfoCard>

        {/* Timing strip */}
        <div style={s.timingStrip} className="float-in-d2">
          <TimingStep label="+" time="500 ms" color="var(--color-text-muted)" note="Fijación" />
          <div style={s.timingArrow}>→</div>
          <TimingStep label="👤" time="1 000 ms" color="#6C63FF" note="Rostro" />
          <div style={s.timingArrow}>→</div>
          <TimingStep label={isMobile ? '👆' : '⎵'} time="2 000 ms" color="#A78BFA" note="Responde" />
        </div>

        <div className="float-in-d2">
          <button className="btn-primary" onClick={onReady} style={{ width: '100%' }}>
            Comenzar práctica →
          </button>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ title, children, className }) {
  return (
    <div style={ic.card} className={className}>
      <p style={ic.cardTitle}>{title}</p>
      {children}
    </div>
  )
}

function ParamBox({ val, label, color }) {
  return (
    <div style={pg.box}>
      <span style={{ ...pg.val, color }}>{val}</span>
      <span style={pg.label}>{label}</span>
    </div>
  )
}

function ExampleN1() {
  return (
    <div style={ex.row}>
      <FaceBox label="A" idx={0} />
      <ExArrow />
      <FaceBox label="A" idx={1} isTarget />
      <div style={ex.targetLabel}>
        <span style={{ color: 'var(--color-success)', fontWeight: 700, fontSize: 13 }}>✓ ¡Coincide!</span>
        <span style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>Mismo que el anterior</span>
      </div>
    </div>
  )
}

function ExampleN2() {
  return (
    <div style={ex.row}>
      <FaceBox label="A" idx={0} />
      <ExArrow />
      <FaceBox label="B" idx={1} />
      <ExArrow />
      <FaceBox label="A" idx={2} isTarget />
      <div style={ex.targetLabel}>
        <span style={{ color: 'var(--color-success)', fontWeight: 700, fontSize: 13 }}>✓ ¡Coincide!</span>
        <span style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>Mismo que hace 2 turnos</span>
      </div>
    </div>
  )
}

function FaceBox({ label, idx, isTarget }) {
  const colors = ['#6C63FF', '#A78BFA', '#60A5FA']
  const color = colors[idx % colors.length]
  return (
    <div style={{
      ...ex.face,
      border: isTarget ? '2px solid var(--color-success)' : `2px solid ${color}50`,
      background: isTarget ? 'rgba(76,175,138,0.12)' : `${color}12`,
      boxShadow: isTarget ? '0 0 14px rgba(76,175,138,0.25)' : 'none',
    }}>
      <span style={{ fontSize: 22 }}>👤</span>
      <span style={{ fontSize: 10, fontWeight: 700, color: isTarget ? 'var(--color-success)' : color, marginTop: 3 }}>{label}</span>
    </div>
  )
}

function ExArrow() { return <span style={ex.arrow}>→</span> }

function RuleItem({ icon, color, text }) {
  return (
    <div style={rl.row}>
      <span style={{ ...rl.icon, color }}>{icon}</span>
      <p style={rl.text}>{text}</p>
    </div>
  )
}

function TimingStep({ label, time, color, note }) {
  return (
    <div style={ts.step}>
      <div style={{ ...ts.box, borderColor: `${color}50`, background: `${color}15` }}>
        <span style={ts.icon}>{label}</span>
      </div>
      <p style={{ ...ts.time, color }}>{time}</p>
      <p style={ts.note}>{note}</p>
    </div>
  )
}

/* ─── Styles (all use CSS vars for light/dark compat) ──────────────────── */
const s = {
  outer: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px 16px', background: 'var(--color-bg)' },
  themeBtn: { position: 'fixed', top: 16, right: 16, zIndex: 100 },
  container: { maxWidth: 560, width: '100%', display: 'flex', flexDirection: 'column', gap: 12 },
  header: { textAlign: 'center', marginBottom: 4 },
  blockChip: { display: 'inline-block', background: 'rgba(108,99,255,0.18)', border: '1px solid rgba(108,99,255,0.35)', color: 'var(--color-accent2)', padding: '3px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.01em', color: 'var(--color-text)' },
  subtitle: { fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6 },
  timingStrip: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12, padding: '14px 16px' },
  timingArrow: { color: 'var(--color-text-muted)', fontSize: 14, flexShrink: 0 },
}

const ic = {
  card: { background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14, padding: '18px 20px' },
  cardTitle: { fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent2)', marginBottom: 12 },
  body: { fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: 14 },
  exampleWrap: { background: 'var(--color-surface2)', border: '1px solid var(--color-border)', borderRadius: 10, padding: '14px 12px' },
  exLabel: { fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: 12 },
}

const pg = {
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 },
  box: { background: 'var(--color-surface2)', border: '1px solid var(--color-border)', borderRadius: 10, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 2 },
  val: { fontSize: 18, fontWeight: 700, lineHeight: 1 },
  label: { fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.4 },
}

const ex = {
  row: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' },
  face: { width: 58, height: 58, borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  arrow: { color: 'var(--color-text-muted)', fontSize: 14, flexShrink: 0 },
  targetLabel: { display: 'flex', flexDirection: 'column', gap: 2, marginLeft: 4 },
}

const rl = {
  row: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '8px 12px', background: 'var(--color-surface2)', borderRadius: 8, marginBottom: 6 },
  icon: { fontSize: 15, fontWeight: 700, flexShrink: 0, marginTop: 2, width: 18, textAlign: 'center' },
  text: { fontSize: 13, color: 'var(--color-text)', lineHeight: 1.6 },
}

const ts = {
  step: { textAlign: 'center', flex: 1 },
  box: { width: 40, height: 40, borderRadius: 9, border: '1px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 5px' },
  icon: { fontSize: 16 },
  time: { fontSize: 11, fontWeight: 700, marginBottom: 2 },
  note: { fontSize: 10, color: 'var(--color-text-muted)' },
}
