
import React, { useState } from 'react';
import { Exercise, DayConfig, LoggingType } from '../types';

interface DayEditorProps {
  dayId: string;
  config: DayConfig;
  exercises: Exercise[];
  categories: string[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
  onSave: (dayId: string, config: DayConfig) => void;
  onBack: () => void;
}

export default function DayEditor({ dayId, config, exercises, categories, setExercises, onSave, onBack }: DayEditorProps) {
  const [steps, setSteps] = useState<string[]>(config?.steps || []);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [editingEx, setEditingEx] = useState<Exercise | null>(null);

  // --- Timeline Actions ---
  const addStep = (id: string) => {
    setSteps(prev => [...prev, id]);
  };

  const removeStep = (index: number) => {
    setSteps(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(dayId, { steps });
    onBack();
  };

  // --- Drag and Drop Logic ---
  const handleDragStartFromLibrary = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('exerciseId', id);
    e.dataTransfer.effectAllowed = 'copy';
    (e.target as HTMLElement).style.opacity = '0.5';
  };

  const handleDragEndFromLibrary = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = '1';
  };

  const handleDragStartInsideTimeline = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    (e.target as HTMLElement).style.opacity = '0.5';
  };

  const handleDragEndInsideTimeline = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = '1';
    setDraggedItemIndex(null);
  };

  const handleDropOnTimeline = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const idFromLibrary = e.dataTransfer.getData('exerciseId');

    if (idFromLibrary) {
      const newSteps = [...steps];
      newSteps.splice(targetIndex, 0, idFromLibrary);
      setSteps(newSteps);
    } else if (draggedItemIndex !== null) {
      const newSteps = [...steps];
      const [removed] = newSteps.splice(draggedItemIndex, 1);
      newSteps.splice(targetIndex, 0, removed);
      setSteps(newSteps);
    }
  };

  const handleDropAtEnd = (e: React.DragEvent) => {
    e.preventDefault();
    const idFromLibrary = e.dataTransfer.getData('exerciseId');
    if (idFromLibrary) {
      setSteps(prev => [...prev, idFromLibrary]);
    }
  };

  // --- Global Edit Actions ---
  const saveGlobalExercise = () => {
    if (!editingEx) return;
    setExercises(prev => prev.map(ex => ex.id === editingEx.id ? editingEx : ex));
    setEditingEx(null);
  };

  const getStepLabel = (id: string, index: number) => {
    const ex = exercises.find(e => e.id === id);
    if (!ex) return 'Unknown';
    let count = 0;
    for (let i = 0; i <= index; i++) {
      if (steps[i] === id) count++;
    }
    return `${ex.name} (Set ${count})`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in slide-in-from-right-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 shrink-0 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-slate-400 hover:text-slate-600 p-3 bg-slate-50 rounded-2xl transition-all">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div>
            <h2 className="text-3xl font-black text-slate-900 leading-none mb-1">{dayId} Planner</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Organize your session modularly</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-12 py-4 rounded-[1.5rem] font-black shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
        >
          Save All Changes
        </button>
      </div>

      {/* Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0 pb-4">
        {/* Library Card Container */}
        <div className="lg:col-span-4 flex flex-col space-y-4 min-h-0 bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between shrink-0 mb-2">
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-[0.2em]">Library</h3>
            <span className="text-[10px] font-black text-slate-400">PICK & DRAG</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
            {exercises.map(ex => (
              <div 
                key={ex.id} 
                draggable
                onDragStart={(e) => handleDragStartFromLibrary(e, ex.id)}
                onDragEnd={handleDragEndFromLibrary}
                className="bg-slate-50 border border-slate-200 p-4 rounded-3xl flex items-center justify-between cursor-grab active:cursor-grabbing hover:bg-white hover:border-blue-400 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-8 h-8 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-all shrink-0">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-slate-800 text-sm leading-tight truncate">{ex.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ex.category}</p>
                  </div>
                </div>
                <button 
                  onClick={() => addStep(ex.id)}
                  className="bg-blue-600 text-white w-6 h-6 rounded-lg font-black text-sm flex items-center justify-center hover:bg-blue-700 transition-all opacity-0 group-hover:opacity-100"
                >
                  +
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Dropzone Container */}
        <div className="lg:col-span-8 flex flex-col space-y-4 min-h-0 bg-slate-900/5 p-6 rounded-[2.5rem] border-2 border-dashed border-slate-200">
          <div className="flex items-center justify-between shrink-0 mb-2">
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-[0.2em]">Daily Sequence</h3>
            <span className="text-[10px] font-black text-slate-500 bg-white border px-3 py-1 rounded-full shadow-sm">
              {steps.length} SETS PLANNED
            </span>
          </div>
          
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropAtEnd}
            className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
          >
            {steps.length > 0 ? (
              steps.map((id, index) => {
                const ex = exercises.find(e => e.id === id);
                if (!ex) return null;
                return (
                  <div 
                    key={`${id}-${index}`}
                    draggable
                    onDragStart={(e) => handleDragStartInsideTimeline(e, index)}
                    onDragEnd={handleDragEndInsideTimeline}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropOnTimeline(e, index)}
                    className="bg-white border border-slate-200 p-4 rounded-3xl flex items-center gap-4 shadow-sm group animate-in slide-in-from-bottom-2 cursor-move hover:border-blue-400 hover:shadow-lg transition-all relative"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 font-black text-xs shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-base truncate">{getStepLabel(id, index)}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{ex.repsOrTime} Target</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setEditingEx(ex)}
                        className="p-2.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                        title="Edit Globally"
                      >
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                      </button>
                      <button 
                        onClick={() => removeStep(index)} 
                        className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                        title="Remove Set"
                      >
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 bg-white/50 rounded-[3rem]">
                <div className="w-20 h-20 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm">
                  <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg>
                </div>
                <p className="font-black text-slate-400">Empty Session</p>
                <p className="text-sm font-bold text-slate-300">Drag exercises here to start planning</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Edit Modal */}
      {editingEx && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Global Settings</h3>
                <p className="text-sm font-bold text-slate-400">Apply changes to all instances of this exercise</p>
              </div>
              <button onClick={() => setEditingEx(null)} className="text-slate-300 hover:text-slate-600 p-2 bg-white border rounded-full shadow-sm">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Exercise Name</label>
                  <input
                    value={editingEx.name}
                    onChange={e => setEditingEx({ ...editingEx, name: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 font-bold transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Target Reps/Time</label>
                  <input
                    value={editingEx.repsOrTime}
                    onChange={e => setEditingEx({ ...editingEx, repsOrTime: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 font-bold transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Rest Period (s)</label>
                  <input
                    type="number"
                    value={editingEx.rest}
                    onChange={e => setEditingEx({ ...editingEx, rest: parseInt(e.target.value) })}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 font-bold transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Logging Type</label>
                  <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2">
                    <button 
                      onClick={() => setEditingEx({ ...editingEx, loggingType: LoggingType.REPS })}
                      className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${editingEx.loggingType === LoggingType.REPS ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                    >
                      Reps
                    </button>
                    <button 
                      onClick={() => setEditingEx({ ...editingEx, loggingType: LoggingType.TIME })}
                      className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${editingEx.loggingType === LoggingType.TIME ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                    >
                      Time
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                  <select
                    value={editingEx.category}
                    onChange={e => setEditingEx({ ...editingEx, category: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 font-bold transition-all appearance-none cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-8 bg-slate-50 flex gap-4 border-t border-slate-100">
              <button onClick={() => setEditingEx(null)} className="flex-1 py-4 rounded-2xl font-black text-slate-500 border border-slate-200 bg-white hover:bg-slate-100 transition-all">Cancel</button>
              <button onClick={saveGlobalExercise} className="flex-1 py-4 rounded-2xl font-black text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all">Apply Globally</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}
