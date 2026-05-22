import { useState } from 'react'
import { useApp } from '../contexts/AppContext'

export default function CategoryRanking() {
  const { expenseByCategory, incomeByCategory } = useApp()
  const [tab, setTab] = useState('expense')

  const data = tab === 'expense' ? expenseByCategory : incomeByCategory
  const total = data.reduce((sum, c) => sum + c.amount, 0)

  return (
    <div>
      <div className="flex gap-1 bg-gray-100/70 rounded-lg p-1 mb-5 w-fit">
        {['expense', 'income'].map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              tab === key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {key === 'expense' ? '支出排行' : '收入排行'}
          </button>
        ))}
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">暂无{tab === 'expense' ? '支出' : '收入'}数据</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.map((cat, index) => {
            const pct = total > 0 ? (cat.amount / total) * 100 : 0
            return (
              <div key={cat.id} className="flex items-center gap-3">
                <span className="w-6 text-center text-sm font-medium text-gray-400">
                  {index + 1}
                </span>
                <div className="w-8 h-8 rounded-lg bg-gray-100/80 flex items-center justify-center text-lg flex-shrink-0">
                  {cat.icon}
                </div>
                <span className="text-sm text-gray-700 w-20 flex-shrink-0 truncate">{cat.name}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      tab === 'expense' ? 'bg-gradient-to-r from-red-400 to-red-300' : 'bg-gradient-to-r from-green-400 to-green-300'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-right flex-shrink-0 w-28">
                  <span className="text-sm font-medium text-gray-800">
                    ¥{cat.amount.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">
                    {pct.toFixed(1)}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
