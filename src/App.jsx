import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ExperimentPage from './pages/ExperimentPage'
import AdminPage from './pages/AdminPage'
import { AuthProvider } from './context/AuthContext'
import { ExperimentProvider } from './context/ExperimentContext'
import ProtectedRoute from './components/shared/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <ExperimentProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ExperimentPage />} />
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </ExperimentProvider>
    </AuthProvider>
  )
}
