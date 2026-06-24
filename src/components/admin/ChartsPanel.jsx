import { aggregateForCharts } from '../../lib/statistics'
import { useMobile } from '../../hooks/useMobile'
import IAFWidget from './charts/IAFWidget'
import AccuracyBarChart from './charts/AccuracyBarChart'
import MemoryLoadChart from './charts/MemoryLoadChart'
import ReactionTimeChart from './charts/ReactionTimeChart'
import HypothesisPieChart from './charts/HypothesisPieChart'
import IAFScatterChart from './charts/IAFScatterChart'
import IAFDistributionChart from './charts/IAFDistributionChart'

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

  const cols2 = isMobile ? '1fr' : '1fr 1fr'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 20 }}>
      {/* Row 1: Global IAF banner */}
      <IAFWidget globalIAF={globalIAF} maleCount={maleCount} femaleCount={femaleCount} />

      {/* Row 2: IAF by block + Cognitive load */}
      <div style={{ display: 'grid', gridTemplateColumns: cols2, gap: isMobile ? 12 : 20 }}>
        <AccuracyBarChart participants={completed} />
        <MemoryLoadChart participants={completed} />
      </div>

      {/* Row 3: Hypothesis pie + Participation status */}
      <div style={{ display: 'grid', gridTemplateColumns: cols2, gap: isMobile ? 12 : 20 }}>
        <HypothesisPieChart participants={completed} />
        <ReactionTimeChart participants={participants} />
      </div>

      {/* Row 4: IAF distribution histogram (full width) */}
      <IAFDistributionChart participants={completed} />

      {/* Row 5: N1 vs N2 scatter (full width) */}
      <IAFScatterChart participants={completed} />
    </div>
  )
}
