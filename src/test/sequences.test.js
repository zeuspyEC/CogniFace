import { describe, it, expect } from 'vitest'
import { generateSequence, PRACTICE_SEQUENCE } from '../lib/sequences'
import { FACE_MANIFEST } from '../lib/imagePreloader'

describe('generateSequence N-1', () => {
  const seq = generateSequence(1, FACE_MANIFEST)

  it('produce exactamente 20 trials', () => {
    expect(seq).toHaveLength(20)
  })

  it('tiene 3 targets femeninos y 3 masculinos', () => {
    const targets = seq.filter(t => t.is_target)
    expect(targets).toHaveLength(6)
    expect(targets.filter(t => t.face_gender === 'female')).toHaveLength(3)
    expect(targets.filter(t => t.face_gender === 'male')).toHaveLength(3)
  })

  it('cada target coincide con el trial N posiciones atrás', () => {
    for (let i = 0; i < seq.length; i++) {
      if (seq[i].is_target) {
        expect(seq[i].face_id).toBe(seq[i - 1].face_id)
      }
    }
  })

  it('ningún no-target coincide accidentalmente con N atrás', () => {
    for (let i = 1; i < seq.length; i++) {
      if (!seq[i].is_target) {
        expect(seq[i].face_id).not.toBe(seq[i - 1].face_id)
      }
    }
  })

  it('cada trial tiene los campos requeridos', () => {
    for (const t of seq) {
      expect(t).toHaveProperty('id')
      expect(t).toHaveProperty('face_id')
      expect(t).toHaveProperty('face_gender')
      expect(t).toHaveProperty('is_target')
      expect(t).toHaveProperty('src')
    }
  })
})

describe('generateSequence N-2', () => {
  const seq = generateSequence(2, FACE_MANIFEST)

  it('produce exactamente 20 trials', () => {
    expect(seq).toHaveLength(20)
  })

  it('tiene 3 targets femeninos y 3 masculinos', () => {
    const targets = seq.filter(t => t.is_target)
    expect(targets).toHaveLength(6)
    expect(targets.filter(t => t.face_gender === 'female')).toHaveLength(3)
    expect(targets.filter(t => t.face_gender === 'male')).toHaveLength(3)
  })

  it('cada target coincide con el trial 2 posiciones atrás', () => {
    for (let i = 0; i < seq.length; i++) {
      if (seq[i].is_target) {
        expect(seq[i].face_id).toBe(seq[i - 2].face_id)
      }
    }
  })

  it('ningún no-target coincide accidentalmente con 2 atrás', () => {
    for (let i = 2; i < seq.length; i++) {
      if (!seq[i].is_target) {
        expect(seq[i].face_id).not.toBe(seq[i - 2].face_id)
      }
    }
  })
})

describe('PRACTICE_SEQUENCE', () => {
  it('tiene 5 trials', () => {
    expect(PRACTICE_SEQUENCE).toHaveLength(5)
  })

  it('tiene al menos 1 target', () => {
    expect(PRACTICE_SEQUENCE.some(t => t.is_target)).toBe(true)
  })
})
