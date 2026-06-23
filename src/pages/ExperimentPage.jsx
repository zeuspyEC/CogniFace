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

  async function handleGenderSelect(gender) {
    const id = await createParticipant(gender)
    dispatch({ type: 'SET_PARTICIPANT_ID', id })
    dispatch({ type: 'SET_GENDER', gender })
  }

  async function handleBlock1Complete(trials) {
    const stamped = trials.map(t => ({ ...t, is_practice: false }))
    await saveBlockTrials(state.participantId, 1, stamped)
    dispatch({ type: 'COMPLETE_BLOCK1', trials: stamped })
  }

  async function handleBlock2Complete(trials) {
    const stamped = trials.map(t => ({ ...t, is_practice: false }))
    await saveBlockTrials(state.participantId, 2, stamped)
    const iaf_n1 = calculateIAF(state.trialsBlock1, state.gender)
    const iaf_n2 = calculateIAF(stamped, state.gender)
    await completeParticipant(state.participantId, iaf_n1, iaf_n2)
    dispatch({ type: 'COMPLETE_BLOCK2', trials: stamped })
  }

  const { step, gender } = state
  const allTrials = [...state.trialsBlock1, ...state.trialsBlock2]

  return (
    <>
      {step === 'welcome' && (
        <WelcomeScreen onStart={() => dispatch({ type: 'GO_GENDER' })} />
      )}
      {step === 'gender' && (
        <GenderSelector onSelect={handleGenderSelect} />
      )}
      {step === 'instructions1' && (
        <InstructionsScreen n={1} onReady={() => dispatch({ type: 'START_PRACTICE1' })} />
      )}
      {step === 'practice1' && (
        <PracticeBlock n={1} onComplete={() => dispatch({ type: 'START_EXPERIMENT1' })} />
      )}
      {step === 'experiment1' && (
        <ExperimentBlock n={1} onComplete={handleBlock1Complete} />
      )}
      {step === 'break' && (
        <BreakScreen onContinue={() => dispatch({ type: 'START_INSTRUCTIONS2' })} />
      )}
      {step === 'instructions2' && (
        <InstructionsScreen n={2} onReady={() => dispatch({ type: 'START_PRACTICE2' })} />
      )}
      {step === 'practice2' && (
        <PracticeBlock n={2} onComplete={() => dispatch({ type: 'START_EXPERIMENT2' })} />
      )}
      {step === 'experiment2' && (
        <ExperimentBlock n={2} onComplete={handleBlock2Complete} />
      )}
      {step === 'results' && (
        <ResultsScreen allTrials={allTrials} participantGender={gender} />
      )}
    </>
  )
}
