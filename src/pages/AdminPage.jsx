import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import AdminDashboard from '../components/admin/AdminDashboard'
import ParticipantsTable from '../components/admin/ParticipantsTable'
import ChartsPanel from '../components/admin/ChartsPanel'
import { getAllParticipants } from '../lib/firestoreService'
import LoadingSpinner from '../components/shared/LoadingSpinner'

export default function AdminPage() {
  const { user } = useAuth()
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('data')

  const fetchParticipants = useCallback(async () => {
    setLoading(true)
    const data = await getAllParticipants()
    setParticipants(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (user) fetchParticipants()
  }, [user, fetchParticipants])

  return (
    <AdminDashboard activeTab={activeTab} onTabChange={setActiveTab}>
      {loading ? <LoadingSpinner /> : (
        activeTab === 'data'
          ? <ParticipantsTable participants={participants} onRefresh={fetchParticipants} />
          : <ChartsPanel participants={participants} />
      )}
    </AdminDashboard>
  )
}
