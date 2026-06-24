import { aggregateForCharts } from '../../lib/statistics'
import { useMobile } from '../../hooks/useMobile'
import IAFWidget from './charts/IAFWidget'
import AccuracyBarChart from './charts/AccuracyBarChart'
import MemoryLoadChart from './charts/MemoryLoadChart'
import ReactionTimeChart from './charts/ReactionTimeChart'

export default function ChartsPanel({ participants }) {
  const isMobile = useMobile()
  const completed = participants.filter(p => p.completed)
  const { globalIAF, maleCount, femaleCount } = aggregateForCharts(completed)

  if (completed.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 15, marginBottom: 8 }}>
          No hay datos completados aún.
        </p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 13, opacity: 0.7 }}>
          Los gráficos aparecerán cuando los participantes completen el experimento.
        </p>
      </div>
    )
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: isMobile ? 12 : 20,
    }}>
      <div style={{ gridColumn: '1 / -1' }}>
        <IAFWidget globalIAF={globalIAF} maleCount={maleCount} femaleCount={femaleCount} />
      </div>
      <AccuracyBarChart participants={completed} />
      <MemoryLoadChart participants={completed} />
      <div style={{ gridColumn: '1 / -1' }}>
        <ReactionTimeChart participants={completed} />
      </div>
    </div>
  )
}
