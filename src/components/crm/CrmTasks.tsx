import React, { useState } from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { CrmTask, UserProfile, Lead } from '../../types';
import { Plus, Check, X } from 'lucide-react';

export const CrmTasks: React.FC = () => {
  const { tasks, toggleTask, addTask, users, leads, showToast } = useRealEstate();

  const [filterPriority, setFilterPriority] = useState<string>('todos');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState(users[0]?.uid || '');
  const [priority, setPriority] = useState<'alta' | 'media' | 'baja'>('alta');
  const [type, setType] = useState<CrmTask['type']>('visita_presencial');
  const [leadId, setLeadId] = useState('');

  const filteredTasks = tasks.filter((t: CrmTask) => {
    if (filterPriority !== 'todos' && t.priority !== filterPriority) return false;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Por favor ingrese el título de la tarea');
      return;
    }

    const assignedUser = users.find((u: UserProfile) => u.uid === assignedTo) || users[0];
    const relatedLead = leads.find((l: Lead) => l.id === leadId);

    addTask({
      title: title.trim(),
      assignedTo: assignedUser.uid,
      assignedName: assignedUser.displayName,
      priority,
      type,
      leadId: relatedLead?.id,
      leadName: relatedLead?.fullName,
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      completed: false,
    });

    setShowAddModal(false);
    setTitle('');
  };

  const getPriorityBadge = (p: CrmTask['priority']) => {
    switch (p) {
      case 'alta':
        return 'text-red-700 bg-red-50 border border-red-200';
      case 'media':
        return 'text-amber-700 bg-amber-50 border border-amber-200';
      case 'baja':
        return 'text-emerald-700 bg-emerald-50 border border-emerald-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F5F2EA] p-6 border border-[#0A2F1D]/10">
        <div>
          <h2 className="text-2xl font-serif text-[#0A2F1D] font-normal">
            Agenda Comercial & Tareas Notariales
          </h2>
          <p className="text-xs text-[#132E22]/70 font-light mt-1">
            Programación de visitas privadas, envío de memorias técnicas y seguimiento de hitos de arras.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#0A2F1D] text-[#FDFBF7] hover:bg-[#16432B] transition-colors"
        >
          <Plus className="w-4 h-4 text-[#C8A261]" />
          <span>Nueva Tarea</span>
        </button>
      </div>

      {/* Priority Filters */}
      <div className="flex items-center gap-2 border-b border-[#0A2F1D]/10 pb-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-[#0A2F1D]/60 mr-2">
          Prioridad:
        </span>
        {['todos', 'alta', 'media', 'baja'].map((pr: string) => (
          <button
            key={pr}
            onClick={() => setFilterPriority(pr)}
            className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider capitalize ${
              filterPriority === pr
                ? 'bg-[#0A2F1D] text-[#FDFBF7]'
                : 'bg-[#F5F2EA] text-[#0A2F1D] hover:bg-[#EAE4D7]'
            }`}
          >
            {pr}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task: CrmTask) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-4 bg-[#FDFBF7] border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                task.completed ? 'border-[#0A2F1D]/10 opacity-60 bg-[#F5F2EA]/40' : 'border-[#0A2F1D]/15 hover:border-[#C8A261]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 w-5 h-5 flex items-center justify-center border transition-colors shrink-0 ${
                    task.completed ? 'bg-[#0A2F1D] border-[#0A2F1D] text-[#FDFBF7]' : 'border-[#0A2F1D]/30 bg-[#FDFBF7]'
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5" />}
                </div>

                <div>
                  <h4 className={`text-xs sm:text-sm font-semibold text-[#0A2F1D] ${task.completed ? 'line-through text-[#132E22]/50' : ''}`}>
                    {task.title}
                  </h4>
                  
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#132E22]/60 mt-1">
                    <span>Responsable: <strong>{task.assignedName}</strong></span>
                    {task.leadName && (
                      <>
                        <span>·</span>
                        <span>Prospecto: {task.leadName}</span>
                      </>
                    )}
                    <span>·</span>
                    <span>Tipo: {task.type.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 ${getPriorityBadge(task.priority)}`}>
                  {task.priority}
                </span>

                <span className="text-[11px] font-mono text-[#132E22]/60">
                  {new Date(task.dueDate).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-[#132E22]/60 italic bg-[#F5F2EA]">
            No hay tareas programadas con esta prioridad.
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#071E13]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] text-[#0A2F1D] max-w-md w-full border border-[#C8A261] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#0A2F1D]/10 pb-3">
              <h3 className="text-lg font-serif text-[#0A2F1D]">Programar Tarea Comercial</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#0A2F1D]/50 hover:text-[#0A2F1D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Título de la Tarea *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Enviar tasación pericial a notaría"
                  className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Responsable</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2"
                  >
                    {users.map((u: UserProfile) => (
                      <option key={u.uid} value={u.uid}>
                        {u.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Prioridad</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2"
                  >
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Vincular a Prospecto (Opcional)</label>
                <select
                  value={leadId}
                  onChange={(e) => setLeadId(e.target.value)}
                  className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2"
                >
                  <option value="">Ninguno / Tarea General</option>
                  {leads.map((l: Lead) => (
                    <option key={l.id} value={l.id}>
                      {l.fullName} ({l.propertyName || 'General'})
                    </option>
                  ))}
                </select>
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
                  Crear Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
