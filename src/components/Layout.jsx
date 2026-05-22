import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { HiOutlineHome, HiOutlineChartBar, HiOutlineLogout, HiOutlinePlus } from 'react-icons/hi'

const navItems = [
  { key: 'dashboard', label: '首页', icon: HiOutlineHome },
  { key: 'stats', label: '统计', icon: HiOutlineChartBar },
]

export default function Layout({ activePage, onNavigate, onAddClick, children }) {
  const { signOut, session } = useAuth()

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 侧边栏 */}
      <aside className="w-64 flex-shrink-0 p-6 flex flex-col">
        <div className="glass-card p-6 flex-1 flex flex-col">
          {/* Logo */}
          <div className="mb-10">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
              记账本
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">{session.user.email}</p>
          </div>

          {/* 导航 */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activePage === item.key
              return (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* 退出 */}
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <HiOutlineLogout className="w-5 h-5" />
            退出登录
          </button>
        </div>
      </aside>

      {/* 主区域 */}
      <main className="flex-1 p-6 pl-0">
        <div className="glass-card p-8 min-h-[calc(100vh-3rem)] relative">
          {children}
        </div>
      </main>

      {/* FAB 添加按钮 */}
      <button
        onClick={onAddClick}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-2xl shadow-lg shadow-indigo-300 hover:shadow-xl hover:shadow-indigo-400 hover:scale-105 transition-all flex items-center justify-center z-50"
      >
        <HiOutlinePlus className="w-7 h-7" />
      </button>
    </div>
  )
}
