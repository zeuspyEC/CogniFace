export default function IAFWidget({ globalIAF, maleCount, femaleCount }) {
  const confirmed = globalIAF > 0
  const total = maleCount + femaleCount

  const barWidth = Math.min(100, Math.abs(globalIAF) * 100)
  const barColor = confirmed ? '#4CAF8A' : '#E05C5C'

  return (
    <div style={s.card}>
      <div style={s.grid}>
        <div style={s.main}>
          <p style={s.label}>Índice de Afinidad Facial — Promedio Global</p>
          <div style={{ ...s.value, color: confirmed ? 'var(--color-success)' : 'var(--color-error)' }}>
            {globalIAF >= 0 ? '+' : ''}{globalIAF.toFixed(4)}
          </div>
          <div style={s.barTrack}>
            <div style={{ ...s.bar, width: `${barWidth}%`, background: barColor, marginLeft: confirmed ? '50%' : `calc(50% - ${barWidth}%)` }} />
            <div style={s.barCenter} />
          </div>
          <div style={{ ...s.verdict, background: confirmed ? 'rgba(76,175,138,0.12)' : 'rgba(224,92,92,0.12)', color: confirmed ? 'var(--color-success)' : 'var(--color-error)', border: `1px solid ${confirmed ? 'rgba(76,175,138,0.3)' : 'rgba(224,92,92,0.3)'}` }}>
            {confirmed
              ? '✓ Hipótesis Confirmada — Los participantes muestran ventaja de memoria hacia el sexo opuesto'
              : '✗ Hipótesis No Confirmada — El IAF global no supera el umbral de 0'}
          </div>
        </div>

        <div style={s.stats}>
          <StatBox label="Participantes" value={total} sub="completados" color="#6C63FF" />
          <StatBox label="♂ Hombres" value={maleCount} sub={`${total > 0 ? ((maleCount/total)*100).toFixed(0) : 0}%`} color="#6C63FF" />
          <StatBox label="♀ Mujeres" value={femaleCount} sub={`${total > 0 ? ((femaleCount/total)*100).toFixed(0) : 0}%`} color="#A78BFA" />
          <StatBox label="Confirman IAF" value={`> 0`} sub="umbral hipótesis" color={confirmed ? '#4CAF8A' : '#E05C5C'} />
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value, sub, color }) {
  return (
    <div style={sBox.box}>
      <p style={sBox.label}>{label}</p>
      <p style={{ ...sBox.value, color }}>{value}</p>
      <p style={sBox.sub}>{sub}</p>
    </div>
  )
}

const s = {
  card: { background: 'var(--color-surface)', borderRadius: 12, padding: 28, border: '1px solid #2A3F5A' },
  grid: { display: 'grid', gridTemplateColumns: '1fr auto', gap: 28, alignItems: 'start' },
  main: { minWidth: 0 },
  label: { color: 'var(--color-text-muted)', fontSize: 13, fontWeight: 500, marginBottom: 10 },
  value: { fontSize: 48, fontWeight: 700, lineHeight: 1, marginBottom: 16 },
  barTrack: { position: 'relative', height: 6, background: 'rgba(42,63,90,0.7)', borderRadius: 3, marginBottom: 16, overflow: 'hidden' },
  bar: { position: 'absolute', height: '100%', borderRadius: 3, transition: 'width 0.6s ease' },
  barCenter: { position: 'absolute', left: '50%', top: 0, width: 2, height: '100%', background: '#8892A4', transform: 'translateX(-50%)' },
  verdict: { fontSize: 13, padding: '10px 16px', borderRadius: 8, lineHeight: 1.5 },
  stats: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, minWidth: 200 },
}

const sBox = {
  box: { background: 'rgba(42,63,90,0.35)', borderRadius: 8, padding: '12px 14px', textAlign: 'center' },
  label: { color: 'var(--color-text-muted)', fontSize: 11, marginBottom: 4 },
  value: { fontSize: 22, fontWeight: 700, lineHeight: 1 },
  sub: { color: 'var(--color-text-muted)', fontSize: 10, marginTop: 2 },
}
