import React, { useState, useMemo } from 'react';
import { useCrm } from '../../context/CrmContext';
import { useAuth } from '../../context/AuthContext';
import { Lead, LeadStage, LEAD_STAGES, PaymentMethod, LeadChannel, CRMUser } from '../../types/crm';
import { CRMStorage } from '../../services/crmStorage';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MessageCircle, 
  Trash2, 
  Eye, 
  AlertTriangle, 
  X,
  Phone,
  Mail,
  CheckCircle2
} from 'lucide-react';

export const LeadsModule: React.FC = () => {
  const { leads, addLead, deleteLead, setSelectedLead, projects, users, organization, showToast, checkDuplicates, globalSearch } = useCrm();
  const { currentUser } = useAuth();

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('todos');
  const [projectFilter, setProjectFilter] = useState<string>('todos');
  const [advisorFilter, setAdvisorFilter] = useState<string>('todos');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Lead Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [projectId, setProjectId] = useState('');
  const [budget, setBudget] = useState(3500000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('contado');
  const [channel, setChannel] = useState<LeadChannel>('meta_ads');
  const [advisorId, setAdvisorId] = useState(users[0]?.uid || '');
  const [stage, setStage] = useState<LeadStage>('lead_nuevo');
  const [notes, setNotes] = useState('');

  // Check duplicates live in the modal
  const liveDuplicates = useMemo(() => {
    if (!phone && !email) return [];
    return checkDuplicates(phone, email);
  }, [phone, email, checkDuplicates]);

  // Combined search: module search + global search
  const effectiveSearch = (globalSearch || search).trim().toLowerCase();

  const filteredLeads = useMemo(() => {
    return leads.filter((l: Lead) => {
      if (stageFilter !== 'todos' && l.stage !== stageFilter) return false;
      if (projectFilter !== 'todos' && l.projectId !== projectFilter) return false;
      if (advisorFilter !== 'todos' && l.advisorId !== advisorFilter) return false;

      if (effectiveSearch) {
        const matchesName = l.fullName.toLowerCase().includes(effectiveSearch);
        const matchesEmail = l.email.toLowerCase().includes(effectiveSearch);
        const matchesPhone = l.phone.includes(effectiveSearch);
        const matchesProject = l.projectName?.toLowerCase().includes(effectiveSearch);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesProject) {
          return false;
        }
      }
      return true;
    });
  }, [leads, stageFilter, projectFilter, advisorFilter, effectiveSearch]);

  const handleExportCsv = () => {
    const headers = ['ID', 'Nombre', 'Telefono', 'Email', 'Etapa', 'Puntaje', 'Presupuesto', 'Forma Pago', 'Canal', 'Proyecto', 'Asesor', 'Fecha'];
    const rows = filteredLeads.map((l: Lead) => [
      l.id,
      `"${l.fullName}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      l.stage,
      l.qualificationScore,
      l.budget,
      l.paymentMethod,
      l.channel,
      `"${l.projectName || ''}"`,
      `"${l.advisorName}"`,
      l.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r: (string | number)[]) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `Prospectos_AUREA_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exportación CSV completada.');
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      showToast('Por favor complete los campos obligatorios.');
      return;
    }

    const assignedAdvisor = users.find((u: CRMUser) => u.uid === advisorId) || users[0];
    const targetProject = projects.find((p) => p.id === projectId);

    const calculatedScore = CRMStorage.calculateLeadScore({
      budget: Number(budget),
      paymentMethod,
      channel,
    });

    addLead({
      organizationId: organization.id,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      projectId: targetProject?.id,
      projectName: targetProject?.name,
      budget: Number(budget),
      paymentMethod,
      channel,
      advisorId: assignedAdvisor.uid,
      advisorName: assignedAdvisor.displayName,
      stage,
      qualificationScore: calculatedScore,
      notes: notes.trim() || undefined,
      lastContactAt: new Date().toISOString(),
    });

    setShowAddModal(false);
    // Reset form
    setFullName('');
    setPhone('');
    setEmail('');
    setNotes('');
  };

  const handleWhatsApp = (lead: Lead) => {
    const text = `Hola ${lead.fullName}, le escribe ${organization.name} para dar seguimiento a su solicitud sobre ${lead.projectName || 'nuestra cartera privada'}.`;
    const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const canDelete = currentUser?.role === 'admin' || currentUser?.role === 'sales_director';

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F5F2EA] p-6 border border-[#0A2F1D]/10">
        <div>
          <h2 className="text-2xl font-serif text-[#0A2F1D] font-normal">
            Directorio de Prospectos
          </h2>
          <p className="text-xs text-[#132E22]/70 font-light mt-1">
            Gestión completa de compradores calificados, detección de duplicados e historial de contacto.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#FDFBF7] text-[#0A2F1D] border border-[#0A2F1D]/20 hover:bg-[#EAE4D7] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#C8A261]" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#0A2F1D] text-[#FDFBF7] hover:bg-[#16432B] transition-colors"
          >
            <Plus className="w-4 h-4 text-[#C8A261]" />
            <span>Nuevo Prospecto</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#FDFBF7] p-4 border border-[#0A2F1D]/10 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#0A2F1D]/40 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo, teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/15 pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#C8A261]"
          />
        </div>

        {/* Stage Filter */}
        <div>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/15 px-3 py-2 text-xs focus:outline-none"
          >
            <option value="todos">Todas las Etapas ({leads.length})</option>
            {LEAD_STAGES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Project Filter */}
        <div>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/15 px-3 py-2 text-xs focus:outline-none"
          >
            <option value="todos">Todos los Proyectos</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Advisor Filter */}
        <div>
          <select
            value={advisorFilter}
            onChange={(e) => setAdvisorFilter(e.target.value)}
            className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/15 px-3 py-2 text-xs focus:outline-none"
          >
            <option value="todos">Todos los Asesores</option>
            {users.map((u: CRMUser) => (
              <option key={u.uid} value={u.uid}>
                {u.displayName}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Table */}
      <div className="bg-[#FDFBF7] border border-[#0A2F1D]/10 overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F5F2EA] text-[#0A2F1D] uppercase tracking-wider font-semibold border-b border-[#0A2F1D]/10">
            <tr>
              <th className="p-4">Prospecto</th>
              <th className="p-4">Contacto</th>
              <th className="p-4">Proyecto & Presupuesto</th>
              <th className="p-4">Etapa Comercial</th>
              <th className="p-4">Calificación</th>
              <th className="p-4">Asesor</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0A2F1D]/5">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead: Lead) => (
                <tr key={lead.id} className="hover:bg-[#F5F2EA]/60 transition-colors">
                  
                  {/* Lead Name */}
                  <td className="p-4">
                    <div 
                      onClick={() => setSelectedLead(lead)}
                      className="font-semibold text-[#0A2F1D] hover:text-[#C8A261] cursor-pointer"
                    >
                      {lead.fullName}
                    </div>
                    <div className="text-[10px] text-[#132E22]/50 font-mono mt-0.5">
                      Canal: {lead.channel.replace('_', ' ')} · {new Date(lead.createdAt).toLocaleDateString('es-ES')}
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="p-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-[#132E22]/80">
                      <Phone className="w-3.5 h-3.5 text-[#C8A261]" />
                      <span className="font-mono">{lead.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#132E22]/80">
                      <Mail className="w-3.5 h-3.5 text-[#C8A261]" />
                      <span>{lead.email}</span>
                    </div>
                  </td>

                  {/* Project & Budget */}
                  <td className="p-4">
                    <div className="font-medium text-[#0A2F1D]">
                      {lead.projectName || 'Sin proyecto asignado'}
                    </div>
                    <div className="text-[11px] text-[#C8A261] font-serif font-bold mt-0.5">
                      {formatCurrency(lead.budget)}
                    </div>
                  </td>

                  {/* Stage */}
                  <td className="p-4">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#0A2F1D] text-[#FDFBF7]">
                      {lead.stage.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Score */}
                  <td className="p-4 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-bold ${
                        lead.qualificationScore >= 80 ? 'text-emerald-700' : lead.qualificationScore >= 60 ? 'text-amber-700' : 'text-slate-600'
                      }`}>
                        {lead.qualificationScore}/100
                      </span>
                    </div>
                  </td>

                  {/* Advisor */}
                  <td className="p-4 text-[#132E22]/80">
                    {lead.advisorName}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleWhatsApp(lead)}
                        title="Contactar vía WhatsApp"
                        className="p-1.5 bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setSelectedLead(lead)}
                        title="Ver ficha completa"
                        className="p-1.5 bg-[#F5F2EA] text-[#0A2F1D] hover:bg-[#EAE4D7] border border-[#0A2F1D]/15 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {canDelete && (
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Desea archivar el prospecto de ${lead.fullName}?`)) {
                              deleteLead(lead.id);
                            }
                          }}
                          title="Archivar prospecto"
                          className="p-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-xs text-[#132E22]/60 italic">
                  No se encontraron prospectos con los filtros actuales.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#071E13]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] text-[#0A2F1D] max-w-xl w-full border border-[#C8A261] p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#0A2F1D]/10 pb-3">
              <h3 className="text-xl font-serif text-[#0A2F1D]">Registrar Prospecto Calificado</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#0A2F1D]/40 hover:text-[#0A2F1D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Duplicate Warning */}
            {liveDuplicates.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Advertencia de duplicado:</strong> Ya existe {liveDuplicates.map((d) => d.fullName).join(', ')} con los mismos datos de contacto.
                </div>
              </div>
            )}

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              
              <div>
                <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej. Rodrigo de la Serna"
                  className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+34 600 000 000"
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5"
                  />
                </div>

                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="cliente@holding.com"
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Proyecto de Interés</label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5"
                  >
                    <option value="">Seleccione proyecto...</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Presupuesto Estimado (€)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Forma de Pago</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5"
                  >
                    <option value="contado">Pago al Contado</option>
                    <option value="fondos_propios">Fondos Propios</option>
                    <option value="credito_hipotecario">Crédito Hipotecario</option>
                    <option value="mixto">Mixto</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Canal de Captación</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as LeadChannel)}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5"
                  >
                    <option value="meta_ads">Meta Ads (Instagram / FB)</option>
                    <option value="google">Búsqueda Google</option>
                    <option value="referido">Referido Privado</option>
                    <option value="portal_inmobiliario">Portal Especializado</option>
                    <option value="evento">Evento Privado</option>
                    <option value="directo">Contacto Directo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Asesor Responsable</label>
                  <select
                    value={advisorId}
                    onChange={(e) => setAdvisorId(e.target.value)}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5"
                  >
                    {users.map((u: CRMUser) => (
                      <option key={u.uid} value={u.uid}>
                        {u.displayName} ({u.role.replace('_', ' ')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Etapa Inicial</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as LeadStage)}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5"
                  >
                    {LEAD_STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Notas Iniciales</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Requerimientos de metros cuadrados, terrazas, timing de compra..."
                  className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#0A2F1D]/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#0A2F1D]/20 uppercase font-semibold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0A2F1D] text-[#FDFBF7] uppercase font-semibold text-xs hover:bg-[#16432B]"
                >
                  Guardar Prospecto
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
