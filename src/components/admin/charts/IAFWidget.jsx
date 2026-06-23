export default function IAFWidget({ globalIAF, maleCount, femaleCount }) {
  const confirmed = globalIAF > 0
  return (
    <div style={styles.card}>
      <h3 style={styles.label}>Índice de Afinidad Facial Global</h3>
      <div style={{ ...styles.value, color: confirmed ? 'var(--color-success)' : 'var(--color-error)' }}>
        {globalIAF.toFixed(4)}
      </div>
      <div style={{ ...styles.status, background: confirmed ? '#0D2A1A' : '#2A0D0D', color: confirmed ? 'var(--color-success)' : 'var(--color-error)' }}>
        {confirmed ? '✓ Hipótesis Confirmada' : '✗ Hipótesis No Confirmada'}
      </div>
      <div style={styles.counts}>
        <span>♂ {maleCount} hombres</span>
        <span>♀ {femaleCount} mujeres</span>
      </div>
    </div>
  )
}

const styles = {
  card: { background: 'var(--color-surface)', borderRadius: 12, padding: 32, textAlign: 'center', border: '1px solid #2A3F5A' },
  label: { color: 'var(--color-text-muted)', fontSize: 13, fontWeight: 500, marginBottom: 16 },
  value: { fontSize: 56, fontWeight: 700, marginBottom: 16 },
  status: { display: 'inline-block', padding: '6px 20px', borderRadius: 20, fontSize: 14, fontWeight: 600, marginBottom: 16 },
  counts: { display: 'flex', justifyContent: 'center', gap: 24, color: 'var(--color-text-muted)', fontSize: 13 },
}
