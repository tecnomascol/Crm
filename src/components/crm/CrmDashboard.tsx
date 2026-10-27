import React from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { RealEstateStore } from '../../services/store';
import { Lead, UserProfile, CrmTask } from '../../types';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  CheckCircle, 
  MessageCircle 
} from 'lucide-react';

export const CrmDashboard: React.FC = () => {
  const { leads, tasks, users, setCrmTab, brand } = useRealEstate();

  const totalLeads = leads.length;
  const newLeads = leads.filter((l: Lead) => l.status === 'nuevo').length;
  
  // Financial pipeline metrics
  const activePipelineValue = leads
    .filter((l: Lead) => ['contactado', 'visita_agendada', 'negociacion'].includes(l.status))
    .reduce((sum: number, l: Lead) => sum + (l.estimatedValue || 0), 0);

  const wonDealsValue = leads
    .filter((l: Lead) => l.status === 'cerrado_ganado')
    .reduce((sum: number, l: Lead) => sum + (l.estimatedValue || 0), 0);

  const closedCount = leads.filter((l: Lead) => l.status === 'cerrado_ganado').length;
  const conversionRate = totalLeads > 0 ? Math.round((closedCount / totalLeads) * 100) : 0;

  const handleWhatsApp = (lead: Lead) => {
    const text = `Hola ${lead.fullName}, le escribe ${brand.brandName} respecto a su consulta sobre "${lead.propertyName || 'nuestra cartera exclusiva'}".`;
    const url = RealEstateStore.buildWhatsAppUrl(lead.phone, text);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F5F2EA] p-6 border border-[#0A2F1D]/10">
        <div>
          <h2 className="text-2xl font-serif text-[#0A2F1D] font-normal">
            Panel Ejecutivo & Rendimiento Comercial
          </h2>
          <p className="text-xs text-[#132E22]/70 font-light mt-1">
            Supervisión integral de oportunidades patrimoniales, embudo de captación y asignación de activos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCrmTab('kanban')}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#0A2F1D] text-[#FDFBF7] hover:bg-[#16432B] transition-colors"
          >
            Abrir Embudo Kanban
          </button>
          <button
            onClick={() => setCrmTab('leads')}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#FDFBF7] text-[#0A2F1D] border border-[#0A2F1D]/20 hover:bg-[#EAE4D7] transition-colors"
          >
            Nuevo Prospecto
          </button>
        </div>
      </div>

      {/* 4 Financial & Pipeline Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-[#FDFBF7] p-6 border border-[#0A2F1D]/10">
          <div className="flex items-center justify-between text-xs text-[#132E22]/60 uppercase tracking-wider mb-2 font-medium">
            <span>Total Prospectos</span>
            <Users className="w-4 h-4 text-[#C8A261]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#0A2F1D] tabular-nums">
            {totalLeads}
          </div>
          <div className="text-xs text-[#16432B] mt-2 font-medium">
            {newLeads} pendientes de cualificación
          </div>
        </div>

        <div className="bg-[#FDFBF7] p-6 border border-[#0A2F1D]/10">
          <div className="flex items-center justify-between text-xs text-[#132E22]/60 uppercase tracking-wider mb-2 font-medium">
            <span>Pipeline en Curso</span>
            <TrendingUp className="w-4 h-4 text-[#C8A261]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#0A2F1D] tabular-nums">
            {RealEstateStore.formatPrice(activePipelineValue)}
          </div>
          <div className="text-xs text-[#132E22]/60 mt-2">
            Operaciones en negociación activa
          </div>
        </div>

        <div className="bg-[#FDFBF7] p-6 border border-[#0A2F1D]/10">
          <div className="flex items-center justify-between text-xs text-[#132E22]/60 uppercase tracking-wider mb-2 font-medium">
            <span>Operaciones Cerradas</span>
            <DollarSign className="w-4 h-4 text-[#C8A261]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#0A2F1D] tabular-nums">
            {RealEstateStore.formatPrice(wonDealsValue)}
          </div>
          <div className="text-xs text-[#16432B] mt-2 font-medium">
            {closedCount} transacciones completadas
          </div>
        </div>

        <div className="bg-[#FDFBF7] p-6 border border-[#0A2F1D]/10">
          <div className="flex items-center justify-between text-xs text-[#132E22]/60 uppercase tracking-wider mb-2 font-medium">
            <span>Tasa de Conversión</span>
            <CheckCircle className="w-4 h-4 text-[#C8A261]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#0A2F1D] tabular-nums">
            {conversionRate}%
          </div>
          <div className="text-xs text-[#132E22]/60 mt-2">
            Visitas a cierre de escrituras
          </div>
        </div>

      </div>

      {/* Two Column Layout: Recent Leads & Commercial Advisors Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Col 1: Recent Leads Table */}
        <div className="lg:col-span-7 bg-[#FDFBF7] p-6 border border-[#0A2F1D]/10">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#0A2F1D]/10">
            <h3 className="text-lg font-serif text-[#0A2F1D] font-normal">
              Prospectos Recientes
            </h3>
            <button
              onClick={() => setCrmTab('leads')}
              className="text-xs font-semibold text-[#0A2F1D] hover:text-[#C8A261] uppercase tracking-wider"
            >
              Ver Todos ({totalLeads})
            </button>
          </div>

          <div className="space-y-3">
            {leads.slice(0, 4).map((lead: Lead) => (
              <div
                key={lead.id}
                className="p-4 bg-[#F5F2EA] border border-[#0A2F1D]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#0A2F1D]">{lead.fullName}</span>
                    <span className="text-[10px] uppercase px-2 py-0.5 bg-[#0A2F1D]/10 text-[#0A2F1D] font-mono">
                      {lead.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-[#132E22]/70 mt-1">
                    {lead.propertyName || 'Interés General'} · {lead.budgetRange}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleWhatsApp(lead)}
                    className="p-2 bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors"
                    title="WhatsApp Directo"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCrmTab('kanban')}
                    className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-[#0A2F1D] text-[#FDFBF7] hover:bg-[#16432B]"
                  >
                    Gestionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 2: Advisor Performance & Upcoming Tasks */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Advisors Card */}
          <div className="bg-[#FDFBF7] p-6 border border-[#0A2F1D]/10">
            <h3 className="text-lg font-serif text-[#0A2F1D] font-normal mb-4 pb-3 border-b border-[#0A2F1D]/10">
              Desglose por Asesor Comercial
            </h3>

            <div className="space-y-4">
              {users.map((usr: UserProfile) => {
                const advisorLeads = leads.filter((l: Lead) => l.assignedAdvisorId === usr.uid);
                const advisorVolume = advisorLeads.reduce((s: number, l: Lead) => s + (l.estimatedValue || 0), 0);

                return (
                  <div key={usr.uid} className="flex items-center justify-between text-xs pb-3 border-b border-[#0A2F1D]/5 last:border-0 last:pb-0">
                    <div>
                      <div className="font-semibold text-[#0A2F1D]">{usr.displayName}</div>
                      <div className="text-[#132E22]/60 capitalize">{usr.role.replace('_', ' ')}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-semibold text-[#0A2F1D]">
                        {RealEstateStore.formatPrice(advisorVolume)}
                      </div>
                      <div className="text-[10px] text-[#132E22]/60">
                        {advisorLeads.length} leads asignados
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending Tasks Snippet */}
          <div className="bg-[#FDFBF7] p-6 border border-[#0A2F1D]/10">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#0A2F1D]/10">
              <h3 className="text-lg font-serif text-[#0A2F1D] font-normal">
                Citas & Visitas Notariales
              </h3>
              <button
                onClick={() => setCrmTab('tasks')}
                className="text-xs font-semibold text-[#0A2F1D] hover:text-[#C8A261] uppercase tracking-wider"
              >
                Ver Todas
              </button>
            </div>

            <div className="space-y-2.5">
              {tasks.filter((t: CrmTask) => !t.completed).slice(0, 3).map((task: CrmTask) => (
                <div key={task.id} className="p-3 bg-[#F5F2EA] border border-[#0A2F1D]/10 text-xs">
                  <div className="font-semibold text-[#0A2F1D] mb-1">{task.title}</div>
                  <div className="text-[#132E22]/60 flex items-center justify-between">
                    <span>Asignado a: {task.assignedName}</span>
                    <span className="text-red-700 font-semibold">{task.priority.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
