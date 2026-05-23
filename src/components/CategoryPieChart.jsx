import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useApp } from '../contexts/AppContext'

const COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#f97316', '#eab308',
  '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
]

const RADIAN = Math.PI / 180

function renderLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percent < 0.05) return null

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={500}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="glass-card px-3 py-2 text-sm">
        <span className="mr-2">{data.icon}</span>
        <span className="font-medium text-gray-700">{data.name}</span>
        <span className="ml-2 text-gray-500">¥{data.amount.toLocaleString()}</span>
      </div>
    )
  }
  return null
}

export default function CategoryPieChart() {
  const { expenseByCategory, totalExpense } = useApp()

  if (totalExpense === 0) {
    return (
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">支出分类</h3>
        <div className="text-center py-10">
          <p className="text-4xl mb-2">📊</p>
          <p className="text-gray-400 text-sm">暂无支出数据</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-4">支出分类</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={expenseByCategory}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={110}
            paddingAngle={2}
            dataKey="amount"
            nameKey="name"
            label={renderLabel}
            labelLine={false}
          >
            {expenseByCategory.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
