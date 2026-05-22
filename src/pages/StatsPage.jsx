import MonthlyTrendChart from '../components/MonthlyTrendChart'
import CategoryRanking from '../components/CategoryRanking'

export default function StatsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">统计分析</h2>

      <div className="glass-card p-6 mb-6">
        <MonthlyTrendChart />
      </div>

      <div className="glass-card p-6">
        <CategoryRanking />
      </div>
    </div>
  )
}
