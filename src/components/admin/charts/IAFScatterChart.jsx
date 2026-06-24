import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'

export default function IAFScatterChart({ participants }) {
  const males   = participants.filter(p => p.gender === 'male').map(p => ({
    iaf_n1: +(p.iaf_n1 ?? 0).toFixed(3),
    iaf_n2: +(p.iaf_n2 ?? 0).toFixed(3),
  }))
  const females = participants.filter(p => p.gender === 'female').map(p => ({
    iaf_n1: +(p.iaf_n1 ?? 0).toFixed(3),
    iaf_n2: +(p.iaf_n2 ?? 0).toFixed(3),
  }))

  const fmt = v => v?.toFixed ? v.toFixed(3) : v

  return (
    <div style={s.card}>
      <h3 style={s.title}>IAF N-Back 1 vs N-Back 2 por Participante</h3>
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A3F5A" />
          <XAxis dataKey="iaf_n1" name="IAF N-1" domain={[-1, 1]} type="number"
            stroke="#8892A4" label={{ value: 'IAF N-1', position: 'insideBottom', offset: -4, fill: '#8892A4', fontSize: 11 }} />
          <YAxis dataKey="iaf_n2" name="IAF N-2" domain={[-1, 1]} type="number"
            stroke="#8892A4" label={{ value: 'IAF N-2', angle: -90, position: 'insideLeft', fill: '#8892A4', fontSize: 11 }} />
          <ZAxis range={[40, 40]} />
          <ReferenceLine x={0} stroke="#8892A4" strokeDasharray="4 4" />
          <ReferenceLine y={0} stroke="#8892A4" strokeDasharray="4 4" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }}
            formatter={fmt}
            contentStyle={{ background: '#1A2D42', border: 'none' }} />
          <Legend />
          <Scatter name="Hombres" data={males} fill="#6C63FF" opacity={0.85} />
          <Scatter name="Mujeres" data={females} fill="#A78BFA" opacity={0.85} />
        </ScatterChart>
      </ResponsiveContainer>
      <p style={s.note}>Cuadrante superior-derecho (++) = hipótesis confirmada en ambos bloques.</p>
    </div>
  )
}

const s = {
  card: { background: 'var(--color-surface)', borderRadius: 12, padding: 24, border: '1px solid #2A3F5A' },
  title: { fontSize: 15, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 16 },
  note: { color: 'var(--color-text-muted)', fontSize: 12, marginTop: 10 },
}
