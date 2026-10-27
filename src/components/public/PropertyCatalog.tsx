import React, { useState, useMemo } from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { PropertyCard } from './PropertyCard';
import { Property } from '../../types';
import { Search, RotateCcw } from 'lucide-react';

export const PropertyCatalog: React.FC = () => {
  const { properties, filterType, setFilterType, filterLocation, setFilterLocation, filterMaxPrice, setFilterMaxPrice } = useRealEstate();
  const [searchQuery, setSearchQuery] = useState('');
  const [minBedrooms, setMinBedrooms] = useState<number>(0);

  const filteredProperties = useMemo(() => {
    return properties.filter((item: Property) => {
      // Type
      if (filterType !== 'todos' && item.propertyType !== filterType) {
        return false;
      }
      // Location
      if (filterLocation !== 'todas' && !item.location.toLowerCase().includes(filterLocation.toLowerCase())) {
        return false;
      }
      // Max price
      if (item.price > filterMaxPrice) {
        return false;
      }
      // Min bedrooms
      if (minBedrooms > 0 && item.bedrooms < minBedrooms) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesLoc = item.location.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesLoc && !matchesDesc) {
          return false;
        }
      }
      return true;
    });
  }, [properties, filterType, filterLocation, filterMaxPrice, minBedrooms, searchQuery]);

  const resetFilters = () => {
    setFilterType('todos');
    setFilterLocation('todas');
    setFilterMaxPrice(10000000);
    setMinBedrooms(0);
    setSearchQuery('');
  };

  return (
    <section id="catalogo" className="py-24 bg-[#FDFBF7] text-[#0A2F1D]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-[#C8A261] font-semibold mb-3">
            Colección Privada Disponible
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#0A2F1D] tracking-tight mb-4">
            Catálogo de Propiedades Exclusivas
          </h2>
          <p className="text-sm sm:text-base text-[#132E22]/70 font-light leading-relaxed">
            Inmuebles verificados documentalmente con titularidad limpia y listos para transmisión notarial inmediata.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#F5F2EA] p-6 mb-12 border border-[#0A2F1D]/10">
          
          {/* Segmented Type Tabs (Functional buttons with active state) */}
          <div className="flex flex-wrap items-center gap-2 mb-6 pb-6 border-b border-[#0A2F1D]/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0A2F1D]/60 mr-2 shrink-0">
              Categoría:
            </span>
            {[
              { id: 'todos', label: 'Todas las Residencias' },
              { id: 'villa', label: 'Villas & Mansiones' },
              { id: 'atico', label: 'Áticos Dúplex' },
              { id: 'residencia_forestal', label: 'Refugios de Montaña' },
            ].map((tab: { id: string; label: string }) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
                  filterType === tab.id
                    ? 'bg-[#0A2F1D] text-[#FDFBF7] shadow-sm'
                    : 'bg-[#FDFBF7] text-[#132E22] hover:bg-[#EAE4D7] border border-[#0A2F1D]/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Detailed Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#0A2F1D]/40 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Buscar por enclave o nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#0A2F1D]/15 pl-9 pr-3 py-2.5 text-xs text-[#0A2F1D] focus:outline-none focus:border-[#C8A261]"
              />
            </div>

            {/* Location Filter */}
            <div>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#0A2F1D]/15 px-3 py-2.5 text-xs font-medium text-[#0A2F1D] focus:outline-none focus:border-[#C8A261]"
              >
                <option value="todas">Todas las ubicaciones</option>
                <option value="Costa Brava">Costa Brava</option>
                <option value="Madrid">Madrid Prime</option>
                <option value="Mallorca">Mallorca</option>
                <option value="Valle de Arán">Valle de Arán</option>
              </select>
            </div>

            {/* Min Bedrooms */}
            <div>
              <select
                value={minBedrooms}
                onChange={(e) => setMinBedrooms(Number(e.target.value))}
                className="w-full bg-[#FDFBF7] border border-[#0A2F1D]/15 px-3 py-2.5 text-xs font-medium text-[#0A2F1D] focus:outline-none focus:border-[#C8A261]"
              >
                <option value={0}>Habitaciones (Cualquiera)</option>
                <option value={4}>Mínimo 4 suites</option>
                <option value={5}>Mínimo 5 suites</option>
                <option value={6}>Mínimo 6 suites</option>
              </select>
            </div>

            {/* Reset Action */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-xs text-[#132E22]/60 tabular-nums">
                {filteredProperties.length} propiedades encontradas
              </span>
              <button
                onClick={resetFilters}
                title="Limpiar filtros"
                className="p-2.5 bg-[#FDFBF7] border border-[#0A2F1D]/15 text-[#0A2F1D] hover:text-[#C8A261] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Property Cards Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property: Property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#F5F2EA] border border-dashed border-[#0A2F1D]/20 p-8">
            <h3 className="text-xl font-serif text-[#0A2F1D] mb-2 font-normal">
              No se han encontrado propiedades con los criterios seleccionados
            </h3>
            <p className="text-xs text-[#132E22]/70 max-w-md mx-auto mb-6">
              Disponemos de activos confidenciales en cartera off-market que no se publican en web. Contáctenos para un mandato de búsqueda personalizado.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#0A2F1D] text-[#FDFBF7] hover:bg-[#16432B]"
            >
              Restablecer Filtros
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
