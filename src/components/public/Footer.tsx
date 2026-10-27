import React from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { brand, setCurrentView } = useRealEstate();

  return (
    <footer className="bg-[#071E13] text-[#FDFBF7] py-16 border-t border-[#C8A261]/20">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Wordmark & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-2xl font-brand font-semibold tracking-widest text-[#FDFBF7] uppercase block">
              {brand.brandName}
            </span>
            <p className="text-xs text-[#FDFBF7]/70 font-light max-w-sm leading-relaxed">
              {brand.tagline}
            </p>
            <div className="text-xs text-[#C8A261] pt-2">
              Barcelona · Madrid · Mallorca · Costa Brava · Baqueira
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-widest text-[#C8A261] font-semibold">
              Exploración
            </div>
            <ul className="space-y-2 text-xs text-[#FDFBF7]/75 font-light">
              <li>
                <a href="#proyectos" className="hover:text-[#C8A261] transition-colors">
                  Desarrollos Arquitectónicos
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-[#C8A261] transition-colors">
                  Villas & Mansiones
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-[#C8A261] transition-colors">
                  Áticos Singulares
                </a>
              </li>
              <li>
                <a href="#experiencia" className="hover:text-[#C8A261] transition-colors">
                  Mandato Confidencial
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Internal Access */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-widest text-[#C8A261] font-semibold">
              Equipo & Gestión
            </div>
            <ul className="space-y-2 text-xs text-[#FDFBF7]/75 font-light">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('crm');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#C8A261] transition-colors inline-flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-[#C8A261]" />
                  <span>Panel Privado CRM</span>
                </button>
              </li>
              <li>
                <span className="text-[#FDFBF7]/50">Aviso Legal & Confidencialidad</span>
              </li>
              <li>
                <span className="text-[#FDFBF7]/50">Cumplimiento Prevención Blanqueo</span>
              </li>
              <li>
                <span className="text-[#FDFBF7]/50">Política de Cookies</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#FDFBF7]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FDFBF7]/50 gap-4">
          <div>
            © {new Date().getFullYear()} {brand.brandName}. Todos los derechos reservados.
          </div>
          <div>
            Plataforma inmobiliaria preparada para Firebase Firestore y CRM comercial.
          </div>
        </div>

      </div>
    </footer>
  );
};
