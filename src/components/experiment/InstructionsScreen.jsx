export default function InstructionsScreen({ n, onReady }) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <span style={styles.badge}>Bloque {n === 1 ? 1 : 2} — N-Back {n}</span>
        <h2 style={styles.title}>Instrucciones</h2>
        <p style={styles.body}>
          Verás rostros aparecer uno a uno. Presiona <kbd style={styles.kbd}>ESPACIO</kbd> cuando
          el rostro actual sea <strong>igual al que viste hace {n === 1 ? 'justo 1 turno' : '2 turnos'} atrás</strong>.
        </p>
        <div style={styles.example}>
          <p style={styles.exTitle}>Ejemplo {n === 1 ? 'N-1' : 'N-2'}:</p>
          {n === 1
            ? <p style={styles.exText}>Cara A → <strong style={{ color: 'var(--color-accent)' }}>Cara A</strong> ← ¡Presiona ESPACIO!</p>
            : <p style={styles.exText}>Cara A → Cara B → <strong style={{ color: 'var(--color-accent)' }}>Cara A</strong> ← ¡Presiona ESPACIO!</p>
          }
        </div>
        <p style={styles.hint}>Primero harás 5 ensayos de práctica con retroalimentación.</p>
        <button style={styles.button} onClick={onReady}>Entendido — Comenzar práctica</button>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24 },
  card: { maxWidth: 560, width: '100%', background: 'var(--color-surface)', borderRadius: 16, padding: 48, textAlign: 'center' },
  badge: { background: 'var(--color-accent)', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 },
  title: { fontSize: 28, fontWeight: 700, margin: '16px 0' },
  body: { fontSize: 16, lineHeight: 1.7, marginBottom: 24 },
  example: { background: '#0D1B2A', borderRadius: 8, padding: 16, marginBottom: 24 },
  exTitle: { color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 8 },
  exText: { fontSize: 16 },
  hint: { color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24 },
  kbd: { background: '#2A3F5A', padding: '2px 8px', borderRadius: 4, fontFamily: 'monospace', color: 'var(--color-accent)' },
  button: { background: 'var(--color-accent)', color: '#fff', border: 'none', padding: '14px 40px', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer' },
}
