export default function StimulusDisplay({ imageSrc, faceId, showHint = false }) {
  return (
    <div style={s.container}>
      <div key={faceId} className="face-appear" style={s.circle}>
        <img
          src={imageSrc}
          alt=""
          style={s.image}
          draggable={false}
        />
      </div>
      <p style={{ ...s.hint, opacity: showHint ? 1 : 0 }}>ESPACIO = mismo rostro</p>
    </div>
  )
}

const s = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: 24,
  },
  circle: {
    width: 320,
    height: 320,
    borderRadius: '50%',
    overflow: 'hidden',
    border: '3px solid rgba(108, 99, 255, 0.4)',
    boxShadow: '0 0 0 8px rgba(108, 99, 255, 0.08), 0 0 60px rgba(108, 99, 255, 0.25)',
    background: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center top',
    userSelect: 'none',
    pointerEvents: 'none',
  },
  hint: {
    color: 'rgba(136,146,164,0.5)',
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
}
