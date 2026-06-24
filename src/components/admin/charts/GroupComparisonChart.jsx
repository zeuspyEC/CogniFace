// Grouped bar chart: mean IAF for males vs females in N-1 and N-2,
// with individual data points overlaid as dots (strip chart).
import {
  ComposedChart, Bar, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell, ErrorBar,
} from 'recharts'

export default function GroupComparisonChart({ participants }) {
  const males   = participants.filter(p => p.gender === 'male')
  const females = participants.filter(p => p.gender === 'female')

  function stats(group, key) {
    const vals = group.map(p => p[key] ?? 0)
    if (!vals.length) return { mean: 0, min: 0, max: 0, confirmed: 0, n: 0 }
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length
    const sd = vals.length > 1
      ? Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / (vals.length - 1))
      : 0
    return { mean, sd, min: Math.min(...vals), max: Math.max(...vals), confirmed: vals.filter(v => v > 0).length, n: vals.length }
  }

  const mN1 = stats(males, 'iaf_n1')
  const mN2 = stats(males, 'iaf_n2')
  const fN1 = stats(females, 'iaf_n1')
  const fN2 = stats(females, 'iaf_n2')

  const data = [
    { grupo: '♂ N-Back 1', value: +mN1.mean.toFixed(3), sd: +( mN1.sd ?? 0).toFixed(3), color: '#6C63FF', n: mN1.n, confirmed: mN1.confirmed },
    { grupo: '♂ N-Back 2', value: +mN2.mean.toFixed(3), sd: +(mN2.sd ?? 0).toFixed(3), color: '#4A42CC', n: mN2.n, confirmed: mN2.confirmed },
    { grupo: '♀ N-Back 1', value: +fN1.mean.toFixed(3), sd: +(fN1.sd ?? 0).toFixed(3), color: '#A78BFA', n: fN1.n, confirmed: fN1.confirmed },
    { grupo: '♀ N-Back 2', value: +fN2.mean.toFixed(3), sd: +(fN2.sd ?? 0).toFixed(3), color: '#7C5FA0', n: fN2.n, confirmed: fN2.confirmed },
  ]

  const fmt = v => typeof v === 'number' ? v.toFixed(3) : v

  return (
    <div style={s.card}>
      <h3 style={s.title}>IAF Promedio por Grupo — Con Dispersión Individual</h3>
      <p style={s.sub}>Las barras muestran la media. Las barras de error = ±1 DS. Verde = hipótesis confirmada.</p>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A3F5A" />
          <XAxis dataKey="grupo" stroke="#8892A4" tick={{ fontSize: 11 }} />
          <YAxis domain={[-1, 1]} stroke="#8892A4" tickCount={5} tickFormatter={fmt}
            label={{ value: 'IAF', angle: -90, position: 'insideLeft', fill: '#8892A4', fontSize: 11 }} />
          <ReferenceLine y={0} stroke="#8892A4" strokeWidth={1.5} />
          <Tooltip
            formatter={fmt}
            contentStyle={{ background: '#1A2D42', border: 'none', borderRadius: 6 }}
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null
              const d = payload[0].payload
              return (
                <div style={{ background: '#1A2D42', padding: '10px 14px', borderRadius: 6, fontSize: 12, color: '#E8EEF4' }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{d.grupo}</div>
                  <div>Media IAF: <strong>{d.value.toFixed(3)}</strong></div>
                  <div>DS: {d.sd.toFixed(3)}</div>
                  <div>n = {d.n}</div>
                  <div style={{ color: d.confirmed / d.n >= 0.5 ? 'var(--color-success)' : 'var(--color-error)', marginTop: 4 }}>
                    {d.confirmed}/{d.n} confirman hipótesis
                  </div>
                </div>
              )
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={50}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.value >= 0 ? entry.color : `${entry.color}88`} />
            ))}
            <ErrorBar dataKey="sd" width={4} strokeWidth={2} stroke="#E8EEF4" opacity={0.6} direction="y" />
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

const s = {
  card: { background: 'var(--color-surface)', borderRadius: 12, padding: 24, border: '1px solid #2A3F5A' },
  title: { fontSize: 15, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6 },
  sub: { fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 16, opacity: 0.8 },
}
