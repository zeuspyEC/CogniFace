import { useState } from 'react'
import { useExperiment } from '../context/ExperimentContext'
import { createParticipant, saveBlockTrials, completeParticipant } from '../lib/firestoreService'
import {
  calculateIAF, calculateAccuracy, calculateMeanRT,
  calculateEmotionalErrors, calculateHits, calculateMisses, calculateFalseAlarms
} from '../lib/statistics'
import WelcomeScreen from '../components/experiment/WelcomeScreen'
import ParticipantForm from '../components/experiment/ParticipantForm'
import BlockSelector from '../components/experiment/BlockSelector'
import InstructionsScreen from '../components/experiment/InstructionsScreen'
import PracticeBlock from '../components/experiment/PracticeBlock'
import ExperimentBlock from '../components/experiment/ExperimentBlock'
import ResultsScreen from '../components/experiment/ResultsScreen'

export default function ExperimentPage() {
  const { state, dispatch } = useExperiment()
  const [fatalError, setFatalError] = useState(null)

  async function handleParticipantSubmit({ gender, code, age }) {
    try {
      const id = await createParticipant(gender, code, age)
      dispatch({ type: 'SET_PARTICIPANT_ID', id })
      dispatch({ type: 'SET_PARTICIPANT', gender, age, code })
    } catch {
      setFatalError('No se pudo iniciar la sesión. Verifica tu conexión y recarga la página.')
    }
  }

  function handleBlockSelect(n) {
    dispatch({ type: 'SET_NBACK', n })
  }

  async function handleExperimentComplete(trials) {
    try {
      const stamped = trials.map(t => ({ ...t, is_practice: false }))
      await saveBlockTrials(state.participantId, state.nBack, stamped)

      const iaf = calculateIAF(stamped, state.gender)
      const hits = calculateHits(stamped)
      const misses = calculateMisses(stamped)
      const false_alarms = calculateFalseAlarms(stamped)
      const emotional_errors = calculateEmotionalErrors(stamped, state.gender)
      const mean_rt = calculateMeanRT(stamped)
      const accuracy = calculateAccuracy(stamped)

      try {
        await completeParticipant(state.participantId, state.nBack, iaf, {
          hits, misses, false_alarms, emotional_errors, mean_rt, accuracy,
        })
      } catch (e) {
        console.warn('completeParticipant failed (trials still saved):', e?.message)
      }

      dispatch({ type: 'COMPLETE_EXPERIMENT', trials: stamped })
    } catch {
      setFatalError('Error al guardar los datos. Tus ensayos parciales ya fueron guardados. Contacta al investigador.')
    }
  }

  if (fatalError) {
    return (
      <div style={errStyle.container}>
        <div style={errStyle.box}>
          <p style={{ fontSize: 40, marginBottom: 16 }}>⚠️</p>
          <p style={errStyle.msg}>{fatalError}</p>
          <button style={errStyle.btn} onClick={() => window.location.reload()}>Recargar</button>
        </div>
      </div>
    )
  }

  const { step, gender, nBack, trials } = state

  return (
    <>
      {step === 'welcome'     && <WelcomeScreen onStart={() => dispatch({ type: 'GO_FORM' })} />}
      {step === 'form'        && <ParticipantForm onSubmit={handleParticipantSubmit} />}
      {step === 'blockSelect' && <BlockSelector onSelect={handleBlockSelect} />}
      {step === 'instructions'&& <InstructionsScreen n={nBack} onReady={() => dispatch({ type: 'START_PRACTICE' })} />}
      {step === 'practice'    && <PracticeBlock n={nBack} onComplete={() => dispatch({ type: 'START_EXPERIMENT' })} />}
      {step === 'experiment'  && <ExperimentBlock n={nBack} onComplete={handleExperimentComplete} />}
      {step === 'results'     && <ResultsScreen trials={trials} participantGender={gender} nBack={nBack} />}
    </>
  )
}

const errStyle = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--color-bg)' },
  box: { maxWidth: 420, background: 'var(--color-surface)', borderRadius: 16, padding: 40, textAlign: 'center', border: '1px solid rgba(224,92,92,0.3)' },
  msg: { color: 'var(--color-text)', lineHeight: 1.7, marginBottom: 24 },
  btn: { background: 'var(--color-accent)', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer' },
}
