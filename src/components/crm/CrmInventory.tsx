import React, { useState } from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { RealEstateStore } from '../../services/store';
import { Property, PropertyStatus, PropertyType } from '../../types';
import { Plus, Eye, X } from 'lucide-react';

export const CrmInventory: React.FC = () => {
  const { properties, saveProperty, updatePropertyStatus, setSelectedProperty, showToast } = useRealEstate();
  
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Property form state
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [zone, setZone] = useState('');
  const [price, setPrice] = useState(4000000);
  const [propertyType, setPropertyType] = useState<PropertyType>('villa');
  const [bedrooms, setBedrooms] = useState(5);
  const [bathrooms, setBathrooms] = useState(5);
  const [builtAreaM2, setBuiltAreaM2] = useState(500);
  const [description, setDescription] = useState('');
  const [heroImage, setHeroImage] = useState('/src/assets/images/hero_luxury_villa_1793066039194.jpg');

  const filteredProperties = properties.filter((p: Property) => {
    if (filterStatus !== 'todos' && p.status !== filterStatus) return false;
    return true;
  });

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) {
      showToast('Por favor indique título y localización');
      return;
    }

    const newProp: Property = {
      id: `prop_${Date.now()}`,
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      location: location.trim(),
      zone: zone.trim() || location.trim(),
      price: Number(price),
      currency: 'EUR',
      propertyType: propertyType,
      status: 'disponible',
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      builtAreaM2: Number(builtAreaM2),
      featured: false,
      heroImage: heroImage,
      galleryImages: [heroImage],
      description: description.trim() || 'Exclusiva residencia de alto standing con acabados de primera calidad.',
      architecturalHighlights: ['Arquitectura de autor', 'Domótica integrada', 'Materiales nobles'],
      amenities: ['Piscina', 'Seguridad', 'Jardín'],
      yearBuilt: 2025,
      energyRating: 'A',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveProperty(newProp);
    setShowAddModal(false);
    showToast('Inmueble añadido exitosamente a la cartera comercial');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F5F2EA] p-6 border border-[#0A2F1D]/10">
        <div>
          <h2 className="text-2xl font-serif text-[#0A2F1D] font-normal">
            Inventario & Cartera de Inmuebles
          </h2>
          <p className="text-xs text-[#132E22]/70 font-light mt-1">
            Control de disponibilidad, asignación de precios y catálogo de activos singulares.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#0A2F1D] text-[#FDFBF7] hover:bg-[#16432B] transition-colors"
        >
          <Plus className="w-4 h-4 text-[#C8A261]" />
          <span>Añadir Propiedad</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#0A2F1D]/10 pb-4">
        {['todos', 'disponible', 'reservado', 'vendido'].map((st: string) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider capitalize ${
              filterStatus === st
                ? 'bg-[#0A2F1D] text-[#FDFBF7]'
                : 'bg-[#F5F2EA] text-[#0A2F1D] hover:bg-[#EAE4D7]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((prop: Property) => (
          <div
            key={prop.id}
            className="bg-[#FDFBF7] border border-[#0A2F1D]/10 overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-[16/10] bg-[#0A2F1D]/10">
              <img
                src={prop.heroImage}
                alt={prop.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-[#071E13]/85 text-[#FDFBF7] px-2.5 py-1 text-[10px] uppercase font-mono">
                {prop.id}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-[11px] text-[#C8A261] uppercase tracking-wider font-semibold">
                  {prop.zone} · {prop.location}
                </div>
                <h3 className="text-base font-serif text-[#0A2F1D] mt-1 font-semibold leading-snug">
                  {prop.title}
                </h3>
                <div className="text-xs text-[#132E22]/60 mt-1 font-mono">
                  {prop.builtAreaM2} m² · {prop.bedrooms} suites · {prop.bathrooms} baños
                </div>
              </div>

              <div className="pt-3 border-t border-[#0A2F1D]/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase text-[#132E22]/50">Precio</div>
                  <div className="text-lg font-serif font-bold text-[#0A2F1D] tabular-nums">
                    {RealEstateStore.formatPrice(prop.price, prop.currency)}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase text-[#132E22]/50 block mb-0.5">Estado</label>
                  <select
                    value={prop.status}
                    onChange={(e) => updatePropertyStatus(prop.id, e.target.value as PropertyStatus)}
                    className="bg-[#F5F2EA] border border-[#0A2F1D]/20 text-[11px] font-semibold text-[#0A2F1D] px-2 py-1 focus:outline-none"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="reservado">Reservado</option>
                    <option value="vendido">Vendido</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedProperty(prop)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#0A2F1D] hover:text-[#C8A261] font-semibold"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver Ficha Completa</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#071E13]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] text-[#0A2F1D] max-w-xl w-full border border-[#C8A261] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#0A2F1D]/10 pb-3">
              <h3 className="text-lg font-serif text-[#0A2F1D]">Registrar Nueva Residencia</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#0A2F1D]/50 hover:text-[#0A2F1D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Título de la Propiedad *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Mansión en Primera Línea de Mar"
                  className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Ubicación / Ciudad *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej. Costa Brava, Girona"
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2"
                  />
                </div>
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Zona / Barrio</label>
                  <input
                    type="text"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    placeholder="Ej. S'Agaró Vell"
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Precio (€) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Superficie m²</label>
                  <input
                    type="number"
                    value={builtAreaM2}
                    onChange={(e) => setBuiltAreaM2(Number(e.target.value))}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Tipología</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2"
                  >
                    <option value="villa">Villa</option>
                    <option value="atico">Ático</option>
                    <option value="mansion">Mansión</option>
                    <option value="residencia_forestal">Refugio Forestal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Dormitorios / Suites</label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2"
                  />
                </div>
                <div>
                  <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Baños Completos</label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Fotografía Principal (Ruta)</label>
                <select
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2 text-xs"
                >
                  <option value="/src/assets/images/hero_luxury_villa_1793066039194.jpg">Villa Acantilado al Atardecer</option>
                  <option value="/src/assets/images/property_penthouse_skyline_1793066039582.jpg">Ático Sky View Salamanca</option>
                  <option value="/src/assets/images/property_forest_residence_1793066040437.jpg">Residencia de Montaña Bosque</option>
                  <option value="/src/assets/images/project_coastal_mansion_1793066040710.jpg">Finca Mediterránea Terrazas</option>
                  <option value="/src/assets/images/property_interior_living_1793066040722.jpg">Salón Travertino La Moraleja</option>
                </select>
              </div>

              <div>
                <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">Descripción / Memoria</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles sobre diseño, materiales, vistas..."
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
                  Guardar en Catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
