export default function StimulusDisplay({ imageSrc, faceId }) {
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
    </div>
  )
}

const s = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  circle: {
    width: 280,
    height: 280,
    borderRadius: '50%',
    overflow: 'hidden',
    border: '3px solid rgba(108, 99, 255, 0.5)',
    boxShadow: '0 0 0 8px rgba(108, 99, 255, 0.08), 0 0 60px rgba(108, 99, 255, 0.3)',
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
}
