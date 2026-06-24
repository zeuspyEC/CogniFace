import { useEffect, useState, useRef } from 'react'
import { useExperimentEngine } from '../../hooks/useExperimentEngine'
import StimulusDisplay from './StimulusDisplay'
import LoadingSpinner from '../shared/LoadingSpinner'

const isMobileDevice = () =>
  typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export default function PracticeBlock({ n, onComplete }) {
  const {
    phase, currentTrial, lastFeedback, trialIndex, totalTrials,
    images, respondedThisTrial, start, respond,
  } = useExperimentEngine(n, true)

  const [countdown, setCountdown] = useState(3)
  const started = useRef(false)
  const isMobile = isMobileDevice()

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(t)
    }
    if (!started.current) {
      started.current = true
      start()
    }
  }, [countdown])

  useEffect(() => { if (phase === 'done') onComplete() }, [phase])

  if (countdown > 0) return <CountdownScreen count={countdown} label={`Práctica N-Back ${n}`} />
  if (phase === 'idle' || phase === 'preloading') return <LoadingSpinner />
  if (phase === 'done') return null

  const imageSrc = currentTrial
    ? (images[currentTrial.face_id]?.src ?? images[currentTrial.face_id] ?? currentTrial.src)
    : null

  const progress = totalTrials > 0 ? (trialIndex / totalTrials) * 100 : 0

  return (
    <div style={s.wrapper}>
      {/* Top progress bar */}
      <div style={s.topBar}>
        <div style={s.topRow}>
          <span style={s.pracBadge}>PRÁCTICA N-BACK {n}</span>
          <span style={s.trialCount}>{Math.min(trialIndex, totalTrials)} / {totalTrials}</span>
        </div>
        <div style={s.progressTrack}>
          <div style={{ ...s.progressFill, width: `${progress}%` }} />
        </div>
      </div>

      {/* Main stimulus area */}
      <div style={s.main}>
        {/* Fixation cross OR feedback from previous trial */}
        {phase === 'fixation' && !lastFeedback && <FixationView />}
        {phase === 'fixation' && lastFeedback && (
          <FeedbackOverlay result={lastFeedback} n={n} trialIndex={trialIndex} />
        )}

        {phase === 'stimulus' && imageSrc && (
          <StimulusDisplay imageSrc={imageSrc} faceId={currentTrial?.face_id} />
        )}

        {phase === 'response' && <EmptyFaceView responded={respondedThisTrial} />}
      </div>

      {/* Bottom response area */}
      <BottomResponse
        phase={phase}
        n={n}
        trialIndex={trialIndex}
        responded={respondedThisTrial}
        respond={respond}
        isMobile={isMobile}
        isPractice
      />
    </div>
  )
}

function CountdownScreen({ count, label }) {
  return (
    <div style={cd.container}>
      <p style={cd.label}>{label}</p>
      <div key={count} className="countdown-num" style={cd.num}>{count}</div>
      <p style={cd.hint}>Prepárate…</p>
    </div>
  )
}

function FeedbackOverlay({ result, n, trialIndex }) {  // shows during next fixation (500ms)
  const isCorrect = result === 'correct'
  return (
    <div key={`fb-${trialIndex}`} style={fb.container}>
      <div style={{ ...fb.badge, background: isCorrect ? 'rgba(76,175,138,0.15)' : 'rgba(224,92,92,0.15)', borderColor: isCorrect ? 'rgba(76,175,138,0.5)' : 'rgba(224,92,92,0.5)' }} className="feedback-slide">
        <span style={{ fontSize: 28 }}>{isCorrect ? '✓' : '✗'}</span>
        <div>
          <p style={{ ...fb.title, color: isCorrect ? 'var(--color-success)' : 'var(--color-error)' }}>
            {isCorrect ? '¡Correcto!' : 'Incorrecto'}
          </p>
          <p style={fb.hint}>
            {isCorrect
              ? 'Bien detectado 👍'
              : `Recuerda: presiona ESPACIO si el rostro coincide con hace ${n === 1 ? '1 turno' : '2 turnos'}`
            }
          </p>
        </div>
      </div>
    </div>
  )
}

function FixationView() {
  return (
    <div style={fix.wrap}>
      <span className="fix-pulse" style={fix.cross}>+</span>
    </div>
  )
}

function EmptyFaceView({ responded }) {
  return (
    <div style={empty.wrap}>
      <div style={{ ...empty.circle, ...(responded ? empty.circleResponded : {}) }}>
        {responded && <span style={empty.checkmark}>✓</span>}
      </div>
    </div>
  )
}

