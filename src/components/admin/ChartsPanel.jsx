import { aggregateForCharts } from '../../lib/statistics'
import IAFWidget from './charts/IAFWidget'
import AccuracyBarChart from './charts/AccuracyBarChart'
import MemoryLoadChart from './charts/MemoryLoadChart'
import ReactionTimeChart from './charts/ReactionTimeChart'

export default function ChartsPanel({ participants }) {
  const completed = participants.filter(p => p.completed)
  const { globalIAF, maleCount, femaleCount } = aggregateForCharts(completed)

  if (completed.length === 0) {
    return <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 60 }}>No hay datos completados aún.</p>
  }

  return (
    <div style={styles.grid}>
      <div style={styles.full}><IAFWidget globalIAF={globalIAF} maleCount={maleCount} femaleCount={femaleCount} /></div>
      <AccuracyBarChart participants={completed} />
      <MemoryLoadChart participants={completed} />
      <div style={styles.full}><ReactionTimeChart participants={completed} /></div>
    </div>
  )
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 },
  full: { gridColumn: '1 / -1' },
}
