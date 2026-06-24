import { useState } from 'react'
import {
  calculateAccuracy, calculateIAF, calculateMeanRT,
  calculateHits, calculateMisses, calculateFalseAlarms, calculateEmotionalErrors
} from '../../lib/statistics'

export default function ResultsScreen({ trials, participantGender, nBack }) {
  const [showLog, setShowLog] = useState(false)

  const real = trials.filter(t => !t.is_practice)
  const iaf = calculateIAF(real, participantGender)
  const acc = calculateAccuracy(real)
  const rt = calculateMeanRT(real)
  const hits = calculateHits(real)
  const misses = calculateMisses(real)
  const errors = calculateFalseAlarms(real)
  const emotionalErrors = calculateEmotionalErrors(real, participantGender)
  const isPositive = iaf > 0
  const oppGender = participantGender === 'male' ? 'Femeninos' : 'Masculinos'

  return (
    <div style={s.outer}>
      <div style={s.card}>
        <div className="float-in" style={s.headerSection}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>
            {isPositive ? '🏆' : '🎉'}
          </div>
          <h2 style={s.title}>¡Experimento Completado!</h2>
          <p style={s.subtitle}>N-Back {nBack} — Resultados del bloque</p>
        </div>

        <div style={s.metricsGrid} className="float-in-d1">
          <MetricCard label="Aciertos"         value={hits}               sub={`de ${real.filter(t => t.is_target).length} objetivos`} icon="✓" color="#4CAF8A" />
          <MetricCard label="Omisiones"        value={misses}             sub="objetivos no detectados"   icon="○" color="#E05C5C" />
          <MetricCard label="Tiempo de Reacción" value={`${rt.toFixed(0)} ms`} sub="promedio por acierto" icon="⚡" color="#6C63FF" />
          <MetricCard label="Errores"          value={errors}             sub="falsas alarmas"            icon="✗" color="#F59E0B" />
          <MetricCard label="Error Emocional"  value={emotionalErrors}    sub={`en rostros ${oppGender}`} icon="💭" color="#A78BFA" />
          <MetricCard label="Precisión"        value={`${(acc * 100).toFixed(1)}%`} sub="respuestas correctas" icon="🎯" color={acc >= 0.7 ? '#4CAF8A' : acc >= 0.5 ? '#F59E0B' : '#E05C5C'} />
        </div>

        <div
          style={{ ...s.iafBox, borderColor: isPositive ? 'rgba(76,175,138,0.4)' : 'rgba(224,92,92,0.3)', background: isPositive ? 'rgba(76,175,138,0.06)' : 'rgba(224,92,92,0.05)' }}
          className="float-in-d1"
        >
          <div style={{ ...s.iafIcon, color: isPositive ? 'var(--color-success)' : 'var(--color-error)' }}>
            {isPositive ? '✓' : '○'}
          </div>
          <div>
            <p style={s.iafTitle}>IAF = {iaf > 0 ? '+' : ''}{iaf.toFixed(3)} — {isPositive ? 'Hipótesis apoyada' : 'Sin ventaja diferencial'}</p>
            <p style={s.iafText}>
              {isPositive
                ? `Tu IAF positivo sugiere mejor memoria para rostros ${oppGender}, apoyando la hipótesis de afinidad facial.`
                : `Tu IAF no muestra ventaja significativa hacia rostros ${oppGender} en este bloque.`}
            </p>
          </div>
        </div>

        <div className="float-in-d2">
          <button style={lg.toggleBtn} onClick={() => setShowLog(v => !v)}>
            {showLog ? '▲ Ocultar registro de ensayos' : '▼ Ver registro de ensayos'}
          </button>
          {showLog && <TrialLog trials={real} nBack={nBack} />}
        </div>

        <p style={s.thanks} className="float-in-d2">
          Gracias por participar en la investigación de memoria de trabajo social. 🙌
        </p>
      </div>
    </div>
  )
}

function MetricCard({ label, value, sub, icon, color }) {
  return (
    <div style={{ ...mc.card, borderColor: `${color}30` }}>
      <span style={{ ...mc.icon, color }}>{icon}</span>
      <div style={mc.label}>{label}</div>
      <div style={{ ...mc.value, color }}>{value}</div>
      <div style={mc.sub}>{sub}</div>
    </div>
  )
}

