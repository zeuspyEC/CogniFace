import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'

export default function MemoryLoadChart({ participants }) {
  const males   = participants.filter(p => p.gender === 'male')
  const females = participants.filter(p => p.gender === 'female')
  const avg = (arr, key) =>
    arr.length > 0 ? arr.reduce((s, p) => s + (p[key] ?? 0), 0) / arr.length : null

  const data = [
    { name: 'N-Back 1', Hombres: avg(males, 'iaf_n1'), Mujeres: avg(females, 'iaf_n1') },
    { name: 'N-Back 2', Hombres: avg(males, 'iaf_n2'), Mujeres: avg(females, 'iaf_n2') },
  ]

  const fmt = v => v != null ? v.toFixed(3) : '—'

  return (
    <div style={s.card}>
      <h3 style={s.title}>Efecto de Carga Cognitiva: IAF en N-1 vs N-2</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A3F5A" />
          <XAxis dataKey="name" stroke="#8892A4" />
          <YAxis domain={[-1, 1]} stroke="#8892A4" tickCount={5} tickFormatter={fmt} />
          <ReferenceLine y={0} stroke="#8892A4" strokeDasharray="4 4" />
          <Tooltip formatter={fmt} contentStyle={{ background: '#1A2D42', border: 'none' }} />
          <Legend />
          <Line type="monotone" dataKey="Hombres" stroke="#6C63FF" strokeWidth={2} dot={{ r: 5 }} />
          <Line type="monotone" dataKey="Mujeres" stroke="#A78BFA" strokeWidth={2} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
      <p style={s.note}>¿Aumenta o disminuye la afinidad facial al incrementar la carga de memoria?</p>
    </div>
  )
}

const s = {
  card: { background: 'var(--color-surface)', borderRadius: 12, padding: 24, border: '1px solid #2A3F5A' },
  title: { fontSize: 15, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 16 },
  note: { color: 'var(--color-text-muted)', fontSize: 12, marginTop: 10 },
}
