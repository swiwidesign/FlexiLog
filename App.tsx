
import React, { useState, useEffect } from 'react';
import { DAYS, INITIAL_EXERCISES, INITIAL_SCHEDULE, INITIAL_CATEGORIES } from './constants';
import { Exercise, SessionState, DayConfig, WorkoutLog } from './types';
import Dashboard from './components/Dashboard';
import ExerciseLibrary from './components/ExerciseLibrary';
import WorkoutSession from './components/WorkoutSession';
import DayEditor from './components/DayEditor';
import LogsView from './components/LogsView';

type View = 'DASHBOARD' | 'LIBRARY' | 'EDITOR' | 'SESSION' | 'LOGS' | 'SETTINGS';

export default function App() {
  const [view, setView] = useState<View>('DASHBOARD');
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem('flexilog_exercises');
    return saved ? JSON.parse(saved) : INITIAL_EXERCISES;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('flexilog_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [schedule, setSchedule] = useState<Record<string, DayConfig>>(() => {
    const saved = localStorage.getItem('flexilog_schedule_v2');
    if (saved) return JSON.parse(saved);
    
    const initial: Record<string, DayConfig> = {};
    Object.entries(INITIAL_SCHEDULE).forEach(([day, ids]) => {
      const steps: string[] = [];
      ids.forEach(id => {
        const ex = INITIAL_EXERCISES.find(e => e.id === id);
        if (ex) {
          for (let i = 0; i < ex.sets; i++) steps.push(id);
        }
      });
      initial[day] = { steps };
    });
    return initial;
  });

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>(() => {
    const saved = localStorage.getItem('flexilog_workout_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<SessionState | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    localStorage.setItem('flexilog_exercises', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem('flexilog_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('flexilog_schedule_v2', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('flexilog_workout_logs', JSON.stringify(workoutLogs));
  }, [workoutLogs]);

  const startSession = (dayId: string) => {
    setActiveSession({
      isActive: true,
      dayId,
      stepIndex: 0,
      isResting: false,
      restTimeLeft: 0,
      completedSets: []
    });
    setView('SESSION');
  };

  const updateSchedule = (dayId: string, config: DayConfig) => {
    setSchedule(prev => ({ ...prev, [dayId]: config }));
  };

  const completeWorkout = (session: SessionState) => {
    const newLog: WorkoutLog = {
      id: Math.random().toString(36).substr(2, 9),
      dayId: session.dayId,
      date: new Date().toISOString(),
      sets: session.completedSets
    };
    setWorkoutLogs(prev => [newLog, ...prev]);
    setActiveSession(null);
    setView('LOGS');
  };

  const addCategory = () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
      setCategories([...categories, newCategoryName.trim()]);
      setNewCategoryName('');
    }
  };

  const removeCategory = (cat: string) => {
    if (window.confirm(`Delete category "${cat}"? This will not remove exercises but they will lose this classification.`)) {
      setCategories(categories.filter(c => c !== cat));
    }
  };

  const renderView = () => {
    switch (view) {
      case 'DASHBOARD':
        return <div className="max-w-5xl mx-auto px-4 py-8"><Dashboard schedule={schedule} exercises={exercises} onStartSession={startSession} /></div>;
      case 'SETTINGS':
        return (
          <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 pb-20 animate-in fade-in duration-300">
             <div className="flex items-center justify-between border-b pb-6">
               <h2 className="text-3xl font-black text-slate-900">Settings</h2>
               <button onClick={() => setView('DASHBOARD')} className="bg-slate-100 text-slate-600 px-6 py-2 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all">Close</button>
             </div>

             <section>
                <h3 className="text-xl font-black mb-6 text-slate-800 flex items-center gap-3">
                  <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                  Weekly Planner
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {DAYS.map(day => (
                    <button 
                      key={day}
                      onClick={() => { setEditingDay(day); setView('EDITOR'); }}
                      className="p-6 bg-white border border-slate-200 rounded-[2rem] hover:border-blue-500 hover:bg-blue-50 transition-all text-left group shadow-sm"
                    >
                      <span className="font-black text-slate-800 block mb-1 text-lg">{day}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        {schedule[day]?.steps.length || 0} Sets Planned
                      </span>
                    </button>
                  ))}
                </div>
             </section>

             <section>
                <h3 className="text-xl font-black mb-6 text-slate-800 flex items-center gap-3">
                  <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
                  Manage Categories
                </h3>
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                  <div className="flex gap-4 mb-8">
                    <input 
                      type="text" 
                      placeholder="New category name..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                      className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                    <button 
                      onClick={addCategory}
                      className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
                    >
                      Add Category
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {categories.map(cat => (
                      <div key={cat} className="group flex items-center gap-3 bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl hover:border-red-200 hover:bg-red-50 transition-all">
                        <span className="font-black text-slate-700 text-sm group-hover:text-red-700">{cat}</span>
                        <button onClick={() => removeCategory(cat)} className="text-slate-300 hover:text-red-600">
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
             </section>

             <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                    <span className="w-2 h-8 bg-emerald-600 rounded-full"></span>
                    Exercise Library
                  </h3>
                  <button onClick={() => setView('LIBRARY')} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-slate-800 shadow-xl transition-all">
                    Open Library
                  </button>
                </div>
             </section>
          </div>
        );
      case 'LIBRARY':
        return <div className="max-w-5xl mx-auto px-4 py-8"><ExerciseLibrary exercises={exercises} categories={categories} setExercises={setExercises} onBack={() => setView('SETTINGS')} /></div>;
      case 'EDITOR':
        return editingDay ? (
          <div className="max-w-full px-4 py-4 h-full">
            <DayEditor 
              dayId={editingDay} 
              config={schedule[editingDay]} 
              exercises={exercises} 
              categories={categories}
              setExercises={setExercises}
              onSave={updateSchedule} 
              onBack={() => setView('SETTINGS')} 
            />
          </div>
        ) : null;
      case 'SESSION':
        return activeSession ? <div className="max-w-5xl mx-auto px-4 py-8"><WorkoutSession session={activeSession} exercises={exercises} schedule={schedule} setSession={setActiveSession} onEndSession={() => { setActiveSession(null); setView('DASHBOARD'); }} onComplete={completeWorkout} /></div> : null;
      case 'LOGS':
        return <div className="max-w-5xl mx-auto px-4 py-8"><LogsView logs={workoutLogs} onBack={() => setView('DASHBOARD')} /></div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shrink-0 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('DASHBOARD')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">FlexiLog</h1>
          </div>
          <nav className="flex gap-2 sm:gap-4">
            <button onClick={() => setView('DASHBOARD')} className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${view === 'DASHBOARD' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
              Dashboard
            </button>
            <button onClick={() => setView('LOGS')} className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${view === 'LOGS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
              Logs
            </button>
            <button onClick={() => setView('SETTINGS')} className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${view === 'SETTINGS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
              Settings
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1 min-h-0 overflow-y-auto">{renderView()}</main>
    </div>
  );
}
