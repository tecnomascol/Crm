import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { useAuth } from '../../context/AuthContext';
import { Project } from '../../types/crm';
import { Plus, Building2, MapPin, Layers, X } from 'lucide-react';

export const ProjectsModule: React.FC = () => {
  const { projects, saveProject, organization, showToast } = useCrm();
  const { currentUser } = useAuth();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<Project['type']>('villas');
  const [areaM2, setAreaM2] = useState(500);
  const [priceFrom, setPriceFrom] = useState(3000000);
  const [priceTo, setPriceTo] = useState(6000000);
  const [status, setStatus] = useState<Project['status']>('preventa');
  const [totalUnits, setTotalUnits] = useState(8);
  const [availableUnits, setAvailableUnits] = useState(4);
  const [description, setDescription] = useState('');
  const [galleryUrl, setGalleryUrl] = useState('/src/assets/images/hero_luxury_villa_1793066039194.jpg');

  const canManage = currentUser?.role === 'admin' || currentUser?.role === 'sales_director';

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) {
      showToast('Por favor indique nombre y ubicación.');
      return;
    }

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      organizationId: organization.id,
      name: name.trim(),
      description: description.trim() || 'Desarrollo residencial de arquitectura de autor.',
      location: location.trim(),
      type,
      areaM2: Number(areaM2),
      priceFrom: Number(priceFrom),
      priceTo: Number(priceTo) || undefined,
      status,
      galleryUrls: [galleryUrl],
      totalUnits: Number(totalUnits),
      availableUnits: Number(availableUnits),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveProject(newProject);
    setShowAddModal(false);
    setName('');
    setLocation('');
    setDescription('');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F5F2EA] p-6 border border-[#0A2F1D]/10">
        <div>
          <h2 className="text-2xl font-serif text-[#0A2F1D] font-normal">
            Proyectos & Masterplans Inmobiliarios
          </h2>
          <p className="text-xs text-[#132E22]/70 font-light mt-1">
            Administración de desarrollos residenciales, estado de obra y disponibilidad de unidades.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#0A2F1D] text-[#FDFBF7] hover:bg-[#16432B] transition-colors"
          >
            <Plus className="w-4 h-4 text-[#C8A261]" />
            <span>Nuevo Proyecto</span>
          </button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((proj: Project) => (
          <div
            key={proj.id}
            className="bg-[#FDFBF7] border border-[#0A2F1D]/10 overflow-hidden flex flex-col justify-between shadow-xs hover:border-[#C8A261] transition-all"
          >
            {/* Visual Media */}
            <div className="relative aspect-[16/10] bg-[#0A2F1D]/10">
              <img
                src={proj.galleryUrls[0] || '/src/assets/images/hero_luxury_villa_1793066039194.jpg'}
                alt={proj.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-[#071E13]/85 text-[#FDFBF7] px-2.5 py-1 text-[10px] uppercase font-mono">
                {proj.status.replace('_', ' ')}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#C8A261] uppercase tracking-wider font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{proj.location}</span>
                </div>

                <h3 className="text-lg font-serif font-semibold text-[#0A2F1D] mt-1">
                  {proj.name}
                </h3>

                <p className="text-xs text-[#132E22]/75 font-light leading-relaxed mt-2 line-clamp-2">
                  {proj.description}
                </p>
              </div>

              {/* Units & Pricing */}
              <div className="pt-3 border-t border-[#0A2F1D]/10 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#132E22]/60">Disponibilidad:</span>
                  <span className="font-semibold text-[#0A2F1D]">
                    {proj.availableUnits} de {proj.totalUnits} unidades
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-[#132E22]/60">Rango de Precios:</span>
                  <span className="font-serif font-bold text-[#C8A261] tabular-nums">
                    Desde {formatCurrency(proj.priceFrom)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#071E13]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] text-[#0A2F1D] max-w-lg w-full border border-[#C8A261] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#0A2F1D]/10 pb-3">
              <h3 className="text-xl font-serif text-[#0A2F1D]">Registrar Nuevo Desarrollo</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#0A2F1D]/40 hover:text-[#0A2F1D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Nombre del Proyecto *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Mirador de la Caleta"
                  className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Ubicación *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej. Costa Brava, Girona"
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5"
                  />
                </div>

                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Tipología</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5"
                  >
                    <option value="villas">Villas de Autor</option>
                    <option value="vertical">Vertical / Áticos</option>
                    <option value="residencial_lujo">Residencial de Lujo</option>
                    <option value="lotes_campestres">Lotes Campestres</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Precio Desde (€)</label>
                  <input
                    type="number"
                    value={priceFrom}
                    onChange={(e) => setPriceFrom(Number(e.target.value))}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Unidades Totales</label>
                  <input
                    type="number"
                    value={totalUnits}
                    onChange={(e) => setTotalUnits(Number(e.target.value))}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5"
                  />
                </div>
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Disponibles</label>
                  <input
                    type="number"
                    value={availableUnits}
                    onChange={(e) => setAvailableUnits(Number(e.target.value))}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles sobre arquitectura, licencias y entrega..."
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
                  Guardar Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
