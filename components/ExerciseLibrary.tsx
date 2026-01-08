
import React, { useState } from 'react';
import { Exercise, LoggingType } from '../types';

interface ExerciseLibraryProps {
  exercises: Exercise[];
  categories: string[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
  onBack: () => void;
}

export default function ExerciseLibrary({ exercises, categories, setExercises, onBack }: ExerciseLibraryProps) {
  const [editingEx, setEditingEx] = useState<Partial<Exercise> | null>(null);

  const saveExercise = () => {
    if (!editingEx?.name) return;
    
    if (editingEx.id) {
      setExercises(prev => prev.map(e => e.id === editingEx.id ? (editingEx as Exercise) : e));
    } else {
      const newEx: Exercise = {
        ...(editingEx as Omit<Exercise, 'id'>),
        id: Math.random().toString(36).substr(2, 9),
        cues: editingEx.cues || [],
        hints: editingEx.hints || []
      };
      setExercises(prev => [...prev, newEx]);
    }
    setEditingEx(null);
  };

  const deleteExercise = (id: string) => {
    if (window.confirm('Delete this exercise from the library?')) {
      setExercises(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-slate-400 hover:text-slate-600 transition-colors p-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h2 className="text-3xl font-black text-slate-900">Exercise Pool</h2>
        </div>
        <button
          onClick={() => setEditingEx({ name: '', sets: 3, repsOrTime: '8-12', rest: 90, loggingType: LoggingType.REPS, cues: [], hints: [], category: categories[0] || 'Strength' })}
          className="bg-blue-600 text-white px-8 py-4 rounded-3xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Create Exercise
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((ex) => (
          <div key={ex.id} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                {ex.category}
              </span>
              <div className="flex gap-2">
                <button onClick={() => setEditingEx(ex)} className="p-2 text-slate-300 hover:text-blue-500 bg-slate-50 rounded-xl transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                </button>
                <button onClick={() => deleteExercise(ex.id)} className="p-2 text-slate-300 hover:text-red-500 bg-slate-50 rounded-xl transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
            <h3 className="font-black text-slate-900 text-xl mb-2 leading-tight">{ex.name}</h3>
            <div className="flex gap-4 text-sm font-bold text-slate-400">
               <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                  {ex.sets} Sets
               </span>
               <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                  {ex.repsOrTime} {ex.loggingType === LoggingType.TIME ? 'Sec' : 'Reps'}
               </span>
            </div>
            
            {/* Visual background hint */}
            <div className="absolute bottom-0 right-0 p-4 opacity-[0.03] scale-150 pointer-events-none">
               <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24"><path d="M21 7L9 19L3.5 13.5L4.91 12.09L9 16.17L19.59 5.59L21 7Z"/></svg>
            </div>
          </div>
        ))}
      </div>

      {editingEx && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 border border-white/20">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div>
                <h3 className="text-2xl font-black text-slate-900">{editingEx.id ? 'Edit Exercise' : 'New Exercise'}</h3>
                <p className="text-sm font-bold text-slate-400">Configure global properties</p>
              </div>
              <button onClick={() => setEditingEx(null)} className="text-slate-300 hover:text-slate-600 p-2 bg-white border rounded-full shadow-sm transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Exercise Name</label>
                <input
                  value={editingEx.name}
                  onChange={e => setEditingEx({ ...editingEx, name: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 font-bold transition-all"
                  placeholder="e.g. Pull-ups"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sets</label>
                  <input
                    type="number"
                    value={editingEx.sets}
                    onChange={e => setEditingEx({ ...editingEx, sets: parseInt(e.target.value) })}
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 font-bold transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Target Reps/Time</label>
                  <input
                    value={editingEx.repsOrTime}
                    onChange={e => setEditingEx({ ...editingEx, repsOrTime: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 font-bold transition-all"
                    placeholder="e.g. 10-12"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Rest (Seconds)</label>
                  <input
                    type="number"
                    value={editingEx.rest}
                    onChange={e => setEditingEx({ ...editingEx, rest: parseInt(e.target.value) })}
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 font-bold transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                  <select
                    value={editingEx.category}
                    onChange={e => setEditingEx({ ...editingEx, category: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 font-bold transition-all appearance-none cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Logging Modality</label>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2">
                  <button 
                    onClick={() => setEditingEx({ ...editingEx, loggingType: LoggingType.REPS })}
                    className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${editingEx.loggingType === LoggingType.REPS ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Repetitions
                  </button>
                  <button 
                    onClick={() => setEditingEx({ ...editingEx, loggingType: LoggingType.TIME })}
                    className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${editingEx.loggingType === LoggingType.TIME ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                  >
                    Time (Sec)
                  </button>
                </div>
              </div>
            </div>
            <div className="p-8 bg-slate-50 flex gap-4 border-t border-slate-100">
              <button onClick={() => setEditingEx(null)} className="flex-1 py-4 rounded-[1.5rem] font-black text-slate-500 border border-slate-200 bg-white hover:bg-slate-100 transition-all">Cancel</button>
              <button onClick={saveExercise} className="flex-1 py-4 rounded-[1.5rem] font-black text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all">Save Global</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
}
