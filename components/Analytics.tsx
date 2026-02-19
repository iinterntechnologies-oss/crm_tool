import React, { useMemo } from 'react';
import { TrendingUp, DollarSign, Users, Target, BarChart3, Calendar, Award } from 'lucide-react';
import { Client, Customer, Lead, Goal } from '../types';

interface AnalyticsProps {
  clients: Client[];
  customers: Customer[];
  leads: Lead[];
  savedLeads: Lead[];
  goals: Goal[];
}

const Analytics: React.FC<AnalyticsProps> = ({ clients, customers, leads, savedLeads, goals }) => {
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

    // Monthly revenue trend (last 6 months)
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

    // Business type distribution
    const businessTypes = clients.reduce((acc, client) => {
      acc[client.businessType] = (acc[client.businessType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topBusinessTypes = Object.entries(businessTypes)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 5)
      .map(([type, count]) => ({ type, count: count as number }));

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

  const maxRevenue = Math.max(...analytics.monthlyRevenue.map(m => m.revenue), 1);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <p className="text-slate-400 text-sm mt-1">Business insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-xl border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors duration-300">
              <DollarSign className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-400 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </div>
          <p className="text-slate-400 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-white mt-1">₹{analytics.totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-linear-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm rounded-xl border border-emerald-500/20 p-6 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors duration-300">
              <Users className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-400 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </div>
          <p className="text-slate-400 text-sm">Conversion Rate</p>
          <p className="text-2xl font-bold text-white mt-1">{analytics.conversionRate}%</p>
        </div>

        <div className="bg-linear-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors duration-300">
              <BarChart3 className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <TrendingUp className="w-5 h-5 text-purple-400 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </div>
          <p className="text-slate-400 text-sm">Avg Project Value</p>
          <p className="text-2xl font-bold text-white mt-1">₹{Number(analytics.avgProjectValue).toLocaleString()}</p>
        </div>

        <div className="bg-linear-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm rounded-xl border border-amber-500/20 p-6 hover:border-amber-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-500/20 rounded-lg group-hover:bg-amber-500/30 transition-colors duration-300">
              <Target className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <TrendingUp className="w-5 h-5 text-amber-400 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </div>
          <p className="text-slate-400 text-sm">Completion Rate</p>
          <p className="text-2xl font-bold text-white mt-1">{analytics.completionRate}%</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold">Revenue Trend (6 Months)</h3>
          </div>
          <div className="space-y-4">
            {analytics.monthlyRevenue.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{item.month}</span>
                  <span className="text-white font-medium">₹{item.revenue.toLocaleString()}</span>
                </div>
                <div className="relative h-2 bg-slate-900/50 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Type Distribution */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold">Top Business Types</h3>
          </div>
          {analytics.topBusinessTypes.length === 0 ? (
            <div className="text-center py-8 text-slate-400">No data available</div>
          ) : (
            <div className="space-y-4">
              {analytics.topBusinessTypes.map((item, index) => {
                const total = analytics.topBusinessTypes.reduce((acc, t) => acc + t.count, 0);
                const percentage = ((item.count / total) * 100).toFixed(0);
                const colors = ['from-purple-500 to-pink-500', 'from-blue-500 to-cyan-500', 'from-emerald-500 to-teal-500', 'from-amber-500 to-orange-500', 'from-red-500 to-rose-500'];
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{item.type}</span>
                      <span className="text-slate-400">{item.count} clients ({percentage}%)</span>
                    </div>
                    <div className="relative h-2 bg-slate-900/50 rounded-full overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 bg-linear-to-r ${colors[index % colors.length]} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Goal Progress */}
      {analytics.currentGoal && (
        <div className="bg-linear-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300 shadow-xl hover:shadow-purple-500/20">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-purple-400" />
            <div>
              <h3 className="text-lg font-semibold">{analytics.currentGoal.title}</h3>
              <p className="text-slate-400 text-sm">
                Target: ₹{analytics.currentGoal.targetAmount.toLocaleString()} by{' '}
                {new Date(analytics.currentGoal.deadline).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Progress</span>
              <span className="text-white font-medium">{analytics.goalProgress}%</span>
            </div>
            <div className="relative h-3 bg-slate-900/50 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-linear-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(Number(analytics.goalProgress), 100)}%` }}
              />
            </div>
            <p className="text-slate-400 text-sm">
              ₹{analytics.totalRevenue.toLocaleString()} of ₹{analytics.currentGoal.targetAmount.toLocaleString()} achieved
            </p>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 text-center hover:border-slate-600/50 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg cursor-default">
          <p className="text-slate-400 text-sm mb-1">Total Leads</p>
          <p className="text-2xl font-bold text-white">{leads.length + savedLeads.length}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 text-center hover:border-slate-600/50 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg cursor-default">
          <p className="text-slate-400 text-sm mb-1">Active Clients</p>
          <p className="text-2xl font-bold text-white">{clients.length}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 text-center hover:border-slate-600/50 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg cursor-default">
          <p className="text-slate-400 text-sm mb-1">Completed Projects</p>
          <p className="text-2xl font-bold text-white">{customers.length}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 text-center hover:border-slate-600/50 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg cursor-default">
          <p className="text-slate-400 text-sm mb-1">Success Rate</p>
          <p className="text-2xl font-bold text-white">
            {clients.length > 0 ? ((customers.length / (clients.length + customers.length)) * 100).toFixed(0) : '0'}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
