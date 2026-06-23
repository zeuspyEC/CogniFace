export default function FixationCross() {
  return (
    <div style={styles.container}>
      <span style={styles.cross}>+</span>
    </div>
  )
}

const styles = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--color-bg)' },
  cross: { fontSize: 72, fontWeight: 300, color: 'var(--color-text-muted)', lineHeight: 1 },
}
