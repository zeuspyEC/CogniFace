// Lollipop chart: each participant as a dot on the IAF scale.
// Shows the individual spread — more honest than averages alone.
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from 'recharts'

function CustomDot(props) {
  const { cx, cy, payload } = props
  const color = payload.gender === 'male' ? '#6C63FF' : '#A78BFA'
  const iaf = payload.iaf
  const stem_y0 = props.zeroY ?? cy
  return (
    <g>
      <line x1={cx} x2={cx} y1={cy} y2={stem_y0} stroke={color} strokeWidth={1.5} opacity={0.6} />
      <circle cx={cx} cy={cy} r={5} fill={color} opacity={0.9} stroke="none" />
    </g>
  )
}

export default function LollipopChart({ participants }) {
  const sorted = [...participants]
    .sort((a, b) => (((a.iaf_n1 ?? 0) + (a.iaf_n2 ?? 0)) / 2) - (((b.iaf_n1 ?? 0) + (b.iaf_n2 ?? 0)) / 2))
    .map((p, i) => ({
      x: i,
      iaf: +((((p.iaf_n1 ?? 0) + (p.iaf_n2 ?? 0)) / 2)).toFixed(3),
      gender: p.gender,
      label: `#${i + 1}`,
    }))

  const confirmed = sorted.filter(p => p.iaf > 0).length
  const pct = sorted.length > 0 ? ((confirmed / sorted.length) * 100).toFixed(0) : 0

  const fmt = v => typeof v === 'number' ? v.toFixed(3) : v

  return (
    <div style={s.card}>
      <div style={s.header}>
        <h3 style={s.title}>IAF Individual — Cada Participante</h3>
        <div style={s.badge}>
          <span style={{ color: +pct >= 50 ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 700 }}>
            {pct}%
          </span>
          <span style={{ color: 'var(--color-text-muted)', marginLeft: 4, fontSize: 12 }}>confirman hipótesis (IAF &gt; 0)</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A3F5A" vertical={false} />
          <XAxis dataKey="x" type="number" domain={[-0.5, sorted.length - 0.5]}
            hide tick={false} axisLine={false} />
          <YAxis dataKey="iaf" domain={[-1, 1]} stroke="#8892A4" tickCount={5}
            tickFormatter={fmt} label={{ value: 'IAF', angle: -90, position: 'insideLeft', fill: '#8892A4', fontSize: 11 }} />
          <ReferenceLine y={0} stroke="#8892A4" strokeWidth={1.5} label={{ value: 'IAF = 0', position: 'right', fill: '#8892A4', fontSize: 10 }} />
          <Tooltip
            cursor={false}
            formatter={(v, name) => [typeof v === 'number' ? v.toFixed(3) : v, name]}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const d = payload[0]?.payload
              if (!d) return null
              return (
                <div style={{ background: '#1A2D42', border: 'none', padding: '8px 12px', borderRadius: 6, fontSize: 12, color: '#E8EEF4' }}>
                  <div>IAF = {d.iaf.toFixed(3)}</div>
                  <div style={{ color: d.gender === 'male' ? '#6C63FF' : '#A78BFA' }}>
                    {d.gender === 'male' ? '♂' : '♀'} {d.gender === 'male' ? 'Hombre' : 'Mujer'}
                  </div>
                  <div style={{ color: d.iaf > 0 ? 'var(--color-success)' : 'var(--color-error)', marginTop: 2 }}>
                    {d.iaf > 0 ? '✓ Confirma hipótesis' : '✗ No confirma'}
                  </div>
                </div>
              )
            }}
          />
          <Scatter data={sorted} shape={props => {
            const { cx, cy } = props
            const d = props.payload ?? props
            const iaf = d.iaf
            const color = d.gender === 'male' ? '#6C63FF' : '#A78BFA'
            // compute y for iaf=0 from domain [-1,1]
            const zeroY = props.yAxis ? props.yAxis.scale(0) : cy
            return (
              <g key={d.x}>
                <line x1={cx} x2={cx} y1={Math.min(cy, zeroY)} y2={Math.max(cy, zeroY)} stroke={color} strokeWidth={1.5} opacity={0.55} />
                <circle cx={cx} cy={cy} r={5.5} fill={color} opacity={0.9} />
              </g>
            )
          }}>
            {sorted.map((entry, i) => (
              <Cell key={i} fill={entry.gender === 'male' ? '#6C63FF' : '#A78BFA'} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div style={s.legend}>
        <span><span style={{ color: '#6C63FF' }}>● </span>Hombres</span>
        <span><span style={{ color: '#A78BFA' }}>● </span>Mujeres</span>
        <span style={{ color: 'var(--color-text-muted)', marginLeft: 8, fontSize: 11 }}>Ordenados por IAF promedio (N1+N2)/2</span>
      </div>
    </div>
  )
}

const s = {
  card: { background: 'var(--color-surface)', borderRadius: 12, padding: 24, border: '1px solid #2A3F5A' },
  header: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 },
  title: { fontSize: 15, fontWeight: 600, color: 'var(--color-text-muted)' },
  badge: { display: 'flex', alignItems: 'baseline' },
  legend: { display: 'flex', gap: 16, fontSize: 12, color: 'var(--color-text-muted)', marginTop: 8 },
}
