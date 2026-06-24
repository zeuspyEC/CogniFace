import { useReducer, useEffect, useRef, useCallback } from 'react'
import { generateSequence, PRACTICE_SEQUENCE_N1, PRACTICE_SEQUENCE_N2 } from '../lib/sequences'
import { preloadImages, FACE_MANIFEST } from '../lib/imagePreloader'
import { classifyError } from '../lib/statistics'

const TIMING = { fixation: 500, stimulus: 1000, response: 2000 }

const initialState = {
  phase: 'idle',
  trialIndex: 0,
  sequence: [],
  results: [],
  lastFeedback: null,
  respondedThisTrial: false,
  stimulusOnset: null,
  pendingRT: null,
  images: {},
}

function reducer(state, action) {
  switch (action.type) {
    case 'PRELOADING':
      return { ...state, phase: 'preloading' }

    case 'LOADED':
      return {
        ...state,
        images: action.images,
        sequence: action.sequence,
        phase: 'fixation',
        trialIndex: 0,
        results: [],
        respondedThisTrial: false,
        pendingRT: null,
        lastFeedback: null,
      }

    case 'SHOW_STIMULUS':
      return {
        ...state,
        phase: 'stimulus',
        stimulusOnset: action.onset,
        lastFeedback: null,
      }

    case 'SHOW_RESPONSE':
      return { ...state, phase: 'response' }

    case 'RESPOND': {
      if (state.respondedThisTrial || state.phase !== 'response') return state
      const rt = performance.now() - state.stimulusOnset
      const trial = state.sequence[state.trialIndex]
      // Immediate feedback: hit if they pressed AND it was a target
      const immediateResult = trial?.is_target ? 'correct' : 'incorrect'
      return { ...state, respondedThisTrial: true, pendingRT: rt, lastFeedback: immediateResult }
    }

    case 'END_TRIAL': {
      const trial = state.sequence[state.trialIndex]
      if (!trial) return state
      const responded = state.respondedThisTrial
      const rt = responded ? state.pendingRT : null
      const errorType = classifyError(trial.is_target, responded)
      const accuracy = (errorType === 'hit' || errorType === 'correct_rejection') ? 1 : 0
      const result = {
        trial_number: state.trialIndex + 1,
        face_id: trial.face_id,
        face_gender: trial.face_gender,
        is_target: trial.is_target,
        responded,
        reaction_time: rt,
        accuracy,
        error_type: errorType,
      }
      const nextIndex = state.trialIndex + 1
      const isDone = nextIndex >= state.sequence.length
      return {
        ...state,
        results: [...state.results, result],
        lastFeedback: accuracy === 1 ? 'correct' : 'incorrect',
        respondedThisTrial: false,
        pendingRT: null,
        phase: isDone ? 'done' : 'fixation',
        trialIndex: nextIndex,
      }
    }

    default:
      return state
  }
}

export function useExperimentEngine(n, isPractice = false) {
  const [state, dispatch] = useReducer(reducer, initialState)
  // Ref to block duplicate keydown events within the same trial
  const keyHandled = useRef(false)

  const start = useCallback(async () => {
    dispatch({ type: 'PRELOADING' })
    const images = await preloadImages()
    const sequence = isPractice
      ? (n === 1 ? PRACTICE_SEQUENCE_N1 : PRACTICE_SEQUENCE_N2)
      : generateSequence(n, FACE_MANIFEST)
    dispatch({ type: 'LOADED', images, sequence })
  }, [n, isPractice])

  const respond = useCallback(() => {
    dispatch({ type: 'RESPOND' })
  }, [])

  // Global SPACE key handler — only registers a single response per trial
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== 'Space' || keyHandled.current) return
      keyHandled.current = true
      respond()
      // Reset after a short delay so a held key doesn't re-fire on the next trial
      setTimeout(() => { keyHandled.current = false }, 50)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [respond])

  // fixation → stimulus after 500 ms
  useEffect(() => {
    if (state.phase !== 'fixation') return
    const t = setTimeout(
      () => dispatch({ type: 'SHOW_STIMULUS', onset: performance.now() }),
      TIMING.fixation,
    )
    return () => clearTimeout(t)
  }, [state.phase, state.trialIndex])

  // stimulus → response after 1000 ms
  useEffect(() => {
    if (state.phase !== 'stimulus') return
    const t = setTimeout(
      () => dispatch({ type: 'SHOW_RESPONSE' }),
      TIMING.stimulus,
    )
    return () => clearTimeout(t)
  }, [state.phase, state.trialIndex])

  // response → end_trial after 2000 ms
  useEffect(() => {
    if (state.phase !== 'response') return
    const t = setTimeout(
      () => dispatch({ type: 'END_TRIAL' }),
      TIMING.response,
    )
    return () => clearTimeout(t)
  }, [state.phase, state.trialIndex])

  const currentTrial = state.sequence[state.trialIndex] ?? null

  return {
    phase: state.phase,
    currentTrial,
    trialIndex: state.trialIndex,
    totalTrials: state.sequence.length,
    lastFeedback: state.lastFeedback,
    results: state.results,
    images: state.images,
    respondedThisTrial: state.respondedThisTrial,
    start,
    respond,
  }
}
