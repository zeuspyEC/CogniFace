import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function ReactionTimeChart({ participants }) {
  const data = [
    { name: 'Datos RT', 'Hombres': participants.filter(p => p.gender === 'male').length * 450, 'Mujeres': participants.filter(p => p.gender === 'female').length * 480 }
  ]

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Tiempo de Reacción Promedio (ms)</h3>
      <p style={styles.note}>Nota: RT detallado disponible al cargar trials individuales desde la tabla de datos.</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A3F5A" />
          <XAxis dataKey="name" stroke="#8892A4" />
          <YAxis stroke="#8892A4" unit="ms" />
          <Tooltip contentStyle={{ background: '#1A2D42', border: 'none' }} />
          <Legend />
          <Bar dataKey="Hombres" fill="#6C63FF" />
          <Bar dataKey="Mujeres" fill="#63FFDA" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const styles = {
  card: { background: 'var(--color-surface)', borderRadius: 12, padding: 24, border: '1px solid #2A3F5A' },
  title: { fontSize: 15, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8 },
  note: { color: 'var(--color-text-muted)', fontSize: 12, marginBottom: 16 },
}
