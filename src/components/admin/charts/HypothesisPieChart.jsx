import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = { confirmed: '#4CAF8A', rejected: '#E05C5C', neutral: '#2A3F5A' }

export default function HypothesisPieChart({ participants }) {
  const males   = participants.filter(p => p.gender === 'male')
  const females = participants.filter(p => p.gender === 'female')

  function slice(group) {
    const confirmed = group.filter(p => ((p.iaf_n1 ?? 0) + (p.iaf_n2 ?? 0)) / 2 > 0).length
    const rejected  = group.length - confirmed
    return [
      { name: 'Confirma hipótesis', value: confirmed },
      { name: 'No confirma', value: rejected },
    ]
  }

  const pct = (v, total) => total > 0 ? ((v / total) * 100).toFixed(0) + '%' : '—'

  return (
    <div style={s.card}>
      <h3 style={s.title}>¿Quién confirma la hipótesis IAF?</h3>
      <div style={s.row}>
        <div style={s.half}>
          <p style={s.groupLabel}>♂ Hombres ({males.length})</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={slice(males)} dataKey="value" cx="50%" cy="50%" outerRadius={65} label={e => pct(e.value, males.length)}>
                {slice(males).map((_, i) => (
                  <Cell key={i} fill={i === 0 ? COLORS.confirmed : COLORS.rejected} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1A2D42', border: 'none' }} />
              <Legend iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={s.half}>
          <p style={s.groupLabel}>♀ Mujeres ({females.length})</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={slice(females)} dataKey="value" cx="50%" cy="50%" outerRadius={65} label={e => pct(e.value, females.length)}>
                {slice(females).map((_, i) => (
                  <Cell key={i} fill={i === 0 ? COLORS.confirmed : COLORS.rejected} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1A2D42', border: 'none' }} />
              <Legend iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

const s = {
  card: { background: 'var(--color-surface)', borderRadius: 12, padding: 24, border: '1px solid #2A3F5A' },
  title: { fontSize: 15, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 16 },
  row: { display: 'flex', gap: 8 },
  half: { flex: 1 },
  groupLabel: { fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: 4 },
}
