import { createContext, useContext, useReducer } from 'react'

const initialState = {
  step: 'welcome',
  gender: null,
  age: null,
  participantCode: '',
  nBack: null,
  participantId: null,
  trials: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'GO_FORM':
      return { ...state, step: 'form' }
    case 'SET_PARTICIPANT':
      return { ...state, gender: action.gender, age: action.age, participantCode: action.code, step: 'blockSelect' }
    case 'SET_PARTICIPANT_ID':
      return { ...state, participantId: action.id }
    case 'SET_NBACK':
      return { ...state, nBack: action.n, step: 'instructions' }
    case 'START_PRACTICE':
      return { ...state, step: 'practice' }
    case 'START_EXPERIMENT':
      return { ...state, step: 'experiment' }
    case 'COMPLETE_EXPERIMENT':
      return { ...state, trials: action.trials, step: 'results' }
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
