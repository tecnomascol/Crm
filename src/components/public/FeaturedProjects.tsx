import React from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { ArchitecturalProject } from '../../types';
import { RealEstateStore } from '../../services/store';
import { FileText } from 'lucide-react';

export const FeaturedProjects: React.FC = () => {
  const { projects, setInquiryProperty, properties } = useRealEstate();

  const handleRequestDossier = (project: ArchitecturalProject) => {
    // Open inquiry with pre-filled interest in this project
    const matchingProp = properties[0];
    setInquiryProperty({
      ...matchingProp,
      id: project.id,
      title: `Proyecto: ${project.name}`,
      location: project.location,
      price: project.startingPrice,
    });
  };

  return (
    <section id="proyectos" className="py-24 bg-[#F5F2EA] text-[#0A2F1D] border-b border-[#0A2F1D]/10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#C8A261] font-semibold mb-3">
              Desarrollos Arquitectónicos & Masterplans
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#0A2F1D] tracking-tight">
              Proyectos de Obra Nueva Singulares
            </h2>
          </div>
          <p className="text-sm text-[#132E22]/70 max-w-md font-light leading-relaxed">
            Promociones residenciales limitadas diseñadas por estudios de arquitectura de prestigio internacional, disponibles en fase de preventa e inversión estratégica.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((project: ArchitecturalProject) => (
            <div
              key={project.id}
              className="bg-[#FDFBF7] border border-[#0A2F1D]/10 overflow-hidden flex flex-col justify-between group hover:border-[#C8A261]/50 transition-all duration-300"
            >
              {/* Media Slot */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#0A2F1D]/5">
                <img
                  src={project.heroImage}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-[#0A2F1D]/80 backdrop-blur-md px-3 py-1 text-[11px] uppercase tracking-wider text-[#FDFBF7] font-medium">
                  {project.status === 'en_construccion' ? 'En Construcción' : 'Fase Preventa'}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-[#C8A261] font-medium uppercase tracking-wider mb-1">
                    {project.location}
                  </div>
                  <h3 className="text-xl font-serif text-[#0A2F1D] mb-2 font-normal">
                    {project.name}
                  </h3>
                  <p className="text-xs text-[#132E22]/75 line-clamp-2 leading-relaxed mb-6 font-light">
                    {project.tagline}
                  </p>

                  {/* Progress Indicator */}
                  <div className="space-y-2 mb-6 pt-4 border-t border-[#0A2F1D]/10">
                    <div className="flex justify-between text-xs text-[#132E22]/80 font-medium">
                      <span>Avance de Obra</span>
                      <span className="tabular-nums font-semibold">{project.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#0A2F1D]/10 overflow-hidden">
                      <div
                        className="h-full bg-[#C8A261] transition-all duration-500"
                        style={{ width: `${project.progressPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-[#132E22]/60 pt-1">
                      <span>Entrega estimada: {project.completionDate}</span>
                      <span>{project.availableUnits} de {project.totalUnits} disponibles</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-[#0A2F1D]/10 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] uppercase text-[#132E22]/60 font-semibold tracking-wider">
                      Desde
                    </div>
                    <div className="text-lg font-serif font-semibold text-[#0A2F1D] tabular-nums">
                      {RealEstateStore.formatPrice(project.startingPrice)}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRequestDossier(project)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#0A2F1D] bg-[#F5F2EA] hover:bg-[#0A2F1D] hover:text-[#FDFBF7] transition-colors border border-[#0A2F1D]/20"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#C8A261]" />
                    <span>Dossier</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
