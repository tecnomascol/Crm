import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { useAuth } from '../../context/AuthContext';
import { Task, CRMUser, Lead } from '../../types/crm';
import { Plus, Check, Clock, Calendar, AlertTriangle, CheckSquare, X } from 'lucide-react';

export const TasksModule: React.FC = () => {
  const { tasks, addTask, toggleTask, users, leads, deals, organization, showToast } = useCrm();
  const { currentUser } = useAuth();

  const [tab, setTab] = useState<'pendientes' | 'vencidas' | 'completadas' | 'todas'>('pendientes');
  const [priorityFilter, setPriorityFilter] = useState('todas');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [leadId, setLeadId] = useState('');
  const [assignedTo, setAssignedTo] = useState(currentUser?.uid || users[0]?.uid || '');
  const [priority, setPriority] = useState<Task['priority']>('alta');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10));

  const filteredTasks = tasks.filter((t: Task) => {
    const isOverdue = !t.completed && new Date(t.dueDate).getTime() < Date.now();

    if (tab === 'pendientes' && t.completed) return false;
    if (tab === 'vencidas' && (!isOverdue || t.completed)) return false;
    if (tab === 'completadas' && !t.completed) return false;

    if (priorityFilter !== 'todas' && t.priority !== priorityFilter) return false;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Por favor indique el título de la tarea.');
      return;
    }

    const assignedUser = users.find((u: CRMUser) => u.uid === assignedTo) || users[0];
    const relatedLead = leads.find((l: Lead) => l.id === leadId);

    addTask({
      organizationId: organization.id,
      title: title.trim(),
      description: description.trim() || undefined,
      leadId: relatedLead?.id,
      leadName: relatedLead?.fullName,
      assignedTo: assignedUser.uid,
      assignedName: assignedUser.displayName,
      dueDate: new Date(dueDate).toISOString(),
      priority,
      completed: false,
    });

    setShowAddModal(false);
    setTitle('');
    setDescription('');
  };

  const getPriorityStyle = (p: Task['priority']) => {
    switch (p) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'media':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'baja':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F5F2EA] p-6 border border-[#0A2F1D]/10">
        <div>
          <h2 className="text-2xl font-serif text-[#0A2F1D] font-normal">
            Tareas Comerciales & Citas Notariales
          </h2>
          <p className="text-xs text-[#132E22]/70 font-light mt-1">
            Programación de llamadas, videollamadas, firmas de arras y seguimiento de prospectos.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#0A2F1D] text-[#FDFBF7] hover:bg-[#16432B] transition-colors"
        >
          <Plus className="w-4 h-4 text-[#C8A261]" />
          <span>Programar Tarea</span>
        </button>
      </div>

      {/* Tabs & Priority Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FDFBF7] p-4 border border-[#0A2F1D]/10 text-xs">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-2">
          {[
            { id: 'pendientes', label: 'Pendientes' },
            { id: 'vencidas', label: 'Vencidas' },
            { id: 'completadas', label: 'Completadas' },
            { id: 'todas', label: 'Todas' },
          ].map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id as any)}
              className={`px-3 py-1.5 font-semibold uppercase tracking-wider transition-all ${
                tab === tb.id
                  ? 'bg-[#0A2F1D] text-[#FDFBF7]'
                  : 'bg-[#F5F2EA] text-[#0A2F1D] hover:bg-[#EAE4D7]'
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[#132E22]/60 uppercase font-semibold">Prioridad:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#F5F2EA] border border-[#0A2F1D]/15 px-3 py-1 text-xs focus:outline-none"
          >
            <option value="todas">Todas</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>

      </div>

      {/* Task Cards List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((t: Task) => {
            const isOverdue = !t.completed && new Date(t.dueDate).getTime() < Date.now();

            return (
              <div
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className={`p-4 bg-[#FDFBF7] border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${
                  t.completed ? 'opacity-60 bg-[#F5F2EA]/40 border-[#0A2F1D]/10' : 'border-[#0A2F1D]/15 hover:border-[#C8A261]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`mt-0.5 w-5 h-5 flex items-center justify-center border transition-colors shrink-0 ${
                      t.completed ? 'bg-[#0A2F1D] border-[#0A2F1D] text-[#FDFBF7]' : 'border-[#0A2F1D]/30 bg-[#FDFBF7]'
                    }`}
                  >
                    {t.completed && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <div>
                    <h4 className={`text-xs sm:text-sm font-semibold text-[#0A2F1D] ${t.completed ? 'line-through text-[#132E22]/50' : ''}`}>
                      {t.title}
                    </h4>

                    {t.description && (
                      <p className="text-[11px] text-[#132E22]/70 font-light mt-0.5 line-clamp-1">
                        {t.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#132E22]/60 mt-1 font-mono">
                      <span>Asignado: <strong>{t.assignedName}</strong></span>
                      {t.leadName && (
                        <>
                          <span>·</span>
                          <span>Prospecto: {t.leadName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 border font-semibold ${getPriorityStyle(t.priority)}`}>
                    {t.priority}
                  </span>

                  <div className="text-right">
                    <span className={`text-[11px] font-mono block ${isOverdue ? 'text-red-700 font-bold' : 'text-[#132E22]/70'}`}>
                      {new Date(t.dueDate).toLocaleDateString('es-ES')}
                    </span>
                    {isOverdue && (
                      <span className="text-[9px] uppercase tracking-wider text-red-600 font-semibold block">
                        Vencida
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-[#132E22]/60 italic bg-[#F5F2EA] border border-[#0A2F1D]/10">
            No hay tareas registradas en esta vista.
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#071E13]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] text-[#0A2F1D] max-w-md w-full border border-[#C8A261] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#0A2F1D]/10 pb-3">
              <h3 className="text-xl font-serif text-[#0A2F1D]">Programar Actividad Comercial</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#0A2F1D]/40 hover:text-[#0A2F1D]">
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
                  placeholder="Ej. Videollamada de presentación Baqueira"
                  className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Responsable</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5"
                  >
                    {users.map((u: CRMUser) => (
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
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5"
                  >
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Fecha de Vencimiento</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5"
                  />
                </div>

                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Vincular a Prospecto</label>
                  <select
                    value={leadId}
                    onChange={(e) => setLeadId(e.target.value)}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5"
                  >
                    <option value="">Ninguno / General</option>
                    {leads.map((l: Lead) => (
                      <option key={l.id} value={l.id}>
                        {l.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Instrucciones o Notas</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles sobre documentos a preparar..."
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
