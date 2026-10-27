import React from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { ArrowDown, Search, Compass } from 'lucide-react';

export const Hero: React.FC = () => {
  const { filterType, setFilterType, filterLocation, setFilterLocation, filterMaxPrice, setFilterMaxPrice } = useRealEstate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const catalogElement = document.getElementById('catalogo');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#0A2F1D] text-[#FDFBF7]">
      {/* Background Image with Cinematic Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_luxury_villa_1793066039194.jpg"
          alt="Villa contemporánea sobre acantilado al atardecer"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Measured Scrim for WCAG AA Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#071E13] via-[#0A2F1D]/60 to-[#071E13]/50" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 flex-1 flex flex-col justify-center">
        
        {/* Kicker */}
        <div className="flex items-center gap-2 mb-6 text-xs uppercase tracking-[0.25em] text-[#C8A261] font-semibold">
          <Compass className="w-4 h-4" />
          <span>Colección Residencial de Autor · Temporada 2026</span>
        </div>

        {/* Headline with text-wrap: balance */}
        <h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal leading-[1.12] text-[#FDFBF7] max-w-4xl tracking-tight mb-6"
          style={{ textWrap: 'balance' }}
        >
          Residencias singulares para patrimonios que aprecian la arquitectura y la discreción.
        </h1>

        <p className="text-base sm:text-lg text-[#FDFBF7]/80 max-w-2xl font-light leading-relaxed mb-10">
          Curaduría inmobiliaria especializada en villas sobre acantilados, áticos en enclaves históricos y refugios bioclimáticos en las localizaciones más codiciadas de España y el Mediterráneo.
        </p>

        {/* Integrated Architectural Search Box */}
        <div className="bg-[#FDFBF7] text-[#0A2F1D] p-4 sm:p-6 shadow-2xl max-w-4xl border border-[#C8A261]/30">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#0A2F1D]/70 mb-1.5">
                Tipología
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/15 px-3 py-2.5 text-xs font-medium text-[#0A2F1D] focus:outline-none focus:border-[#C8A261]"
              >
                <option value="todos">Todas las tipologías</option>
                <option value="villa">Villas & Mansiones</option>
                <option value="atico">Áticos Sky View</option>
                <option value="residencia_forestal">Refugios Forestales</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#0A2F1D]/70 mb-1.5">
                Ubicación
              </label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/15 px-3 py-2.5 text-xs font-medium text-[#0A2F1D] focus:outline-none focus:border-[#C8A261]"
              >
                <option value="todas">Todas las zonas</option>
                <option value="Costa Brava">Costa Brava, Girona</option>
                <option value="Madrid">Madrid (Salamanca / La Moraleja)</option>
                <option value="Mallorca">Mallorca, Baleares</option>
                <option value="Valle de Arán">Pirineos (Valle de Arán)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#0A2F1D]/70 mb-1.5">
                Presupuesto Máximo
              </label>
              <select
                value={filterMaxPrice}
                onChange={(e) => setFilterMaxPrice(Number(e.target.value))}
                className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/15 px-3 py-2.5 text-xs font-medium text-[#0A2F1D] focus:outline-none focus:border-[#C8A261]"
              >
                <option value={10000000}>Sin límite</option>
                <option value={3000000}>Hasta €3.0M</option>
                <option value={5000000}>Hasta €5.0M</option>
                <option value={7000000}>Hasta €7.0M</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#0A2F1D] text-[#FDFBF7] hover:bg-[#16432B] transition-colors"
              >
                <Search className="w-4 h-4 text-[#C8A261]" />
                <span>Ver Disponibles</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Quantitative Rigor: Trust Metrics Bar */}
      <div className="relative z-10 bg-[#071E13]/90 border-t border-[#C8A261]/20 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div>
            <div className="text-2xl lg:text-3xl font-serif text-[#C8A261] font-semibold tabular-nums">€92M+</div>
            <div className="text-xs text-[#FDFBF7]/70 uppercase tracking-wider mt-1">Cartera Exclusiva 2026</div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-serif text-[#C8A261] font-semibold tabular-nums">100%</div>
            <div className="text-xs text-[#FDFBF7]/70 uppercase tracking-wider mt-1">Acuerdos Confidenciales</div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-serif text-[#C8A261] font-semibold tabular-nums">18 Días</div>
            <div className="text-xs text-[#FDFBF7]/70 uppercase tracking-wider mt-1">Tiempo Medio de Match</div>
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-serif text-[#C8A261] font-semibold tabular-nums">Off-Market</div>
            <div className="text-xs text-[#FDFBF7]/70 uppercase tracking-wider mt-1">Acceso a Activos Reservados</div>
          </div>
        </div>
      </div>
    </section>
  );
};
