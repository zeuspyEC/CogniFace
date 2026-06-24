import { useState } from 'react'
import { useExperiment } from '../context/ExperimentContext'
import { createParticipant, saveBlockTrials, completeParticipant } from '../lib/firestoreService'
import { calculateIAF } from '../lib/statistics'
import WelcomeScreen from '../components/experiment/WelcomeScreen'
import GenderSelector from '../components/experiment/GenderSelector'
import InstructionsScreen from '../components/experiment/InstructionsScreen'
import PracticeBlock from '../components/experiment/PracticeBlock'
import ExperimentBlock from '../components/experiment/ExperimentBlock'
import BreakScreen from '../components/experiment/BreakScreen'
import ResultsScreen from '../components/experiment/ResultsScreen'

export default function ExperimentPage() {
  const { state, dispatch } = useExperiment()
  const [fatalError, setFatalError] = useState(null)

  async function handleGenderSelect(gender) {
    try {
      const id = await createParticipant(gender)
      dispatch({ type: 'SET_PARTICIPANT_ID', id })
      dispatch({ type: 'SET_GENDER', gender })
    } catch {
      setFatalError('No se pudo iniciar la sesión. Verifica tu conexión y recarga la página.')
    }
  }

  async function handleBlock1Complete(trials) {
    try {
      const stamped = trials.map(t => ({ ...t, is_practice: false }))
      await saveBlockTrials(state.participantId, 1, stamped)
      dispatch({ type: 'COMPLETE_BLOCK1', trials: stamped })
    } catch {
      setFatalError('Error al guardar el bloque 1. Por favor recarga e intenta de nuevo.')
    }
  }

  async function handleBlock2Complete(trials) {
    try {
      const stamped = trials.map(t => ({ ...t, is_practice: false }))
      await saveBlockTrials(state.participantId, 2, stamped)
      const iaf_n1 = calculateIAF(state.trialsBlock1, state.gender)
      const iaf_n2 = calculateIAF(stamped, state.gender)
      try {
        await completeParticipant(state.participantId, iaf_n1, iaf_n2)
      } catch (e) {
        console.warn('completeParticipant failed (trials still saved):', e?.message)
      }
      dispatch({ type: 'COMPLETE_BLOCK2', trials: stamped })
    } catch {
      setFatalError('Error al guardar el bloque 2. Tus datos parciales ya fueron guardados. Por favor contacta al investigador.')
    }
  }

  if (fatalError) {
    return (
      <div style={errStyle.container}>
        <div style={errStyle.box}>
          <p style={errStyle.icon}>⚠️</p>
          <p style={errStyle.msg}>{fatalError}</p>
          <button style={errStyle.btn} onClick={() => window.location.reload()}>Recargar</button>
        </div>
      </div>
    )
  }

  const { step, gender } = state
  const allTrials = [...state.trialsBlock1, ...state.trialsBlock2]

  return (
    <>
      {step === 'welcome'      && <WelcomeScreen onStart={() => dispatch({ type: 'GO_GENDER' })} />}
      {step === 'gender'       && <GenderSelector onSelect={handleGenderSelect} />}
      {step === 'instructions1'&& <InstructionsScreen n={1} onReady={() => dispatch({ type: 'START_PRACTICE1' })} />}
      {step === 'practice1'    && <PracticeBlock n={1} onComplete={() => dispatch({ type: 'START_EXPERIMENT1' })} />}
      {step === 'experiment1'  && <ExperimentBlock n={1} onComplete={handleBlock1Complete} />}
      {step === 'break'        && <BreakScreen onContinue={() => dispatch({ type: 'START_INSTRUCTIONS2' })} />}
      {step === 'instructions2'&& <InstructionsScreen n={2} onReady={() => dispatch({ type: 'START_PRACTICE2' })} />}
      {step === 'practice2'    && <PracticeBlock n={2} onComplete={() => dispatch({ type: 'START_EXPERIMENT2' })} />}
      {step === 'experiment2'  && <ExperimentBlock n={2} onComplete={handleBlock2Complete} />}
      {step === 'results'      && <ResultsScreen allTrials={allTrials} participantGender={gender} />}
    </>
  )
}

const errStyle = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' },
  box: { maxWidth: 420, background: 'var(--color-surface)', borderRadius: 16, padding: 40, textAlign: 'center', border: '1px solid rgba(224,92,92,0.3)' },
  icon: { fontSize: 40, marginBottom: 16 },
  msg: { color: 'var(--color-text)', lineHeight: 1.7, marginBottom: 24 },
  btn: { background: 'var(--color-accent)', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer' },
}
