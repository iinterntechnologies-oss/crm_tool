import React from 'react';
import { Activity as ActivityIcon, CheckCircle, Target, Users, Briefcase, ListTodo, Clock, Trash2 } from 'lucide-react';
import { Activity } from '../types';

interface ActivityTimelineProps {
  activities: Activity[];
  onRefresh: () => void;
  onDelete: (id: string) => void;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities, onRefresh, onDelete }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lead_created':
        return <Users className="w-4 h-4" />;
      case 'client_added':
        return <Briefcase className="w-4 h-4" />;
      case 'customer_completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'goal_achieved':
        return <Target className="w-4 h-4" />;
      case 'task_completed':
        return <ListTodo className="w-4 h-4" />;
      default:
        return <ActivityIcon className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'lead_created':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'client_added':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'customer_completed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'goal_achieved':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'task_completed':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Activity Timeline</h2>
          <p className="text-slate-400 text-sm mt-1">Recent business activities</p>
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.99] flex items-center gap-2"
        >
          <ActivityIcon className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 shadow-xl">
        {activities.length === 0 ? (
          <div className="text-center py-14">
            <Clock className="w-14 h-14 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-300 text-lg font-medium">No activities yet</p>
            <p className="text-slate-500 text-sm mt-2">Your latest updates will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className="flex gap-4 p-4 bg-slate-900/40 rounded-xl border border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-900/60 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/40 animate-in fade-in slide-in-from-left duration-300"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${getActivityColor(activity.activityType)}`}>
                  {getActivityIcon(activity.activityType)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium">{activity.description}</p>
                  <p className="text-slate-400 text-sm mt-1">
                    {activity.entityName} • {activity.entityType}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-3">
                  <span className="text-slate-500 text-sm">{formatTimestamp(activity.createdAt)}</span>
                  <button
                    onClick={() => onDelete(activity.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    aria-label="Delete activity"
                    title="Delete activity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;
