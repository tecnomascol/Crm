import React, { useState, useMemo } from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { RealEstateStore } from '../../services/store';
import { Lead, LeadStatus, InterestType, UserProfile } from '../../types';
import { 
  Search, 
  Download, 
  Plus, 
  MessageCircle, 
  Trash2, 
  X, 
  Mail, 
  Phone 
} from 'lucide-react';

export const CrmLeadsTable: React.FC = () => {
  const { leads, addLead, updateLeadStatus, deleteLead, currentRole, users, brand, showToast } = useRealEstate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [advisorFilter, setAdvisorFilter] = useState<string>('todos');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Lead Form State
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newInterest, setNewInterest] = useState<InterestType>('compra');
  const [newBudget, setNewBudget] = useState('€3.5M - €5.0M');
  const [newPropertyName, setNewPropertyName] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newEstimatedValue, setNewEstimatedValue] = useState(3500000);

  const filteredLeads = useMemo(() => {
    return leads.filter((l: Lead) => {
      if (statusFilter !== 'todos' && l.status !== statusFilter) return false;
      if (advisorFilter !== 'todos' && l.assignedAdvisorId !== advisorFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          l.fullName.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.phone.toLowerCase().includes(q) ||
          (l.propertyName && l.propertyName.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [leads, statusFilter, advisorFilter, search]);

  const handleExportCsv = () => {
    const headers = ['ID', 'Nombre', 'Email', 'Telefono', 'Estado', 'Interes', 'Propiedad', 'Presupuesto', 'Valor Estimado', 'Asesor', 'Fecha'];
    const rows = filteredLeads.map((l: Lead) => [
      l.id,
      `"${l.fullName}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      l.status,
      l.interestType,
      `"${l.propertyName || ''}"`,
      `"${l.budgetRange}"`,
      l.estimatedValue || '',
      `"${l.assignedAdvisorName || ''}"`,
      l.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e: (string | number)[]) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AUREA_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exportación CSV generada con éxito');
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newEmail.trim() || !newPhone.trim()) {
      showToast('Por favor complete los campos obligatorios (*)');
      return;
    }

    addLead({
      fullName: newFullName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim(),
      interestType: newInterest,
      budgetRange: newBudget,
      propertyName: newPropertyName.trim() || undefined,
      notes: newNotes.trim() || undefined,
      estimatedValue: Number(newEstimatedValue) || 3000000,
      status: 'nuevo',
      source: 'web_landing',
      assignedAdvisorId: users[1]?.uid,
      assignedAdvisorName: users[1]?.displayName,
    });

    setShowAddModal(false);
    // Reset form
    setNewFullName('');
    setNewEmail('');
    setNewPhone('');
    setNewPropertyName('');
    setNewNotes('');
  };

  const handleWhatsApp = (lead: Lead) => {
    const text = `Hola ${lead.fullName}, le contactamos desde ${brand.brandName} para comentar su consulta sobre "${lead.propertyName || 'oportunidades residenciales'}".`;
    const url = RealEstateStore.buildWhatsAppUrl(lead.phone, text);
    window.open(url, '_blank');
  };

  const canDelete = currentRole === 'administrador' || currentRole === 'director_comercial';

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Table Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F5F2EA] p-6 border border-[#0A2F1D]/10">
        <div>
          <h2 className="text-2xl font-serif text-[#0A2F1D] font-normal">
            Directorio Central de Prospectos
          </h2>
          <p className="text-xs text-[#132E22]/70 font-light mt-1">
            Registro unificado de compradores patrimoniales, fuentes de captación e historial de cualificación.
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

      {/* Filter & Search Bar */}
      <div className="bg-[#FDFBF7] p-4 border border-[#0A2F1D]/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#0A2F1D]/40 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/15 pl-9 pr-3 py-2 text-xs text-[#0A2F1D] focus:outline-none focus:border-[#C8A261]"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/15 px-3 py-2 text-xs font-medium text-[#0A2F1D] focus:outline-none focus:border-[#C8A261]"
          >
            <option value="todos">Todos los Estados</option>
            <option value="nuevo">Nuevo</option>
            <option value="contactado">Contactado</option>
            <option value="visita_agendada">Visita Agendada</option>
            <option value="negociacion">Negociación Activa</option>
            <option value="cerrado_ganado">Cerrado Ganado</option>
          </select>
        </div>

        {/* Advisor Filter */}
        <div>
          <select
            value={advisorFilter}
            onChange={(e) => setAdvisorFilter(e.target.value)}
            className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/15 px-3 py-2 text-xs font-medium text-[#0A2F1D] focus:outline-none focus:border-[#C8A261]"
          >
            <option value="todos">Todos los Asesores</option>
            {users.map((u: UserProfile) => (
              <option key={u.uid} value={u.uid}>
                {u.displayName} ({u.role.replace('_', ' ')})
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Leads Table */}
      <div className="bg-[#FDFBF7] border border-[#0A2F1D]/10 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F5F2EA] text-[#0A2F1D] uppercase tracking-wider font-semibold border-b border-[#0A2F1D]/10">
            <tr>
              <th className="p-4">Prospecto</th>
              <th className="p-4">Contacto</th>
              <th className="p-4">Interés & Propiedad</th>
              <th className="p-4">Valor Estimado</th>
              <th className="p-4">Estado</th>
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
                    <div className="font-semibold text-[#0A2F1D]">{lead.fullName}</div>
                    <div className="text-[10px] text-[#132E22]/50 font-mono">
                      {new Date(lead.createdAt).toLocaleDateString('es-ES')} · {lead.source.replace('_', ' ')}
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="p-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-[#132E22]/80">
                      <Mail className="w-3 h-3 text-[#C8A261]" />
                      <span>{lead.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#132E22]/80">
                      <Phone className="w-3 h-3 text-[#C8A261]" />
                      <span>{lead.phone}</span>
                    </div>
                  </td>

                  {/* Property Interest */}
                  <td className="p-4">
                    <div className="font-medium text-[#0A2F1D]">
                      {lead.propertyName || 'Búsqueda Residencial'}
                    </div>
                    <div className="text-[11px] text-[#C8A261] font-semibold">
                      Presupuesto: {lead.budgetRange}
                    </div>
                  </td>

                  {/* Estimated Value */}
                  <td className="p-4 font-mono font-semibold text-[#0A2F1D]">
                    {RealEstateStore.formatPrice(lead.estimatedValue || 0)}
                  </td>

                  {/* Status Dropdown */}
                  <td className="p-4">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                      className="bg-[#F5F2EA] border border-[#0A2F1D]/15 px-2.5 py-1 text-[11px] font-medium text-[#0A2F1D] focus:outline-none"
                    >
                      <option value="nuevo">Nuevo</option>
                      <option value="contactado">Contactado</option>
                      <option value="visita_agendada">Visita Agendada</option>
                      <option value="negociacion">En Negociación</option>
                      <option value="cerrado_ganado">Cerrado Ganado</option>
                      <option value="archivado">Archivado</option>
                    </select>
                  </td>

                  {/* Assigned Advisor */}
                  <td className="p-4 text-[#132E22]/80">
                    {lead.assignedAdvisorName || 'Sin asignar'}
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

                      {canDelete && (
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Desea archivar el prospecto de ${lead.fullName}?`)) {
                              deleteLead(lead.id);
                            }
                          }}
                          title="Archivar prospecto"
                          className="p-1.5 bg-[#F5F2EA] text-red-700 hover:bg-red-100 transition-colors border border-red-200"
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
                  No se encontraron prospectos que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#071E13]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] text-[#0A2F1D] max-w-lg w-full border border-[#C8A261] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#0A2F1D]/10 pb-3">
              <h3 className="text-lg font-serif text-[#0A2F1D] font-normal">
                Registrar Nuevo Prospecto
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#0A2F1D]/50 hover:text-[#0A2F1D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Ej. Conde de Romanones"
                  className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="cliente@holding.com"
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2"
                  />
                </div>
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Teléfono *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+34 600 000 000"
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Propiedad de Interés</label>
                  <input
                    type="text"
                    value={newPropertyName}
                    onChange={(e) => setNewPropertyName(e.target.value)}
                    placeholder="Ej. Villa Miramar"
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2"
                  />
                </div>
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Valor Estimado (€)</label>
                  <input
                    type="number"
                    value={newEstimatedValue}
                    onChange={(e) => setNewEstimatedValue(Number(e.target.value))}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Notas Internas</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Canal de contacto, referencias patrimoniales..."
                  className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2"
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
                  Guardar en Base de Datos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
