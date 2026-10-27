import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { useAuth } from '../../context/AuthContext';
import { PropertyItem, PropertyStatus, Project } from '../../types/crm';
import { Plus, Home, Filter, Search, X } from 'lucide-react';

export const InventoryModule: React.FC = () => {
  const { properties, projects, saveProperty, updatePropertyStatus, organization, showToast } = useCrm();
  const { currentUser } = useAuth();

  const [projectFilter, setProjectFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showAddModal, setShowAddModal] = useState(false);

  // New property form state
  const [code, setCode] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [areaM2, setAreaM2] = useState(550);
  const [bedrooms, setBedrooms] = useState(5);
  const [bathrooms, setBathrooms] = useState(6);
  const [price, setPrice] = useState(4500000);
  const [status, setStatus] = useState<PropertyStatus>('disponible');
  const [observations, setObservations] = useState('');

  const canManage = currentUser?.role === 'admin' || currentUser?.role === 'sales_director';

  const filteredProperties = properties.filter((p: PropertyItem) => {
    if (projectFilter !== 'todos' && p.projectId !== projectFilter) return false;
    if (statusFilter !== 'todos' && p.status !== statusFilter) return false;
    return true;
  });

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !projectId) {
      showToast('Por favor indique el código de la unidad y el proyecto.');
      return;
    }

    const selectedProject = projects.find((p: Project) => p.id === projectId);

    const newProp: PropertyItem = {
      id: `prop_${Date.now()}`,
      organizationId: organization.id,
      code: code.trim().toUpperCase(),
      projectId,
      projectName: selectedProject?.name || 'Proyecto',
      areaM2: Number(areaM2),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      price: Number(price),
      status,
      observations: observations.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveProperty(newProp);
    setShowAddModal(false);
    setCode('');
    setObservations('');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusBadge = (st: PropertyStatus) => {
    switch (st) {
      case 'disponible':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'reservado':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'vendido':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'inactivo':
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F5F2EA] p-6 border border-[#0A2F1D]/10">
        <div>
          <h2 className="text-2xl font-serif text-[#0A2F1D] font-normal">
            Inventario & Lotes Disponibles
          </h2>
          <p className="text-xs text-[#132E22]/70 font-light mt-1">
            Control de unidades físicas, lotes de terreno, estado de reserva y observaciones notariales.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#0A2F1D] text-[#FDFBF7] hover:bg-[#16432B] transition-colors"
          >
            <Plus className="w-4 h-4 text-[#C8A261]" />
            <span>Añadir Lote o Unidad</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#FDFBF7] p-4 border border-[#0A2F1D]/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block uppercase font-semibold text-[#132E22]/60 mb-1">Filtrar por Proyecto</label>
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

        <div>
          <label className="block uppercase font-semibold text-[#132E22]/60 mb-1">Filtrar por Estado</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/15 px-3 py-2 text-xs focus:outline-none"
          >
            <option value="todos">Todos los Estados ({properties.length})</option>
            <option value="disponible">Disponible</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#FDFBF7] border border-[#0A2F1D]/10 overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F5F2EA] text-[#0A2F1D] uppercase tracking-wider font-semibold border-b border-[#0A2F1D]/10">
            <tr>
              <th className="p-4">Identificador / Código</th>
              <th className="p-4">Proyecto</th>
              <th className="p-4">Superficie & Distribución</th>
              <th className="p-4">Precio Oficial</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Observaciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0A2F1D]/5">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((prop: PropertyItem) => (
                <tr key={prop.id} className="hover:bg-[#F5F2EA]/60 transition-colors">
                  
                  {/* Code */}
                  <td className="p-4 font-mono font-bold text-[#0A2F1D]">
                    {prop.code}
                  </td>

                  {/* Project */}
                  <td className="p-4 font-medium text-[#0A2F1D]">
                    {prop.projectName}
                  </td>

                  {/* Specs */}
                  <td className="p-4 text-[#132E22]/75 font-mono">
                    {prop.areaM2} m² · {prop.bedrooms} suites · {prop.bathrooms} baños
                  </td>

                  {/* Price */}
                  <td className="p-4 font-serif font-bold text-[#0A2F1D] tabular-nums">
                    {formatCurrency(prop.price)}
                  </td>

                  {/* Status Dropdown */}
                  <td className="p-4">
                    {canManage ? (
                      <select
                        value={prop.status}
                        onChange={(e) => updatePropertyStatus(prop.id, e.target.value as PropertyStatus)}
                        className={`text-[10px] uppercase font-mono px-2 py-1 border font-semibold focus:outline-none ${getStatusBadge(prop.status)}`}
                      >
                        <option value="disponible">Disponible</option>
                        <option value="reservado">Reservado</option>
                        <option value="vendido">Vendido</option>
                        <option value="inactivo">Inactivo</option>
                      </select>
                    ) : (
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 border font-semibold ${getStatusBadge(prop.status)}`}>
                        {prop.status}
                      </span>
                    )}
                  </td>

                  {/* Observations */}
                  <td className="p-4 text-[#132E22]/70 italic line-clamp-1">
                    {prop.observations || 'Sin incidencias'}
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-xs text-[#132E22]/60 italic">
                  No hay unidades con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#071E13]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] text-[#0A2F1D] max-w-lg w-full border border-[#C8A261] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#0A2F1D]/10 pb-3">
              <h3 className="text-xl font-serif text-[#0A2F1D]">Registrar Nueva Unidad de Inventario</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#0A2F1D]/40 hover:text-[#0A2F1D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Código o N.º Lote *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Ej. VILLA-MIRA-03"
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5 font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Proyecto *</label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Superficie m²</label>
                  <input
                    type="number"
                    value={areaM2}
                    onChange={(e) => setAreaM2(Number(e.target.value))}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Habitaciones</label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5"
                  />
                </div>

                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Baños</label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Precio de Venta (€) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Estado</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="reservado">Reservado</option>
                    <option value="vendido">Vendido</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Observaciones Notariales o de Obra</label>
                <textarea
                  rows={2}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Detalles sobre escrituras, hipotecas o acabados..."
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
                  Guardar en Inventario
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
