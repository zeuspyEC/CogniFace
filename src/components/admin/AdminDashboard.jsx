import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard({ children, activeTab, onTabChange }) {
  const { signOut } = useAuth()
  const tabs = [
    { id: 'data', label: 'Datos' },
    { id: 'charts', label: 'Estadísticas' },
  ]

  return (
    <div style={styles.layout}>
      <header style={styles.header}>
        <span style={styles.logo}>CogniFace <span style={styles.badge}>Admin</span></span>
        <nav style={styles.nav}>
          {tabs.map(t => (
            <button key={t.id}
              style={{ ...styles.tab, ...(activeTab === t.id ? styles.tabActive : {}) }}
              onClick={() => onTabChange(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
        <button style={styles.signOut} onClick={signOut}>Cerrar sesión</button>
      </header>
      <main style={styles.main}>{children}</main>
    </div>
  )
}

const styles = {
  layout: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  header: { background: 'var(--color-surface)', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', gap: 32, borderBottom: '1px solid #2A3F5A' },
  logo: { fontSize: 20, fontWeight: 700, color: 'var(--color-text)' },
  badge: { background: 'var(--color-accent)', color: '#fff', fontSize: 11, padding: '2px 8px', borderRadius: 10, marginLeft: 8 },
  nav: { display: 'flex', gap: 4, flex: 1 },
  tab: { background: 'none', border: 'none', color: 'var(--color-text-muted)', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 500 },
  tabActive: { background: '#2A3F5A', color: 'var(--color-text)' },
  signOut: { background: 'none', border: '1px solid #2A3F5A', color: 'var(--color-text-muted)', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
  main: { flex: 1, padding: 32, maxWidth: 1200, margin: '0 auto', width: '100%' },
}
