import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
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

  const enrichTransaction = useCallback((record) => {
    if (!record) return record
    const cat = categories.find((c) => c.id === record.category_id)
    return { ...record, categories: cat ? { name: cat.name, icon: cat.icon } : null }
  }, [categories])

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase.from('categories').select('*').order('name')
    if (data) setCategories(data)
    return data || []
  }, [])

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    setTransactions([])
    try {
      const { data } = await supabase
        .from('transactions')
        .select('*, categories(name, icon)')
        .gte('date', format(monthStart, 'yyyy-MM-dd'))
        .lte('date', format(monthEnd, 'yyyy-MM-dd'))
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
      if (data) setTransactions(data)
      return data || []
    } finally {
      setLoading(false)
    }
  }, [monthStart, monthEnd])

  useEffect(() => {
    if (session) {
      fetchCategories()
      fetchTransactions()
    }
  }, [session, fetchTransactions])

  const addTransaction = async (record) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...record, user_id: session.user.id })
      .select()
      .single()
    if (error) throw error
    const enriched = enrichTransaction(data)
    setTransactions((prev) => [enriched, ...prev])
    return enriched
  }

  const updateTransaction = async (id, updates) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    const enriched = enrichTransaction(data)
    setTransactions((prev) => prev.map((t) => (t.id === id ? enriched : t)))
    return enriched
  }

  const deleteTransaction = async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) throw error
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const totalIncome = useMemo(() =>
    transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0),
  [transactions])

  const totalExpense = useMemo(() =>
    transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0),
  [transactions])

  const balance = useMemo(() => totalIncome - totalExpense, [totalIncome, totalExpense])

  const expenseByCategory = useMemo(() =>
    categories
      .filter((c) => c.type === 'expense')
      .map((cat) => {
        const amount = transactions
          .filter((t) => t.type === 'expense' && t.category_id === cat.id)
          .reduce((sum, t) => sum + Number(t.amount), 0)
        return { ...cat, amount }
      })
      .filter((c) => c.amount > 0)
      .sort((a, b) => b.amount - a.amount),
  [categories, transactions])

  const incomeByCategory = useMemo(() =>
    categories
      .filter((c) => c.type === 'income')
      .map((cat) => {
        const amount = transactions
          .filter((t) => t.type === 'income' && t.category_id === cat.id)
          .reduce((sum, t) => sum + Number(t.amount), 0)
        return { ...cat, amount }
      })
      .filter((c) => c.amount > 0)
      .sort((a, b) => b.amount - a.amount),
  [categories, transactions])

  const value = {
    transactions, categories, currentMonth, setCurrentMonth, loading,
    totalIncome, totalExpense, balance, expenseByCategory, incomeByCategory,
    addTransaction, updateTransaction, deleteTransaction, fetchTransactions,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
