import { createContext, useContext, useReducer } from 'react'

const initialState = {
  step: 'welcome',
  gender: null,
  participantId: null,
  trialsBlock1: [],
  trialsBlock2: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'GO_GENDER':
      return { ...state, step: 'gender' }
    case 'SET_GENDER':
      return { ...state, gender: action.gender, step: 'instructions1' }
    case 'SET_PARTICIPANT_ID':
      return { ...state, participantId: action.id }
    case 'START_PRACTICE1':
      return { ...state, step: 'practice1' }
    case 'START_EXPERIMENT1':
      return { ...state, step: 'experiment1' }
    case 'COMPLETE_BLOCK1':
      return { ...state, trialsBlock1: action.trials, step: 'break' }
    case 'START_INSTRUCTIONS2':
      return { ...state, step: 'instructions2' }
    case 'START_PRACTICE2':
      return { ...state, step: 'practice2' }
    case 'START_EXPERIMENT2':
      return { ...state, step: 'experiment2' }
    case 'COMPLETE_BLOCK2':
      return { ...state, trialsBlock2: action.trials, step: 'results' }
    default:
      return state
  }
}

const ExperimentContext = createContext(null)

export function ExperimentProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <ExperimentContext.Provider value={{ state, dispatch }}>
      {children}
    </ExperimentContext.Provider>
  )
}

export const useExperiment = () => useContext(ExperimentContext)
