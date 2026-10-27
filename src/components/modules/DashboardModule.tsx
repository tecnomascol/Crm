import React from 'react';
import { useCrm } from '../../context/CrmContext';
import { Lead, Task, Deal } from '../../types/crm';
import { 
  Users, 
  UserPlus, 
  Video, 
  TrendingUp, 
  BookmarkCheck, 
  Trophy, 
  Percent, 
  AlertCircle, 
  Clock, 
  ArrowUpRight,
  DollarSign
} from 'lucide-react';

export const DashboardModule: React.FC = () => {
  const { leads, tasks, deals, setActiveModule, setSelectedLead } = useCrm();

  const totalLeads = leads.length;
  const newLeads = leads.filter((l: Lead) => l.stage === 'lead_nuevo').length;
  const toContactLeads = leads.filter((l: Lead) => l.stage === 'lead_nuevo' || l.stage === 'contacto_calificacion').length;
  const scheduledMeetings = leads.filter((l: Lead) => l.stage === 'videollamada_agendada').length;
  const activeNegotiations = leads.filter((l: Lead) => l.stage === 'negociacion').length;
  const separations = leads.filter((l: Lead) => l.stage === 'separacion').length;
  const wonSales = leads.filter((l: Lead) => l.stage === 'ganado').length;

  const totalWonValue = deals
    .filter((d: Deal) => d.outcome === 'ganado')
    .reduce((sum: number, d: Deal) => sum + d.estimatedValue, 0);

  const activePipelineValue = deals
    .filter((d: Deal) => d.outcome === 'en_proceso')
    .reduce((sum: number, d: Deal) => sum + d.estimatedValue, 0);

  // Conversion calculations
  const meetingConversionRate = totalLeads > 0 ? Math.round(((scheduledMeetings + activeNegotiations + separations + wonSales) / totalLeads) * 100) : 0;
  const closeConversionRate = totalLeads > 0 ? Math.round((wonSales / totalLeads) * 100) : 0;

  // Tasks
  const pendingTasks = tasks.filter((t: Task) => !t.completed);
  const overdueTasks = pendingTasks.filter((t: Task) => new Date(t.dueDate).getTime() < Date.now());

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const kpis = [
    { label: 'Total Prospectos', value: totalLeads, icon: Users, sub: `${newLeads} nuevos`, color: 'text-[#0A2F1D]' },
    { label: 'Por Contactar', value: toContactLeads, icon: UserPlus, sub: 'Cualificación inicial', color: 'text-amber-700' },
    { label: 'Reuniones Agendadas', value: scheduledMeetings, icon: Video, sub: 'Videollamadas previstas', color: 'text-purple-700' },
    { label: 'Negociaciones Activas', value: activeNegotiations, icon: TrendingUp, sub: 'Ofertas formales', color: 'text-blue-700' },
    { label: 'Separaciones', value: separations, icon: BookmarkCheck, sub: 'Depósitos recibidos', color: 'text-emerald-700' },
    { label: 'Ventas Ganadas', value: wonSales, icon: Trophy, sub: formatCurrency(totalWonValue), color: 'text-[#C8A261]' },
    { label: 'Conversión a Cierre', value: `${closeConversionRate}%`, icon: Percent, sub: 'Ratio lead a escritura', color: 'text-[#0A2F1D]' },
    { label: 'Tareas Vencidas', value: overdueTasks.length, icon: AlertCircle, sub: `${pendingTasks.length} pendientes en total`, color: overdueTasks.length > 0 ? 'text-red-700' : 'text-emerald-700' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F5F2EA] p-6 border border-[#0A2F1D]/10">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#C8A261] font-semibold">
            Visión Global de Ventas
          </span>
          <h2 className="text-2xl font-serif text-[#0A2F1D] font-normal mt-1">
            Dashboard Comercial & Métricas Operativas
          </h2>
          <p className="text-xs text-[#132E22]/70 font-light mt-1">
            Rendimiento calculado en tiempo real sobre transacciones y prospectos del CRM.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveModule('kanban')}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#0A2F1D] text-[#FDFBF7] hover:bg-[#16432B] transition-colors"
          >
            Ver Embudo Kanban
          </button>
          <button
            onClick={() => setActiveModule('leads')}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#FDFBF7] text-[#0A2F1D] border border-[#0A2F1D]/20 hover:bg-[#EAE4D7] transition-colors"
          >
            Ver Prospectos
          </button>
        </div>
      </div>

      {/* KPI Grid (8 metrics required by prompt) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-[#FDFBF7] p-5 border border-[#0A2F1D]/10 space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-[#132E22]/60">
                <span className="text-[11px] uppercase tracking-wider font-semibold">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className={`text-2xl sm:text-3xl font-serif font-bold ${kpi.color} tabular-nums`}>
                {kpi.value}
              </div>
              <div className="text-[11px] text-[#132E22]/60 font-light truncate">
                {kpi.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Financial Pipeline Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="p-6 bg-[#071E13] text-[#FDFBF7] border border-[#C8A261]/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C8A261] font-semibold mb-2">
              <DollarSign className="w-4 h-4" />
              <span>Volumen Activo en Negociación</span>
            </div>
            <div className="text-3xl font-serif font-bold text-[#FDFBF7] tabular-nums mt-1">
              {formatCurrency(activePipelineValue)}
            </div>
            <p className="text-xs text-[#FDFBF7]/70 font-light mt-2 leading-relaxed">
              Valor acumulado de las oportunidades comerciales en etapas de videollamada, negociación y separación.
            </p>
          </div>

          <div className="pt-4 mt-6 border-t border-[#FDFBF7]/10 flex items-center justify-between text-xs">
            <span>Tasa de conversión a videollamada:</span>
            <strong className="text-[#C8A261] font-mono">{meetingConversionRate}%</strong>
          </div>
        </div>

        <div className="p-6 bg-[#FDFBF7] border border-[#0A2F1D]/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#0A2F1D]">
                Distribución por Etapa Comercial
              </span>
              <button
                onClick={() => setActiveModule('kanban')}
                className="text-xs text-[#C8A261] font-semibold hover:underline"
              >
                Abrir Kanban →
              </button>
            </div>

            {/* Stage Progress Breakdown */}
            <div className="space-y-2 text-xs">
              {[
                { label: 'Leads Nuevos', count: newLeads, color: 'bg-blue-600' },
                { label: 'Cualificación & Contacto', count: toContactLeads - newLeads, color: 'bg-amber-500' },
                { label: 'Videollamadas Agendadas', count: scheduledMeetings, color: 'bg-purple-600' },
                { label: 'En Negociación', count: activeNegotiations, color: 'bg-pink-600' },
                { label: 'Separación / Arras', count: separations, color: 'bg-emerald-600' },
                { label: 'Cierres Ganados', count: wonSales, color: 'bg-[#C8A261]' },
              ].map((stage, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <span className="text-[#132E22]/75 truncate">{stage.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-[#F5F2EA] h-1.5 overflow-hidden">
                      <div
                        className={`h-full ${stage.color}`}
                        style={{ width: `${totalLeads > 0 ? (stage.count / totalLeads) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="font-mono font-semibold text-[#0A2F1D] w-6 text-right tabular-nums">
                      {stage.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Two Column Grid: Urgent Tasks & Recent Prospects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Col 1: Urgent Tasks */}
        <div className="lg:col-span-6 bg-[#FDFBF7] p-6 border border-[#0A2F1D]/10 space-y-4">
          <div className="flex items-center justify-between border-b border-[#0A2F1D]/10 pb-3">
            <h3 className="text-base font-serif text-[#0A2F1D] font-normal flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C8A261]" />
              <span>Tareas Pendientes & Vencidas</span>
            </h3>
            <button
              onClick={() => setActiveModule('tasks')}
              className="text-xs font-semibold text-[#0A2F1D] hover:underline"
            >
              Ver Todas ({pendingTasks.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingTasks.slice(0, 4).map((t: Task) => (
              <div
                key={t.id}
                className="p-3 bg-[#F5F2EA] border border-[#0A2F1D]/10 text-xs flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-semibold text-[#0A2F1D]">{t.title}</div>
                  <div className="text-[11px] text-[#132E22]/60 mt-0.5">
                    Responsable: {t.assignedName} · {t.leadName || 'General'}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[9px] uppercase font-mono px-2 py-0.5 font-semibold ${
                    t.priority === 'alta' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {t.priority}
                  </span>
                  <div className="text-[10px] text-[#132E22]/60 mt-1 font-mono">
                    {new Date(t.dueDate).toLocaleDateString('es-ES')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 2: Recent Leads */}
        <div className="lg:col-span-6 bg-[#FDFBF7] p-6 border border-[#0A2F1D]/10 space-y-4">
          <div className="flex items-center justify-between border-b border-[#0A2F1D]/10 pb-3">
            <h3 className="text-base font-serif text-[#0A2F1D] font-normal flex items-center gap-2">
              <Users className="w-4 h-4 text-[#C8A261]" />
              <span>Prospectos Recientes</span>
            </h3>
            <button
              onClick={() => setActiveModule('leads')}
              className="text-xs font-semibold text-[#0A2F1D] hover:underline"
            >
              Ver Directorio ({totalLeads})
            </button>
          </div>

          <div className="space-y-2.5">
            {leads.slice(0, 4).map((lead: Lead) => (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className="p-3 bg-[#F5F2EA] hover:bg-[#EAE4D7] border border-[#0A2F1D]/10 text-xs flex items-center justify-between gap-3 cursor-pointer transition-colors"
              >
                <div>
                  <div className="font-semibold text-[#0A2F1D]">{lead.fullName}</div>
                  <div className="text-[11px] text-[#132E22]/60 mt-0.5">
                    {lead.projectName || 'Interés Residencial'} · Score: {lead.qualificationScore}/100
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#0A2F1D] text-[#FDFBF7]">
                    {lead.stage.replace('_', ' ')}
                  </span>
                  <div className="text-[11px] text-[#C8A261] font-serif font-bold mt-1">
                    {formatCurrency(lead.budget)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
