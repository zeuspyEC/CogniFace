import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

export default function ReactionTimeChart({ participants }) {
  const males   = participants.filter(p => p.gender === 'male')
  const females = participants.filter(p => p.gender === 'female')

  const data = [
    {
      name: 'Hombres',
      Completados: males.filter(p => p.completed).length,
      Incompletos: males.filter(p => !p.completed).length,
    },
    {
      name: 'Mujeres',
      Completados: females.filter(p => p.completed).length,
      Incompletos: females.filter(p => !p.completed).length,
    },
  ]

  return (
    <div style={s.card}>
      <h3 style={s.title}>Participantes por Grupo y Estado</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A3F5A" />
          <XAxis dataKey="name" stroke="#8892A4" />
          <YAxis allowDecimals={false} stroke="#8892A4" />
          <Tooltip contentStyle={{ background: '#1A2D42', border: 'none' }} />
          <Legend />
          <Bar dataKey="Completados" fill="#4CAF8A" radius={[4, 4, 0, 0]} stackId="a" />
          <Bar dataKey="Incompletos" fill="#2A3F5A" radius={[4, 4, 0, 0]} stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const s = {
  card: { background: 'var(--color-surface)', borderRadius: 12, padding: 24, border: '1px solid #2A3F5A' },
  title: { fontSize: 15, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 16 },
}
