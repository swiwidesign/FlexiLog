
import React from 'react';
import { WorkoutLog, LoggingType } from '../types';

interface LogsViewProps {
  logs: WorkoutLog[];
  onBack: () => void;
}

export default function LogsView({ logs, onBack }: LogsViewProps) {
  const formatDate = (isoStr: string) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date(isoStr));
  };

  const downloadCSV = () => {
    if (logs.length === 0) return;

    // CSV Header
    const headers = ['Date', 'Day', 'Exercise', 'Set Number', 'Value', 'Type'];
    const rows = logs.flatMap(log => {
      const formattedDate = new Date(log.date).toLocaleDateString();
      return log.sets.map(set => [
        formattedDate,
        log.dayId,
        set.exerciseName,
        set.setNumber.toString(),
        set.value.toString(),
        set.type === LoggingType.TIME ? 'Seconds' : 'Reps'
      ]);
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `flexilog_workout_history_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Workout History</h2>
          <p className="text-slate-500 font-medium">Your progress over time.</p>
        </div>
        <div className="flex gap-3">
          {logs.length > 0 && (
            <button 
              onClick={downloadCSV}
              className="bg-white text-emerald-600 border-2 border-emerald-100 px-6 py-2.5 rounded-2xl font-bold shadow-sm hover:bg-emerald-50 hover:border-emerald-200 transition-all flex items-center gap-2"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Export CSV
            </button>
          )}
          <button onClick={onBack} className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all">
            Dashboard
          </button>
        </div>
      </div>

      {logs.length > 0 ? (
        <div className="space-y-6">
          {logs.map((log) => (
            <div key={log.id} className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="px-8 py-5 bg-slate-50 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-black text-slate-800">{log.dayId} Session</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formatDate(log.date)}</p>
                </div>
                <div className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black">
                  {log.sets.length} Sets Total
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.from(new Set(log.sets.map(s => s.exerciseName))).map(name => {
                    const exerciseSets = log.sets.filter(s => s.exerciseName === name);
                    return (
                      <div key={name} className="p-4 bg-slate-50/50 border rounded-2xl">
                        <h4 className="font-bold text-slate-800 text-sm mb-2 truncate">{name}</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {exerciseSets.map((s, i) => (
                            <span key={i} className="text-[10px] font-black bg-white border border-slate-100 px-2 py-1 rounded-lg text-slate-600">
                              {s.value}{s.type === LoggingType.TIME ? 's' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto text-slate-300">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          </div>
          <h3 className="text-xl font-black text-slate-800">No logs found</h3>
          <p className="text-slate-500 font-medium">Complete your first workout session to see history here.</p>
        </div>
      )}
    </div>
  );
}
