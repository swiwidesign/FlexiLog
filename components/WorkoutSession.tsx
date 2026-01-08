
import React, { useState, useEffect, useRef } from 'react';
import { Exercise, SessionState, LoggingType, DayConfig, SetLog } from '../types';

interface WorkoutSessionProps {
  session: SessionState;
  exercises: Exercise[];
  schedule: Record<string, DayConfig>;
  setSession: React.Dispatch<React.SetStateAction<SessionState | null>>;
  onEndSession: () => void;
  onComplete: (session: SessionState) => void;
}

export default function WorkoutSession({ session, exercises, schedule, setSession, onEndSession, onComplete }: WorkoutSessionProps) {
  const [logInput, setLogInput] = useState<string>('');
  const [timerRunning, setTimerRunning] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const timerRef = useRef<number | null>(null);

  const steps = schedule[session.dayId]?.steps || [];
  const currentExId = steps[session.stepIndex];
  const currentExercise = exercises.find(e => e.id === currentExId);

  // Calculate current set number by counting occurrences of this ID in previous steps
  const currentSetNumber = steps.slice(0, session.stepIndex + 1).filter(id => id === currentExId).length;
  // Calculate total occurrences of this exercise in the daily sequence
  const totalSetsOfThisExercise = steps.filter(id => id === currentExId).length;

  // For visual set tracking: identify which indices in 'steps' belong to this exercise
  const exerciseSetIndices = steps.reduce((acc, id, idx) => {
    if (id === currentExId) acc.push(idx);
    return acc;
  }, [] as number[]);

  // Handle Rest Timer
  useEffect(() => {
    let interval: number;
    if (session.isResting && session.restTimeLeft > 0) {
      interval = window.setInterval(() => {
        setSession(prev => {
          if (!prev) return null;
          if (prev.restTimeLeft <= 1) return { ...prev, isResting: false, restTimeLeft: 0 };
          return { ...prev, restTimeLeft: prev.restTimeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [session.isResting, session.restTimeLeft, setSession]);

  // Handle Stopwatch
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = window.setInterval(() => setStopwatchTime(prev => prev + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerRunning]);

  if (!currentExercise) return <div className="p-20 text-center font-black text-slate-400">No exercises found in routine.</div>;

  const handleLogSet = () => {
    const value = parseInt(logInput) || (currentExercise.loggingType === LoggingType.TIME ? stopwatchTime : 0);
    
    const newLogEntry: SetLog = {
      exerciseId: currentExercise.id,
      exerciseName: currentExercise.name,
      setNumber: currentSetNumber,
      value,
      type: currentExercise.loggingType,
      timestamp: Date.now()
    };

    setSession(prev => {
      if (!prev) return null;
      const newCompleted = [...prev.completedSets, newLogEntry];
      const nextStepIndex = prev.stepIndex + 1;
      const isFinished = nextStepIndex >= steps.length;

      const updatedState = {
        ...prev,
        stepIndex: nextStepIndex,
        completedSets: newCompleted,
        isResting: currentExercise.rest > 0 && !isFinished,
        restTimeLeft: currentExercise.rest
      };

      if (isFinished) {
        onComplete(updatedState);
        return null;
      }
      return updatedState;
    });

    setLogInput('');
    setStopwatchTime(0);
    setTimerRunning(false);
  };

  const progress = (session.stepIndex / steps.length) * 100;
  
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 mb-20">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="h-4 bg-slate-100 w-full relative">
          <div className="h-full bg-blue-600 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
        </div>

        <div className="p-8 md:p-12">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Step {session.stepIndex + 1} / {steps.length}
                </span>
                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{currentExercise.category}</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 leading-tight">{currentExercise.name}</h2>
              
              {/* Visual Set Tracker Pills */}
              <div className="flex gap-1.5 pt-1">
                {exerciseSetIndices.map((idx, i) => {
                  const isCompleted = idx < session.stepIndex;
                  const isCurrent = idx === session.stepIndex;
                  return (
                    <div 
                      key={idx}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isCompleted ? 'w-8 bg-blue-600' : 
                        isCurrent ? 'w-12 bg-blue-400 ring-4 ring-blue-50' : 
                        'w-8 bg-slate-100'
                      }`}
                      title={`Set ${i + 1}`}
                    />
                  );
                })}
              </div>
            </div>
            <button onClick={onEndSession} className="text-slate-300 hover:text-red-500 transition-all p-4 bg-slate-50 hover:bg-red-50 rounded-full">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="bg-slate-50/80 p-6 rounded-[2rem] border border-slate-100">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Target</p>
              <p className="text-3xl font-black text-slate-800 tabular-nums">
                {currentExercise.repsOrTime} 
                <span className="text-sm font-bold text-slate-400 ml-1">{currentExercise.loggingType === LoggingType.TIME ? 'sec' : 'reps'}</span>
              </p>
            </div>
            <div className="bg-slate-50/80 p-6 rounded-[2rem] border border-slate-100 flex flex-col justify-center">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Set Progress</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-blue-600 tabular-nums">{currentSetNumber}</span>
                <span className="text-sm font-bold text-slate-400 uppercase">of {totalSetsOfThisExercise}</span>
              </div>
            </div>
          </div>

          {currentExercise.cues.length > 0 && !session.isResting && (
            <div className="mb-10 bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100/50">
              <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Focus Points
              </h4>
              <ul className="space-y-3">
                {currentExercise.cues.map((cue, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-4 font-bold items-start leading-relaxed">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0" />
                    {cue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-6">
            {session.isResting ? (
              <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] text-center space-y-6 shadow-2xl animate-in zoom-in-95 ring-8 ring-slate-900/10">
                <div className="flex flex-col items-center">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2">Rest Period</p>
                   <p className="text-sm font-bold text-slate-400 mb-6">Up Next: {currentExercise.name} (Set {currentSetNumber} of {totalSetsOfThisExercise})</p>
                   <div className="text-8xl font-black tabular-nums tracking-tighter leading-none mb-8">
                    {Math.floor(session.restTimeLeft / 60)}:{(session.restTimeLeft % 60).toString().padStart(2, '0')}
                  </div>
                  <button 
                    onClick={() => setSession(prev => prev ? ({ ...prev, isResting: false, restTimeLeft: 0 }) : null)}
                    className="bg-white text-slate-900 px-12 py-4 rounded-[1.5rem] text-sm font-black hover:bg-blue-50 transition-all active:scale-95 shadow-lg"
                  >
                    Skip Rest
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {currentExercise.loggingType === LoggingType.TIME && (
                  <div className="flex flex-col items-center gap-6 py-12 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <div className="text-7xl font-black text-slate-900 tabular-nums tracking-tighter">
                      {Math.floor(stopwatchTime / 60)}:{(stopwatchTime % 60).toString().padStart(2, '0')}
                    </div>
                    <button 
                      onClick={() => setTimerRunning(!timerRunning)}
                      className={`px-16 py-5 rounded-[1.5rem] font-black shadow-2xl transition-all active:scale-95 transform ${timerRunning ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}
                    >
                      {timerRunning ? 'Stop Timer' : 'Start Timer'}
                    </button>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={logInput}
                      onChange={(e) => setLogInput(e.target.value)}
                      placeholder={currentExercise.loggingType === LoggingType.TIME ? "Actual time..." : "Repetitions..."}
                      className="w-full px-8 py-6 rounded-[2rem] border-2 border-slate-100 focus:border-blue-500 focus:ring-0 text-3xl font-black outline-none shadow-sm transition-all placeholder:text-slate-200"
                    />
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 font-black text-sm uppercase">
                      {currentExercise.loggingType === LoggingType.TIME ? 'SEC' : 'REPS'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogSet}
                    className="bg-blue-600 text-white px-10 py-6 rounded-[2rem] font-black shadow-2xl hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-4 group"
                  >
                    <span>Log Set</span>
                    <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24"><path d="m20 6-11 11-5-5"/></svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
