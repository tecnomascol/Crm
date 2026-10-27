import React from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { UserRole } from '../../types';
import { Shield, ExternalLink, UserCircle2, Sparkles, Building2 } from 'lucide-react';

export const CrmHeader: React.FC = () => {
  const { brand, currentUser, currentRole, setRole, setCurrentView, users } = useRealEstate();

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'administrador':
        return 'bg-[#C8A261] text-[#0A2F1D] font-bold';
      case 'director_comercial':
        return 'bg-[#0A2F1D] text-[#FDFBF7] font-semibold';
      case 'asesor':
        return 'bg-[#16432B] text-[#FDFBF7] font-medium';
    }
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'administrador':
        return 'Administrador';
      case 'director_comercial':
        return 'Directora Comercial';
      case 'asesor':
        return 'Asesor Senior';
    }
  };

  return (
    <header className="bg-[#071E13] text-[#FDFBF7] border-b border-[#C8A261]/25 px-6 py-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & CRM Wordmark */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <span className="text-xl font-brand font-semibold tracking-widest text-[#FDFBF7] uppercase">
              {brand.brandName}
            </span>
            <span className="text-xs uppercase tracking-widest bg-[#0A2F1D] border border-[#C8A261]/40 px-2 py-0.5 text-[#C8A261]">
              CRM Privado
            </span>
          </div>

          {/* Quick Return to Public Site (Mobile) */}
          <button
            onClick={() => setCurrentView('public')}
            className="md:hidden inline-flex items-center gap-1.5 text-xs text-[#C8A261] hover:underline"
          >
            <span>Ver Web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* User Identity & Role Switcher */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          
          {/* Role selector dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#FDFBF7]/60 hidden sm:inline">Rol activo:</span>
            <select
              value={currentRole}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-[#0A2F1D] border border-[#C8A261]/40 text-[#FDFBF7] px-3 py-1.5 text-xs focus:outline-none focus:border-[#C8A261]"
            >
              <option value="administrador">Carlos Mendoza (Administrador)</option>
              <option value="director_comercial">Elena Valdés (Directora Comercial)</option>
              <option value="asesor">Mateo Rivas (Asesor Senior)</option>
            </select>
          </div>

          {/* Active user badge */}
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-[#C8A261]/20">
            <UserCircle2 className="w-5 h-5 text-[#C8A261]" />
            <div className="text-left text-xs leading-tight">
              <div className="font-medium text-[#FDFBF7]">{currentUser.displayName}</div>
              <div className="text-[10px] text-[#C8A261]">{getRoleDisplayName(currentRole)}</div>
            </div>
          </div>

          {/* Return to Public Site Button */}
          <button
            onClick={() => setCurrentView('public')}
            className="hidden md:inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#0A2F1D] bg-[#FDFBF7] hover:bg-[#F5F2EA] transition-colors"
          >
            <span>Portal Web</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#0A2F1D]" />
          </button>

        </div>

      </div>
    </header>
  );
};
