import { useState, useCallback } from 'react'
import { useAuth } from './contexts/AuthContext'
import { AppProvider } from './contexts/AppContext'
import AuthPage from './pages/AuthPage'
import Layout from './components/Layout'
import AddTransactionDrawer from './components/AddTransactionDrawer'
import SummaryCards from './components/SummaryCards'
import CategoryPieChart from './components/CategoryPieChart'
import RecentTransactions from './components/RecentTransactions'

function AppContent() {
  const [page, setPage] = useState('dashboard')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

  const handleNavigate = useCallback((key) => {
    setPage(key)
  }, [])

  const handleAddClick = () => {
    setEditingTransaction(null)
    setDrawerOpen(true)
  }

  const handleEditTransaction = (tx) => {
    setEditingTransaction(tx)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setEditingTransaction(null)
  }

  return (
    <AppProvider>
      <Layout activePage={page} onNavigate={handleNavigate} onAddClick={handleAddClick}>
        {page === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">本月概览</h2>
            <SummaryCards />
            <div className="mt-8 glass-card p-6">
              <CategoryPieChart />
            </div>
            <div className="mt-8 glass-card p-6">
              <RecentTransactions onEdit={handleEditTransaction} />
            </div>
          </div>
        )}
        {page === 'stats' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">统计分析</h2>
            <p className="text-gray-400">统计图表即将到来...</p>
          </div>
        )}
      </Layout>
      <AddTransactionDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        editTransaction={editingTransaction}
      />
    </AppProvider>
  )
}

export default function App() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return <AuthPage />

  return <AppContent />
}
