
import React from 'react';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  Clock,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { Stats } from '../types';

interface DashboardProps {
  stats: Stats;
  onCreateLead: () => void;
  onSaveAllLeads: () => void;
  onGenerateReport: () => void;
  onSyncContacts: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onCreateLead, onSaveAllLeads, onGenerateReport, onSyncContacts }) => {
  const cards = [
    { title: 'Total Leads', value: stats.totalLeads, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: 'Active Projects', value: stats.activeProjects, icon: Briefcase, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { title: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { title: 'Deadlines (7d)', value: stats.deadlines, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Welcome back, Admin</h2>
          <p className="text-slate-400 text-sm mt-1">Agency performance summary.</p>
        </div>
        <div className="flex md:hidden items-center text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 w-fit">
          <Clock size={12} className="mr-1" /> Live Updates
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-2xl hover:border-slate-700 transition-all group shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 md:p-3 rounded-xl ${card.bg}`}>
                <card.icon className={`h-5 w-5 md:h-6 md:w-6 ${card.color}`} />
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
            <p className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider">{card.title}</p>
            <p className="text-2xl md:text-3xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 md:p-6 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-semibold text-base md:text-lg">Project Pipeline</h3>
            <button className="text-xs md:text-sm text-blue-400 hover:text-blue-300 flex items-center">
              All <ChevronRight size={16} />
            </button>
          </div>
          <div className="p-4 md:p-6">
             <div className="space-y-3 md:space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-950/50 border border-slate-800/50 rounded-xl gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-9 w-9 md:h-10 md:w-10 bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                        <Briefcase size={18} className="text-slate-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm md:text-base truncate">Web Redesign - Client {i}</p>
                        <p className="text-[10px] md:text-xs text-slate-500">Milestone {i} of 4 • Active</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-6">
                      <div className="text-left sm:text-right shrink-0">
                        <p className="text-[10px] md:text-xs text-slate-500 uppercase font-bold tracking-tighter">Deadline</p>
                        <p className="text-xs md:text-sm font-semibold">Dec {12 + i}, 2024</p>
                      </div>
                      <div className="w-20 md:w-24 bg-slate-800 h-1.5 md:h-2 rounded-full overflow-hidden shrink-0">
                        <div className="bg-blue-500 h-full w-[65%]" />
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl h-fit">
          <div className="p-5 md:p-6 border-b border-slate-800">
            <h3 className="font-semibold text-base md:text-lg">Quick Actions</h3>
          </div>
          <div className="p-5 md:p-6 space-y-3 md:space-y-4">
            <button
              onClick={onCreateLead}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-sm md:text-base transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
            >
              Create New Lead
            </button>
            <button
              onClick={onSaveAllLeads}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm md:text-base transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
            >
              Save All Leads
            </button>
            <button
              onClick={onGenerateReport}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 py-3 rounded-xl font-bold text-sm md:text-base transition-all active:scale-[0.98]"
            >
              Generate Report
            </button>
            <button
              onClick={onSyncContacts}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 py-3 rounded-xl font-bold text-sm md:text-base transition-all active:scale-[0.98]"
            >
              Sync Contacts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
