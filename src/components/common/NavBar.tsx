
import { Box, BarChart3, Plus, LayoutGrid } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { importSampleData } from '@/utils/sampleData'
import { useModelStore } from '@/stores/modelStore'
import { useStatsStore } from '@/stores/statsStore'

export default function NavBar() {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const fetchAll = useModelStore(s => s.fetchAll)
  const refreshStats = useStatsStore(s => s.refresh)

  const handleImportSample = async () => {
    if (confirm('确定导入示例数据？这将覆盖现有数据。')) {
      await importSampleData()
      await Promise.all([fetchAll(), refreshStats()])
      setShowMenu(false)
    }
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-mecha-blue/20 text-mecha-blue border border-mecha-blue/30'
        : 'text-workspace-textDim hover:text-workspace-text hover:bg-workspace-card border border-transparent'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-workspace-border bg-workspace-surface/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-md bg-gradient-to-br from-mecha-blue to-mecha-orange flex items-center justify-center shadow-glow-blue group-hover:animate-pulse-slow">
                <Box size={20} className="text-white" />
              </div>
              <div className="absolute -inset-0.5 rounded-md bg-gradient-to-br from-mecha-blue/30 to-mecha-orange/30 -z-10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="font-display font-bold text-lg leading-none bg-gradient-to-r from-mecha-blue via-mecha-orange to-mecha-blue bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">
                涂装进度册
              </div>
              <div className="text-[10px] font-mono text-workspace-muted mt-0.5">GUNPLA WORKBENCH</div>
            </div>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              <LayoutGrid size={16} />
              模型总览
            </NavLink>
            <NavLink to="/dashboard" className={navLinkClass}>
              <BarChart3 size={16} />
              统计仪表盘
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/model/new')} className="btn-orange">
            <Plus size={16} />
            <span className="hidden sm:inline">新建模型</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="btn-secondary !px-3"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 card p-2 z-20 shadow-card-hover">
                  <button
                    onClick={handleImportSample}
                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-workspace-border transition-colors flex items-center gap-2"
                  >
                    📦 导入示例数据
                  </button>
                  <div className="divider my-2" />
                  <a
                    href="https://www.bilibili.com"
                    target="_blank"
                    rel="noreferrer"
                    className="block px-3 py-2 rounded-md text-sm text-workspace-muted hover:text-workspace-text hover:bg-workspace-border transition-colors"
                  >
                    💡 涂装技巧参考
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
