import React from 'react';
import { useCrm } from '../../context/CrmContext';
import { Lead, LeadStage, LEAD_STAGES } from '../../types/crm';
import { 
  MessageCircle, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Eye, 
  Building 
} from 'lucide-react';

export const KanbanModule: React.FC = () => {
  const { leads, updateLeadStage, setSelectedLead, organization, globalSearch } = useCrm();

  const effectiveSearch = globalSearch.trim().toLowerCase();

  const filteredLeads = effectiveSearch
    ? leads.filter((l: Lead) =>
        l.fullName.toLowerCase().includes(effectiveSearch) ||
        l.phone.includes(effectiveSearch) ||
        l.email.toLowerCase().includes(effectiveSearch) ||
        (l.projectName && l.projectName.toLowerCase().includes(effectiveSearch))
      )
    : leads;

  const moveStage = (leadId: string, currentStage: LeadStage, direction: 'forward' | 'backward') => {
    const stageIds = LEAD_STAGES.map((s) => s.id);
    const currentIndex = stageIds.indexOf(currentStage);

    if (direction === 'forward' && currentIndex < stageIds.length - 1) {
      updateLeadStage(leadId, stageIds[currentIndex + 1]);
    } else if (direction === 'backward' && currentIndex > 0) {
      updateLeadStage(leadId, stageIds[currentIndex - 1]);
    }
  };

  const handleWhatsApp = (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation();
    const text = `Hola ${lead.fullName}, le escribe ${organization.name} respecto a su avance en el proceso para ${lead.projectName || 'su adquisición inmobiliaria'}.`;
    const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F5F2EA] p-6 border border-[#0A2F1D]/10">
        <div>
          <h2 className="text-2xl font-serif text-[#0A2F1D] font-normal">
            Embudo Comercial Kanban (10 Etapas)
          </h2>
          <p className="text-xs text-[#132E22]/70 font-light mt-1">
            Transiciones de estado auditadas con fecha y usuario responsable en Cloud Firestore.
          </p>
        </div>

        <div className="text-xs text-[#132E22]/60 font-mono">
          Oportunidades en Pipeline: <strong>{filteredLeads.length}</strong>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll Container */}
      <div className="flex gap-4 overflow-x-auto pb-6 items-start">
        {LEAD_STAGES.map((stage) => {
          const stageLeads = filteredLeads.filter((l: Lead) => l.stage === stage.id);
          const stageTotal = stageLeads.reduce((sum: number, l: Lead) => sum + l.budget, 0);

          return (
            <div
              key={stage.id}
              className="bg-[#F5F2EA] border border-[#0A2F1D]/15 flex flex-col w-72 shrink-0 shadow-xs"
            >
              {/* Column Header */}
              <div 
                className="p-3 border-b border-[#0A2F1D]/10 bg-[#EAE4D7] flex flex-col justify-between"
                style={{ borderTop: `3px solid ${stage.color}` }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0A2F1D] truncate">
                    {stage.label}
                  </h3>
                  <span className="text-xs font-mono font-bold bg-[#0A2F1D] text-[#FDFBF7] px-2 py-0.5">
                    {stageLeads.length}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#0A2F1D]/70 font-medium mt-1">
                  Vol: {formatCurrency(stageTotal)}
                </div>
              </div>

              {/* Cards Container */}
              <div className="p-2.5 space-y-2.5 min-h-[500px]">
                {stageLeads.length === 0 ? (
                  <div className="text-center py-12 text-xs text-[#132E22]/40 italic">
                    Sin prospectos
                  </div>
                ) : (
                  stageLeads.map((lead: Lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="bg-[#FDFBF7] p-3.5 border border-[#0A2F1D]/10 hover:border-[#C8A261] transition-all cursor-pointer shadow-xs space-y-2.5"
                    >
                      {/* Name & WhatsApp */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold text-xs text-[#0A2F1D] leading-snug">
                            {lead.fullName}
                          </div>
                          <div className="text-[10px] text-[#132E22]/50 font-mono">
                            Score: {lead.qualificationScore}/100
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleWhatsApp(e, lead)}
                          title="WhatsApp Directo"
                          className="p-1 bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors shrink-0"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Project & Budget */}
                      <div className="text-[11px] bg-[#F5F2EA] p-1.5 border border-[#0A2F1D]/5">
                        <div className="text-[#0A2F1D] font-medium truncate">
                          {lead.projectName || 'General / Varios'}
                        </div>
                        <div className="text-[#C8A261] font-serif font-bold tabular-nums">
                          {formatCurrency(lead.budget)}
                        </div>
                      </div>

                      {/* Advisor */}
                      <div className="flex items-center justify-between text-[10px] text-[#132E22]/60">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-[#C8A261]" />
                          <span>{lead.advisorName}</span>
                        </span>
                        <span>{lead.paymentMethod.replace('_', ' ')}</span>
                      </div>

                      {/* Stage Transition Arrows */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#0A2F1D]/10 text-[10px]">
                        <button
                          disabled={stage.id === 'lead_nuevo'}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveStage(lead.id, stage.id, 'backward');
                          }}
                          className="px-2 py-1 bg-[#F5F2EA] hover:bg-[#EAE4D7] disabled:opacity-20 disabled:cursor-not-allowed text-[#0A2F1D]"
                          title="Fase anterior"
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLead(lead);
                          }}
                          className="text-[10px] text-[#0A2F1D] hover:underline font-semibold"
                        >
                          Ver Detalle
                        </button>

                        <button
                          disabled={stage.isTerminal}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveStage(lead.id, stage.id, 'forward');
                          }}
                          className="px-2 py-1 bg-[#0A2F1D] hover:bg-[#16432B] disabled:opacity-20 disabled:cursor-not-allowed text-[#FDFBF7]"
                          title="Siguiente fase"
                        >
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
