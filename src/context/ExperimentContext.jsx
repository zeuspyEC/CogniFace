import { createContext, useContext, useReducer } from 'react'
export const ExperimentContext = createContext(null)
export function ExperimentProvider({ children }) {
  return <ExperimentContext.Provider value={{}}>{children}</ExperimentContext.Provider>
}
export const useExperiment = () => useContext(ExperimentContext)
