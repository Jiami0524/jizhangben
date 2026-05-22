import { useState, useEffect } from 'react'
import { HiOutlineX, HiOutlinePlus, HiOutlineMinus } from 'react-icons/hi'
import { useApp } from '../contexts/AppContext'
import { useToast } from './Toast'
import { format } from 'date-fns'

export default function AddTransactionDrawer({ open, onClose, editTransaction }) {
  const { categories, addTransaction, updateTransaction } = useApp()
  const { addToast } = useToast()

  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isEdit = !!editTransaction
  const filteredCategories = categories.filter((c) => c.type === type)

  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type)
      setAmount(String(editTransaction.amount))
      setCategoryId(editTransaction.category_id || '')
      setDate(editTransaction.date)
      setNote(editTransaction.note || '')
    } else {
      setType('expense')
      setAmount('')
      setCategoryId('')
      setDate(format(new Date(), 'yyyy-MM-dd'))
      setNote('')
    }
  }, [editTransaction, open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount || !categoryId) {
      addToast('请填写金额并选择分类', 'error')
      return
    }
    if (Number(amount) <= 0) {
      addToast('金额必须大于 0', 'error')
      return
    }

    setSubmitting(true)
    try {
      const record = {
        type,
        amount: Number(amount),
        category_id: categoryId,
        date,
        note: note || '',
      }
      if (isEdit) {
        await updateTransaction(editTransaction.id, record)
        addToast('已更新记录')
      } else {
        await addTransaction(record)
        addToast('已添加记录')
      }
      onClose()
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <>
      {/* 遮罩 */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* 抽屉面板 */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 animate-[slideInRight_0.3s_ease-out]">
        <div className="h-full glass-card rounded-l-3xl rounded-r-none border-l border-white/60 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              {isEdit ? '编辑记录' : '记一笔'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <HiOutlineX className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 收入/支出切换 */}
            <div className="flex bg-gray-100/70 rounded-xl p-1">
              <button
                type="button"
                onClick={() => { setType('expense'); setCategoryId('') }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                  type === 'expense'
                    ? 'bg-white text-red-500 shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                <HiOutlineMinus className="w-4 h-4" />
                支出
              </button>
              <button
                type="button"
                onClick={() => { setType('income'); setCategoryId('') }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                  type === 'income'
                    ? 'bg-white text-green-500 shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                <HiOutlinePlus className="w-4 h-4" />
                收入
              </button>
            </div>

            {/* 金额 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">金额</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-300">¥</span>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 text-2xl font-semibold bg-white/60 border border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-900 placeholder-gray-300"
                />
              </div>
            </div>

            {/* 分类选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
              <div className="grid grid-cols-4 gap-2">
                {filteredCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-sm transition-all ${
                      categoryId === cat.id
                        ? 'bg-indigo-50 border-2 border-indigo-300 shadow-sm'
                        : 'bg-white/50 border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-xs text-gray-600 truncate w-full text-center">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">日期</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-900"
              />
            </div>

            {/* 备注 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">备注（可选）</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="添加备注..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-900 placeholder-gray-400"
              />
            </div>
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`w-full py-3 text-white font-medium rounded-xl transition-all shadow-lg disabled:opacity-50 ${
                type === 'expense'
                  ? 'bg-gradient-to-r from-red-400 to-red-500 shadow-red-200 hover:from-red-500 hover:to-red-600'
                  : 'bg-gradient-to-r from-green-400 to-green-500 shadow-green-200 hover:from-green-500 hover:to-green-600'
              }`}
            >
              {submitting ? '保存中...' : isEdit ? '保存修改' : `记一笔 · ¥${amount || '0'}`}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  )
}