function TrialLog({ trials, nBack }) {
  const labels = {
    hit: { label: '✓ Acierto', color: '#4CAF8A' },
    miss: { label: '○ Omisión', color: '#E05C5C' },
    false_alarm: { label: '✗ Error', color: '#F59E0B' },
    correct_rejection: { label: '— Correcto', color: '#8892A4' },
  }
  return (
    <div style={lg.block}>
      <p style={lg.blockTitle}>Registro N-Back {nBack} — {trials.length} ensayos</p>
      {trials.map((t, i) => {
        const info = labels[t.error_type] ?? { label: t.error_type, color: '#8892A4' }
        return (
          <div key={i} style={lg.row}>
            <span style={lg.num}>{t.trial_number}</span>
            <span style={{ color: t.face_gender === 'female' ? '#F472B6' : '#60A5FA', width: 14, flexShrink: 0, fontSize: 13 }}>
              {t.face_gender === 'female' ? '♀' : '♂'}
            </span>
            <span style={{ ...lg.tag, ...(t.is_target ? lg.tagTarget : {}) }}>
              {t.is_target ? 'Objetivo' : 'Distractor'}
            </span>
            <span style={{ ...lg.result, color: info.color }}>{info.label}</span>
            <span style={lg.rt}>{t.reaction_time != null ? `${Math.round(t.reaction_time)} ms` : ''}</span>
          </div>
        )
      })}
    </div>
  )
}

const s = {
  outer: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px 16px', background: 'var(--color-bg)' },
  card: { maxWidth: 600, width: '100%', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 24, padding: '40px 32px', boxShadow: '0 24px 80px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', gap: 20 },
  headerSection: { textAlign: 'center' },
  title: { fontSize: 26, fontWeight: 800, marginBottom: 4, color: 'var(--color-text)' },
  subtitle: { color: 'var(--color-text-muted)', fontSize: 13 },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 },
  iafBox: { border: '1px solid', borderRadius: 14, padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'flex-start' },
  iafIcon: { fontSize: 22, fontWeight: 700, flexShrink: 0, marginTop: 2 },
  iafTitle: { fontSize: 15, fontWeight: 700, marginBottom: 4, color: 'var(--color-text)' },
  iafText: { fontSize: 13, lineHeight: 1.7, color: 'var(--color-text-muted)' },
  thanks: { color: 'var(--color-text-muted)', fontSize: 13, lineHeight: 1.7, textAlign: 'center' },
}

const mc = {
  card: { background: 'rgba(13,27,42,0.4)', border: '1px solid', borderRadius: 12, padding: '14px 10px', textAlign: 'center' },
  icon: { fontSize: 20, display: 'block', marginBottom: 6 },
  label: { color: 'var(--color-text-muted)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 },
  value: { fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 },
  sub: { color: 'var(--color-text-muted)', fontSize: 10, lineHeight: 1.4 },
}

const lg = {
  toggleBtn: { width: '100%', background: 'rgba(26,45,66,0.5)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', padding: '10px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 500, textAlign: 'center' },
  block: { background: 'rgba(13,27,42,0.5)', border: '1px solid var(--color-border)', borderRadius: 12, padding: '14px 16px', maxHeight: 320, overflowY: 'auto', marginTop: 8 },
  blockTitle: { fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 10 },
  row: { display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid rgba(42,63,90,0.3)', fontSize: 12 },
  num: { width: 22, color: 'var(--color-text-muted)', fontSize: 11, flexShrink: 0 },
  tag: { fontSize: 10, padding: '2px 7px', borderRadius: 10, background: 'rgba(42,63,90,0.6)', color: 'var(--color-text-muted)', flexShrink: 0 },
  tagTarget: { background: 'rgba(108,99,255,0.2)', color: '#A78BFA' },
  result: { flex: 1, fontWeight: 500 },
  rt: { fontSize: 11, color: 'var(--color-text-muted)', flexShrink: 0, minWidth: 48, textAlign: 'right' },
}
