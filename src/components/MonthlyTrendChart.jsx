import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 text-sm space-y-1">
        <p className="font-medium text-gray-700">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-gray-500">{p.name}:</span>
            <span className="font-medium">¥{Number(p.value).toLocaleString()}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function MonthlyTrendChart() {
  const { session } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrend = async () => {
      const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5))

      const { data: txns } = await supabase
        .from('transactions')
        .select('amount, type, date')
        .eq('user_id', session.user.id)
        .gte('date', format(sixMonthsAgo, 'yyyy-MM-dd'))

      if (!txns) {
        setLoading(false)
        return
      }

      const monthly = {}
      for (let i = 5; i >= 0; i--) {
        const monthStart = startOfMonth(subMonths(new Date(), i))
        const key = format(monthStart, 'yyyy-MM')
        monthly[key] = { month: format(monthStart, 'M月'), income: 0, expense: 0 }
      }

      txns.forEach((t) => {
        const key = t.date.substring(0, 7)
        if (monthly[key]) {
          monthly[key][t.type] += Number(t.amount)
        }
      })

      setData(Object.values(monthly))
      setLoading(false)
    }

    fetchTrend()
  }, [session])

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-4">月度趋势</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" tick={{ fontSize: 13, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-sm text-gray-600">{value === 'income' ? '收入' : '支出'}</span>
            )}
          />
          <Bar dataKey="income" name="收入" fill="#22c55e" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expense" name="支出" fill="#ef4444" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
