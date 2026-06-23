import { Fragment, useState } from 'react'
import { deleteParticipant, getParticipantTrials } from '../../lib/firestoreService'

export default function ParticipantsTable({ participants, onRefresh }) {
  const [loadingId, setLoadingId] = useState(null)
  const [detailId, setDetailId] = useState(null)
  const [trials, setTrials] = useState([])

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este participante y todos sus datos?')) return
    setLoadingId(id)
    await deleteParticipant(id)
    onRefresh()
    setLoadingId(null)
  }

  async function handleDetail(id) {
    if (detailId === id) { setDetailId(null); return }
    setLoadingId(id)
    const t = await getParticipantTrials(id)
    setTrials(t)
    setDetailId(id)
    setLoadingId(null)
  }

  if (participants.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 40 }}>
        No hay participantes registrados aún.
      </p>
    )
  }

  return (
    <div>
      <table style={styles.table}>
        <thead>
          <tr>
            {['ID', 'Género', 'Fecha', 'IAF N-1', 'IAF N-2', 'Completo', 'Acciones'].map(h => (
              <th key={h} style={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {participants.map(p => (
            <Fragment key={p.id}>
              <tr style={styles.tr}>
                <td style={styles.td}>{p.id.slice(0, 8)}…</td>
                <td style={styles.td}>{p.gender === 'male' ? '♂ Hombre' : '♀ Mujer'}</td>
                <td style={styles.td}>{p.timestamp?.toDate().toLocaleDateString('es') ?? '—'}</td>
                <td style={{ ...styles.td, color: p.iaf_n1 > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                  {p.iaf_n1 != null ? p.iaf_n1.toFixed(3) : '—'}
                </td>
                <td style={{ ...styles.td, color: p.iaf_n2 > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                  {p.iaf_n2 != null ? p.iaf_n2.toFixed(3) : '—'}
                </td>
                <td style={styles.td}>{p.completed ? '✓' : '⏳'}</td>
                <td style={styles.td}>
                  <button style={styles.btnDetail} onClick={() => handleDetail(p.id)} disabled={loadingId === p.id}>
                    {detailId === p.id ? 'Cerrar' : 'Ver'}
                  </button>
                  <button style={styles.btnDelete} onClick={() => handleDelete(p.id)} disabled={loadingId === p.id}>
                    Eliminar
                  </button>
                </td>
              </tr>
              {detailId === p.id && (
                <tr>
                  <td colSpan={7} style={styles.detailCell}>
                    <div style={styles.detailGrid}>
                      {trials.map(t => (
                        <div key={t.id} style={styles.trialChip}>
                          <span>{t.face_gender === 'female' ? '♀' : '♂'}</span>
                          <span style={{ color: t.accuracy === 1 ? 'var(--color-success)' : 'var(--color-error)' }}>
                            {t.error_type}
                          </span>
                          <span style={{ color: 'var(--color-text-muted)' }}>{t.reaction_time ? `${t.reaction_time.toFixed(0)}ms` : '—'}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 16px', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: 13, borderBottom: '1px solid #2A3F5A' },
  tr: { borderBottom: '1px solid #1A2D42' },
  td: { padding: '12px 16px', fontSize: 14 },
  btnDetail: { background: '#2A3F5A', color: 'var(--color-text)', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', marginRight: 8, fontSize: 13 },
  btnDelete: { background: '#3D1A1A', color: 'var(--color-error)', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
  detailCell: { background: '#0D1B2A', padding: 16 },
  detailGrid: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  trialChip: { background: '#1A2D42', borderRadius: 6, padding: '4px 10px', display: 'flex', gap: 8, fontSize: 12 },
}
