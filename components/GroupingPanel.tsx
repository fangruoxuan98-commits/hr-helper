
import React, { useState } from 'react';
import { LayoutGrid, Shuffle, Users, Download, HelpCircle, FileSpreadsheet } from 'lucide-react';
import { Participant, Group } from '../types';

interface GroupingPanelProps {
  participants: Participant[];
}

export const GroupingPanel: React.FC<GroupingPanelProps> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGrouping, setIsGrouping] = useState(false);

  const performGrouping = () => {
    if (participants.length === 0) {
      alert('请先导入名单');
      return;
    }

    setIsGrouping(true);
    
    // Shuffle logic (Fisher-Yates)
    const shuffled = [...participants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const newGroups: Group[] = [];
    const numGroups = Math.ceil(shuffled.length / groupSize);

    for (let i = 0; i < numGroups; i++) {
      const members = shuffled.slice(i * groupSize, (i + 1) * groupSize);
      newGroups.push({
        id: `group-${i}`,
        name: `第 ${i + 1} 组`,
        members
      });
    }

    // Add a slight delay for "feeling" of processing
    setTimeout(() => {
      setGroups(newGroups);
      setIsGrouping(false);
    }, 600);
  };

  const exportGroupsToCSV = () => {
    if (groups.length === 0) return;

    // Header
    let csvContent = "组名,成员姓名\n";
    
    // Rows
    groups.forEach(group => {
      group.members.forEach(member => {
        // Escape quotes and wrap in quotes for safety
        const memberName = `"${member.name.replace(/"/g, '""')}"`;
        const groupName = `"${group.name.replace(/"/g, '""')}"`;
        csvContent += `${groupName},${memberName}\n`;
      });
    });

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HR_Pro_分组结果_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-6">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 block">每组人数</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="2"
                max="20"
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value))}
                className="w-48 accent-indigo-600"
              />
              <span className="w-8 text-center font-bold text-indigo-600">{groupSize}</span>
            </div>
          </div>
          
          <div className="flex flex-col text-sm text-slate-500">
            <span>总人数: {participants.length}</span>
            <span>预计组数: {Math.ceil(participants.length / groupSize)}</span>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={performGrouping}
            disabled={isGrouping || participants.length === 0}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
          >
            {isGrouping ? (
              <Shuffle className="animate-spin" size={20} />
            ) : (
              <LayoutGrid size={20} />
            )}
            {isGrouping ? '正在分组...' : '立即分组'}
          </button>

          {groups.length > 0 && (
            <button
              onClick={exportGroupsToCSV}
              className="flex items-center gap-2 px-4 py-3 border border-indigo-200 bg-indigo-50 rounded-xl hover:bg-indigo-100 text-indigo-700 transition-colors font-semibold shadow-sm"
              title="导出为 CSV"
            >
              <FileSpreadsheet size={20} />
              <span className="hidden sm:inline">导出 CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Group Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {groups.length === 0 ? (
          <div className="col-span-full h-96 flex flex-col items-center justify-center text-slate-400 space-y-4">
            <div className="p-8 bg-white rounded-full shadow-inner border border-slate-100">
              <Users size={64} className="opacity-20" />
            </div>
            <p className="text-lg">配置分组人数并点击“立即分组”</p>
          </div>
        ) : (
          groups.map((group) => (
            <div 
              key={group.id} 
              className={`bg-white rounded-2xl border-t-4 border-indigo-500 shadow-sm hover:shadow-md transition-all overflow-hidden animate-in zoom-in-95 duration-300`}
            >
              <div className="p-4 bg-indigo-50/50 flex items-center justify-between border-b border-indigo-100">
                <h4 className="font-bold text-indigo-900">{group.name}</h4>
                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-semibold">
                  {group.members.length} 人
                </span>
              </div>
              <div className="p-4 space-y-2">
                {group.members.map((member, mIdx) => (
                  <div 
                    key={member.id} 
                    className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-transparent hover:border-slate-200 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-[10px] flex items-center justify-center font-bold text-slate-500">
                      {mIdx + 1}
                    </div>
                    <span className="text-slate-700 font-medium">{member.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
