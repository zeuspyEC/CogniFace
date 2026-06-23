import { describe, it, expect } from 'vitest'
import { FACE_MANIFEST } from '../lib/imagePreloader'

describe('FACE_MANIFEST', () => {
  it('tiene exactamente 12 rostros', () => {
    expect(FACE_MANIFEST).toHaveLength(12)
  })

  it('tiene 6 femeninos y 6 masculinos', () => {
    const female = FACE_MANIFEST.filter(f => f.gender === 'female')
    const male = FACE_MANIFEST.filter(f => f.gender === 'male')
    expect(female).toHaveLength(6)
    expect(male).toHaveLength(6)
  })

  it('cada rostro tiene id, gender y src', () => {
    for (const face of FACE_MANIFEST) {
      expect(face).toHaveProperty('id')
      expect(face).toHaveProperty('gender')
      expect(face).toHaveProperty('src')
      expect(['female', 'male']).toContain(face.gender)
    }
  })

  it('los ids femeninos son f01-f06', () => {
    const ids = FACE_MANIFEST.filter(f => f.gender === 'female').map(f => f.id)
    expect(ids).toEqual(['f01', 'f02', 'f03', 'f04', 'f05', 'f06'])
  })

  it('los ids masculinos son m01-m06', () => {
    const ids = FACE_MANIFEST.filter(f => f.gender === 'male').map(f => f.id)
    expect(ids).toEqual(['m01', 'm02', 'm03', 'm04', 'm05', 'm06'])
  })
})
