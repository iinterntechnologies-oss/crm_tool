
import React, { useState } from 'react';
import { Bookmark, Rocket, Trash2, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { Lead } from '../types';

interface SavedLeadsProps {
  leads: Lead[];
  onConvert: (lead: Lead, dates?: { startDate?: string; finishDate?: string }, specs?: any) => void;
  onDelete: (id: string) => void;
}

interface TechSpecs {
  domainName: string;
  hostingProvider: string;
  cmsType: string;
  projectStage: string;
  maintenancePlan: boolean;
  renewalDate: string;
}

const SavedLeadsPage: React.FC<SavedLeadsProps> = ({ leads, onConvert, onDelete }) => {
  const [dateOverrides, setDateOverrides] = useState<{ [key: string]: { startDate: string; finishDate: string } }>({});
  const [expandedSpecs, setExpandedSpecs] = useState<{ [key: string]: boolean }>({});
  const [techSpecs, setTechSpecs] = useState<{ [key: string]: TechSpecs }>({});

  const today = new Date().toISOString().split('T')[0];
  const defaultFinish = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const getDatesForLead = (leadId: string) =>
    dateOverrides[leadId] || { startDate: today, finishDate: defaultFinish };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold">The Vault</h2>
        <p className="text-slate-400 mt-1">A curated library of qualified prospects and past inquiries. Nurture leads that aren't ready yet but represent significant future revenue potential.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leads.length > 0 ? (
          leads.map((lead) => (
            <div key={lead.id} className="bg-space-900/40 border border-space-800/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden group shadow-xl hover:shadow-blue-500/10\">
              <div className="absolute top-0 right-0 p-3">
                <Bookmark className="h-5 w-5 text-blue-500 fill-blue-500/20" />
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-100">{lead.businessName}</h3>
                <div className="flex items-center text-slate-400 text-sm mt-1">
                  <Phone size={14} className="mr-2" />
                  {lead.contact}
                </div>
              </div>

              {lead.comment && (
                <div className="bg-slate-950 rounded-xl p-3 mb-6 border border-slate-800/50">
                  <p className="text-xs text-slate-400 italic">"{lead.comment}"</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 mb-4">
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Start Date
                    <input
                      type="date"
                      className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                      value={getDatesForLead(lead.id).startDate}
                      onChange={(e) =>
                        setDateOverrides((prev) => ({
                          ...prev,
                          [lead.id]: { ...getDatesForLead(lead.id), startDate: e.target.value }
                        }))
                      }
                    />
                  </label>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Finish Date
                    <input
                      type="date"
                      className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                      value={getDatesForLead(lead.id).finishDate}
                      onChange={(e) =>
                        setDateOverrides((prev) => ({
                          ...prev,
                          [lead.id]: { ...getDatesForLead(lead.id), finishDate: e.target.value }
                        }))
                      }
                    />
                  </label>
                </div>
              </div>

              {/* Technical Specifications Section */}
              <div className="mb-4 border-t border-slate-800 pt-4">
                <button
                  onClick={() => setExpandedSpecs(prev => ({ ...prev, [lead.id]: !prev[lead.id] }))}
                  className="flex items-center justify-between w-full text-[10px] text-slate-400 uppercase tracking-wider hover:text-slate-300 transition-colors"
                >
                  <span>Technical Specifications</span>
                  {expandedSpecs[lead.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {expandedSpecs[lead.id] && (
                  <div className="grid grid-cols-1 gap-2 mt-3">
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Domain Name
                      <input
                        type="text"
                        placeholder="example.com"
                        className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600"
                        value={techSpecs[lead.id]?.domainName || ''}
                        onChange={(e) =>
                          setTechSpecs(prev => ({
                            ...prev,
                            [lead.id]: { ...prev[lead.id] || {} as TechSpecs, domainName: e.target.value } as TechSpecs
                          }))
                        }
                      />
                    </label>

                    <label className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Hosting Provider
                      <select
                        className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                        value={techSpecs[lead.id]?.hostingProvider || ''}
                        onChange={(e) =>
                          setTechSpecs(prev => ({
                            ...prev,
                            [lead.id]: { ...prev[lead.id] || {} as TechSpecs, hostingProvider: e.target.value } as TechSpecs
                          }))
                        }
                      >
                        <option value="">Select...</option>
                        <option value="AWS">AWS</option>
                        <option value="Vercel">Vercel</option>
                        <option value="GoDaddy">GoDaddy</option>
                        <option value="Bluehost">Bluehost</option>
                        <option value="DigitalOcean">DigitalOcean</option>
                        <option value="Heroku">Heroku</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>

                    <label className="text-[10px] text-slate-500 uppercase tracking-wider">
                      CMS Type
                      <select
                        className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                        value={techSpecs[lead.id]?.cmsType || ''}
                        onChange={(e) =>
                          setTechSpecs(prev => ({
                            ...prev,
                            [lead.id]: { ...prev[lead.id] || {} as TechSpecs, cmsType: e.target.value } as TechSpecs
                          }))
                        }
                      >
                        <option value="">Select...</option>
                        <option value="WordPress">WordPress</option>
                        <option value="Next.js">Next.js</option>
                        <option value="Headless CMS">Headless CMS</option>
                        <option value="Shopify">Shopify</option>
                        <option value="Webflow">Webflow</option>
                        <option value="Wix">Wix</option>
                        <option value="Drupal">Drupal</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>

                    <label className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Project Stage
                      <select
                        className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                        value={techSpecs[lead.id]?.projectStage || 'Discovery'}
                        onChange={(e) =>
                          setTechSpecs(prev => ({
                            ...prev,
                            [lead.id]: { ...prev[lead.id] || {} as TechSpecs, projectStage: e.target.value } as TechSpecs
                          }))
                        }
                      >
                        <option value="Discovery">Discovery</option>
                        <option value="Design">Design</option>
                        <option value="Development">Development</option>
                        <option value="UAT">UAT</option>
                        <option value="Launched">Launched</option>
                      </select>
                    </label>

                    <div className="flex items-center space-x-3 pt-2">
                      <input
                        type="checkbox"
                        id={`maintenance-${lead.id}`}
                        checked={techSpecs[lead.id]?.maintenancePlan || false}
                        onChange={(e) =>
                          setTechSpecs(prev => ({
                            ...prev,
                            [lead.id]: { ...prev[lead.id] || {} as TechSpecs, maintenancePlan: e.target.checked } as TechSpecs
                          }))
                        }
                        className="rounded"
                      />
                      <label htmlFor={`maintenance-${lead.id}`} className="text-[10px] text-slate-500 uppercase tracking-wider cursor-pointer">
                        Maintenance Plan
                      </label>
                    </div>

                    {techSpecs[lead.id]?.maintenancePlan && (
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider">
                        Renewal Date
                        <input
                          type="date"
                          className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                          value={techSpecs[lead.id]?.renewalDate || ''}
                          onChange={(e) =>
                            setTechSpecs(prev => ({
                              ...prev,
                              [lead.id]: { ...prev[lead.id] || {} as TechSpecs, renewalDate: e.target.value } as TechSpecs
                            }))
                          }
                        />
                      </label>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => onConvert(lead, getDatesForLead(lead.id), techSpecs[lead.id])}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-900/30 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.98]"
                >
                  <Rocket size={16} />
                  <span>Convert to Client</span>
                </button>
                <button 
                  onClick={() => onDelete(lead.id)}
                  className="p-2.5 text-slate-500 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all hover:shadow-lg hover:shadow-slate-900/40"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500 bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl shadow-xl">
            <Bookmark size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">No saved leads</p>
            <p className="text-sm">Select leads from the main leads page to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedLeadsPage;
