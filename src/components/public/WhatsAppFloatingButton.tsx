import React from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { RealEstateStore } from '../../services/store';
import { MessageCircle } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const { brand } = useRealEstate();

  const handleClick = () => {
    const text = `Hola ${brand.brandName}, deseo realizar una consulta inmobiliaria directa con su departamento de atención privada.`;
    const url = RealEstateStore.buildWhatsAppUrl(brand.whatsappNumber, text);
    window.open(url, '_blank');
  };

  return (
    <aside
      aria-label="Atención por WhatsApp"
      className="fixed bottom-6 right-6 z-40"
    >
      <button
        onClick={handleClick}
        className="group flex items-center gap-2.5 bg-[#25D366] text-white px-4 py-3 shadow-xl hover:bg-[#20ba59] transition-all duration-300 border border-white/20"
        title="Contactar por WhatsApp Oficial"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-xs font-semibold tracking-wider uppercase whitespace-nowrap">
          WhatsApp Concierge
        </span>
      </button>
    </aside>
  );
};
