
import React from 'react';
import { Users, Gift, LayoutGrid, Database } from 'lucide-react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setView: (view: View) => void;
  participantCount: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, participantCount }) => {
  const navItems = [
    { id: 'data', icon: Database, label: '名单管理' },
    { id: 'lucky-draw', icon: Gift, label: '抽奖活动' },
    { id: 'grouping', icon: LayoutGrid, label: '自动分组' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-indigo-900 text-white flex flex-col shadow-xl">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="text-rose-400" />
            <span>HR Pro</span>
          </h1>
          <p className="text-indigo-300 text-sm mt-1">智能人事工具箱</p>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as View)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-white/10 text-white ring-1 ring-white/20 shadow-inner' 
                    : 'text-indigo-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-6 bg-indigo-950/50 mt-auto border-t border-indigo-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-indigo-400">当前人数:</span>
            <span className="font-bold text-rose-400 text-lg">{participantCount}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50">
        <header className="bg-white border-b h-16 flex items-center px-8 hidden md:flex">
          <h2 className="text-lg font-semibold text-slate-800">
            {navItems.find(i => i.id === currentView)?.label}
          </h2>
        </header>
        {children}
      </main>
    </div>
  );
};
