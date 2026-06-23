export default function WelcomeScreen({ onStart }) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>CogniFace</h1>
        <p style={styles.subtitle}>Experimento de Memoria de Trabajo Social</p>
        <div style={styles.divider} />
        <p style={styles.body}>
          En este experimento verás una secuencia de rostros. Tu tarea es
          presionar <kbd style={styles.kbd}>ESPACIO</kbd> cuando el rostro
          actual sea igual a uno que viste recientemente.
        </p>
        <p style={styles.body}>
          El experimento tiene dos bloques cortos y dura aproximadamente <strong>10 minutos</strong>.
        </p>
        <button style={styles.button} onClick={onStart}>Comenzar</button>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24 },
  card: { maxWidth: 560, width: '100%', background: 'var(--color-surface)', borderRadius: 16, padding: 48, textAlign: 'center' },
  title: { fontSize: 48, fontWeight: 700, color: 'var(--color-accent)', marginBottom: 8 },
  subtitle: { color: 'var(--color-text-muted)', fontSize: 18, marginBottom: 24 },
  divider: { height: 1, background: '#2A3F5A', margin: '24px 0' },
  body: { fontSize: 16, lineHeight: 1.7, marginBottom: 16, color: 'var(--color-text)' },
  kbd: { background: '#2A3F5A', padding: '2px 8px', borderRadius: 4, fontFamily: 'monospace', color: 'var(--color-accent)' },
  button: { marginTop: 24, background: 'var(--color-accent)', color: '#fff', border: 'none', padding: '14px 40px', borderRadius: 8, fontSize: 18, fontWeight: 600, cursor: 'pointer' },
}
