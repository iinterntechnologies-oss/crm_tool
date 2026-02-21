
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Bookmark, 
  Briefcase, 
  Target, 
  CheckCircle,
  Menu,
  ChevronLeft,
  ListTodo,
  BarChart3
} from 'lucide-react';
import { PageType } from '../types';

interface SidebarProps {
  isOpen: boolean;
  activePage: PageType;
  onPageChange: (page: PageType) => void;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activePage, onPageChange, onToggle }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'saved-leads', label: 'Saved', icon: Bookmark },
    { id: 'clients', label: 'Clients', icon: Briefcase },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'customers', label: 'Success', icon: CheckCircle },
    { id: 'tasks', label: 'Tasks', icon: ListTodo },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div 
        className={`hidden md:flex bg-slate-900 border-r border-slate-800 flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950/20">
          {isOpen && <h1 className="text-xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Command Center</h1>}
          <button 
            onClick={onToggle}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id as PageType)}
                className={`w-full flex items-center py-3 px-3 rounded-lg transition-all group relative ${
                  isActive 
                    ? 'bg-blue-500/10 backdrop-blur-sm text-blue-400 shadow-lg shadow-blue-500/50' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 hover:backdrop-blur-sm'
                }`}
              >
                <Icon size={20} className={`shrink-0 transition-all ${
                  isActive 
                    ? 'text-blue-400 drop-shadow-lg drop-shadow-blue-400/50 scale-105' 
                    : 'group-hover:text-slate-200'
                }`} />
                {isOpen && <span className="ml-3 font-medium text-sm whitespace-nowrap">{item.label}</span>}
                {!isOpen && isActive && <div className="absolute left-1 w-1 h-8 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50" />}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className={`flex items-center ${isOpen ? 'space-x-3' : 'justify-center'}`}>
            <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 border border-slate-700 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">CRM</span>
            </div>
            {isOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">User</p>
                <p className="text-xs text-slate-500 truncate">Admin</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/40 backdrop-blur-md border-t border-white/10 flex items-center justify-around px-2 z-50">
        {menuItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id as PageType)}
              className={`flex flex-col items-center justify-center space-y-1 flex-1 h-full transition-all rounded-lg ${
                isActive ? 'text-blue-400 bg-blue-500/10 backdrop-blur-sm' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon size={20} className={isActive ? 'drop-shadow-lg drop-shadow-blue-400/50' : ''} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
              {isActive && <div className="absolute bottom-1 w-1 h-1 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50" />}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;
