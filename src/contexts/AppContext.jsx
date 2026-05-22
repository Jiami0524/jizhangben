import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const { session } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(true)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    if (data) setCategories(data)
    return data || []
  }, [])

  // Fetch transactions for current month
  const fetchTransactions = useCallback(async () => {
    const { data } = await supabase
      .from('transactions')
      .select('*, categories(name, icon)')
      .gte('date', format(monthStart, 'yyyy-MM-dd'))
      .lte('date', format(monthEnd, 'yyyy-MM-dd'))
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
    if (data) setTransactions(data)
    setLoading(false)
    return data || []
  }, [monthStart, monthEnd])

  useEffect(() => {
    if (session) {
      fetchCategories()
      fetchTransactions()
    }
  }, [session, fetchCategories, fetchTransactions])

  // Add transaction
  const addTransaction = async (record) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...record, user_id: session.user.id })
      .select('*, categories(name, icon)')
      .single()
    if (error) throw error
    setTransactions((prev) => [data, ...prev])
    return data
  }

  // Update transaction
  const updateTransaction = async (id, updates) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select('*, categories(name, icon)')
      .single()
    if (error) throw error
    setTransactions((prev) => prev.map((t) => (t.id === id ? data : t)))
    return data
  }

  // Delete transaction
  const deleteTransaction = async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) throw error
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  // Computed values
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = totalIncome - totalExpense

  // Categories with amounts for charts
  const expenseByCategory = categories
    .filter((c) => c.type === 'expense')
    .map((cat) => {
      const amount = transactions
        .filter((t) => t.type === 'expense' && t.category_id === cat.id)
        .reduce((sum, t) => sum + Number(t.amount), 0)
      return { ...cat, amount }
    })
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  const incomeByCategory = categories
    .filter((c) => c.type === 'income')
    .map((cat) => {
      const amount = transactions
        .filter((t) => t.type === 'income' && t.category_id === cat.id)
        .reduce((sum, t) => sum + Number(t.amount), 0)
      return { ...cat, amount }
    })
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  const value = {
    transactions,
    categories,
    currentMonth,
    setCurrentMonth,
    loading,
    totalIncome,
    totalExpense,
    balance,
    expenseByCategory,
    incomeByCategory,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    fetchTransactions,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
