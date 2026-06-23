import { useEffect } from 'react'
import { useExperimentEngine } from '../../hooks/useExperimentEngine'
import FixationCross from './FixationCross'
import StimulusDisplay from './StimulusDisplay'
import LoadingSpinner from '../shared/LoadingSpinner'

export default function PracticeBlock({ n, onComplete }) {
  const { phase, currentTrial, lastFeedback, trialIndex, totalTrials, images, start } = useExperimentEngine(n, true)

  useEffect(() => { start() }, [])
  useEffect(() => { if (phase === 'done') onComplete() }, [phase])

  if (phase === 'idle' || phase === 'preloading') return <LoadingSpinner />
  if (phase === 'done') return null

  const imageSrc = currentTrial
    ? (images[currentTrial.face_id]?.src ?? images[currentTrial.face_id] ?? currentTrial.src)
    : null

  return (
    <div style={styles.wrapper}>
      <div style={styles.progress}>Práctica {trialIndex}/{totalTrials}</div>
      {phase === 'fixation' && <FixationCross />}
      {(phase === 'stimulus' || phase === 'response') && imageSrc && (
        <StimulusDisplay imageSrc={imageSrc} faceId={currentTrial?.face_id} />
      )}
      {phase === 'response' && lastFeedback && (
        <div
          key={currentTrial?.face_id}
          className="feedback-pop"
          style={{ ...styles.feedback, color: lastFeedback === 'correct' ? 'var(--color-success)' : 'var(--color-error)' }}
        >
          {lastFeedback === 'correct' ? '✓ Correcto' : '✗ Incorrecto'}
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper: { position: 'relative', minHeight: '100vh' },
  progress: { position: 'fixed', top: 16, right: 16, color: 'var(--color-text-muted)', fontSize: 13 },
  feedback: { position: 'fixed', bottom: 40, left: '50%', transform: 'translateX(-50%)', fontSize: 24, fontWeight: 700 },
}
