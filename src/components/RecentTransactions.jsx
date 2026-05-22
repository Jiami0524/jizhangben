import { useApp } from '../contexts/AppContext'
import TransactionItem from './TransactionItem'

export default function RecentTransactions({ onEdit }) {
  const { transactions, loading } = useApp()
  const recent = transactions.slice(0, 5)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">最近账单</h3>
        {transactions.length > 5 && (
          <span className="text-xs text-gray-400">显示最近 5 条</span>
        )}
      </div>
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : recent.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-5xl mb-3">📝</p>
          <p className="text-gray-400 text-sm">这个月还没有记录</p>
          <p className="text-gray-300 text-xs mt-1">点击右下角 + 开始记账</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100/80">
          {recent.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  )
}
