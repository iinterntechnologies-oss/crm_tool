
import React, { useEffect, useRef, useState } from 'react';
import { FileSpreadsheet, Trash2, CheckCircle2, MessageSquare, Plus, Users } from 'lucide-react';
import { Lead } from '../types';
import { GlowingEffect } from './ui/glowing-effect';

interface LeadsPageProps {
  leads: Lead[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateComment: (id: string, text: string) => void;
  onAddLead: (lead: { businessName: string; contact: string; comment: string }) => void;
  onImportLeads: (leads: Array<{ businessName: string; contact: string; comment: string }>) => void;
  showAddLead: boolean;
  onToggleAddLead: (open: boolean) => void;
}

const LeadsPage: React.FC<LeadsPageProps> = ({
  leads,
  onSelect,
  onDelete,
  onUpdateComment,
  onAddLead,
  onImportLeads,
  showAddLead,
  onToggleAddLead
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ businessName: '', contact: '', comment: '' });

  useEffect(() => {
    if (showAddLead) {
      setIsAdding(true);
    }
  }, [showAddLead]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please upload a .csv file with columns: businessName, contact, comment');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) return;

      const rows = lines.slice(1).map((line) => line.split(',').map((cell) => cell.trim()));
      const parsed = rows
        .filter((row) => row.some((cell) => cell && cell.trim()))
        .map((row) => ({
          businessName: row[0] || '',
          contact: row[1] || '',
          comment: row[2] || ''
        }));

      if (parsed.length) {
        onImportLeads(parsed);
      }
    };
    reader.readAsText(file);
  };

  const handleAddLeadSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted with:', formData);
    onAddLead({
      businessName: formData.businessName.trim(),
      contact: formData.contact.trim(),
      comment: formData.comment.trim()
    });
    setFormData({ businessName: '', contact: '', comment: '' });
    setIsAdding(false);
    onToggleAddLead(false);
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
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-100 px-3 md:px-4 py-2 rounded-lg border border-slate-700 transition-all shrink-0 active:scale-[0.98] hover:shadow-lg hover:shadow-slate-900/40"
          >
            <FileSpreadsheet size={16} className="text-emerald-400" />
            <span className="text-xs md:text-sm font-semibold">Excel</span>
          </button>
          <button
            onClick={() => {
              setIsAdding(true);
              onToggleAddLead(true);
            }}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-900/30 active:scale-[0.98] hover:shadow-blue-500/40 hover:scale-[1.02] shrink-0"
          >
            <Plus size={16} />
            <span className="text-xs md:text-sm font-semibold whitespace-nowrap">Add Lead</span>
          </button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleAddLeadSubmit} className="relative bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl p-4 md:p-6 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
          <GlowingEffect disabled={false} blur={10} proximity={120} spread={26} glow />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Business name"
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none"
              value={formData.businessName}
              onChange={(e) => setFormData((prev) => ({ ...prev, businessName: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Contact number"
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none"
              value={formData.contact}
              onChange={(e) => setFormData((prev) => ({ ...prev, contact: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Quick comment"
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none"
              value={formData.comment}
              onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
            />
          </div>
          <div className="flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                onToggleAddLead(false);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/40 active:scale-[0.98]"
            >
              Save Lead
            </button>
          </div>
        </form>
      )}

      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <GlowingEffect disabled={false} blur={12} proximity={140} spread={28} glow />
        {leads.length > 0 ? (
          <div className="overflow-x-auto scrollbar-hide relative group">
            {/* Visual indicator for horizontal scroll on mobile */}
            <div className="md:hidden absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-slate-950/50 to-transparent pointer-events-none" />
            
            <table className="w-full text-left min-w-175">
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
                  <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-100 text-sm md:text-base">{lead.businessName}</div>
                      <div className="text-[10px] text-slate-500">ID: {lead.id}</div>
                    </td>
                    <td className="px-6 py-4 text-xs md:text-sm text-slate-300">
                      {lead.contact}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 focus-within:border-blue-500/50 transition-all min-w-37.5">
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
                          className="flex items-center space-x-1 text-[10px] font-bold uppercase bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white px-3 py-1.5 rounded-lg border border-blue-500/20 transition-all active:scale-[0.98] hover:shadow-lg hover:shadow-blue-500/30"
                          title="Save Lead"
                        >
                          <CheckCircle2 size={14} />
                          <span>Select</span>
                        </button>
                        <button 
                          onClick={() => onDelete(lead.id)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
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
            <Users size={44} className="mb-4 opacity-20 md:w-12 md:h-12" />
            <p className="text-base md:text-lg font-medium">No leads found</p>
            <p className="text-xs md:text-sm">Upload excel or add manually.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsPage;
