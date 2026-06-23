import { useEffect } from 'react'
import { useExperimentEngine } from '../../hooks/useExperimentEngine'
import FixationCross from './FixationCross'
import StimulusDisplay from './StimulusDisplay'
import LoadingSpinner from '../shared/LoadingSpinner'

export default function ExperimentBlock({ n, onComplete }) {
  const { phase, currentTrial, trialIndex, totalTrials, images, results, start } = useExperimentEngine(n, false)

  useEffect(() => { start() }, [])
  useEffect(() => { if (phase === 'done') onComplete(results) }, [phase])

  if (phase === 'idle' || phase === 'preloading') return <LoadingSpinner />
  if (phase === 'done') return null

  const imageSrc = currentTrial
    ? (images[currentTrial.face_id]?.src ?? images[currentTrial.face_id] ?? currentTrial.src)
    : null

  return (
    <div style={styles.wrapper}>
      <div style={styles.progress}>{trialIndex}/{totalTrials}</div>
      {phase === 'fixation' && <FixationCross />}
      {(phase === 'stimulus' || phase === 'response') && imageSrc && (
        <StimulusDisplay imageSrc={imageSrc} faceId={currentTrial?.face_id} />
      )}
    </div>
  )
}

const styles = {
  wrapper: { position: 'relative', minHeight: '100vh' },
  progress: { position: 'fixed', top: 16, right: 16, color: 'var(--color-text-muted)', fontSize: 13 },
}
