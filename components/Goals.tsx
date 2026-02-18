
import React, { useState, useMemo, useEffect } from 'react';
import { Target, Trophy, Calendar, TrendingUp, Edit2, Check, CheckCircle, Info } from 'lucide-react';
import { Goal } from '../types';

interface GoalsPageProps {
  goal: Goal;
  currentRevenue: number;
  successfulClients: number;
  successfulRevenue: number;
  previousGoals: Goal[];
  onUpdateGoal: (title: string, target: number, deadline: string) => void;
}

const GoalsPage: React.FC<GoalsPageProps> = ({ goal, currentRevenue, successfulClients, successfulRevenue, previousGoals, onUpdateGoal }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(goal.title || 'Revenue Goal');
  const [tempTarget, setTempTarget] = useState(goal.targetAmount.toString());
  const [tempDeadline, setTempDeadline] = useState(goal.deadline);

  useEffect(() => {
    setTempTitle(goal.title || 'Revenue Goal');
    setTempTarget(goal.targetAmount.toString());
    setTempDeadline(goal.deadline);
  }, [goal.title, goal.targetAmount, goal.deadline]);

  const progress = Math.min(100, (currentRevenue / goal.targetAmount) * 100);

  const handleSave = () => {
    const target = parseFloat(tempTarget);
    if (isNaN(target) || target <= 0) {
      alert('Please enter a valid target amount');
      return;
    }
    if (!tempDeadline) {
      alert('Please select a deadline');
      return;
    }
    const title = tempTitle.trim() || 'Revenue Goal';
    onUpdateGoal(title, target, tempDeadline);
    setIsEditing(false);
  };

  const daysRemaining = Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Agency Goals</h2>
          <p className="text-slate-400 text-sm md:text-base mt-1">Track your growth and celebrate your wins.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Goal Card */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-5 hidden md:block">
            <Target size={200} />
          </div>

          <div className="relative z-10 space-y-6 md:space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider">
                  Active Revenue Goal
                </span>
                {isEditing ? (
                  <div className="mt-4 flex flex-col space-y-4 max-w-md">
                    <div className="flex flex-col">
                      <label className="text-xs text-slate-500 mb-1 font-bold uppercase">Goal Title</label>
                      <input 
                        type="text"
                        className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs text-slate-500 mb-1 font-bold uppercase">Target Amount (₹)</label>
                      <input 
                        type="number"
                        className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xl font-bold text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        value={tempTarget}
                        onChange={(e) => setTempTarget(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs text-slate-500 mb-1 font-bold uppercase">Target Deadline</label>
                      <input 
                        type="date"
                        className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        value={tempDeadline}
                        onChange={(e) => setTempDeadline(e.target.value)}
                      />
                      <p className="text-[10px] text-slate-500 mt-2 flex items-center">
                        <Info size={12} className="mr-1" /> Remaining days will be recalculated automatically.
                      </p>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl flex items-center justify-center space-x-2 font-semibold transition-all">
                        <Check size={18} /> <span>Save Goal</span>
                      </button>
                      <button onClick={() => setIsEditing(false)} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold transition-all">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-slate-400 text-xs md:text-sm font-medium mt-4">Remaining</p>
                    <h3 className="text-4xl md:text-5xl font-black tracking-tight">
                      ₹{Math.max(0, goal.targetAmount - currentRevenue).toLocaleString()}
                    </h3>
                    <p className="text-sm md:text-base text-slate-300 mt-3 font-semibold">
                      {goal.title || 'Revenue Goal'}
                    </p>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex items-center mt-4 text-slate-400 hover:text-blue-400 transition-colors group"
                    >
                      <Calendar size={18} className="mr-2" />
                      <span className="font-medium underline decoration-slate-700 underline-offset-4 group-hover:decoration-blue-400">
                        Deadline: {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                      <Edit2 size={12} className="ml-2 opacity-50" />
                    </button>
                  </>
                )}
              </div>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all border border-slate-700 shadow-lg"
                  title="Edit Goal"
                >
                  <Edit2 size={20} className="text-slate-300" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-slate-400 text-xs md:text-sm font-medium">Current Progress</p>
                  <p className="text-2xl md:text-3xl font-bold text-blue-400">₹{currentRevenue.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs md:text-sm font-medium">Percent</p>
                  <p className="text-2xl md:text-3xl font-bold">{Math.round(progress)}%</p>
                </div>
              </div>

              <div className="h-4 md:h-6 bg-slate-950 rounded-full p-0.5 md:p-1 border border-slate-800 shadow-inner overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400 animate-progress relative transition-all duration-1000`}
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
              
              <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest pt-2">
                <span>Start (₹0)</span>
                <span>Progress</span>
              </div>
              <div className="pt-4 text-right">
                <span className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-slate-400">Goal Total</span>
                <div className="text-xl md:text-2xl font-black text-slate-100">₹{goal.targetAmount.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Goal Stats Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col justify-between overflow-hidden relative shadow-xl">
          <div className="space-y-6 relative z-10">
            <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Goal Insights</h4>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="h-10 w-10 md:h-12 md:w-12 bg-emerald-500/10 rounded-xl md:rounded-2xl flex items-center justify-center border border-emerald-500/20 shrink-0">
                  <TrendingUp className="text-emerald-400 h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] md:text-xs">To Achievement</p>
                  <p className="text-lg md:text-xl font-bold">₹{Math.max(0, goal.targetAmount - currentRevenue).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-500/10 rounded-xl md:rounded-2xl flex items-center justify-center border border-blue-500/20 shrink-0">
                  <Calendar className="text-blue-400 h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] md:text-xs">Days Remaining</p>
                  <p className="text-lg md:text-xl font-bold">
                    {daysRemaining} Days
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="h-10 w-10 md:h-12 md:w-12 bg-amber-500/10 rounded-xl md:rounded-2xl flex items-center justify-center border border-amber-500/20 shrink-0">
                  <CheckCircle className="text-amber-400 h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] md:text-xs">Successful Clients</p>
                  <p className="text-lg md:text-xl font-bold">{successfulClients}</p>
                  <p className="text-[10px] md:text-xs text-slate-500">₹{successfulRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 relative z-10">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/50">
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                <span className="text-blue-400 font-bold italic">Tip:</span> Your "Remaining Days" are calculated from your deadline. Adjust the deadline to change the countdown.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6 pt-4">
        <h3 className="text-lg md:text-xl font-bold flex items-center">
          <Trophy size={20} className="mr-3 text-amber-400" /> 
          Previous Achievements
        </h3>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="bg-slate-800/50 text-slate-400 text-[10px] md:text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Goal Target</th>
                  <th className="px-6 py-4 font-semibold">Date Started</th>
                  <th className="px-6 py-4 font-semibold">Date Achieved</th>
                  <th className="px-6 py-4 font-semibold text-center">Total Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {previousGoals.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-100">₹{g.targetAmount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 text-xs md:text-sm text-slate-400">
                      {new Date(g.dateStarted).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-emerald-400 font-medium text-xs md:text-sm">
                        <Check size={14} className="mr-2" />
                        {g.dateAchieved ? new Date(g.dateAchieved).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 bg-slate-800 rounded text-[10px] md:text-xs text-slate-300 font-bold">
                        {g.dateAchieved 
                          ? Math.round((new Date(g.dateAchieved).getTime() - new Date(g.dateStarted).getTime()) / (1000 * 60 * 60 * 24))
                          : '0'} Days
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
