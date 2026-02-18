
import React from 'react';
import { CheckCircle, ShieldCheck, Download, History } from 'lucide-react';
import { Customer } from '../types';

interface CustomersPageProps {
  customers: Customer[];
  onDownloadReport: (customer: Customer) => void;
}

const CustomersPage: React.FC<CustomersPageProps> = ({ customers, onDownloadReport }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold">Success Stories</h2>
        <p className="text-slate-400 mt-1">Clients who have successfully completed projects with us.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {customers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Date Completed</th>
                  <th className="px-6 py-4 font-semibold">Total Revenue</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                  <th className="px-6 py-4 font-semibold text-center">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
                          <ShieldCheck size={16} className="text-blue-400" />
                        </div>
                        <span className="font-semibold">{customer.businessName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {customer.completedDate}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-emerald-400">₹{customer.totalPaid.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold uppercase tracking-wider">
                        Delivered
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => onDownloadReport(customer)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Download size={18} />
                      </button>
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
