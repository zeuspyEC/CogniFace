import { calculateAccuracy, calculateIAF, calculateMeanRT } from '../../lib/statistics'

export default function ResultsScreen({ allTrials, participantGender }) {
  const iaf = calculateIAF(allTrials, participantGender)
  const acc = calculateAccuracy(allTrials)
  const rt = calculateMeanRT(allTrials)
  const isPositive = iaf > 0
  const oppositeLabel = participantGender === 'male' ? 'femeninos' : 'masculinos'

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Tus Resultados</h2>
        <div style={styles.grid}>
          <Stat label="Exactitud Global" value={`${(acc * 100).toFixed(1)}%`} />
          <Stat label="Tiempo de Reacción" value={`${rt.toFixed(0)} ms`} />
          <Stat label="Índice de Afinidad Facial" value={iaf.toFixed(3)} highlight />
        </div>
        <div style={styles.interpretation}>
          <p>
            {isPositive
              ? `✓ Tu IAF es positivo (${iaf.toFixed(3)}), lo que indica que recordaste mejor los rostros ${oppositeLabel}. Esto apoya la hipótesis de afinidad facial.`
              : `Tu IAF es ${iaf.toFixed(3)}, lo que indica que no mostraste una ventaja clara hacia los rostros ${oppositeLabel}.`
            }
          </p>
        </div>
        <p style={styles.thanks}>¡Gracias por participar en este experimento! Tu contribución ayuda a la ciencia.</p>
      </div>
    </div>
  )
}

function Stat({ label, value, highlight }) {
  return (
    <div style={{ background: '#0D1B2A', borderRadius: 8, padding: 20, textAlign: 'center' }}>
      <div style={{ color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color: highlight ? 'var(--color-accent)' : 'var(--color-text)' }}>{value}</div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24 },
  card: { maxWidth: 600, width: '100%', background: 'var(--color-surface)', borderRadius: 16, padding: 48, textAlign: 'center' },
  title: { fontSize: 32, fontWeight: 700, marginBottom: 32 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 },
  interpretation: { background: '#0D1B2A', borderRadius: 8, padding: 20, textAlign: 'left', lineHeight: 1.7, marginBottom: 24 },
  thanks: { color: 'var(--color-text-muted)', fontSize: 14 },
}
