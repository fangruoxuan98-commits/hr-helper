
import React, { useState, useMemo } from 'react';
import { Upload, ClipboardList, Trash2, UserPlus, FileJson, Users, Sparkles, AlertCircle, UserCheck } from 'lucide-react';
import { Participant } from '../types';

interface DataPanelProps {
  participants: Participant[];
  onUpdate: (names: string[]) => void;
}

export const DataPanel: React.FC<DataPanelProps> = ({ participants, onUpdate }) => {
  const [inputText, setInputText] = useState('');

  // 模拟数据
  const mockNames = [
    "张伟", "王芳", "李静", "刘洋", "张伟", "王秀英", "李强", "陈静", "张敏", "李军", 
    "王平", "李芳", "陈桂英", "张勇", "李明", "王艳", "李佳", "刘杰", "张华", "陈静"
  ];

  const handleLoadMock = () => {
    onUpdate(mockNames);
  };

  const handlePaste = () => {
    const names = inputText.split(/[,\n\t]/).filter(n => n.trim().length > 0);
    onUpdate(names);
    setInputText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const names = text.split(/[,\n\r]/).filter(n => n.trim().length > 0);
      onUpdate(names);
    };
    reader.readAsText(file);
  };

  const clearAll = () => {
    if (confirm('确定要清空名单吗？')) {
      onUpdate([]);
    }
  };

  const handleRemoveDuplicates = () => {
    const uniqueNames = Array.from(new Set(participants.map(p => p.name)));
    onUpdate(uniqueNames);
  };

  // 找出所有重复的姓名
  const duplicateNames = useMemo(() => {
    const nameCounts = new Map<string, number>();
    participants.forEach(p => {
      nameCounts.set(p.name, (nameCounts.get(p.name) || 0) + 1);
    });
    return new Set(
      Array.from(nameCounts.entries())
        .filter(([_, count]) => count > 1)
        .map(([name]) => name)
    );
  }, [participants]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Area */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <UserPlus className="text-indigo-600" size={24} />
              <h3 className="text-lg font-bold">导入名单</h3>
            </div>
            <button
              onClick={handleLoadMock}
              className="text-xs flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors font-medium border border-indigo-100"
            >
              <Sparkles size={14} />
              加载模拟名单
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">批量粘贴 (支持换行、逗号、Tab)</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="例如: 张三, 李四, 王五..."
                className="w-full h-40 p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
              <button
                onClick={handlePaste}
                disabled={!inputText.trim()}
                className="mt-3 w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                <ClipboardList size={20} />
                确认添加
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-2">上传 CSV / TXT 文件</label>
              <div className="relative group">
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center group-hover:border-indigo-500 transition-colors bg-slate-50/50">
                  <Upload className="mx-auto text-slate-400 group-hover:text-indigo-500 mb-2" size={32} />
                  <p className="text-sm text-slate-600">点击或拖拽文件到此处</p>
                  <p className="text-xs text-slate-400 mt-1">支持 .csv 和 .txt</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* List View */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col max-h-[600px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileJson className="text-rose-600" size={24} />
              <h3 className="text-lg font-bold">已加载名单 ({participants.length})</h3>
            </div>
            <div className="flex gap-3">
              {duplicateNames.size > 0 && (
                <button 
                  onClick={handleRemoveDuplicates}
                  className="text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1 text-sm font-semibold"
                >
                  <UserCheck size={16} />
                  一键去重
                </button>
              )}
              {participants.length > 0 && (
                <button 
                  onClick={clearAll}
                  className="text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <Trash2 size={16} />
                  清空
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2">
            {participants.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 opacity-60">
                <Users size={48} />
                <p>暂无名单数据，请先导入</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {participants.map((p, idx) => {
                  const isDuplicate = duplicateNames.has(p.name);
                  return (
                    <div 
                      key={p.id} 
                      className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                        isDuplicate 
                          ? 'bg-amber-50 border-amber-200 ring-1 ring-amber-100' 
                          : 'bg-slate-50 border-slate-200 hover:border-indigo-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-400">{idx + 1}</span>
                        <span className={`font-medium ${isDuplicate ? 'text-amber-900' : 'text-slate-700'}`}>
                          {p.name}
                        </span>
                      </div>
                      {isDuplicate && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 uppercase tracking-tighter bg-white px-2 py-0.5 rounded border border-amber-200">
                          <AlertCircle size={10} />
                          重复
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
