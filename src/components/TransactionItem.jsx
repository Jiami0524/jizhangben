import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { useApp } from '../contexts/AppContext'
import { useToast } from './Toast'

export default function TransactionItem({ transaction, onEdit }) {
  const { deleteTransaction } = useApp()
  const { addToast } = useToast()

  const handleDelete = async () => {
    if (!window.confirm('确定删除这条记录吗？')) return
    try {
      await deleteTransaction(transaction.id)
      addToast('已删除记录')
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  const isExpense = transaction.type === 'expense'
  const icon = transaction.categories?.icon || '📌'
  const name = transaction.categories?.name || '未分类'

  return (
    <div className="flex items-center gap-4 py-3.5 px-1 group hover:bg-white/40 rounded-xl transition-colors -mx-1 px-2">
      <div className="w-10 h-10 rounded-xl bg-gray-100/80 flex items-center justify-center text-xl flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{name}</p>
        {transaction.note && (
          <p className="text-xs text-gray-400 truncate">{transaction.note}</p>
        )}
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`text-sm font-semibold ${isExpense ? 'text-red-500' : 'text-green-500'}`}>
          {isExpense ? '-' : '+'}¥{Number(transaction.amount).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-gray-400">{transaction.date}</p>
      </div>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button onClick={() => onEdit(transaction)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors">
          <HiOutlinePencil className="w-4 h-4" />
        </button>
        <button onClick={handleDelete} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
          <HiOutlineTrash className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
