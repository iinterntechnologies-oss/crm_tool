
import React, { useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
import { authApi, clientsApi, customersApi, goalsApi, leadsApi } from './api';



const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAddLead, setShowAddLead] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentGoalId, setCurrentGoalId] = useState<string | null>(null);
  
  // App State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [savedLeads, setSavedLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [previousGoals, setPreviousGoals] = useState<Goal[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const demoEmail = import.meta.env.VITE_DEMO_EMAIL || 'demo@pulse.app';
  const demoPassword = import.meta.env.VITE_DEMO_PASSWORD || 'demo1234';

  // Derived Values
  const totalRevenue = useMemo(() => 
    clients.reduce((acc, c) => acc + c.paymentCollected, 0) + 
    customers.reduce((acc, c) => acc + c.totalPaid, 0),
    [clients, customers]
  );
  const successfulRevenue = useMemo(() =>
    customers.reduce((acc, c) => acc + c.totalPaid, 0),
    [customers]
  );
  const successfulClients = customers.length;

  const stats = useMemo(() => ({
    totalLeads: leads.length + savedLeads.length,
    activeProjects: clients.length,
    revenue: totalRevenue,
    deadlines: clients.filter(c => new Date(c.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length
  }), [leads, savedLeads, clients, totalRevenue]);

  const requireToken = () => {
    if (!token) throw new Error('Not authenticated');
    return token;
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const loadAllData = async (activeToken: string) => {
    const [loadedLeads, loadedClients, loadedCustomers, loadedGoals] = await Promise.all([
      leadsApi.list(activeToken),
      clientsApi.list(activeToken),
      customersApi.list(activeToken),
      goalsApi.list(activeToken)
    ]);

    setLeads(loadedLeads.filter((lead) => lead.status !== 'saved'));
    setSavedLeads(loadedLeads.filter((lead) => lead.status === 'saved'));
    setClients(loadedClients);
    setCustomers(loadedCustomers);

    if (loadedGoals.length > 0) {
      setGoal(loadedGoals[0]);
      setCurrentGoalId(loadedGoals[0].id);
      setPreviousGoals(loadedGoals.slice(1));
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        let activeToken: string;
        try {
          activeToken = await authApi.login(demoEmail, demoPassword);
        } catch (error) {
          await authApi.register(demoEmail, demoPassword);
          activeToken = await authApi.login(demoEmail, demoPassword);
        }
        setToken(activeToken);
        await loadAllData(activeToken);
        setErrorMessage('');
      } catch (error) {
        console.error('Initialization error:', error);
        setErrorMessage('Unable to connect to the API. Check the backend and database settings.');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [demoEmail, demoPassword]);

  // Handlers
  const selectLead = async (leadId: string) => {
    try {
      const lead = leads.find(l => l.id === leadId);
      if (!lead) return;
      const updated = await leadsApi.update(leadId, { ...lead, status: 'saved' }, requireToken());
      setLeads(prev => prev.filter(l => l.id !== leadId));
      setSavedLeads(prev => [...prev, updated]);
      setErrorMessage('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save lead';
      console.error('Select lead error:', error);
      setErrorMessage(message);
    }
  };

  const deleteLead = async (leadId: string, from: 'leads' | 'saved') => {
    try {
      await leadsApi.remove(leadId, requireToken());
      if (from === 'leads') setLeads(prev => prev.filter(l => l.id !== leadId));
      else setSavedLeads(prev => prev.filter(l => l.id !== leadId));
      setErrorMessage('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete lead';
      console.error('Delete lead error:', error);
      setErrorMessage(message);
    }
  };

  const deleteCustomer = async (customerId: string) => {
    try {
      await customersApi.remove(customerId, requireToken());
      setCustomers(prev => prev.filter(c => c.id !== customerId));
      setErrorMessage('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete customer';
      console.error('Delete customer error:', error);
      setErrorMessage(message);
    }
  };

  const updateCustomer = async (customerId: string, updates: Partial<Customer>) => {
    try {
      const updated = await customersApi.update(customerId, updates, requireToken());
      setCustomers(prev => prev.map(c => c.id === customerId ? updated : c));
      setErrorMessage('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update customer';
      console.error('Update customer error:', error);
      setErrorMessage(message);
    }
  };

  const deleteClient = async (clientId: string) => {
    try {
      await clientsApi.remove(clientId, requireToken());
      setClients(prev => prev.filter(c => c.id !== clientId));
      setErrorMessage('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete client';
      console.error('Delete client error:', error);
      setErrorMessage(message);
    }
  };

  const addLead = async (payload: { businessName: string; contact: string; comment: string }) => {
    try {
      const token = requireToken();
      const created = await leadsApi.create({ ...payload, status: 'new' }, token);
      setLeads(prev => [created, ...prev]);
      setErrorMessage('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add lead';
      console.error('Add lead error:', error);
      setErrorMessage(message);
    }
  };

  const importLeads = async (payloads: Array<{ businessName: string; contact: string; comment: string }>) => {
    try {
      const token = requireToken();
      const created = await Promise.all(payloads.map((payload) =>
        leadsApi.create({ ...payload, status: 'new' }, token)
      ));
      setLeads(prev => [...created, ...prev]);
      setErrorMessage('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to import leads';
      console.error('Import leads error:', error);
      setErrorMessage(message);
    }
  };

  const updateLeadComment = async (id: string, text: string) => {
    try {
      const lead = leads.find(l => l.id === id) || savedLeads.find(l => l.id === id);
      if (!lead) return;
      const updated = await leadsApi.update(id, { ...lead, comment: text }, requireToken());
      if (lead.status === 'saved') {
        setSavedLeads(prev => prev.map(l => l.id === id ? updated : l));
      } else {
        setLeads(prev => prev.map(l => l.id === id ? updated : l));
      }
      setErrorMessage('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update lead comment';
      console.error('Update lead comment error:', error);
      setErrorMessage(message);
    }
  };

  const convertToClient = async (lead: Lead, dates?: { startDate?: string; finishDate?: string }) => {
    try {
      const token = requireToken();
      const startDate = dates?.startDate || new Date().toISOString().split('T')[0];
      const finishDate = dates?.finishDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const newClient: Client = {
        id: uuidv4(),
        businessName: lead.businessName,
        businessType: 'Web Design',
        contact: lead.contact,
        onboarding: startDate,
        deadline: finishDate,
        delivery: 'In Progress',
        paymentCollected: 0,
        isCompleted: false
      };
      await leadsApi.remove(lead.id, token);
      const createdClient = await clientsApi.create(newClient, token);
      setSavedLeads(prev => prev.filter(l => l.id !== lead.id));
      setClients(prev => [...prev, createdClient]);
      setErrorMessage('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to convert lead to client';
      if (message.toLowerCase().includes('lead not found')) {
        setSavedLeads(prev => prev.filter(l => l.id !== lead.id));
        setErrorMessage('Lead already removed. Refreshing list.');
        refreshData();
        return;
      }
      console.error('Convert lead error:', error);
      setErrorMessage(message);
    }
  };

  const updatePayment = async (clientId: string, amount: number) => {
    try {
      const client = clients.find(c => c.id === clientId);
      if (!client) return;
      const nextPayment = Number((client.paymentCollected + amount).toFixed(2));
      setClients(prev => prev.map(c => c.id === clientId ? { ...c, paymentCollected: nextPayment } : c));
      const updated = await clientsApi.updatePayment(clientId, nextPayment, requireToken());
      setClients(prev => prev.map(c => c.id === clientId ? updated : c));
      setErrorMessage('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update payment';
      if (message.toLowerCase().includes('client not found')) {
        setClients(prev => prev.filter(c => c.id !== clientId));
        setErrorMessage('Client already removed. Refreshing list.');
        refreshData();
        return;
      }
      console.error('Update payment error:', error);
      setErrorMessage(message);
    }
  };

  const markClientCompleted = async (clientId: string) => {
    try {
      const token = requireToken();
      const client = clients.find(c => c.id === clientId);
      if (!client) return;
      await clientsApi.remove(clientId, token);
      const customer = await customersApi.create({
        businessName: client.businessName,
        completedDate: client.deadline || new Date().toISOString().split('T')[0],
        totalPaid: client.paymentCollected
      }, token);
      setClients(prev => prev.filter(c => c.id !== clientId));
      setCustomers(prev => [customer, ...prev]);
      setErrorMessage('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to complete client';
      if (message.toLowerCase().includes('client not found')) {
        setClients(prev => prev.filter(c => c.id !== clientId));
        setErrorMessage('Client already removed. Refreshing list.');
        refreshData();
        return;
      }
      console.error('Mark client completed error:', error);
      setErrorMessage(message);
    }
  };

  const updateGoal = async (title: string, target: number, deadline: string) => {
    try {
      if (currentGoalId && goal) {
        const updated = await goalsApi.update(currentGoalId, { ...goal, title, targetAmount: target, deadline, isAchieved: false }, requireToken());
        setGoal(updated);
      } else {
        const newGoal: Goal = {
          id: '',
          title,
          targetAmount: target,
          deadline,
          dateStarted: new Date().toISOString().split('T')[0],
          isAchieved: false
        };
        const created = await goalsApi.create(newGoal, requireToken());
        setGoal(created);
        setCurrentGoalId(created.id);
      }
    } catch (error) {
      setErrorMessage('Failed to update goal.');
    }
  };

  const refreshData = async () => {
    try {
      const activeToken = requireToken();
      setIsLoading(true);
      await loadAllData(activeToken);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to sync contacts.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveAllLeads = async () => {
    const leadsToSave = [...leads];
    if (!leadsToSave.length) return;

    try {
      const activeToken = requireToken();
      setIsLoading(true);
      const results = await Promise.allSettled(
        leadsToSave.map((lead) => leadsApi.update(lead.id, { ...lead, status: 'saved' }, activeToken))
      );
      const saved: Lead[] = [];
      let failed = 0;
      results.forEach((result) => {
        if (result.status === 'fulfilled') saved.push(result.value);
        else failed += 1;
      });
      if (saved.length) {
        const savedIds = new Set(saved.map((lead) => lead.id));
        setLeads((prev) => prev.filter((lead) => !savedIds.has(lead.id)));
        setSavedLeads((prev) => [...saved, ...prev]);
      }
      if (failed) {
        setErrorMessage(`Saved ${saved.length} leads, ${failed} failed.`);
      }
    } catch (error) {
      setErrorMessage('Failed to save all leads.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = () => {
    const payload = {
      leads: [...leads, ...savedLeads],
      clients,
      customers,
      goal,
      previousGoals
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'crm-report.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadCustomerReport = (customer: Customer) => {
    const csv = [
      'Business Name,Completed Date,Total Paid',
      `${customer.businessName},${customer.completedDate},${customer.totalPaid}`
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customer-${customer.id}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Celebration Logic
  useEffect(() => {
    if (goal && token && totalRevenue >= goal.targetAmount && !goal.isAchieved && goal.targetAmount > 0) {
      setShowCelebration(true);
      const updatedGoal = { ...goal, isAchieved: true, dateAchieved: new Date().toISOString().split('T')[0] };
      setGoal(updatedGoal);
      if (currentGoalId) {
        goalsApi.update(currentGoalId, updatedGoal, token).catch(() => {
          setErrorMessage('Failed to update goal achievement status.');
        });
      }
    }
  }, [totalRevenue, goal, token, currentGoalId]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return (
        <Dashboard
          stats={stats}
          clients={clients}
          customers={customers}
          onCreateLead={() => {
            setCurrentPage('leads');
            setShowAddLead(true);
          }}
          onSaveAllLeads={saveAllLeads}
          onGenerateReport={downloadReport}
          onSyncContacts={refreshData}
          onDeleteCustomer={deleteCustomer}
        />
      );
      case 'leads': return (
        <LeadsPage 
          leads={leads.filter(l => (l.businessName || '').toLowerCase().includes(searchQuery.toLowerCase()))} 
          onSelect={selectLead} 
          onDelete={(id) => deleteLead(id, 'leads')}
          onUpdateComment={updateLeadComment}
          onAddLead={addLead}
          onImportLeads={importLeads}
          showAddLead={showAddLead}
          onToggleAddLead={setShowAddLead}
        />
      );
      case 'saved-leads': return (
        <SavedLeadsPage 
          leads={savedLeads.filter(l => (l.businessName || '').toLowerCase().includes(searchQuery.toLowerCase()))}
          onConvert={convertToClient}
          onDelete={(id) => deleteLead(id, 'saved')}
        />
      );
      case 'clients': return (
        <ClientsPage 
          clients={clients.filter(c => (c.businessName || '').toLowerCase().includes(searchQuery.toLowerCase()))}
          onUpdatePayment={updatePayment}
          onMarkCompleted={markClientCompleted}
          onDeleteClient={deleteClient}
        />
      );
      case 'goals': return goal ? (
        <GoalsPage 
          goal={goal} 
          currentRevenue={successfulRevenue} 
          successfulClients={successfulClients}
          successfulRevenue={successfulRevenue}
          previousGoals={previousGoals} 
          onUpdateGoal={updateGoal}
        />
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h2 className="text-2xl font-bold">Agency Goals</h2>
            <p className="text-slate-400 mt-1">Track your growth and celebrate your wins.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center py-20">
            <Target size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">No goals yet</p>
            <p className="text-slate-400 mt-2">Create a goal to get started tracking your growth.</p>
          </div>
        </div>
      );
      case 'customers': return (
        <CustomersPage 
          customers={customers.filter(c => (c.businessName || '').toLowerCase().includes(searchQuery.toLowerCase()))}
          onDownloadReport={downloadCustomerReport}
          onDeleteCustomer={deleteCustomer}
          onUpdateCustomer={updateCustomer}
        />
      );
      default: return (
        <Dashboard
          stats={stats}
          clients={clients}
          customers={customers}
          onCreateLead={() => {
            setCurrentPage('leads');
            setShowAddLead(true);
          }}
          onSaveAllLeads={saveAllLeads}
          onGenerateReport={downloadReport}
          onSyncContacts={refreshData}
          onDeleteCustomer={deleteCustomer}
        />
      );
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
            <div className="h-8 w-8 bg-linear-to-tr from-blue-600 to-cyan-400 rounded-full flex items-center justify-center text-xs font-bold border-2 border-slate-800 shadow-lg shrink-0">
              JS
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {errorMessage && (
              <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-200 px-4 py-3 text-sm">
                {errorMessage}
              </div>
            )}
            {isLoading && (
              <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 px-4 py-3 text-sm">
                Syncing CRM data...
              </div>
            )}
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
