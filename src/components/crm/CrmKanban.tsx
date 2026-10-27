import React, { useState } from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { RealEstateStore } from '../../services/store';
import { Lead, LeadStatus, UserProfile } from '../../types';
import { 
  MessageCircle, 
  ChevronRight, 
  ChevronLeft, 
  Edit3, 
  User 
} from 'lucide-react';

const STAGES: { id: LeadStatus; label: string; color: string }[] = [
  { id: 'nuevo', label: '1. Nuevos Leads', color: 'border-l-4 border-l-blue-600' },
  { id: 'contactado', label: '2. Contactados', color: 'border-l-4 border-l-amber-600' },
  { id: 'visita_agendada', label: '3. Visita Agendada', color: 'border-l-4 border-l-purple-600' },
  { id: 'negociacion', label: '4. Negociación Activa', color: 'border-l-4 border-l-emerald-600' },
  { id: 'cerrado_ganado', label: '5. Cerrado / Arras', color: 'border-l-4 border-l-[#C8A261]' },
];

export const CrmKanban: React.FC = () => {
  const { leads, updateLeadStatus, updateLeadNotes, assignLeadAdvisor, users, brand } = useRealEstate();
  
  const [editingNoteLeadId, setEditingNoteLeadId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');

  const handleWhatsApp = (lead: Lead) => {
    const text = `Estimado/a ${lead.fullName}, me pongo en contacto desde ${brand.brandName} para dar seguimiento a su solicitud sobre "${lead.propertyName || 'nuestra cartera privada'}".`;
    const url = RealEstateStore.buildWhatsAppUrl(lead.phone, text);
    window.open(url, '_blank');
  };

  const handleStartEditNote = (lead: Lead) => {
    setEditingNoteLeadId(lead.id);
    setNoteContent(lead.notes || '');
  };

  const handleSaveNote = (leadId: string) => {
    updateLeadNotes(leadId, noteContent);
    setEditingNoteLeadId(null);
  };

  const moveStage = (leadId: string, currentStatus: LeadStatus, direction: 'forward' | 'backward') => {
    const stageIds: LeadStatus[] = ['nuevo', 'contactado', 'visita_agendada', 'negociacion', 'cerrado_ganado'];
    const currentIndex = stageIds.indexOf(currentStatus);
    if (direction === 'forward' && currentIndex < stageIds.length - 1) {
      updateLeadStatus(leadId, stageIds[currentIndex + 1]);
    } else if (direction === 'backward' && currentIndex > 0) {
      updateLeadStatus(leadId, stageIds[currentIndex - 1]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Board Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F5F2EA] p-6 border border-[#0A2F1D]/10">
        <div>
          <h2 className="text-2xl font-serif text-[#0A2F1D] font-normal">
            Embudo Comercial Kanban
          </h2>
          <p className="text-xs text-[#132E22]/70 font-light mt-1">
            Gestión visual del ciclo de venta, cualificación de compradores y coordinación de firmas notariadas.
          </p>
        </div>

        <div className="text-xs text-[#132E22]/60 font-mono">
          Total Oportunidades: {leads.length}
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l: Lead) => l.status === stage.id);
          const stageValue = stageLeads.reduce((s: number, l: Lead) => s + (l.estimatedValue || 0), 0);

          return (
            <div
              key={stage.id}
              className="bg-[#F5F2EA] border border-[#0A2F1D]/15 flex flex-col min-w-[260px]"
            >
              {/* Column Header */}
              <div className="p-4 bg-[#EAE4D7] border-b border-[#0A2F1D]/10 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0A2F1D]">
                    {stage.label}
                  </h3>
                  <span className="text-xs font-mono font-bold bg-[#0A2F1D] text-[#FDFBF7] px-2 py-0.5">
                    {stageLeads.length}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#0A2F1D]/70 font-medium mt-1">
                  Vol: {RealEstateStore.formatPrice(stageValue)}
                </div>
              </div>

              {/* Cards Container */}
              <div className="p-3 space-y-3 min-h-[450px]">
                {stageLeads.length === 0 ? (
                  <div className="text-center py-12 text-xs text-[#132E22]/40 italic">
                    Sin prospectos en esta fase
                  </div>
                ) : (
                  stageLeads.map((lead: Lead) => (
                    <div
                      key={lead.id}
                      className="bg-[#FDFBF7] p-4 border border-[#0A2F1D]/10 shadow-sm space-y-3 hover:border-[#C8A261] transition-colors"
                    >
                      {/* Lead Title & Value */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-semibold text-[#0A2F1D] leading-snug">
                            {lead.fullName}
                          </div>
                          <div className="text-[11px] text-[#C8A261] font-semibold mt-0.5">
                            {lead.budgetRange}
                          </div>
                        </div>

                        <button
                          onClick={() => handleWhatsApp(lead)}
                          title="Enviar WhatsApp directo"
                          className="p-1.5 bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors shrink-0"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Property Interest */}
                      <div className="text-[11px] text-[#132E22]/75 line-clamp-1 bg-[#F5F2EA] px-2 py-1 border border-[#0A2F1D]/5">
                        {lead.propertyName || 'Búsqueda Residencial'}
                      </div>

                      {/* Advisor Assignment */}
                      <div className="text-[11px] text-[#132E22]/70 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-[#C8A261]" />
                          <span>{lead.assignedAdvisorName || 'Sin asignar'}</span>
                        </span>
                        
                        <select
                          value={lead.assignedAdvisorId || ''}
                          onChange={(e) => {
                            const selectedUser = users.find((u: UserProfile) => u.uid === e.target.value);
                            if (selectedUser) {
                              assignLeadAdvisor(lead.id, selectedUser.uid, selectedUser.displayName);
                            }
                          }}
                          className="text-[10px] bg-transparent border-b border-[#0A2F1D]/20 focus:outline-none"
                        >
                          <option value="">Reasignar...</option>
                          {users.map((u: UserProfile) => (
                            <option key={u.uid} value={u.uid}>
                              {u.displayName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Notes Box / Inline Editor */}
                      <div className="pt-2 border-t border-[#0A2F1D]/10">
                        {editingNoteLeadId === lead.id ? (
                          <div className="space-y-2">
                            <textarea
                              rows={2}
                              value={noteContent}
                              onChange={(e) => setNoteContent(e.target.value)}
                              className="w-full text-[11px] p-2 bg-[#F5F2EA] border border-[#0A2F1D]/20 focus:outline-none"
                              placeholder="Añadir notas de seguimiento..."
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingNoteLeadId(null)}
                                className="px-2 py-1 text-[10px] text-[#0A2F1D]"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => handleSaveNote(lead.id)}
                                className="px-2 py-1 text-[10px] bg-[#0A2F1D] text-[#FDFBF7] font-semibold"
                              >
                                Guardar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => handleStartEditNote(lead)}
                            className="group cursor-pointer flex items-start justify-between text-[11px] text-[#132E22]/65 hover:text-[#0A2F1D]"
                          >
                            <span className="line-clamp-2 italic">
                              {lead.notes || 'Haga clic para añadir nota de seguimiento...'}
                            </span>
                            <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1 mt-0.5" />
                          </div>
                        )}
                      </div>

                      {/* Quick Move Buttons */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#0A2F1D]/10 text-[10px]">
                        <button
                          disabled={stage.id === 'nuevo'}
                          onClick={() => moveStage(lead.id, stage.id, 'backward')}
                          className="px-2 py-1 bg-[#F5F2EA] hover:bg-[#EAE4D7] disabled:opacity-30 disabled:cursor-not-allowed text-[#0A2F1D]"
                          title="Fase anterior"
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </button>

                        <span className="text-[#132E22]/50 text-[10px]">
                          {lead.source.replace('_', ' ')}
                        </span>

                        <button
                          disabled={stage.id === 'cerrado_ganado'}
                          onClick={() => moveStage(lead.id, stage.id, 'forward')}
                          className="px-2 py-1 bg-[#0A2F1D] hover:bg-[#16432B] disabled:opacity-30 disabled:cursor-not-allowed text-[#FDFBF7]"
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
