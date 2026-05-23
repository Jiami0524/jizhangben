# 记账本 — 项目文件结构

```
src/
├── main.jsx                              # React 入口
├── App.jsx                               # 根组件：认证守卫 + 布局 + 页面路由
├── index.css                             # Tailwind + 毛玻璃全局样式
├── lib/
│   └── supabaseClient.js                 # Supabase 客户端
├── contexts/
│   ├── AuthContext.jsx                    # 认证状态：登录/注册/登出
│   └── AppContext.jsx                    # 数据状态：账单 CRUD + 月份切换 + 统计计算
├── pages/
│   ├── AuthPage.jsx                      # 登录/注册页面
│   └── StatsPage.jsx                     # 统计页：趋势图 + 排行
└── components/
    ├── Layout.jsx                        # 整体布局：侧边栏 + 主区域 + FAB
    ├── SummaryCards.jsx                   # 首页三张汇总卡片
    ├── CategoryPieChart.jsx              # 支出分类饼图
    ├── RecentTransactions.jsx            # 最近账单列表
    ├── TransactionItem.jsx               # 单条账单行（编辑/删除）
    ├── AddTransactionDrawer.jsx          # 记账抽屉面板
    ├── MonthlyTrendChart.jsx             # 月度趋势柱状图
    ├── CategoryRanking.jsx               # 分类排行（进度条）
    └── Toast.jsx                         # Toast 通知

根目录文件：
├── index.html                            # Vite 入口 HTML
├── package.json                          # 依赖和脚本
├── vite.config.js                        # Vite 配置
├── tailwind.config.js                    # Tailwind 配置
├── postcss.config.js                     # PostCSS 配置
└── supabase/
    └── schema.sql                        # 数据库建表 + RLS + 触发器

外部服务：
├── Supabase                              # 认证 + PostgreSQL 数据库
└── GitHub Pages                          # 静态部署
```
