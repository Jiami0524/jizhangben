import { useState, useCallback } from 'react'
import { useAuth } from './contexts/AuthContext'
import AuthPage from './pages/AuthPage'
import Layout from './components/Layout'

export default function App() {
  const { session, loading } = useAuth()
  const [page, setPage] = useState('dashboard')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleNavigate = useCallback((key) => {
    setPage(key)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return <AuthPage />
  }

  return (
    <Layout activePage={page} onNavigate={handleNavigate} onAddClick={() => setDrawerOpen(true)}>
      {page === 'dashboard' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">本月概览</h2>
          <p className="text-gray-400">仪表盘内容即将到来...</p>
        </div>
      )}
      {page === 'stats' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">统计分析</h2>
          <p className="text-gray-400">统计图表即将到来...</p>
        </div>
      )}
    </Layout>
  )
}
