
import React, { useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { DataPanel } from './components/DataPanel';
import { LuckyDrawPanel } from './components/LuckyDrawPanel';
import { GroupingPanel } from './components/GroupingPanel';
import { Participant, View } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<View>('data');
  const [participants, setParticipants] = useState<Participant[]>([]);
  // Lift winners state to persist across view changes
  const [winners, setWinners] = useState<Participant[]>([]);

  const handleUpdateParticipants = useCallback((names: string[]) => {
    // Generate IDs based on name and index to be relatively stable within a session
    const newList = names
      .filter(name => name.trim().length > 0)
      .map((name, index) => ({
        id: `p-${name.trim()}-${index}`,
        name: name.trim()
      }));
    setParticipants(newList);
  }, []);

  const handleSetWinners = useCallback((newWinners: Participant[] | ((prev: Participant[]) => Participant[])) => {
    setWinners(newWinners);
  }, []);

  return (
    <Layout currentView={view} setView={setView} participantCount={participants.length}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {view === 'data' && (
          <DataPanel 
            participants={participants} 
            onUpdate={handleUpdateParticipants} 
          />
        )}
        {view === 'lucky-draw' && (
          <LuckyDrawPanel 
            participants={participants}
            winners={winners}
            setWinners={handleSetWinners}
          />
        )}
        {view === 'grouping' && (
          <GroupingPanel 
            participants={participants} 
          />
        )}
      </div>
    </Layout>
  );
};

export default App;
