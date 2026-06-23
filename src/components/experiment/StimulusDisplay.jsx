export default function StimulusDisplay({ imageSrc }) {
  return (
    <div style={styles.container}>
      <img
        src={imageSrc}
        alt=""
        style={styles.image}
        draggable={false}
      />
    </div>
  )
}

const styles = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--color-bg)' },
  image: { width: 300, height: 300, objectFit: 'cover', borderRadius: 8, userSelect: 'none' },
}
