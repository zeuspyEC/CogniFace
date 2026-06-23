import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function MemoryLoadChart({ participants }) {
  const males = participants.filter(p => p.gender === 'male')
  const females = participants.filter(p => p.gender === 'female')
  const avg = (arr, key) => arr.length > 0 ? arr.reduce((s, p) => s + (p[key] ?? 0), 0) / arr.length : 0

  const data = [
    { name: 'Hombres', 'N-Back 1': +(avg(males, 'iaf_n1') + 0.5).toFixed(3), 'N-Back 2': +(avg(males, 'iaf_n2') + 0.5).toFixed(3) },
    { name: 'Mujeres', 'N-Back 1': +(avg(females, 'iaf_n1') + 0.5).toFixed(3), 'N-Back 2': +(avg(females, 'iaf_n2') + 0.5).toFixed(3) },
  ]

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Efecto de Carga Cognitiva: N-1 vs N-2</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A3F5A" />
          <XAxis dataKey="name" stroke="#8892A4" />
          <YAxis domain={[0, 1]} stroke="#8892A4" tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
          <Tooltip formatter={(v) => `${(v * 100).toFixed(1)}%`} contentStyle={{ background: '#1A2D42', border: 'none' }} />
          <Legend />
          <Bar dataKey="N-Back 1" fill="#6C63FF" />
          <Bar dataKey="N-Back 2" fill="#E05C5C" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const styles = {
  card: { background: 'var(--color-surface)', borderRadius: 12, padding: 24, border: '1px solid #2A3F5A' },
  title: { fontSize: 15, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 16 },
}
