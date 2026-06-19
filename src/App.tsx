
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "@/components/common/NavBar";
import Overview from "@/pages/Overview";
import ModelDetail from "@/pages/ModelDetail";
import ModelEditor from "@/pages/ModelEditor";
import Dashboard from "@/pages/Dashboard";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/model/new" element={<ModelEditor />} />
            <Route path="/model/:id" element={<ModelDetail />} />
            <Route path="/model/:id/edit" element={<ModelEditor />} />
            <Route path="*" element={
              <div className="container mx-auto px-4 py-20 text-center">
                <div className="text-6xl mb-4">🤔</div>
                <h1 className="text-2xl font-display font-bold text-workspace-text mb-2">页面走丢了</h1>
                <p className="text-workspace-muted mb-6">找不到你要的页面，是不是输错地址了？</p>
                <a href="/" className="btn-primary inline-flex">返回首页</a>
              </div>
            } />
          </Routes>
        </main>
        <footer className="border-t border-workspace-border/50 py-6 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs text-workspace-muted font-mono">
              🔧 Gunpla 涂装进度册 · 数据存储于浏览器本地 IndexedDB · 纯前端无需服务端
            </p>
            <p className="text-[10px] text-workspace-muted/60 font-mono mt-2">
              Built with React + Vite + Zustand + IndexedDB
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
