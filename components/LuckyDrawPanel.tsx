
import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RefreshCw, Settings2, Play, Pause, ListChecks, Gift, AlertTriangle, Users } from 'lucide-react';
import { Participant } from '../types';
import confetti from 'canvas-confetti';

interface LuckyDrawPanelProps {
  participants: Participant[];
  winners: Participant[];
  setWinners: (winners: Participant[] | ((prev: Participant[]) => Participant[])) => void;
}

export const LuckyDrawPanel: React.FC<LuckyDrawPanelProps> = ({ participants, winners, setWinners }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState<Participant | null>(null);
  const [allowDuplicate, setAllowDuplicate] = useState(false);
  const timerRef = useRef<any>(null);

  // Calculate available pool based on current winners and duplicate setting
  // Use both ID and name as secondary fallback for filtering
  const availableParticipants = allowDuplicate 
    ? participants 
    : participants.filter(p => !winners.some(w => w.id === p.id || w.name === p.name));

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#f43f5e', '#fbbf24']
      });
    } catch (e) {
      console.error('Confetti failed', e);
    }
  };

  const startDraw = () => {
    if (isSpinning) return;
    
    if (availableParticipants.length === 0) {
      alert(participants.length === 0 ? '请先在“名单管理”中导入名单' : '当前池内所有人已中奖，请重置或开启重复抽奖');
      return;
    }

    setIsSpinning(true);
    let count = 0;
    const maxCount = 30 + Math.floor(Math.random() * 20); // Variable duration
    
    const spin = () => {
      try {
        if (availableParticipants.length === 0) {
          setIsSpinning(false);
          return;
        }

        const randomIndex = Math.floor(Math.random() * availableParticipants.length);
        const candidate = availableParticipants[randomIndex];
        
        if (!candidate) {
           setIsSpinning(false);
           return;
        }

        setCurrentCandidate(candidate);
        
        count++;
        if (count < maxCount) {
          const progress = count / maxCount;
          // Decelerate the animation
          const delay = progress < 0.7 ? 50 : 50 + (progress - 0.7) * 500;
          timerRef.current = window.setTimeout(spin, delay);
        } else {
          // Final selection reached
          setWinners(prev => [candidate, ...prev]);
          setIsSpinning(false);
          triggerConfetti();
        }
      } catch (err) {
        console.error('Draw animation error:', err);
        setIsSpinning(false);
      }
    };

    spin();
  };

  const resetWinners = () => {
    if (confirm('确定要清除所有中奖记录吗？')) {
      setWinners([]);
      setCurrentCandidate(null);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Configuration */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Settings2 className="text-indigo-600" size={20} />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">重复抽奖:</span>
            <button
              onClick={() => setAllowDuplicate(!allowDuplicate)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                allowDuplicate ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                allowDuplicate ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block"></div>
          <p className="text-sm text-slate-500">
            {allowDuplicate ? '每人可多次中奖' : '排除已中奖名单'}
          </p>
        </div>
        <button 
          onClick={resetWinners}
          className="text-sm text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1 font-medium"
        >
          <RefreshCw size={16} />
          重置抽奖
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Slot Machine Area */}
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-3xl p-10 flex flex-col items-center justify-center min-h-[400px] shadow-2xl relative overflow-hidden">
          {/* Animated Background Decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,white_0%,transparent_70%)] animate-pulse"></div>
          </div>

          <Trophy className={`${isSpinning ? 'animate-bounce text-yellow-400' : 'text-rose-400'} mb-6 transition-colors`} size={64} />
          
          <div className="relative w-full text-center">
            <div className="h-32 flex items-center justify-center">
              {currentCandidate ? (
                <div className={`text-6xl md:text-8xl font-black text-white drop-shadow-lg transition-transform ${isSpinning ? 'scale-110' : 'scale-100'}`}>
                  {currentCandidate.name}
                </div>
              ) : (
                <div className="text-2xl text-indigo-300 font-medium">
                  {participants.length === 0 ? '请先导入名单' : '准备好了吗？'}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={startDraw}
            disabled={isSpinning || participants.length === 0}
            className={`mt-12 w-64 py-5 rounded-2xl text-xl font-bold transition-all shadow-xl flex items-center justify-center gap-3 ${
              isSpinning 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-80' 
                : participants.length === 0 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-rose-500 hover:bg-rose-600 text-white hover:scale-105 active:scale-95 shadow-rose-500/20'
            }`}
          >
            {isSpinning ? <Pause className="animate-pulse" /> : <Play fill="currentColor" />}
            {isSpinning ? '抽取中...' : '开始抽奖'}
          </button>

          <div className="mt-6 flex items-center gap-2 text-indigo-300 text-sm bg-indigo-950/30 px-4 py-2 rounded-full border border-indigo-700/50">
            <Users size={14} />
            <span>待抽奖人数: <strong className="text-white">{availableParticipants.length}</strong> / {participants.length}</span>
          </div>
        </div>

        {/* Winner History */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col p-6 overflow-hidden max-h-[500px] lg:max-h-none">
          <div className="flex items-center gap-2 mb-6">
            <ListChecks className="text-indigo-600" size={24} />
            <h3 className="text-xl font-bold text-slate-800">中奖名单</h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
            {winners.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 py-12">
                <Gift size={48} className="opacity-20 mb-4" />
                <p>等待好运降临...</p>
              </div>
            ) : (
              winners.map((winner, idx) => (
                <div 
                  key={`${winner.id}-${idx}`} 
                  className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl animate-in slide-in-from-right duration-300"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold">
                    {winners.length - idx}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{winner.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-medium">Winner</p>
                  </div>
                  <Trophy size={18} className="text-rose-400 flex-shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {participants.length > 0 && availableParticipants.length === 0 && !allowDuplicate && (
        <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm animate-pulse">
          <AlertTriangle size={18} className="text-amber-500" />
          <p>当前所有人都已中奖。如果您想继续抽奖，请开启“重复抽奖”或点击右上角“重置抽奖”。</p>
        </div>
      )}
    </div>
  );
};
