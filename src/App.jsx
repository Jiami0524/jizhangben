import { useState, useCallback } from 'react'
import { format, addMonths, subMonths } from 'date-fns'
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi'
import { useAuth } from './contexts/AuthContext'
import { useApp } from './contexts/AppContext'
import AuthPage from './pages/AuthPage'
import StatsPage from './pages/StatsPage'
import Layout from './components/Layout'
import SummaryCards from './components/SummaryCards'
import CategoryPieChart from './components/CategoryPieChart'
import RecentTransactions from './components/RecentTransactions'
import AddTransactionDrawer from './components/AddTransactionDrawer'

function AppContent() {
  const [page, setPage] = useState('dashboard')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const app = useApp()

  const handleNavigate = useCallback((key) => setPage(key), [])

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
    <>
      <Layout activePage={page} onNavigate={handleNavigate} onAddClick={handleAddClick}>
        {page === 'dashboard' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">本月概览</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => app.setCurrentMonth(subMonths(app.currentMonth, 1))}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <HiOutlineChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium text-gray-700 min-w-[100px] text-center">
                  {format(app.currentMonth, 'yyyy 年 M 月')}
                </span>
                <button
                  onClick={() => app.setCurrentMonth(addMonths(app.currentMonth, 1))}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <HiOutlineChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <SummaryCards />
            {app.loading ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <div className="mt-8 glass-card p-6">
                  <CategoryPieChart />
                </div>
                <div className="mt-8 glass-card p-6">
                  <RecentTransactions onEdit={handleEditTransaction} />
                </div>
              </>
            )}
          </div>
        )}
        {page === 'stats' && <StatsPage />}
      </Layout>
      <AddTransactionDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        editTransaction={editingTransaction}
      />
    </>
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
