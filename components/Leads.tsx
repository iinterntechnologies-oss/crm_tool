
import React, { useRef } from 'react';
import { FileSpreadsheet, Trash2, CheckCircle2, MessageSquare, Plus, Users } from 'lucide-react';
import { Lead } from '../types';

interface LeadsPageProps {
  leads: Lead[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateComment: (id: string, text: string) => void;
}

const LeadsPage: React.FC<LeadsPageProps> = ({ leads, onSelect, onDelete, onUpdateComment }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      alert(`Successfully uploaded: ${e.target.files[0].name} (Mocked data added)`);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Leads</h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Qualify your potential opportunities.</p>
        </div>
        <div className="flex space-x-2 md:space-x-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".csv, .xlsx, .xls"
          />
          <button 
            onClick={handleUploadClick}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-100 px-3 md:px-4 py-2 rounded-lg border border-slate-700 transition-all shrink-0 active:scale-[0.98]"
          >
            <FileSpreadsheet size={16} className="text-emerald-400" />
            <span className="text-xs md:text-sm font-semibold">Excel</span>
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] shrink-0">
            <Plus size={16} />
            <span className="text-xs md:text-sm font-semibold whitespace-nowrap">Add Lead</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {leads.length > 0 ? (
          <div className="overflow-x-auto scrollbar-hide relative group">
            {/* Visual indicator for horizontal scroll on mobile */}
            <div className="md:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-950/50 to-transparent pointer-events-none" />
            
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-slate-800/50 text-slate-400 text-[10px] md:text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Business Name</th>
                  <th className="px-6 py-4 font-semibold">Mobile Number</th>
                  <th className="px-6 py-4 font-semibold">Quick Comment</th>
                  <th className="px-6 py-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-100 text-sm md:text-base">{lead.businessName}</div>
                      <div className="text-[10px] text-slate-500">ID: {lead.id}</div>
                    </td>
                    <td className="px-6 py-4 text-xs md:text-sm text-slate-300">
                      {lead.contact}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 focus-within:border-blue-500/50 transition-all min-w-[150px]">
                        <MessageSquare size={14} className="text-slate-500 mr-2 shrink-0" />
                        <input 
                          type="text" 
                          placeholder="Note..."
                          className="bg-transparent border-none outline-none text-[10px] md:text-xs text-slate-300 w-full"
                          value={lead.comment}
                          onChange={(e) => onUpdateComment(lead.id, e.target.value)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2 md:space-x-3">
                        <button 
                          onClick={() => onSelect(lead.id)}
                          className="flex items-center space-x-1 text-[10px] font-bold uppercase bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white px-3 py-1.5 rounded-lg border border-blue-500/20 transition-all active:scale-[0.98]"
                          title="Save Lead"
                        >
                          <CheckCircle2 size={14} />
                          <span>Select</span>
                        </button>
                        <button 
                          onClick={() => onDelete(lead.id)}
                          className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                          title="Delete Lead"
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
            <Users size={40} className="mb-4 opacity-20 md:w-12 md:h-12" />
            <p className="text-base md:text-lg font-medium">No leads found</p>
            <p className="text-xs md:text-sm">Upload excel or add manually.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsPage;
