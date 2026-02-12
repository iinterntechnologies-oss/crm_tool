
import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Bookmark, 
  Briefcase, 
  Target, 
  CheckCircle,
  Search,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { PageType, Lead, Client, Customer, Goal } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LeadsPage from './components/Leads';
import SavedLeadsPage from './components/SavedLeads';
import ClientsPage from './components/Clients';
import GoalsPage from './components/Goals';
import CustomersPage from './components/Customers';
import CelebrationOverlay from './components/CelebrationOverlay';

const INITIAL_LEADS: Lead[] = [
  { id: '1', businessName: 'TechNova Solutions', contact: '+91 98765 43210', comment: '', status: 'new' },
  { id: '2', businessName: 'Apex Marketing', contact: '+91 87654 32109', comment: 'Interested in SEO', status: 'new' },
  { id: '3', businessName: 'Green Eats', contact: '+91 76543 21098', comment: 'Needs new website', status: 'new' },
  { id: '4', businessName: 'Swift Logistics', contact: '+91 65432 10987', comment: '', status: 'new' },
];

const INITIAL_GOAL: Goal = {
  id: 'current-goal',
  targetAmount: 50000,
  deadline: '2024-12-31',
  dateStarted: '2024-01-01',
  isAchieved: false
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // App State
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [savedLeads, setSavedLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [goal, setGoal] = useState<Goal>(INITIAL_GOAL);
  const [previousGoals, setPreviousGoals] = useState<Goal[]>([
    { id: 'p1', targetAmount: 20000, deadline: '2023-12-31', dateStarted: '2023-01-01', dateAchieved: '2023-11-15', isAchieved: true }
  ]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Derived Values
  const totalRevenue = useMemo(() => 
    clients.reduce((acc, c) => acc + c.paymentCollected, 0) + 
    customers.reduce((acc, c) => acc + c.totalPaid, 0),
    [clients, customers]
  );

  const stats = useMemo(() => ({
    totalLeads: leads.length + savedLeads.length,
    activeProjects: clients.length,
    revenue: totalRevenue,
    deadlines: clients.filter(c => new Date(c.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length
  }), [leads, savedLeads, clients, totalRevenue]);

  // Handlers
  const selectLead = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      setLeads(prev => prev.filter(l => l.id !== leadId));
      setSavedLeads(prev => [...prev, { ...lead, status: 'saved' }]);
    }
  };

  const deleteLead = (leadId: string, from: 'leads' | 'saved') => {
    if (from === 'leads') setLeads(prev => prev.filter(l => l.id !== leadId));
    else setSavedLeads(prev => prev.filter(l => l.id !== leadId));
  };

  const convertToClient = (lead: Lead) => {
    setSavedLeads(prev => prev.filter(l => l.id !== lead.id));
    const newClient: Client = {
      id: lead.id,
      businessName: lead.businessName,
      businessType: 'Web Design',
      contact: lead.contact,
      onboarding: new Date().toISOString().split('T')[0],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      delivery: 'In Progress',
      paymentCollected: 0,
      isCompleted: false
    };
    setClients(prev => [...prev, newClient]);
  };

  const updatePayment = (clientId: string, amount: number) => {
    setClients(prev => prev.map(c => 
      c.id === clientId ? { ...c, paymentCollected: c.paymentCollected + amount } : c
    ));
  };

  const markClientCompleted = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setClients(prev => prev.filter(c => c.id !== clientId));
      setCustomers(prev => [...prev, {
        id: client.id,
        businessName: client.businessName,
        completedDate: new Date().toISOString().split('T')[0],
        totalPaid: client.paymentCollected
      }]);
    }
  };

  const updateGoal = (target: number, deadline: string) => {
    setGoal(prev => ({ ...prev, targetAmount: target, deadline, isAchieved: false }));
  };

  // Celebration Logic
  useEffect(() => {
    if (totalRevenue >= goal.targetAmount && !goal.isAchieved && goal.targetAmount > 0) {
      setShowCelebration(true);
      setGoal(prev => ({ ...prev, isAchieved: true, dateAchieved: new Date().toISOString().split('T')[0] }));
    }
  }, [totalRevenue, goal]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard stats={stats} />;
      case 'leads': return (
        <LeadsPage 
          leads={leads.filter(l => l.businessName.toLowerCase().includes(searchQuery.toLowerCase()))} 
          onSelect={selectLead} 
          onDelete={(id) => deleteLead(id, 'leads')}
          onUpdateComment={(id, text) => setLeads(prev => prev.map(l => l.id === id ? {...l, comment: text} : l))}
        />
      );
      case 'saved-leads': return (
        <SavedLeadsPage 
          leads={savedLeads.filter(l => l.businessName.toLowerCase().includes(searchQuery.toLowerCase()))}
          onConvert={convertToClient}
          onDelete={(id) => deleteLead(id, 'saved')}
        />
      );
      case 'clients': return (
        <ClientsPage 
          clients={clients.filter(c => c.businessName.toLowerCase().includes(searchQuery.toLowerCase()))}
          onUpdatePayment={updatePayment}
          onMarkCompleted={markClientCompleted}
        />
      );
      case 'goals': return (
        <GoalsPage 
          goal={goal} 
          currentRevenue={totalRevenue} 
          previousGoals={previousGoals} 
          onUpdateGoal={updateGoal}
        />
      );
      case 'customers': return (
        <CustomersPage 
          customers={customers.filter(c => c.businessName.toLowerCase().includes(searchQuery.toLowerCase()))}
        />
      );
      default: return <Dashboard stats={stats} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        activePage={currentPage} 
        onPageChange={setCurrentPage}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden pb-16 md:pb-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 md:px-6 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10 shrink-0">
          <div className="flex items-center flex-1 max-w-2xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={`Search ${currentPage.replace('-', ' ')}...`}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 md:space-x-4 ml-4">
            <button className="hidden md:block p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-blue-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <div className="h-8 w-8 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full flex items-center justify-center text-xs font-bold border-2 border-slate-800 shadow-lg shrink-0">
              JS
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </div>
      </main>

      {/* Celebration Overlay */}
      {showCelebration && <CelebrationOverlay onClose={() => setShowCelebration(false)} />}
    </div>
  );
};

export default App;
