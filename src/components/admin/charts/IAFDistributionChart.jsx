import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts'

function buildHistogram(values, bins = 10) {
  if (values.length === 0) return []
  const min = -1, max = 1
  const step = (max - min) / bins
  const counts = Array.from({ length: bins }, (_, i) => ({
    bin: +(min + i * step).toFixed(2),
    label: `${+(min + i * step).toFixed(2)}`,
    count: 0,
  }))
  for (const v of values) {
    const idx = Math.min(Math.floor((v - min) / step), bins - 1)
    counts[idx].count++
  }
  return counts
}

export default function IAFDistributionChart({ participants }) {
  const allIAF = participants.map(p => ((p.iaf_n1 ?? 0) + (p.iaf_n2 ?? 0)) / 2)
  const data = buildHistogram(allIAF)

  const mean = allIAF.length > 0
    ? (allIAF.reduce((a, b) => a + b, 0) / allIAF.length).toFixed(3)
    : 0
  const sd = allIAF.length > 1
    ? Math.sqrt(allIAF.reduce((s, v) => s + (v - mean) ** 2, 0) / (allIAF.length - 1)).toFixed(3)
    : 0
  const confirmed = allIAF.filter(v => v > 0).length
  const pct = allIAF.length > 0 ? ((confirmed / allIAF.length) * 100).toFixed(0) : 0

  return (
    <div style={s.card}>
      <h3 style={s.title}>Distribución del IAF (Promedio N1+N2)</h3>
      <div style={s.stats}>
        <span>μ = {mean}</span>
        <span>σ = {sd}</span>
        <span style={{ color: +pct >= 50 ? 'var(--color-success)' : 'var(--color-error)' }}>
          {pct}% confirman hipótesis
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A3F5A" />
          <XAxis dataKey="label" stroke="#8892A4" tick={{ fontSize: 10 }} interval={1} />
          <YAxis allowDecimals={false} stroke="#8892A4" />
          <ReferenceLine x="0.00" stroke="#8892A4" strokeDasharray="4 4" label={{ value: '0', fill: '#8892A4', fontSize: 10 }} />
          <Tooltip
            formatter={(v) => [v, 'Participantes']}
            labelFormatter={l => `IAF ≈ ${l}`}
            contentStyle={{ background: '#1A2D42', border: 'none' }}
          />
          <Bar dataKey="count" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.bin >= 0 ? '#4CAF8A' : '#E05C5C'} opacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p style={s.note}>Verde = IAF positivo (hipótesis confirmada). Rojo = IAF negativo.</p>
    </div>
  )
}

const s = {
  card: { background: 'var(--color-surface)', borderRadius: 12, padding: 24, border: '1px solid #2A3F5A' },
  title: { fontSize: 15, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 16 },
  stats: { display: 'flex', gap: 20, marginBottom: 12, fontSize: 13, color: 'var(--color-text-muted)' },
  note: { color: 'var(--color-text-muted)', fontSize: 12, marginTop: 10 },
}
