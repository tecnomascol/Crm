import React, { useState } from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { Menu, X, ArrowUpRight, Shield } from 'lucide-react';

export const Header: React.FC = () => {
  const { brand, currentView, setCurrentView, currentRole } = useRealEstate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#0A2F1D]/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark (Single text element wordmark in display face) */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); setCurrentView('public'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="text-2xl font-brand font-semibold tracking-widest text-[#0A2F1D] uppercase whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity"
        >
          {brand.brandName}
        </a>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#132E22]/80">
          <a href="#proyectos" className="hover:text-[#0A2F1D] transition-colors whitespace-nowrap shrink-0">
            Proyectos
          </a>
          <a href="#catalogo" className="hover:text-[#0A2F1D] transition-colors whitespace-nowrap shrink-0">
            Propiedades
          </a>
          <a href="#experiencia" className="hover:text-[#0A2F1D] transition-colors whitespace-nowrap shrink-0">
            Servicios Privados
          </a>
          <a href="#contacto" className="hover:text-[#0A2F1D] transition-colors whitespace-nowrap shrink-0">
            Contacto
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {currentView === 'public' ? (
            <button
              onClick={() => setCurrentView('crm')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7] bg-[#0A2F1D] hover:bg-[#16432B] transition-all rounded-none border border-[#0A2F1D] shadow-sm whitespace-nowrap shrink-0"
            >
              <Shield className="w-3.5 h-3.5 text-[#C8A261]" />
              <span>Acceso CRM</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#C8A261]" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('public')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0A2F1D] bg-[#FDFBF7] hover:bg-[#F4EFE6] border border-[#0A2F1D]/30 transition-all rounded-none whitespace-nowrap shrink-0"
            >
              <span>Ver Web Pública</span>
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setCurrentView(currentView === 'public' ? 'crm' : 'public')}
            className="p-2 text-xs font-medium uppercase text-[#0A2F1D] border border-[#0A2F1D]/20"
          >
            {currentView === 'public' ? 'CRM' : 'Web'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#0A2F1D] hover:text-[#C8A261] focus:outline-none"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#FDFBF7] border-b border-[#0A2F1D]/10 px-6 py-6 space-y-4">
          <a
            href="#proyectos"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#0A2F1D]"
          >
            Proyectos Singulares
          </a>
          <a
            href="#catalogo"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#0A2F1D]"
          >
            Catálogo de Propiedades
          </a>
          <a
            href="#experiencia"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#0A2F1D]"
          >
            Servicios Privados
          </a>
          <a
            href="#contacto"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#0A2F1D]"
          >
            Contacto & Cita
          </a>
          <div className="pt-4 border-t border-[#0A2F1D]/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setCurrentView('crm');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#0A2F1D]"
            >
              <Shield className="w-4 h-4 text-[#C8A261]" />
              <span>Acceder al Panel CRM ({currentRole.replace('_', ' ')})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
