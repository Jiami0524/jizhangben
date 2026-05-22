import { useApp } from '../contexts/AppContext'
import { HiOutlineArrowUp, HiOutlineArrowDown, HiOutlineCash } from 'react-icons/hi'

const cards = [
  {
    key: 'income',
    label: '本月收入',
    getValue: (ctx) => ctx.totalIncome,
    icon: HiOutlineArrowUp,
    color: 'green',
  },
  {
    key: 'expense',
    label: '本月支出',
    getValue: (ctx) => ctx.totalExpense,
    icon: HiOutlineArrowDown,
    color: 'red',
  },
  {
    key: 'balance',
    label: '本月结余',
    getValue: (ctx) => ctx.balance,
    icon: HiOutlineCash,
    color: 'blue',
  },
]

const colorMap = {
  green: 'from-emerald-50 to-green-50 border-emerald-100 text-emerald-600',
  red: 'from-rose-50 to-red-50 border-red-100 text-red-600',
  blue: 'from-indigo-50 to-blue-50 border-indigo-100 text-indigo-600',
}

const iconBgMap = {
  green: 'bg-emerald-100/60',
  red: 'bg-red-100/60',
  blue: 'bg-indigo-100/60',
}

export default function SummaryCards() {
  const app = useApp()

  return (
    <div className="grid grid-cols-3 gap-5">
      {cards.map(({ key, label, getValue, icon: Icon, color }) => (
        <div
          key={key}
          className={`glass-card-hover p-5 bg-gradient-to-br ${colorMap[color]}`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">{label}</span>
            <div className={`w-9 h-9 rounded-xl ${iconBgMap[color]} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${colorMap[color].split(' ')[3]}`} />
            </div>
          </div>
          <p className={`text-2xl font-bold tracking-tight ${colorMap[color].split(' ')[3]}`}>
            ¥{getValue(app).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
          </p>
        </div>
      ))}
    </div>
  )
}
