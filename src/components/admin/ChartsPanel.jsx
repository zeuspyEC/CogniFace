import { aggregateForCharts } from '../../lib/statistics'
import { useMobile } from '../../hooks/useMobile'
import IAFWidget from './charts/IAFWidget'
import GroupComparisonChart from './charts/GroupComparisonChart'
import MemoryLoadChart from './charts/MemoryLoadChart'
import ReactionTimeChart from './charts/ReactionTimeChart'
import SlopeChart from './charts/SlopeChart'
import LollipopChart from './charts/LollipopChart'
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
  const gap = isMobile ? 12 : 20

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {/* 1. Global IAF verdict banner */}
      <IAFWidget globalIAF={globalIAF} maleCount={maleCount} femaleCount={femaleCount} />

      {/* 2. Individual lollipop — most transparent view of the data */}
      <LollipopChart participants={completed} />

      {/* 3. Group means with error bars + Cognitive load line chart */}
      <div style={{ display: 'grid', gridTemplateColumns: cols2, gap }}>
        <GroupComparisonChart participants={completed} />
        <MemoryLoadChart participants={completed} />
      </div>

      {/* 4. IAF distribution histogram + Participation breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: cols2, gap }}>
        <IAFDistributionChart participants={completed} />
        <ReactionTimeChart participants={participants} />
      </div>

      {/* 5. Slope chart: N-1 → N-2 per participant (full width — rich detail) */}
      <SlopeChart participants={completed} />
    </div>
  )
}
