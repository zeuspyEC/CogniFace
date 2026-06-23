import { describe, it, expect } from 'vitest'
import {
  calculateIAF, calculateAccuracy, calculateMeanRT,
  classifyError, aggregateForCharts
} from '../lib/statistics'

const makeTrial = (overrides) => ({
  face_gender: 'female', is_target: true, responded: true,
  reaction_time: 500, accuracy: 1, is_practice: false,
  error_type: 'hit', block: 1,
  ...overrides
})

describe('classifyError', () => {
  it('hit: objetivo y respondió', () => {
    expect(classifyError(true, true)).toBe('hit')
  })
  it('miss: objetivo y no respondió', () => {
    expect(classifyError(true, false)).toBe('miss')
  })
  it('false_alarm: no objetivo y respondió', () => {
    expect(classifyError(false, true)).toBe('false_alarm')
  })
  it('correct_rejection: no objetivo y no respondió', () => {
    expect(classifyError(false, false)).toBe('correct_rejection')
  })
})

describe('calculateAccuracy', () => {
  const trials = [
    makeTrial({ face_gender: 'female', accuracy: 1 }),
    makeTrial({ face_gender: 'female', accuracy: 1 }),
    makeTrial({ face_gender: 'female', accuracy: 0 }),
    makeTrial({ face_gender: 'male', accuracy: 1 }),
  ]

  it('calcula exactitud para femeninos', () => {
    expect(calculateAccuracy(trials, 'female')).toBeCloseTo(0.667, 2)
  })

  it('calcula exactitud para masculinos', () => {
    expect(calculateAccuracy(trials, 'male')).toBe(1)
  })

  it('retorna 0 si no hay trials del género', () => {
    expect(calculateAccuracy([], 'female')).toBe(0)
  })
})

describe('calculateIAF', () => {
  const trialsHombre = [
    makeTrial({ face_gender: 'female', accuracy: 1 }),
    makeTrial({ face_gender: 'female', accuracy: 1 }),
    makeTrial({ face_gender: 'male', accuracy: 0 }),
    makeTrial({ face_gender: 'male', accuracy: 0 }),
  ]

  it('hombre: acc(femeninas) - acc(masculinas)', () => {
    expect(calculateIAF(trialsHombre, 'male')).toBeCloseTo(1.0, 2)
  })

  it('mujer: acc(masculinas) - acc(femeninas)', () => {
    expect(calculateIAF(trialsHombre, 'female')).toBeCloseTo(-1.0, 2)
  })
})

describe('calculateMeanRT', () => {
  const trials = [
    makeTrial({ reaction_time: 400, face_gender: 'female' }),
    makeTrial({ reaction_time: 600, face_gender: 'female' }),
    makeTrial({ reaction_time: null, face_gender: 'female' }),
    makeTrial({ reaction_time: 300, face_gender: 'male' }),
  ]

  it('ignora nulls en el promedio', () => {
    expect(calculateMeanRT(trials, 'female')).toBe(500)
  })

  it('sin filtro de género calcula todos los no-null', () => {
    expect(calculateMeanRT(trials)).toBeCloseTo(433.33, 0)
  })
})
