
import React, { useState } from 'react';
import { CheckCircle, ShieldCheck, Download, History, Trash2, Edit2, Save, X } from 'lucide-react';
import { Customer } from '../types';

interface CustomersPageProps {
  customers: Customer[];
  onDownloadReport: (customer: Customer) => void;
  onDeleteCustomer?: (id: string) => void;
  onUpdateCustomer?: (id: string, updates: Partial<Customer>) => void;
}

const CustomersPage: React.FC<CustomersPageProps> = ({ customers, onDownloadReport, onDeleteCustomer, onUpdateCustomer }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ businessName: string; completedDate: string; totalPaid: string } | null>(null);

  const startEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setDraft({
      businessName: customer.businessName,
      completedDate: customer.completedDate,
      totalPaid: customer.totalPaid.toString()
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
  };

  const saveEdit = (customerId: string) => {
    if (!draft) return;
    const totalPaid = parseFloat(draft.totalPaid);
    onUpdateCustomer?.(customerId, {
      businessName: draft.businessName,
      completedDate: draft.completedDate,
      totalPaid: Number.isNaN(totalPaid) ? 0 : totalPaid
    });
    cancelEdit();
  };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold">Success Stories</h2>
        <p className="text-slate-400 mt-1">Clients who have successfully completed projects with us.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {customers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Date Completed</th>
                  <th className="px-6 py-4 font-semibold">Total Revenue</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                  <th className="px-6 py-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
                          <ShieldCheck size={16} className="text-blue-400" />
                        </div>
                        {editingId === customer.id ? (
                          <input
                            type="text"
                            className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 outline-none"
                            value={draft?.businessName || ''}
                            onChange={(e) => setDraft((prev) => prev ? { ...prev, businessName: e.target.value } : prev)}
                          />
                        ) : (
                          <span className="font-semibold">{customer.businessName}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {editingId === customer.id ? (
                        <input
                          type="date"
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 outline-none"
                          value={draft?.completedDate || ''}
                          onChange={(e) => setDraft((prev) => prev ? { ...prev, completedDate: e.target.value } : prev)}
                        />
                      ) : (
                        customer.completedDate
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === customer.id ? (
                        <input
                          type="number"
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-sm text-slate-100 w-28 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 outline-none"
                          value={draft?.totalPaid || ''}
                          onChange={(e) => setDraft((prev) => prev ? { ...prev, totalPaid: e.target.value } : prev)}
                        />
                      ) : (
                        <div className="font-bold text-emerald-400">₹{customer.totalPaid.toLocaleString()}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold uppercase tracking-wider">
                        Delivered
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {editingId === customer.id ? (
                          <>
                            <button
                              onClick={() => saveEdit(customer.id)}
                              className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 rounded-lg transition-colors hover:shadow-lg hover:shadow-emerald-500/20"
                              title="Save"
                            >
                              <Save size={18} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEdit(customer)}
                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors hover:shadow-lg hover:shadow-blue-500/20"
                            title="Edit customer"
                          >
                            <Edit2 size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => onDownloadReport(customer)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors hover:shadow-lg"
                          title="Download report"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => onDeleteCustomer?.(customer.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors hover:shadow-lg hover:shadow-red-500/20"
                          title="Delete customer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 flex flex-col items-center justify-center text-slate-500">
            <History size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">No customers yet</p>
            <p className="text-sm">When projects are marked completed, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;
