import { useState, useEffect } from 'react'

export default function BreakScreen({ onContinue }) {
  const [seconds, setSeconds] = useState(30)

  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>¡Bloque 1 completado!</h2>
        <p style={styles.body}>
          Tómate un momento para descansar. El segundo bloque es similar pero con una regla diferente.
        </p>
        <div style={styles.timer}>{seconds > 0 ? seconds : '¡Listo!'}</div>
        <button
          style={{ ...styles.button, opacity: seconds > 0 ? 0.5 : 1, cursor: seconds > 0 ? 'not-allowed' : 'pointer' }}
          onClick={onContinue}
          disabled={seconds > 0}
        >
          Continuar al Bloque 2
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' },
  card: { maxWidth: 480, background: 'var(--color-surface)', borderRadius: 16, padding: 48, textAlign: 'center' },
  title: { fontSize: 28, fontWeight: 700, color: 'var(--color-success)', marginBottom: 16 },
  body: { fontSize: 16, lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: 24 },
  timer: { fontSize: 64, fontWeight: 700, color: 'var(--color-accent)', marginBottom: 24 },
  button: { background: 'var(--color-accent)', color: '#fff', border: 'none', padding: '14px 40px', borderRadius: 8, fontSize: 16, fontWeight: 600 },
}
