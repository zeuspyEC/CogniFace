export default function FixationCross() {
  return (
    <div style={s.container}>
      <span className="fix-pulse" style={s.cross}>+</span>
    </div>
  )
}

const s = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  cross: {
    fontSize: 80,
    fontWeight: 200,
    color: '#fff',
    lineHeight: 1,
    userSelect: 'none',
  },
}
