import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { useAuth } from '../../context/AuthContext';
import { Deal, LEAD_STAGES, LeadStage } from '../../types/crm';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign, 
  Building2, 
  User, 
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const DealsModule: React.FC = () => {
  const { deals, leads, projects, properties, users, saveDeal, updateDealOutcome, organization, setSelectedLead } = useCrm();
  const { currentUser } = useAuth();

  const [filterOutcome, setFilterOutcome] = useState<'todos' | 'en_proceso' | 'ganado' | 'perdido'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [formLeadId, setFormLeadId] = useState(leads[0]?.id || '');
  const [formProjectId, setFormProjectId] = useState(projects[0]?.id || '');
  const [formPropertyId, setFormPropertyId] = useState('');
  const [formEstimatedValue, setFormEstimatedValue] = useState('350000');
  const [formStage, setFormStage] = useState<LeadStage>('negociacion');
  const [formAdvisorId, setFormAdvisorId] = useState(currentUser?.uid || users[0]?.uid || '');
  const [formCloseDate, setFormCloseDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });

  const currencyFmt = (val: number) => {
    return `${organization.currencySymbol} ${Number(val).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const filteredDeals = deals.filter((d: Deal) => {
    if (filterOutcome !== 'todos' && d.outcome !== filterOutcome) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchLead = d.leadName?.toLowerCase().includes(q);
      const matchProject = d.projectName?.toLowerCase().includes(q);
      const matchAdvisor = d.advisorName?.toLowerCase().includes(q);
      const matchCode = d.propertyCode?.toLowerCase().includes(q);
      return matchLead || matchProject || matchAdvisor || matchCode;
    }
    return true;
  });

  // Calculate metrics
  const totalVolume = deals.reduce((acc: number, d: Deal) => acc + (d.estimatedValue || 0), 0);
  const activeVolume = deals
    .filter((d: Deal) => d.outcome === 'en_proceso')
    .reduce((acc: number, d: Deal) => acc + (d.estimatedValue || 0), 0);
  const wonVolume = deals
    .filter((d: Deal) => d.outcome === 'ganado')
    .reduce((acc: number, d: Deal) => acc + (d.estimatedValue || 0), 0);
  const wonCount = deals.filter((d: Deal) => d.outcome === 'ganado').length;

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    const selLead = leads.find(l => l.id === formLeadId);
    const selProject = projects.find(p => p.id === formProjectId);
    const selProp = properties.find(p => p.id === formPropertyId);
    const selAdvisor = users.find(u => u.uid === formAdvisorId);

    saveDeal({
      organizationId: organization.id,
      leadId: formLeadId,
      leadName: selLead ? selLead.fullName : 'Prospecto General',
      projectId: formProjectId,
      projectName: selProject?.name,
      propertyId: formPropertyId || undefined,
      propertyCode: selProp?.code,
      estimatedValue: parseFloat(formEstimatedValue) || 0,
      stage: formStage,
      advisorId: formAdvisorId,
      advisorName: selAdvisor ? selAdvisor.displayName : 'Asesor Asignado',
      expectedCloseDate: formCloseDate,
      outcome: 'en_proceso',
    });

    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#0A2F1D]/10 text-[#0A2F1D]">
              <Briefcase className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
              Negocios & Operaciones
            </h1>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Gestión comercial de transacciones, valor proyectado de cartera y cierres.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0A2F1D] text-white hover:bg-[#071E13] transition font-medium text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo Negocio
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-gray-500 uppercase tracking-wider">
            <span>Cartera Total</span>
            <Briefcase className="w-4 h-4 text-[#0A2F1D]" />
          </div>
          <div className="mt-2 text-2xl font-serif font-bold text-gray-900">
            {currencyFmt(totalVolume)}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {deals.length} operaciones registradas
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-amber-600 uppercase tracking-wider">
            <span>En Negociación</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-serif font-bold text-amber-700">
            {currencyFmt(activeVolume)}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {deals.filter((d: Deal) => d.outcome === 'en_proceso').length} tratos activos en curso
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-emerald-600 uppercase tracking-wider">
            <span>Ventas Ganadas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-serif font-bold text-emerald-700">
            {currencyFmt(wonVolume)}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {wonCount} operaciones concluidas con éxito
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-medium text-indigo-600 uppercase tracking-wider">
            <span>Tasa de Cierre</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-serif font-bold text-indigo-900">
            {deals.length > 0 ? `${Math.round((wonCount / deals.length) * 100)}%` : '0%'}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Ratio sobre negocios concluidos
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, proyecto, unidad o asesor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#0A2F1D]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-gray-400 mr-1" />
          {(['todos', 'en_proceso', 'ganado', 'perdido'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterOutcome(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition whitespace-nowrap ${
                filterOutcome === tab
                  ? 'bg-[#0A2F1D] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-stone-100'
              }`}
            >
              {tab === 'todos' ? 'Todos' : tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Deals Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        {filteredDeals.length === 0 ? (
          <div className="py-16 text-center">
            <Briefcase className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-serif font-bold text-gray-800">No hay negocios encontrados</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
              No existen transacciones que coincidan con los criterios seleccionados. Crea un nuevo negocio para comenzar el seguimiento.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0A2F1D] text-white text-xs font-medium hover:bg-[#071E13]"
            >
              <Plus className="w-3.5 h-3.5" />
              Crear primer negocio
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Cliente / Prospecto</th>
                  <th className="py-3 px-4">Proyecto & Unidad</th>
                  <th className="py-3 px-4">Valor Estimado</th>
                  <th className="py-3 px-4">Etapa Comercial</th>
                  <th className="py-3 px-4">Cierre Estimado</th>
                  <th className="py-3 px-4">Asesor</th>
                  <th className="py-3 px-4">Resultado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {filteredDeals.map((deal: Deal) => {
                  const stageObj = LEAD_STAGES.find(s => s.id === deal.stage);
                  const isOverdue = new Date(deal.expectedCloseDate) < new Date() && deal.outcome === 'en_proceso';

                  return (
                    <tr key={deal.id} className="hover:bg-stone-50/60 transition group">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-900 group-hover:text-[#0A2F1D] flex items-center gap-1.5">
                          {deal.leadName}
                          <button
                            title="Ver ficha de prospecto"
                            onClick={() => {
                              const found = leads.find(l => l.id === deal.leadId);
                              if (found) setSelectedLead(found);
                            }}
                            className="text-stone-400 hover:text-[#0A2F1D]"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-xs text-gray-600">ID: {deal.id.slice(0, 8)}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-gray-900 font-medium text-xs">
                          <Building2 className="w-3.5 h-3.5 text-stone-400" />
                          {deal.projectName || 'Proyecto General'}
                        </div>
                        {deal.propertyCode && (
                          <div className="text-[11px] text-[#0A2F1D] font-mono font-semibold">
                            Unidad: {deal.propertyCode}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                        {currencyFmt(deal.estimatedValue)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span 
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${stageObj?.color || '#3B82F6'}15`,
                            color: stageObj?.color || '#3B82F6'
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stageObj?.color }} />
                          {stageObj?.label.split('. ')[1] || deal.stage}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs">
                        <div className="flex items-center gap-1 text-gray-700">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {deal.expectedCloseDate}
                        </div>
                        {isOverdue && (
                          <span className="inline-block mt-0.5 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 rounded">
                            Fecha vencida
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-gray-700">
                        <div className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          {deal.advisorName}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {deal.outcome === 'ganado' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Ganado
                          </span>
                        )}
                        {deal.outcome === 'perdido' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                            <XCircle className="w-3 h-3 text-red-600" />
                            Perdido
                          </span>
                        )}
                        {deal.outcome === 'en_proceso' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-500" />
                            En proceso
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          {deal.outcome !== 'ganado' && (
                            <button
                              onClick={() => updateDealOutcome(deal.id, 'ganado')}
                              title="Marcar como Ganado"
                              className="p-1 rounded text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          {deal.outcome !== 'perdido' && (
                            <button
                              onClick={() => updateDealOutcome(deal.id, 'perdido')}
                              title="Marcar como Perdido"
                              className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          {deal.outcome !== 'en_proceso' && (
                            <button
                              onClick={() => updateDealOutcome(deal.id, 'en_proceso')}
                              title="Reabrir / En proceso"
                              className="p-1 rounded text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Crear Negocio */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-[#0A2F1D]/10 text-[#0A2F1D]">
                  <DollarSign className="w-5 h-5" />
                </span>
                <h3 className="font-serif font-bold text-lg text-gray-900">Registrar Nuevo Negocio</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Prospecto Asociado *</label>
                <select
                  value={formLeadId}
                  onChange={(e) => setFormLeadId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-200 text-xs focus:ring-1 focus:ring-[#0A2F1D]"
                  required
                >
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.fullName} — {l.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Proyecto Inmobiliario</label>
                  <select
                    value={formProjectId}
                    onChange={(e) => setFormProjectId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-200 text-xs focus:ring-1 focus:ring-[#0A2F1D]"
                  >
                    <option value="">(Sin asignar)</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Unidad / Lote</label>
                  <select
                    value={formPropertyId}
                    onChange={(e) => setFormPropertyId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-200 text-xs focus:ring-1 focus:ring-[#0A2F1D]"
                  >
                    <option value="">(Ninguna)</option>
                    {properties
                      .filter(prop => !formProjectId || prop.projectId === formProjectId)
                      .map(prop => (
                        <option key={prop.id} value={prop.id}>
                          {prop.code} ({prop.status}) - ${prop.price.toLocaleString()}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Valor Estimado ({organization.currencySymbol}) *</label>
                  <input
                    type="number"
                    value={formEstimatedValue}
                    onChange={(e) => setFormEstimatedValue(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-200 text-xs focus:ring-1 focus:ring-[#0A2F1D] font-mono"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Etapa de la Transacción</label>
                  <select
                    value={formStage}
                    onChange={(e) => setFormStage(e.target.value as LeadStage)}
                    className="w-full p-2.5 rounded-lg border border-stone-200 text-xs focus:ring-1 focus:ring-[#0A2F1D]"
                  >
                    {LEAD_STAGES.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Asesor Responsable</label>
                  <select
                    value={formAdvisorId}
                    onChange={(e) => setFormAdvisorId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-200 text-xs focus:ring-1 focus:ring-[#0A2F1D]"
                  >
                    {users.map(u => (
                      <option key={u.uid} value={u.uid}>{u.displayName} ({u.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Fecha Estimada Cierre</label>
                  <input
                    type="date"
                    value={formCloseDate}
                    onChange={(e) => setFormCloseDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-200 text-xs focus:ring-1 focus:ring-[#0A2F1D]"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-stone-200 text-gray-600 hover:bg-stone-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0A2F1D] text-white hover:bg-[#071E13] font-medium"
                >
                  Guardar Negocio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
