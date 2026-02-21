import React, { useState } from 'react';
import { Plus, CheckCircle, Clock, AlertCircle, X, Calendar, Flag } from 'lucide-react';
import { Task } from '../types';

interface TasksProps {
  tasks: Task[];
  clients: Array<{ id: string; businessName: string }>;
  leads: Array<{ id: string; businessName: string }>;
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt' | 'completedAt'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

const Tasks: React.FC<TasksProps> = ({ tasks, clients, leads, onCreateTask, onUpdateTask, onDeleteTask }) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    relatedTo: 'general' as const,
    relatedId: null as string | null,
    priority: 'medium' as const,
    status: 'pending' as const,
    dueDate: null as string | null,
  });

  const priorityColors = {
    low: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    medium: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    high: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    urgent: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const statusIcons = {
    pending: <Clock className="w-4 h-4" />,
    in_progress: <AlertCircle className="w-4 h-4" />,
    completed: <CheckCircle className="w-4 h-4" />,
    cancelled: <X className="w-4 h-4" />,
  };

  const filteredTasks = tasks.filter(task => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    onCreateTask(newTask);
    setNewTask({
      title: '',
      description: '',
      relatedTo: 'general',
      relatedId: null,
      priority: 'medium',
      status: 'pending',
      dueDate: null,
    });
    setShowAddTask(false);
  };

  const getRelatedName = (task: Task) => {
    if (task.relatedTo === 'general') return 'General';
    if (task.relatedTo === 'client') {
      const client = clients.find(c => c.id === task.relatedId);
      return client ? client.businessName : 'Unknown Client';
    }
    if (task.relatedTo === 'lead') {
      const lead = leads.find(l => l.id === task.relatedId);
      return lead ? lead.businessName : 'Unknown Lead';
    }
    return '';
  };

  return (
    <div className="space-y-6 animate-fade-in animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Operations</h2>
          <p className="text-slate-400 text-sm mt-1">The granular daily workflow manager. Organize developer tickets, UI/UX revisions, and client feedback loops.</p>
        </div>
        <button
          onClick={() => setShowAddTask(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.99]"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap items-center bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
        <div className="flex gap-2 items-center">
          <span className="text-slate-400 text-sm font-medium">Status:</span>
          {(['all', 'pending', 'in_progress', 'completed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-slate-400 text-sm font-medium">Priority:</span>
          {(['all', 'low', 'medium', 'high', 'urgent'] as const).map(priority => (
            <button
              key={priority}
              onClick={() => setFilterPriority(priority)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                filterPriority === priority
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
              }`}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 w-full max-w-xl shadow-2xl animate-in zoom-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-xl font-bold mb-4">Create New Task</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Related To</label>
                  <select
                    value={newTask.relatedTo}
                    onChange={(e) => setNewTask({ ...newTask, relatedTo: e.target.value as any, relatedId: null })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">General</option>
                    <option value="client">Client</option>
                    <option value="lead">Lead</option>
                  </select>
                </div>
                {newTask.relatedTo === 'client' && (
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Select Client</label>
                    <select
                      value={newTask.relatedId || ''}
                      onChange={(e) => setNewTask({ ...newTask, relatedId: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">None</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.businessName}</option>
                      ))}
                    </select>
                  </div>
                )}
                {newTask.relatedTo === 'lead' && (
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Select Lead</label>
                    <select
                      value={newTask.relatedId || ''}
                      onChange={(e) => setNewTask({ ...newTask, relatedId: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">None</option>
                      {leads.map(lead => (
                        <option key={lead.id} value={lead.id}>{lead.businessName}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate || ''}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value || null })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-14 text-center shadow-xl">
            <CheckCircle className="w-14 h-14 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-300 text-lg font-medium">No tasks found</p>
            <p className="text-slate-500 text-sm mt-2">Create a new task to get started.</p>
          </div>
        ) : (
          filteredTasks.map((task, index) => (
            <div
              key={task.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 hover:border-slate-600/50 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/40 animate-fade-in animate-slide-in"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${priorityColors[task.priority]}`}>
                  <Flag className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-white font-medium">{task.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <span>{getRelatedName(task)}</span>
                        {task.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={task.status}
                        onChange={(e) => onUpdateTask(task.id, { status: e.target.value as any })}
                        className="px-3 py-1 bg-slate-900/50 border border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;
