import React, { useMemo } from 'react';
import {
  Users,
  Briefcase,
  DollarSign,
  Clock,
  ArrowUpRight,
  ChevronRight,
  Trash2,
  TrendingUp,
  Target,
  BarChart3,
  Calendar,
  Award,
  Zap,
  AlertCircle
} from 'lucide-react';
import { Stats, Client, Customer, Lead, Goal } from '../types';
import { GlowingEffect } from './ui/glowing-effect';

interface DashboardProps {
  stats: Stats;
  clients: Client[];
  customers: Customer[];
  leads?: Lead[];
  savedLeads?: Lead[];
  goals?: Goal[];
  onCreateLead: () => void;
  onSaveAllLeads: () => void;
  onGenerateReport: () => void;
  onDeleteCustomer?: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  stats,
  clients,
  customers,
  leads = [],
  savedLeads = [],
  goals = [],
  onCreateLead,
  onSaveAllLeads,
  onGenerateReport,
  onDeleteCustomer,
}) => {
  // Calculate analytics
  const analytics = useMemo(() => {
    const totalRevenue = clients.reduce((acc, c) => acc + c.paymentCollected, 0) +
      customers.reduce((acc, c) => acc + c.totalPaid, 0);

    const conversionRate = (leads.length + savedLeads.length) > 0
      ? ((clients.length / (leads.length + savedLeads.length)) * 100).toFixed(1)
      : '0';

    const avgProjectValue = clients.length > 0
      ? (clients.reduce((acc, c) => acc + c.paymentCollected, 0) / clients.length).toFixed(0)
      : '0';

    const completionRate = clients.length > 0
      ? ((clients.filter(c => c.isCompleted).length / clients.length) * 100).toFixed(1)
      : '0';

    // Monthly revenue trend
    const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const monthStr = date.toLocaleDateString('en-US', { month: 'short' });

      const revenue = customers
        .filter(c => {
          const completedDate = new Date(c.completedDate);
          return completedDate.getMonth() === date.getMonth() &&
            completedDate.getFullYear() === date.getFullYear();
        })
        .reduce((acc, c) => acc + c.totalPaid, 0);

      return { month: monthStr, revenue };
    });

    // Business type distribution by revenue
    const businessTypes = clients.reduce((acc, client) => {
      acc[client.businessType] = (acc[client.businessType] || 0) + client.paymentCollected;
      return acc;
    }, {} as Record<string, number>);

    const topBusinessTypes = Object.entries(businessTypes)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 5)
      .map(([type, revenue]) => ({ type, revenue: revenue as number }));

    // Goal progress
    const currentGoal = goals.find(g => !g.isAchieved);
    const goalProgress = currentGoal
      ? ((totalRevenue / currentGoal.targetAmount) * 100).toFixed(1)
      : '0';

    return {
      totalRevenue,
      conversionRate,
      avgProjectValue,
      completionRate,
      monthlyRevenue,
      topBusinessTypes,
      goalProgress,
      currentGoal,
    };
  }, [clients, customers, leads, savedLeads, goals]);

  // Project data for chart
  const chartData = clients
    .slice()
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 8)
    .map((client) => {
      const totalDays = Math.max(1, Math.ceil((new Date(client.deadline).getTime() - new Date(client.onboarding).getTime()) / (1000 * 60 * 60 * 24)));
      const daysStarted = Math.max(0, Math.ceil((Date.now() - new Date(client.onboarding).getTime()) / (1000 * 60 * 60 * 24)));
      const progress = Math.max(0, Math.min(100, (daysStarted / totalDays) * 100));
      const daysUntilDeadline = Math.ceil((new Date(client.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return { id: client.id, name: client.businessName, progress, daysUntilDeadline };
    });

  const maxRevenue = Math.max(...analytics.monthlyRevenue.map(m => m.revenue), 1);
  const chartWidth = 100;
  const chartHeight = 36;
  const xStep = chartData.length > 1 ? chartWidth / (chartData.length - 1) : 0;
  const chartPoints = chartData
    .map((point, index) => {
      const x = index * xStep;
      const y = chartHeight - (point.progress / 100) * chartHeight;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  const averageProgress = chartData.length
    ? Math.round(chartData.reduce((acc, point) => acc + point.progress, 0) / chartData.length)
    : 0;

  const nextDeadline = chartData
    .map((point) => point.daysUntilDeadline)
    .filter((value) => value >= 0)
    .sort((a, b) => a - b)[0];

  const overdueProjects = chartData.filter(p => p.daysUntilDeadline < 0).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Command Center
          </h1>
          <p className="text-slate-400 text-sm mt-2">Unified analytics and actionable business intelligence</p>
        </div>
        {overdueProjects > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full backdrop-blur-sm">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">{overdueProjects} overdue project{overdueProjects !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Key Metrics - Bento Style Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          icon={<DollarSign className="w-6 h-6" />}
          label="Total Revenue"
          value={`₹${analytics.totalRevenue.toLocaleString()}`}
          trend={`+12% from last month`}
          gradient="from-blue-500/20 to-cyan-500/20"
          borderColor="border-blue-500/30"
          accentColor="text-blue-400"
          colSpan="md:col-span-2"
        />
        <MetricCard
          icon={<Users className="w-6 h-6" />}
          label="Conversion Rate"
          value={`${analytics.conversionRate}%`}
          trend={leads.length + savedLeads.length > 0 ? `${clients.length} of ${leads.length + savedLeads.length}` : 'No leads'}
          gradient="from-emerald-500/20 to-teal-500/20"
          borderColor="border-emerald-500/30"
          accentColor="text-emerald-400"
          colSpan="md:col-span-2"
        />
        <MetricCard
          icon={<BarChart3 className="w-6 h-6" />}
          label="Avg Project Value"
          value={`₹${Number(analytics.avgProjectValue).toLocaleString()}`}
          trend={`Across ${clients.length} projects`}
          gradient="from-purple-500/20 to-pink-500/20"
          borderColor="border-purple-500/30"
          accentColor="text-purple-400"
        />
        <MetricCard
          icon={<Target className="w-6 h-6" />}
          label="Completion Rate"
          value={`${analytics.completionRate}%`}
          trend={`${customers.length} completed`}
          gradient="from-amber-500/20 to-orange-500/20"
          borderColor="border-amber-500/30"
          accentColor="text-amber-400"
        />
        <div className="md:col-span-2 group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
          <div className="relative bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 flex flex-col hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 to-teal-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-emerald-500/20 rounded-lg">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight">Quick Actions</h3>
              </div>

              <div className="space-y-3 flex-1 flex flex-col">
                <ActionButton
                  onClick={onCreateLead}
                  label="Create New Lead"
                  icon={<Users className="w-4 h-4" />}
                  gradient="from-blue-600 to-blue-500"
                  hoverGradient="from-blue-500 to-blue-400"
                />
                <ActionButton
                  onClick={onGenerateReport}
                  label="Generate Report"
                  icon={<BarChart3 className="w-4 h-4" />}
                  gradient="from-purple-600 to-purple-500"
                  hoverGradient="from-purple-500 to-purple-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8">
        {/* Active Projects - Large Card */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
          <div className="relative bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 via-purple-500/10 to-cyan-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-blue-500/20 rounded-lg">
                <Briefcase className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white tracking-tight">Active Projects</h3>
                <p className="text-slate-400 text-sm">{clients.length} ongoing</p>
              </div>
            </div>

            {chartData.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-widest font-medium">
                  <span>Progress Overview</span>
                  <span className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-amber-400" />
                    {averageProgress}% avg • {nextDeadline !== undefined ? `${nextDeadline}d due` : 'All on track'}
                  </span>
                </div>

                <div className="relative h-48 bg-slate-950/40 rounded-xl p-4 border border-slate-700/30">
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                      <linearGradient id="progressFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <polygon
                      points={`${chartPoints} ${chartWidth},${chartHeight} 0,${chartHeight}`}
                      fill="url(#progressFill)"
                      opacity="0.9"
                    />
                    <polyline
                      fill="none"
                      stroke="url(#progressGradient)"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      points={chartPoints}
                      filter="url(#glow)"
                      opacity="0.8"
                    />
                    {chartData.map((point, index) => {
                      const x = index * xStep;
                      const y = chartHeight - (point.progress / 100) * chartHeight;
                      return (
                        <g key={point.id}>
                          <circle cx={x} cy={y} r="2.5" fill="#06b6d4" opacity="0.6" />
                          <circle cx={x} cy={y} r="1.5" fill="#38bdf8" />
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  {chartData.map((point) => (
                    <div key={point.id} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30 hover:border-slate-600/50 hover:shadow-cyan-500/20 hover:-translate-y-0.5 transition-all duration-300">
                      <p className="text-slate-300 font-medium truncate">{point.name}</p>
                      <p className={`mt-1 font-semibold ${point.daysUntilDeadline < 0 ? 'text-red-400' : point.daysUntilDeadline < 3 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {point.daysUntilDeadline >= 0 ? `${point.daysUntilDeadline}d` : 'Overdue'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <p className="text-sm">No active projects. Convert leads to get started.</p>
              </div>
            )}
            </div>
          </div>
        </div>

      </div>

      {/* Goal Progress */}
      {analytics.currentGoal && (
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
          <div className="relative bg-gradient-to-br from-purple-950/40 via-slate-900/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6 hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300 shadow-2xl hover:border-purple-500/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-pink-500/10 to-rose-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-500/20 rounded-lg">
                  <Award className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white tracking-tight">{analytics.currentGoal.title}</h3>
                  <p className="text-slate-400 text-sm">
                    Target: ₹{analytics.currentGoal.targetAmount.toLocaleString()} by {new Date(analytics.currentGoal.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {analytics.goalProgress}%
              </span>
            </div>

            <div className="space-y-3">
              <div className="relative h-3 bg-slate-900/60 rounded-full overflow-hidden border border-purple-500/30">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full transition-all duration-500 shadow-lg shadow-purple-500/20"
                  style={{ width: `${Math.min(Number(analytics.goalProgress), 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Progress</span>
                <span className="text-white font-semibold">₹{analytics.totalRevenue.toLocaleString()} / ₹{analytics.currentGoal.targetAmount.toLocaleString()}</span>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Completions */}
      {customers.length > 0 && (
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
          <div className="relative bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 transition-all duration-300 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-emerald-500/20 rounded-lg">
                <Award className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Recent Completions</h3>
                <p className="text-slate-400 text-sm">{customers.length} total</p>
              </div>
            </div>

            <div className="space-y-3">
              {customers.slice(0, 5).map((customer) => {
                const completionDate = new Date(customer.completedDate);
                const formattedDate = completionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                return (
                  <div key={customer.id} className="group/item flex items-center justify-between p-4 bg-gradient-to-r from-slate-900/40 to-slate-800/40 border border-emerald-500/20 rounded-xl hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <p className="font-medium text-sm md:text-base truncate text-slate-100">{customer.businessName}</p>
                      </div>
                      <p className="text-[10px] md:text-xs text-slate-500 mt-1">₹{customer.totalPaid.toLocaleString()} • {formattedDate}</p>
                    </div>
                    <button
                      onClick={() => onDeleteCustomer?.(customer.id)}
                      className="ml-3 p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all shrink-0 opacity-0 group-hover/item:opacity-100"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Component for Metric Cards
const MetricCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  gradient: string;
  borderColor: string;
  accentColor: string;
  colSpan?: string;
}> = ({ icon, label, value, trend, gradient, borderColor, accentColor, colSpan }) => (
  <div className={`group relative ${colSpan || ''}`}>
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    <div className={`relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl border ${borderColor} p-6 hover:border-slate-600/50 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 shadow-xl group-hover:shadow-2xl overflow-hidden`}>
      <GlowingEffect disabled={false} blur={12} proximity={120} spread={28} glow />
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-slate-900/50 border ${borderColor}`}>
          <div className={`${accentColor}`}>{icon}</div>
        </div>
        <TrendingUp className={`w-4 h-4 ${accentColor} opacity-60 group-hover:opacity-100 transition-opacity`} />
      </div>
      <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">{label}</p>
      <p className="text-2xl md:text-3xl font-bold mt-2 text-white tracking-tight">{value}</p>
      <p className={`text-xs mt-2 ${accentColor} font-medium`}>{trend}</p>
      </div>
    </div>
  </div>
);

// Component for Action Buttons
const ActionButton: React.FC<{
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  gradient: string;
  hoverGradient: string;
}> = ({ onClick, label, icon, gradient, hoverGradient }) => (
  <button
    onClick={onClick}
    className={`group/btn relative w-full bg-gradient-to-r ${gradient} hover:${hoverGradient} text-white py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] overflow-hidden`}
  >
    <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-20 bg-white transition-opacity" />
    <div className="relative flex items-center justify-center gap-2">
      {icon}
      {label}
    </div>
  </button>
);

// Component for Summary Cards
const SummaryCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className="group relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-slate-800/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 text-center hover:border-slate-600/50 hover:-translate-y-1 hover:shadow-slate-600/20 transition-all duration-300 shadow-lg group-hover:shadow-xl">
      <div className="flex justify-center mb-3 text-slate-400">{icon}</div>
      <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">{label}</p>
      <p className="text-2xl md:text-3xl font-bold mt-3 text-white tracking-tight">{value}</p>
    </div>
  </div>
);

export default Dashboard;
