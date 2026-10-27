import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { useAuth } from '../../context/AuthContext';
import { Lead, LeadStage, LEAD_STAGES } from '../../types/crm';
import { CRMStorage } from '../../services/crmStorage';
import { 
  X, 
  MessageCircle, 
  Phone, 
  Mail, 
  User, 
  Building, 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  Plus, 
  CheckCircle2, 
  Calendar,
  Send
} from 'lucide-react';

interface LeadDetailDrawerProps {
  lead: Lead | null;
  onClose: () => void;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({ lead, onClose }) => {
  const { updateLead, updateLeadStage, addLeadActivity, organization, users, checkDuplicates } = useCrm();
  const { currentUser } = useAuth();

  const [newNote, setNewNote] = useState('');
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(lead?.notes || '');

  if (!lead) return null;

  const activities = CRMStorage.getActivities(lead.id);
  const duplicates = checkDuplicates(lead.phone, lead.email, lead.id);

  const handleStageChange = (newStage: LeadStage) => {
    updateLeadStage(lead.id, newStage);
  };

  const handleSaveNotes = () => {
    updateLead(lead.id, { notes: notesText });
    setEditingNotes(false);
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addLeadActivity(lead.id, 'Nota de seguimiento', newNote.trim(), 'nota');
    setNewNote('');
  };

  const handleWhatsApp = () => {
    const text = `Hola ${lead.fullName}, le escribe ${currentUser?.displayName || 'el equipo de'} ${organization.name} respecto a su interés en ${lead.projectName || 'nuestra cartera de proyectos'}.`;
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#071E13]/70 backdrop-blur-xs flex justify-end animate-fade-in">
      <div 
        className="w-full max-w-xl bg-[#FDFBF7] text-[#0A2F1D] shadow-2xl border-l border-[#C8A261]/40 h-full flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-6 bg-[#F5F2EA] border-b border-[#0A2F1D]/10 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#0A2F1D] text-[#C8A261] font-semibold">
                ID: {lead.id}
              </span>
              <span className="text-xs text-[#132E22]/60">·</span>
              <span className="text-xs font-semibold text-[#16432B]">
                Score: {lead.qualificationScore}/100
              </span>
            </div>
            
            <h3 className="text-2xl font-serif text-[#0A2F1D] font-normal">
              {lead.fullName}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsApp}
              title="Abrir WhatsApp oficial"
              className="p-2 bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#0A2F1D]/60 hover:text-[#0A2F1D]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Potential Duplicates Warning Banner */}
          {duplicates.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Posible duplicado detectado:</strong>
                <p className="text-[11px] mt-0.5">
                  Existen {duplicates.length} registro(s) con el mismo número de teléfono o correo en el sistema ({duplicates.map((d) => d.fullName).join(', ')}).
                </p>
              </div>
            </div>
          )}

          {/* Current Commercial Stage Selector */}
          <div>
            <label className="block uppercase font-semibold text-[11px] text-[#0A2F1D] mb-1.5">
              Etapa en el Embudo Comercial
            </label>
            <select
              value={lead.stage}
              onChange={(e) => handleStageChange(e.target.value as LeadStage)}
              className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5 font-semibold text-xs text-[#0A2F1D] focus:outline-none focus:border-[#C8A261]"
            >
              {LEAD_STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Grid of Commercial Attributes */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-[#F5F2EA] border border-[#0A2F1D]/10">
            <div>
              <span className="text-[10px] uppercase text-[#132E22]/60 block font-semibold">Presupuesto</span>
              <span className="text-base font-serif font-bold text-[#0A2F1D] tabular-nums">
                {formatCurrency(lead.budget)}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase text-[#132E22]/60 block font-semibold">Forma de Pago</span>
              <span className="font-semibold text-[#0A2F1D] capitalize">
                {lead.paymentMethod.replace('_', ' ')}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase text-[#132E22]/60 block font-semibold">Proyecto de Interés</span>
              <span className="font-semibold text-[#0A2F1D]">
                {lead.projectName || 'General / Sin asignar'}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase text-[#132E22]/60 block font-semibold">Canal de Captación</span>
              <span className="font-semibold text-[#0A2F1D] uppercase font-mono text-[10px]">
                {lead.channel.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2 border-t border-[#0A2F1D]/10 pt-4">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#132E22]/60 block">
              Datos de Contacto
            </span>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#C8A261]" />
              <span className="font-mono">{lead.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#C8A261]" />
              <span>{lead.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-[#C8A261]" />
              <span>Asignado a: <strong>{lead.advisorName}</strong></span>
            </div>
          </div>

          {/* Follow-up Notes */}
          <div className="space-y-2 border-t border-[#0A2F1D]/10 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#132E22]/60">
                Notas y Requerimientos
              </span>
              <button
                onClick={() => {
                  if (editingNotes) handleSaveNotes();
                  else setEditingNotes(true);
                }}
                className="text-[11px] font-semibold text-[#0A2F1D] hover:underline"
              >
                {editingNotes ? 'Guardar' : 'Editar'}
              </button>
            </div>

            {editingNotes ? (
              <textarea
                rows={3}
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2 text-xs focus:outline-none"
              />
            ) : (
              <p className="p-3 bg-[#F5F2EA] border border-[#0A2F1D]/10 text-xs italic text-[#132E22]/80 leading-relaxed">
                {lead.notes || 'Sin notas registradas.'}
              </p>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="space-y-3 border-t border-[#0A2F1D]/10 pt-4">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#132E22]/60 block">
              Historial de Actividades e Hitos ({activities.length})
            </span>

            {/* Quick Add Note Form */}
            <form onSubmit={handleAddActivity} className="flex gap-2">
              <input
                type="text"
                placeholder="Registrar nueva llamada o nota rápida..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 bg-[#F5F2EA] border border-[#0A2F1D]/15 px-3 py-2 text-xs focus:outline-none focus:border-[#C8A261]"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-[#0A2F1D] text-[#FDFBF7] font-semibold text-xs hover:bg-[#16432B]"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* Activity Stream */}
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {activities.map((act) => (
                <div key={act.id} className="p-2.5 bg-[#F5F2EA] border border-[#0A2F1D]/10 text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-[#0A2F1D]">
                    <span>{act.title}</span>
                    <span className="text-[10px] text-[#132E22]/50 font-mono">
                      {new Date(act.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#132E22]/75 leading-relaxed">{act.description}</p>
                  <div className="text-[10px] text-[#132E22]/50">Por: {act.performedByName}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-[#F5F2EA] border-t border-[#0A2F1D]/10 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[#132E22]/60">
            Último contacto: {new Date(lead.lastContactAt).toLocaleDateString('es-ES')}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0A2F1D] text-[#FDFBF7] text-xs uppercase tracking-wider font-semibold hover:bg-[#16432B]"
          >
            Cerrar Ficha
          </button>
        </div>

      </div>
    </div>
  );
};
