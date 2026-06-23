import { calculateAccuracy, calculateIAF, calculateMeanRT } from '../../lib/statistics'

export default function ResultsScreen({ allTrials, participantGender }) {
  const iaf = calculateIAF(allTrials, participantGender)
  const acc = calculateAccuracy(allTrials)
  const rt = calculateMeanRT(allTrials)
  const isPositive = iaf > 0
  const oppositeLabel = participantGender === 'male' ? 'femeninos' : 'masculinos'

  return (
    <div style={s.container}>
      <div style={s.card}>
        <div style={s.trophy} className="float-in">🎉</div>
        <h2 style={s.title} className="float-in">Tus Resultados</h2>
        <p style={s.subtitle} className="float-in">Experimento completado</p>

        <div style={s.grid} className="float-in-d1">
          <StatCard label="Exactitud" value={`${(acc * 100).toFixed(1)}%`} icon="🎯" />
          <StatCard label="Tiempo de reacción" value={`${rt.toFixed(0)} ms`} icon="⚡" />
          <StatCard label="Índice IAF" value={iaf.toFixed(3)} icon="🧪" accent />
        </div>

        <div style={{ ...s.iafBox, borderColor: isPositive ? 'rgba(76,175,138,0.4)' : 'rgba(224,92,92,0.3)' }} className="float-in-d1">
          <div style={{ ...s.iafIcon, color: isPositive ? 'var(--color-success)' : 'var(--color-error)' }}>
            {isPositive ? '✓' : '○'}
          </div>
          <p style={s.iafText}>
            {isPositive
              ? `Tu IAF positivo (${iaf.toFixed(3)}) indica que recordaste mejor los rostros ${oppositeLabel}. Esto apoya la hipótesis de afinidad facial.`
              : `Tu IAF (${iaf.toFixed(3)}) indica que no mostraste una ventaja clara hacia los rostros ${oppositeLabel}.`
            }
          </p>
        </div>

        <p style={s.thanks} className="float-in-d2">
          ¡Gracias por participar! Tu contribución ayuda a la investigación científica.
        </p>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, accent }) {
  return (
    <div style={{ ...sc.card, border: accent ? '1px solid rgba(108,99,255,0.35)' : '1px solid #2A3F5A' }}>
      <span style={sc.icon}>{icon}</span>
      <div style={sc.label}>{label}</div>
      <div style={{ ...sc.value, color: accent ? 'var(--color-accent2)' : 'var(--color-text)' }}>{value}</div>
    </div>
  )
}

const sc = {
  card: { background: 'rgba(13,27,42,0.6)', borderRadius: 12, padding: '20px 16px', textAlign: 'center' },
  icon: { fontSize: 28, display: 'block', marginBottom: 8 },
  label: { color: 'var(--color-text-muted)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 },
  value: { fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' },
}

const s = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24 },
  card: {
    maxWidth: 600,
    width: '100%',
    background: 'rgba(26, 45, 66, 0.85)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(108,99,255,0.15)',
    borderRadius: 24,
    padding: '48px 40px',
    textAlign: 'center',
    boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
  },
  trophy: { fontSize: 52, marginBottom: 12 },
  title: { fontSize: 30, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.02em' },
  subtitle: { color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 32 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 24 },
  iafBox: {
    background: 'rgba(13,27,42,0.5)',
    border: '1px solid',
    borderRadius: 12,
    padding: '20px 24px',
    textAlign: 'left',
    display: 'flex',
    gap: 16,
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  iafIcon: { fontSize: 22, fontWeight: 700, flexShrink: 0, marginTop: 2 },
  iafText: { fontSize: 15, lineHeight: 1.7, color: 'var(--color-text)' },
  thanks: { color: 'var(--color-text-muted)', fontSize: 13 },
}
