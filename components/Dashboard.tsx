
import React from 'react';
import { DAYS } from '../constants';
import { Exercise, DayConfig } from '../types';

interface DashboardProps {
  schedule: Record<string, DayConfig>;
  exercises: Exercise[];
  onStartSession: (day: string) => void;
}

export default function Dashboard({ schedule, exercises, onStartSession }: DashboardProps) {
  // Correctly access 'steps' instead of 'exerciseIds' and unique-ify for display
  const getExercisesForDay = (day: string) => {
    const steps = schedule[day]?.steps || [];
    const uniqueIds = Array.from(new Set(steps));
    return uniqueIds.map(id => exercises.find(e => e.id === id)).filter(Boolean) as Exercise[];
  };

  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  const todayExercises = getExercisesForDay(today);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Today Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div>
              <p className="text-blue-100 font-bold uppercase tracking-widest text-sm mb-1">Today is {today}</p>
              <h2 className="text-4xl md:text-5xl font-black">Time to Move</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {todayExercises.length > 0 ? (
                 todayExercises.slice(0, 3).map((ex, i) => (
                   <span key={i} className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium">
                     {ex.name}
                   </span>
                 ))
              ) : (
                <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium">Rest Day</span>
              )}
              {todayExercises.length > 3 && (
                <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium">+{todayExercises.length - 3} more</span>
              )}
            </div>
          </div>
          <button
            disabled={todayExercises.length === 0}
            onClick={() => onStartSession(today)}
            className={`group px-10 py-5 rounded-3xl text-xl font-black transition-all flex items-center gap-4 shadow-xl active:scale-95 ${
              todayExercises.length === 0
                ? 'bg-white/20 text-white/50 cursor-not-allowed'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            {todayExercises.length === 0 ? 'Rest Day' : 'Start Session'}
            <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
          </button>
        </div>
        
        {/* Decorative background shape */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Week Preview */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-extrabold text-slate-800">Weekly Overview</h3>
          <div className="h-1 flex-1 mx-6 bg-slate-100 rounded-full hidden md:block" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DAYS.map((day) => {
            const dayExercises = getExercisesForDay(day);
            const isToday = day === today;
            if (isToday) return null; // Already shown big

            return (
              <div
                key={day}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group"
              >
                <h4 className="font-bold text-slate-900 mb-3 flex items-center justify-between">
                  {day}
                  {dayExercises.length > 0 && <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">{dayExercises.length}</span>}
                </h4>
                <div className="space-y-2 mb-4">
                  {dayExercises.length > 0 ? (
                    dayExercises.slice(0, 3).map((ex, i) => (
                      <p key={i} className="text-sm text-slate-500 truncate">• {ex.name}</p>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 italic">Rest</p>
                  )}
                  {dayExercises.length > 3 && <p className="text-xs text-slate-400">+{dayExercises.length - 3} more...</p>}
                </div>
                <button
                  onClick={() => onStartSession(day)}
                  disabled={dayExercises.length === 0}
                  className="w-full py-2 text-sm font-bold text-slate-600 bg-slate-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Start
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
