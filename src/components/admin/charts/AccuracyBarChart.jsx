import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'

export default function AccuracyBarChart({ participants }) {
  const males   = participants.filter(p => p.gender === 'male')
  const females = participants.filter(p => p.gender === 'female')
  const avg = (arr, key) =>
    arr.length > 0 ? arr.reduce((s, p) => s + (p[key] ?? 0), 0) / arr.length : null

  const mN1 = avg(males,   'iaf_n1')
  const mN2 = avg(males,   'iaf_n2')
  const fN1 = avg(females, 'iaf_n1')
  const fN2 = avg(females, 'iaf_n2')

  const data = [
    { name: 'N-Back 1', Hombres: mN1, Mujeres: fN1 },
    { name: 'N-Back 2', Hombres: mN2, Mujeres: fN2 },
  ]

  const fmt = v => v != null ? v.toFixed(3) : '—'

  return (
    <div style={s.card}>
      <h3 style={s.title}>IAF Promedio por Bloque y Género</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A3F5A" />
          <XAxis dataKey="name" stroke="#8892A4" />
          <YAxis domain={[-1, 1]} stroke="#8892A4" tickCount={5} tickFormatter={fmt} />
          <ReferenceLine y={0} stroke="#8892A4" strokeDasharray="4 4" />
          <Tooltip formatter={fmt} contentStyle={{ background: '#1A2D42', border: 'none' }} />
          <Legend />
          <Bar dataKey="Hombres" fill="#6C63FF" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Mujeres" fill="#A78BFA" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p style={s.note}>IAF &gt; 0 indica ventaja hacia rostros del sexo opuesto.</p>
    </div>
  )
}

const s = {
  card: { background: 'var(--color-surface)', borderRadius: 12, padding: 24, border: '1px solid #2A3F5A' },
  title: { fontSize: 15, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 16 },
  note: { color: 'var(--color-text-muted)', fontSize: 12, marginTop: 10 },
}
