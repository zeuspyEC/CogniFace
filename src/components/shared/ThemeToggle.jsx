import { useTheme } from '../../context/ThemeContext'

export function ThemeToggle({ style = {} }) {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      style={{
        background: 'transparent',
        border: '1px solid var(--color-border)',
        borderRadius: 8,
        padding: '6px 10px',
        cursor: 'pointer',
        fontSize: 16,
        color: 'var(--color-text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        transition: 'all 0.2s',
        ...style,
      }}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
