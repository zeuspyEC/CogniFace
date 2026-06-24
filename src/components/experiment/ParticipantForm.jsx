import { useState } from 'react'
import { ThemeToggle } from '../shared/ThemeToggle'

export default function ParticipantForm({ onSubmit }) {
  const [gender, setGender] = useState('')
  const [code, setCode] = useState('')
  const [age, setAge] = useState('')
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!gender) e.gender = 'Selecciona tu sexo'
    if (!code.trim()) e.code = 'Ingresa tu ID de participante'
    const ageNum = parseInt(age)
    if (!age || isNaN(ageNum) || ageNum < 10 || ageNum > 99) e.age = 'Ingresa una edad válida (10–99)'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSubmit({ gender, code: code.trim(), age: parseInt(age) })
  }

  return (
    <div style={s.container}>
      <div style={s.themeBtn}><ThemeToggle /></div>
      <div style={s.orb} />
      <div style={s.card}>
        <div className="float-in" style={s.header}>
          <span style={s.step}>DATOS DEL PARTICIPANTE</span>
          <h2 style={s.title}>Información General</h2>
          <p style={s.sub}>Esta información es confidencial y solo se usa para el análisis científico.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Sex */}
          <div style={s.fieldGroup} className="float-in-d1">
            <label style={s.label}>Sexo *</label>
            <div style={s.genderRow}>
              {[['male', '♂', 'Masculino', '#60A5FA'], ['female', '♀', 'Femenino', '#F472B6']].map(([val, icon, label, color]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => { setGender(val); setErrors(e => ({ ...e, gender: undefined })) }}
                  style={{
                    ...s.genderBtn,
                    borderColor: gender === val ? color : 'var(--color-border)',
                    background: gender === val ? `${color}18` : 'var(--color-surface)',
                    boxShadow: gender === val ? `0 0 0 2px ${color}40` : 'none',
                  }}
                >
                  <span style={{ fontSize: 24, color }}>{icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{label}</span>
                </button>
              ))}
            </div>
            {errors.gender && <p style={s.error}>{errors.gender}</p>}
          </div>

          {/* Participant ID */}
          <div style={s.fieldGroup} className="float-in-d1">
            <label style={s.label} htmlFor="pcode">ID del Participante *</label>
            <input
              id="pcode"
              type="text"
              value={code}
              onChange={e => { setCode(e.target.value); setErrors(er => ({ ...er, code: undefined })) }}
              placeholder="Ej: P001, EST_2024, etc."
              style={{ ...s.input, borderColor: errors.code ? 'var(--color-error)' : 'var(--color-border)' }}
            />
            {errors.code && <p style={s.error}>{errors.code}</p>}
          </div>

          {/* Age */}
          <div style={s.fieldGroup} className="float-in-d1">
            <label style={s.label} htmlFor="page">Edad *</label>
            <input
              id="page"
              type="number"
              value={age}
              min={10}
              max={99}
              onChange={e => { setAge(e.target.value); setErrors(er => ({ ...er, age: undefined })) }}
              placeholder="Ej: 22"
              style={{ ...s.input, maxWidth: 140, borderColor: errors.age ? 'var(--color-error)' : 'var(--color-border)' }}
            />
            {errors.age && <p style={s.error}>{errors.age}</p>}
          </div>

          <button type="submit" className="btn-primary float-in-d2" style={{ width: '100%', marginTop: 8 }}>
            Continuar →
          </button>
        </form>

        <p style={s.note} className="float-in-d2">
          🔒 Tus datos no incluyen nombre ni información identificable.
        </p>
      </div>
    </div>
  )
}

const s = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px 16px', background: 'var(--color-bg)', position: 'relative' },
  themeBtn: { position: 'fixed', top: 16, right: 16, zIndex: 100 },
  orb: { position: 'absolute', top: '20%', right: '10%', width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)', pointerEvents: 'none', animation: 'orbFloat 8s ease-in-out infinite' },
  card: { maxWidth: 480, width: '100%', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 20, padding: '36px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  header: { textAlign: 'center', marginBottom: 28 },
  step: { fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--color-accent2)', background: 'rgba(108,99,255,0.12)', padding: '3px 10px', borderRadius: 20 },
  title: { fontSize: 24, fontWeight: 700, marginTop: 10, marginBottom: 6, color: 'var(--color-text)' },
  sub: { fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 },
  fieldGroup: { marginBottom: 20 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8 },
  genderRow: { display: 'flex', gap: 12 },
  genderBtn: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '16px 12px', borderRadius: 12, border: '2px solid', cursor: 'pointer', transition: 'all 0.2s', background: 'var(--color-surface)' },
  input: { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: 15, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' },
  error: { fontSize: 12, color: 'var(--color-error)', marginTop: 5 },
  note: { textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 12, marginTop: 16 },
}