function BottomResponse({ phase, n, trialIndex, responded, respond, isMobile, isPractice }) {
  const isActive = phase === 'response'

  return (
    <div style={br.wrapper}>
      {/* Response timer bar */}
      <div style={br.timerTrack}>
        {isActive && (
          <div key={`timer-${trialIndex}`} className="response-timer-bar" />
        )}
      </div>

      {isMobile ? (
        <button
          onPointerDown={respond}
          disabled={!isActive || responded}
          style={{
            ...br.tapBtn,
            background: responded
              ? 'rgba(76,175,138,0.25)'
              : isActive
              ? 'linear-gradient(135deg, rgba(108,99,255,0.3), rgba(167,139,250,0.3))'
              : 'rgba(26,45,66,0.6)',
            borderColor: responded
              ? 'rgba(76,175,138,0.6)'
              : isActive
              ? 'rgba(108,99,255,0.7)'
              : 'rgba(42,63,90,0.6)',
            opacity: isActive ? 1 : 0.4,
          }}
        >
          <span style={br.tapIcon}>{responded ? '✓' : '👆'}</span>
          <span style={br.tapLabel}>
            {responded ? '¡Respondido!' : 'TOCA — Mismo rostro'}
          </span>
        </button>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              ...br.keyBox,
              ...(responded ? br.keyPressed : {}),
              ...(isActive && !responded ? br.keyActive : {}),
              opacity: isActive ? 1 : 0.35,
            }}
            className={isActive && !responded ? 'key-active-pulse' : ''}
          >
            <span style={br.keyIcon}>⎵</span>
            <span style={br.keyText}>ESPACIO</span>
          </div>
          <p style={{ ...br.keyHint, opacity: isActive ? 1 : 0.5 }}>
            {isActive
              ? `Presiona si coincide con hace ${n === 1 ? '1 turno' : '2 turnos'}`
              : isPractice
              ? '← Mira el rostro. Intenta recordar los anteriores.'
              : 'Observa el rostro…'
            }
          </p>
        </div>
      )}
    </div>
  )
}

/* ─── Styles ──────────────────────────────── */
const s = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--color-bg)',
  },
  topBar: {
    padding: '14px 20px 12px',
    borderBottom: '1px solid rgba(42,63,90,0.5)',
    background: 'rgba(26,45,66,0.6)',
    backdropFilter: 'blur(8px)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pracBadge: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.12em',
    color: '#FBBF24',
    background: 'rgba(251,191,36,0.12)',
    border: '1px solid rgba(251,191,36,0.3)',
    padding: '3px 10px',
    borderRadius: 20,
  },
  trialCount: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--color-text-muted)',
  },
  progressTrack: {
    height: 4,
    background: 'rgba(42,63,90,0.8)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #FBBF24, #F59E0B)',
    borderRadius: 3,
    transition: 'width 0.4s ease',
  },
  main: {
    flex: 1,
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

const cd = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.12em',
    color: '#FBBF24',
    textTransform: 'uppercase',
  },
  num: {
    fontSize: 120,
    fontWeight: 800,
    background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: 1,
  },
  hint: {
    fontSize: 15,
    color: 'var(--color-text-muted)',
  },
}

const fb = {
  container: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 5,
    pointerEvents: 'none',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '20px 28px',
    borderRadius: 16,
    border: '1px solid',
    backdropFilter: 'blur(12px)',
    maxWidth: 360,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 4,
  },
  hint: {
    fontSize: 13,
    color: 'var(--color-text-muted)',
    lineHeight: 1.5,
  },
}

const fix = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  cross: {
    fontSize: 80,
    fontWeight: 200,
    color: '#fff',
    lineHeight: 1,
    userSelect: 'none',
  },
}

const empty = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  circle: {
    width: 280,
    height: 280,
    borderRadius: '50%',
    border: '2px dashed rgba(108,99,255,0.25)',
    background: 'rgba(108,99,255,0.04)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  circleResponded: {
    borderColor: 'rgba(76,175,138,0.6)',
    background: 'rgba(76,175,138,0.06)',
    borderStyle: 'solid',
  },
  checkmark: {
    fontSize: 48,
    color: 'var(--color-success)',
  },
}

const br = {
  wrapper: {
    padding: '20px 24px 28px',
    borderTop: '1px solid rgba(42,63,90,0.5)',
    background: 'rgba(26,45,66,0.6)',
    backdropFilter: 'blur(8px)',
  },
  timerTrack: {
    height: 5,
    background: 'rgba(42,63,90,0.8)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 20,
  },
  keyBox: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    background: 'rgba(42,63,90,0.7)',
    border: '2px solid rgba(108,99,255,0.25)',
    borderRadius: 12,
    padding: '14px 32px',
    marginBottom: 10,
    transition: 'all 0.15s ease',
    cursor: 'default',
  },
  keyActive: {
    background: 'rgba(108,99,255,0.2)',
    borderColor: 'rgba(108,99,255,0.7)',
    boxShadow: '0 0 20px rgba(108,99,255,0.25)',
  },
  keyPressed: {
    background: 'rgba(76,175,138,0.2)',
    borderColor: 'rgba(76,175,138,0.6)',
    transform: 'translateY(2px)',
    boxShadow: 'none',
  },
  keyIcon: {
    fontSize: 22,
    color: 'var(--color-accent2)',
  },
  keyText: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: '0.06em',
    color: 'var(--color-text)',
  },
  keyHint: {
    fontSize: 13,
    color: 'var(--color-text-muted)',
    transition: 'opacity 0.3s',
  },
  tapBtn: {
    width: '100%',
    padding: '22px 20px',
    border: '2px solid',
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
  },
  tapIcon: {
    fontSize: 36,
    lineHeight: 1,
  },
  tapLabel: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--color-text)',
    letterSpacing: '0.04em',
  },
}
