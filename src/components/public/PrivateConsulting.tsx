import React from 'react';
import { ShieldCheck, Scale, Compass, Award } from 'lucide-react';

export const PrivateConsulting: React.FC = () => {
  return (
    <section id="experiencia" className="py-24 bg-[#0A2F1D] text-[#FDFBF7] border-b border-[#C8A261]/20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Editorial Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-[#C8A261] font-semibold mb-3">
            Servicios Privados & Gestión Patrimonial
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#FDFBF7] tracking-tight mb-4">
            La Discreción Como Principio Fundamental
          </h2>
          <p className="text-sm sm:text-base text-[#FDFBF7]/80 font-light leading-relaxed">
            Acompañamos a compradores privados, family offices y fondos institucionales a través de un proceso riguroso donde cada transacción permanece estrictamente confidencial.
          </p>
        </div>

        {/* 3 Editorial Pillars (No generic icon slop, clean human numbering) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-[#071E13] p-8 border border-[#C8A261]/20 flex flex-col justify-between">
            <div>
              <div className="text-xs font-serif text-[#C8A261] uppercase tracking-widest mb-4">
                01. Mandato Off-Market
              </div>
              <h3 className="text-xl font-serif text-[#FDFBF7] mb-3 font-normal">
                Búsqueda Silenciosa de Activos Singulares
              </h3>
              <p className="text-xs sm:text-sm text-[#FDFBF7]/75 font-light leading-relaxed">
                Acceso prioritario a propiedades cuyos propietarios prefieren no comercializar abiertamente en portales públicos. Activamos nuestra red de contactos notariales y despachos de arquitectura.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[#C8A261]/20 flex items-center gap-2 text-xs text-[#C8A261]">
              <ShieldCheck className="w-4 h-4" />
              <span>Acuerdo de Confidencialidad Previo (NDA)</span>
            </div>
          </div>

          <div className="bg-[#071E13] p-8 border border-[#C8A261]/20 flex flex-col justify-between">
            <div>
              <div className="text-xs font-serif text-[#C8A261] uppercase tracking-widest mb-4">
                02. Auditoría Técnica
              </div>
              <h3 className="text-xl font-serif text-[#FDFBF7] mb-3 font-normal">
                Due Diligence Arquitectónica & Urbanística
              </h3>
              <p className="text-xs sm:text-sm text-[#FDFBF7]/75 font-light leading-relaxed">
                Evaluamos exhaustivamente la estructura, licencias urbanísticas, servidumbres y eficiencia energética con peritos independientes antes de emitir cualquier propuesta vinculante.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[#C8A261]/20 flex items-center gap-2 text-xs text-[#C8A261]">
              <Scale className="w-4 h-4" />
              <span>Informe Pericial Pre-Escritura</span>
            </div>
          </div>

          <div className="bg-[#071E13] p-8 border border-[#C8A261]/20 flex flex-col justify-between">
            <div>
              <div className="text-xs font-serif text-[#C8A261] uppercase tracking-widest mb-4">
                03. Concierge Notarial
              </div>
              <h3 className="text-xl font-serif text-[#FDFBF7] mb-3 font-normal">
                Estructuración Jurídica & Cierre
              </h3>
              <p className="text-xs sm:text-sm text-[#FDFBF7]/75 font-light leading-relaxed">
                Coordinación de trámites bancarios, cuentas fiduciarias escrow, NIE para inversores no residentes y redacción minuciosa de contratos de arras y escrituras públicas ante notario.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[#C8A261]/20 flex items-center gap-2 text-xs text-[#C8A261]">
              <Award className="w-4 h-4" />
              <span>Acompañamiento Integral en Notaría</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
