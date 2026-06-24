import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Navigate } from 'react-router-dom'
import LoadingSpinner from '../shared/LoadingSpinner'

export default function AdminLogin() {
  const { signIn, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Hooks must come BEFORE conditional returns
  if (authLoading) return <LoadingSpinner />
  if (user) return <Navigate to="/admin" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signIn(email, password)
      navigate('/admin')
    } catch {
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoRing}>
            <span style={{ fontSize: 28 }}>🧠</span>
          </div>
          <h1 style={styles.title}>Panel Administrativo</h1>
          <p style={styles.sub}>CogniFace — Acceso Investigador</p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div style={styles.error}>
              <span>⚠️</span> {error}
            </div>
          )}
          <div style={styles.field}>
            <label style={styles.label}>Correo electrónico</label>
            <input
              style={styles.input}
              type="email"
              placeholder="admin@ejemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Ingresando…' : 'Ingresar al panel →'}
          </button>
        </form>

        <p style={styles.hint}>
          Acceso exclusivo para investigadores. Si no tienes credenciales,
          contacta al administrador del proyecto.
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '24px 16px',
    background: 'var(--color-bg)',
  },
  card: {
    maxWidth: 420,
    width: '100%',
    background: 'rgba(26, 45, 66, 0.9)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(108,99,255,0.2)',
    borderRadius: 24,
    padding: '40px 32px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
  },
  header: { textAlign: 'center', marginBottom: 28 },
  logoRing: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    background: 'rgba(108,99,255,0.15)',
    border: '1px solid rgba(108,99,255,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  title: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
  sub: { color: 'var(--color-text-muted)', fontSize: 13 },
  form: { display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)' },
  error: {
    background: 'rgba(224,92,92,0.12)',
    border: '1px solid rgba(224,92,92,0.3)',
    color: 'var(--color-error)',
    padding: '10px 14px',
    borderRadius: 10,
    fontSize: 14,
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    background: 'rgba(13,27,42,0.8)',
    border: '1px solid #2A3F5A',
    color: 'var(--color-text)',
    padding: '12px 16px',
    borderRadius: 10,
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  button: {
    background: 'linear-gradient(135deg, #6C63FF, #A78BFA)',
    color: '#fff',
    border: 'none',
    padding: '14px',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'filter 0.15s, transform 0.15s',
    marginTop: 4,
  },
  hint: {
    fontSize: 12,
    color: 'var(--color-text-muted)',
    textAlign: 'center',
    lineHeight: 1.6,
  },
}
