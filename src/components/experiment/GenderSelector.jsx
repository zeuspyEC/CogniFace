export default function GenderSelector({ onSelect }) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>¿Cuál es tu sexo?</h2>
        <p style={styles.sub}>Esta información es confidencial y solo se usa para el análisis científico.</p>
        <div style={styles.options}>
          <button style={styles.option} onClick={() => onSelect('male')}>
            <span style={styles.icon}>♂</span>
            <span>Hombre</span>
          </button>
          <button style={styles.option} onClick={() => onSelect('female')}>
            <span style={styles.icon}>♀</span>
            <span>Mujer</span>
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' },
  card: { maxWidth: 480, width: '100%', background: 'var(--color-surface)', borderRadius: 16, padding: 48, textAlign: 'center' },
  title: { fontSize: 28, fontWeight: 700, marginBottom: 12 },
  sub: { color: 'var(--color-text-muted)', marginBottom: 32, fontSize: 14 },
  options: { display: 'flex', gap: 24, justifyContent: 'center' },
  option: { flex: 1, background: '#1A2D42', border: '2px solid #2A3F5A', color: 'var(--color-text)', borderRadius: 12, padding: '32px 16px', fontSize: 18, fontWeight: 600, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 },
  icon: { fontSize: 48 },
}
