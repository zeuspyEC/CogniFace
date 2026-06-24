// Slope chart: each participant's N-1 → N-2 IAF as a connected line.
// Rising lines = IAF gets stronger under cognitive load.
// Dropping lines = cognitive load hurts facial affinity memory.
export default function SlopeChart({ participants }) {
  const CHART_H = 280
  const CHART_W_INNER = '100%'
  const PAD = { top: 24, bottom: 36, left: 52, right: 24 }
  const IAF_MIN = -1, IAF_MAX = 1

  function toY(iaf, h) {
    const range = IAF_MAX - IAF_MIN
    return PAD.top + ((IAF_MAX - iaf) / range) * (h - PAD.top - PAD.bottom)
  }

  const males   = participants.filter(p => p.gender === 'male')
  const females = participants.filter(p => p.gender === 'female')

  const avgM1 = avg(males.map(p => p.iaf_n1))
  const avgM2 = avg(males.map(p => p.iaf_n2))
  const avgF1 = avg(females.map(p => p.iaf_n1))
  const avgF2 = avg(females.map(p => p.iaf_n2))

  return (
    <div style={s.card}>
      <h3 style={s.title}>Evolución IAF: N-Back 1 → N-Back 2 por Participante</h3>
      <p style={s.subtitle}>Cada línea es un participante. Sube = hipótesis se refuerza con carga. Baja = decae.</p>
      <svg width={CHART_W_INNER} height={CHART_H} style={{ width: '100%', display: 'block' }} viewBox={`0 0 460 ${CHART_H}`} preserveAspectRatio="xMidYMid meet">
        {/* Y axis labels */}
        {[-1, -0.5, 0, 0.5, 1].map(v => {
          const y = toY(v, CHART_H)
          return (
            <g key={v}>
              <line x1={PAD.left} x2={436} y1={y} y2={y} stroke="#2A3F5A" strokeDasharray={v === 0 ? '0' : '3 4'} strokeWidth={v === 0 ? 1.5 : 0.8} />
              <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize={10} fill="#8892A4">{v.toFixed(1)}</text>
            </g>
          )
        })}

        {/* Zero line label */}
        <text x={PAD.left - 6} y={toY(0, CHART_H) + 4} textAnchor="end" fontSize={10} fill="#8892A4" />

        {/* X axis */}
        {[{ label: 'N-Back 1', x: 160 }, { label: 'N-Back 2', x: 300 }].map(col => (
          <g key={col.label}>
            <line x1={col.x} x2={col.x} y1={PAD.top} y2={CHART_H - PAD.bottom} stroke="#2A3F5A" strokeWidth={0.5} />
            <text x={col.x} y={CHART_H - 8} textAnchor="middle" fontSize={11} fill="#8892A4">{col.label}</text>
          </g>
        ))}

        {/* Individual participants - females */}
        {females.map((p, i) => {
          const y1 = toY(p.iaf_n1 ?? 0, CHART_H)
          const y2 = toY(p.iaf_n2 ?? 0, CHART_H)
          return (
            <g key={`f-${i}`} opacity={0.45}>
              <line x1={160} y1={y1} x2={300} y2={y2} stroke="#A78BFA" strokeWidth={1.2} />
              <circle cx={160} cy={y1} r={3} fill="#A78BFA" />
              <circle cx={300} cy={y2} r={3} fill="#A78BFA" />
            </g>
          )
        })}

        {/* Individual participants - males */}
        {males.map((p, i) => {
          const y1 = toY(p.iaf_n1 ?? 0, CHART_H)
          const y2 = toY(p.iaf_n2 ?? 0, CHART_H)
          return (
            <g key={`m-${i}`} opacity={0.45}>
              <line x1={160} y1={y1} x2={300} y2={y2} stroke="#6C63FF" strokeWidth={1.2} />
              <circle cx={160} cy={y1} r={3} fill="#6C63FF" />
              <circle cx={300} cy={y2} r={3} fill="#6C63FF" />
            </g>
          )
        })}

        {/* Average lines - bold */}
        {males.length > 0 && (
          <g>
            <line x1={160} y1={toY(avgM1, CHART_H)} x2={300} y2={toY(avgM2, CHART_H)} stroke="#6C63FF" strokeWidth={3} strokeLinecap="round" />
            <circle cx={160} cy={toY(avgM1, CHART_H)} r={5} fill="#6C63FF" />
            <circle cx={300} cy={toY(avgM2, CHART_H)} r={5} fill="#6C63FF" />
          </g>
        )}
        {females.length > 0 && (
          <g>
            <line x1={160} y1={toY(avgF1, CHART_H)} x2={300} y2={toY(avgF2, CHART_H)} stroke="#A78BFA" strokeWidth={3} strokeLinecap="round" />
            <circle cx={160} cy={toY(avgF1, CHART_H)} r={5} fill="#A78BFA" />
            <circle cx={300} cy={toY(avgF2, CHART_H)} r={5} fill="#A78BFA" />
          </g>
        )}

        {/* Legend */}
        <g transform={`translate(340, ${PAD.top + 10})`}>
          <circle cx={0} cy={0} r={5} fill="#6C63FF" />
          <text x={8} y={4} fontSize={11} fill="#8892A4">♂ Hombres</text>
          <circle cx={0} cy={18} r={5} fill="#A78BFA" />
          <text x={8} y={22} fontSize={11} fill="#8892A4">♀ Mujeres</text>
          <text x={0} y={40} fontSize={10} fill="#8892A4">── Promedio</text>
        </g>
      </svg>
    </div>
  )
}

function avg(arr) {
  const v = arr.filter(x => x !== null && x !== undefined)
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0
}

const s = {
  card: { background: 'var(--color-surface)', borderRadius: 12, padding: 24, border: '1px solid #2A3F5A' },
  title: { fontSize: 15, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6 },
  subtitle: { fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 16, opacity: 0.8 },
}
