
import React, { useState } from 'react';
import { Briefcase, CreditCard, CheckCircle, Calendar, ExternalLink, Clock, Trash2 } from 'lucide-react';
import { Client } from '../types';
import { GlowingEffect } from './ui/glowing-effect';

interface ClientsPageProps {
  clients: Client[];
  onUpdatePayment: (id: string, amount: number) => Promise<void>;
  onMarkCompleted: (id: string) => Promise<void>;
  onDeleteClient?: (id: string) => void;
}

const ClientsPage: React.FC<ClientsPageProps> = ({ clients, onUpdatePayment, onMarkCompleted, onDeleteClient }) => {
  const [paymentInput, setPaymentInput] = useState<Record<string, string>>({});

  const handlePaymentSubmit = async (clientId: string) => {
    const amount = parseFloat(paymentInput[clientId]);
    if (!isNaN(amount) && amount > 0) {
      await onUpdatePayment(clientId, amount);
      setPaymentInput(prev => ({ ...prev, [clientId]: '' }));
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl md:text-2xl font-bold">Production</h2>
        <p className="text-slate-400 text-xs md:text-sm mt-1\">The core workspace for active development. Monitor design, coding, and testing phases with real-time milestones and payment collection.</p>
      </div>

      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <GlowingEffect disabled={false} blur={12} proximity={140} spread={28} glow />
        {clients.length > 0 ? (
          <div className="overflow-x-auto scrollbar-hide relative">
            <div className="md:hidden absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-slate-950/50 to-transparent pointer-events-none" />
            
            <table className="w-full text-left min-w-212.5">
              <thead>
                <tr className="bg-slate-800/50 text-slate-400 text-[10px] md:text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Project & Client</th>
                  <th className="px-6 py-4 font-semibold">Timelines</th>
                  <th className="px-6 py-4 font-semibold">Payment Status</th>
                  <th className="px-6 py-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-100 text-sm md:text-base">{client.businessName}</div>
                      <div className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-tighter">
                        {client.businessType}
                      </div>
                      {client.cmsType && (
                        <div className="text-[9px] text-slate-400 mt-1">
                          <span className="text-slate-600">CMS:</span> {client.cmsType}
                        </div>
                      )}
                      {client.domainName && (
                        <div className="text-[9px] text-slate-400">
                          <span className="text-slate-600">Domain:</span> {client.domainName}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1.5 text-[10px] md:text-xs">
                        <div className="flex items-center text-slate-300">
                          <Calendar size={12} className="mr-2 text-slate-500 shrink-0" />
                          <span className="text-slate-500 w-16 md:w-20">Start:</span> 
                          <span className="font-medium">{client.onboarding}</span>
                        </div>
                        <div className="flex items-center text-slate-300">
                          <Clock className="mr-2 text-slate-500 shrink-0" size={12} />
                          <span className="text-slate-500 w-16 md:w-20">Deadline:</span> 
                          <span className="font-medium text-amber-400">{client.deadline}</span>
                        </div>
                        <div className="flex items-center text-slate-300">
                          <ExternalLink className="mr-2 text-slate-500 shrink-0" size={12} />
                          <span className="text-slate-500 w-16 md:w-20">Delivery:</span> 
                          <span className="font-medium">{client.delivery}</span>
                        </div>
                        {client.projectStage && (
                          <div className="flex items-center text-slate-300 mt-2 pt-1.5 border-t border-slate-700">
                            <span className="text-slate-500 w-16 md:w-20 text-[10px]">Stage:</span>
                            <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                              {client.projectStage}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="text-base md:text-lg font-bold text-emerald-400">₹{client.paymentCollected.toLocaleString()}</div>
                        <div className="flex items-center mt-2">
                          <input 
                            type="number" 
                            placeholder="+ Add"
                            className="w-16 md:w-20 bg-slate-950 border border-slate-800 rounded-lg py-1 px-2 text-[10px] md:text-xs focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 outline-none mr-1.5"
                            value={paymentInput[client.id] || ''}
                            onChange={(e) => setPaymentInput(prev => ({ ...prev, [client.id]: e.target.value }))}
                          />
                          <button 
                            onClick={() => handlePaymentSubmit(client.id)}
                            className="p-1.5 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white rounded-lg border border-emerald-500/20 transition-all active:scale-95 hover:shadow-lg hover:shadow-emerald-500/30"
                          >
                            <CreditCard size={14} />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={async () => {
                            const pendingAmount = parseFloat(paymentInput[client.id]);
                            if (!isNaN(pendingAmount) && pendingAmount > 0) {
                              await onUpdatePayment(client.id, pendingAmount);
                              setPaymentInput(prev => ({ ...prev, [client.id]: '' }));
                            }
                            await onMarkCompleted(client.id);
                          }}
                          className="flex items-center space-x-2 bg-slate-950 hover:bg-emerald-600 border border-slate-800 hover:border-emerald-500 text-slate-400 hover:text-white px-3 md:px-4 py-2 rounded-xl transition-all font-bold text-xs md:text-sm group active:scale-[0.98] hover:shadow-lg hover:shadow-emerald-500/30"
                        >
                          <CheckCircle size={16} className="text-slate-500 group-hover:text-white" />
                          <span className="whitespace-nowrap">Done</span>
                        </button>
                        <button 
                          onClick={() => onDeleteClient?.(client.id)}
                          className="flex items-center justify-center bg-slate-950 hover:bg-red-600/20 border border-slate-800 hover:border-red-500 text-slate-400 hover:text-red-400 px-3 md:px-4 py-2 rounded-xl transition-all font-bold text-xs md:text-sm active:scale-[0.98] hover:shadow-lg hover:shadow-red-500/20"
                          title="Delete client"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 md:p-20 flex flex-col items-center justify-center text-slate-500">
            <Briefcase size={40} className="mb-4 opacity-20 md:w-12 md:h-12" />
            <p className="text-base md:text-lg font-medium">No clients</p>
            <p className="text-xs md:text-sm">Convert leads to start projects.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsPage;
