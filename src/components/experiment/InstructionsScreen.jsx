const isMobileDevice = () =>
  typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export default function InstructionsScreen({ n, onReady }) {
  const isMobile = isMobileDevice()
  const blockNum = n === 1 ? 1 : 2

  return (
    <div style={s.outer}>
      <div style={s.card}>

        {/* Header */}
        <div className="float-in" style={s.header}>
          <span style={s.chip}>Bloque {blockNum} de 2</span>
          <h2 style={s.title}>
            {n === 1 ? 'Recuerda el turno anterior' : 'Recuerda 2 turnos atrás'}
          </h2>
          <p style={s.subtitle}>
            {n === 1
              ? 'Detecta si el rostro actual es idéntico al de justo antes.'
              : 'Detecta si el rostro actual es idéntico al de hace dos apariciones.'}
          </p>
        </div>

        {/* Example sequence */}
        <div style={s.exampleBox} className="float-in-d1">
          <p style={s.exLabel}>EJEMPLO {n === 1 ? 'N-1' : 'N-2'}</p>
          {n === 1 ? <ExampleN1 /> : <ExampleN2 />}
        </div>

        {/* Rules */}
        <div style={s.rules} className="float-in-d1">
          <RuleItem
            icon="✓"
            color="var(--color-success)"
            text={`Presiona ${isMobile ? 'el botón' : 'ESPACIO'} cuando el rostro coincida con hace ${n === 1 ? '1 turno' : '2 turnos'}`}
          />
          <RuleItem
            icon="✗"
            color="var(--color-error)"
            text="No hagas nada si el rostro es diferente"
          />
          <RuleItem
            icon="💬"
            color="var(--color-text-muted)"
            text={`5 ensayos de práctica con retroalimentación → ${n === 1 ? '20' : '20'} ensayos reales`}
          />
        </div>

        {/* Timing strip */}
        <div style={s.timingStrip} className="float-in-d2">
          <TimingStep label="+" time="500 ms" color="#8892A4" note="Fijación" />
          <div style={s.timingArrow}>→</div>
          <TimingStep label="👤" time="1 000 ms" color="#6C63FF" note="Rostro" />
          <div style={s.timingArrow}>→</div>
          <TimingStep label={isMobile ? '👆' : '⎵'} time="2 000 ms" color="#A78BFA" note="Responde" />
        </div>

        <div className="float-in-d2" style={{ textAlign: 'center' }}>
          <button className="btn-primary" onClick={onReady}>
            {n === 1 ? 'Comenzar práctica →' : 'Continuar →'}
          </button>
        </div>
      </div>
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
        <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>✓ ¡Coincide!</span>
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
        <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>✓ ¡Coincide!</span>
        <span style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>Mismo que hace 2 turnos</span>
      </div>
    </div>
  )
}

function FaceBox({ label, idx, isTarget }) {
  const colors = ['#6C63FF', '#A78BFA', '#60A5FA', '#34D399']
  const color = colors[idx % colors.length]
  return (
    <div style={{
      ...ex.face,
      border: isTarget ? `2px solid var(--color-success)` : `2px solid ${color}40`,
      background: isTarget ? 'rgba(76,175,138,0.12)' : `${color}12`,
      boxShadow: isTarget ? '0 0 16px rgba(76,175,138,0.3)' : 'none',
    }}>
      <span style={{ fontSize: 24 }}>👤</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: isTarget ? 'var(--color-success)' : color, marginTop: 4 }}>{label}</span>
    </div>
  )
}

function ExArrow() {
  return <span style={ex.arrow}>→</span>
}

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

/* ─── Styles ──────────────────────────────── */
const s = {
  outer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '24px 16px',
  },
  card: {
    maxWidth: 560,
    width: '100%',
    background: 'rgba(26, 45, 66, 0.9)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(108,99,255,0.15)',
    borderRadius: 24,
    padding: '40px 32px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  header: { textAlign: 'center' },
  chip: {
    display: 'inline-block',
    background: 'rgba(108,99,255,0.2)',
    border: '1px solid rgba(108,99,255,0.4)',
    color: 'var(--color-accent2)',
    padding: '4px 14px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.08em',
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.01em' },
  subtitle: { fontSize: 15, color: 'var(--color-text-muted)', lineHeight: 1.6 },
  exampleBox: {
    background: 'rgba(13,27,42,0.5)',
    border: '1px solid #2A3F5A',
    borderRadius: 14,
    padding: '18px 16px',
  },
  exLabel: {
    color: 'var(--color-text-muted)',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 16,
  },
  rules: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  timingStrip: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    background: 'rgba(13,27,42,0.4)',
    borderRadius: 12,
    padding: '14px 16px',
  },
  timingArrow: {
    color: 'var(--color-text-muted)',
    fontSize: 14,
    flexShrink: 0,
  },
}

const ex = {
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  face: {
    width: 64,
    height: 64,
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  arrow: {
    color: 'var(--color-text-muted)',
    fontSize: 14,
    flexShrink: 0,
  },
  targetLabel: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: 13,
    marginLeft: 4,
  },
}

const rl = {
  row: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '10px 14px',
    background: 'rgba(13,27,42,0.4)',
    borderRadius: 10,
  },
  icon: {
    fontSize: 16,
    fontWeight: 700,
    flexShrink: 0,
    marginTop: 1,
    width: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    color: 'var(--color-text)',
    lineHeight: 1.6,
  },
}

const ts = {
  step: { textAlign: 'center', flex: 1 },
  box: {
    width: 44,
    height: 44,
    borderRadius: 10,
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 6px',
  },
  icon: { fontSize: 18 },
  time: { fontSize: 11, fontWeight: 700, marginBottom: 2 },
  note: { fontSize: 10, color: 'var(--color-text-muted)' },
}
