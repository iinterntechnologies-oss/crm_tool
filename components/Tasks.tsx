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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Task Management</h2>
          <p className="text-slate-400 text-sm mt-1">Organize and track your tasks</p>
        </div>
        <button
          onClick={() => setShowAddTask(true)}
          className="px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex gap-2">
          <span className="text-slate-400 text-sm">Status:</span>
          {(['all', 'pending', 'in_progress', 'completed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <span className="text-slate-400 text-sm">Priority:</span>
          {(['all', 'low', 'medium', 'high', 'urgent'] as const).map(priority => (
            <button
              key={priority}
              onClick={() => setFilterPriority(priority)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filterPriority === priority
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 w-full max-w-xl">
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
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-12 text-center">
            <CheckCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No tasks found</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 hover:border-slate-600/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${priorityColors[task.priority]}`}>
                  <Flag className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-white font-medium">{task.title}</h3>
                      {task.description && (
                        <p className="text-slate-400 text-sm mt-1">{task.description}</p>
                      )}
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
