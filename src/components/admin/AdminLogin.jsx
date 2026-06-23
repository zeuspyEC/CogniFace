import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signIn(email, password)
      navigate('/admin')
    } catch {
      setError('Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h1 style={styles.title}>Panel Administrativo</h1>
        <p style={styles.sub}>CogniFace — Acceso Investigador</p>
        {error && <div style={styles.error}>{error}</div>}
        <input style={styles.input} type="email" placeholder="Correo electrónico"
          value={email} onChange={e => setEmail(e.target.value)} required />
        <input style={styles.input} type="password" placeholder="Contraseña"
          value={password} onChange={e => setPassword(e.target.value)} required />
        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}

const styles = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' },
  form: { background: 'var(--color-surface)', padding: 48, borderRadius: 16, width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16 },
  title: { fontSize: 24, fontWeight: 700, textAlign: 'center' },
  sub: { color: 'var(--color-text-muted)', textAlign: 'center', fontSize: 13, marginBottom: 8 },
  error: { background: '#3D1A1A', color: 'var(--color-error)', padding: '10px 16px', borderRadius: 8, fontSize: 14 },
  input: { background: '#0D1B2A', border: '1px solid #2A3F5A', color: 'var(--color-text)', padding: '12px 16px', borderRadius: 8, fontSize: 16, outline: 'none' },
  button: { background: 'var(--color-accent)', color: '#fff', border: 'none', padding: '14px', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer', marginTop: 8 },
}
