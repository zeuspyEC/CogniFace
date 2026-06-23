import { describe, it, expect } from 'vitest'
import { generateSequence, PRACTICE_SEQUENCE_N1, PRACTICE_SEQUENCE_N2 } from '../lib/sequences'
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

describe('PRACTICE_SEQUENCE_N1', () => {
  it('tiene 5 trials', () => expect(PRACTICE_SEQUENCE_N1).toHaveLength(5))
  it('targets válidos para N=1: face_id == el trial anterior', () => {
    PRACTICE_SEQUENCE_N1.forEach((t, i) => {
      if (t.is_target) {
        expect(PRACTICE_SEQUENCE_N1[i - 1].face_id).toBe(t.face_id)
      }
    })
  })
})

describe('PRACTICE_SEQUENCE_N2', () => {
  it('tiene 5 trials', () => expect(PRACTICE_SEQUENCE_N2).toHaveLength(5))
  it('targets válidos para N=2: face_id == el trial de 2 posiciones atrás', () => {
    PRACTICE_SEQUENCE_N2.forEach((t, i) => {
      if (t.is_target) {
        expect(PRACTICE_SEQUENCE_N2[i - 2].face_id).toBe(t.face_id)
      }
    })
  })
})
