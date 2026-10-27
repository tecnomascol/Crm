import React from 'react';
import { Property } from '../../types';
import { useRealEstate } from '../../context/RealEstateContext';
import { RealEstateStore } from '../../services/store';
import { ArrowUpRight, MessageCircle } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { brand, setSelectedProperty } = useRealEstate();

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `Hola ${brand.brandName}, estoy interesado en recibir información confidencial sobre la propiedad "${property.title}" (${RealEstateStore.formatPrice(property.price)}). Referencia: ${property.id}.`;
    const url = RealEstateStore.buildWhatsAppUrl(brand.whatsappNumber, text);
    window.open(url, '_blank');
  };

  const getStatusLabel = (status: Property['status']) => {
    switch (status) {
      case 'disponible':
        return 'Disponible';
      case 'reservado':
        return 'En Reserva';
      case 'vendido':
        return 'Adjudicado';
      default:
        return 'Próximamente';
    }
  };

  return (
    <div
      onClick={() => setSelectedProperty(property)}
      className="group cursor-pointer bg-[#FDFBF7] border border-[#0A2F1D]/10 overflow-hidden flex flex-col justify-between hover:border-[#C8A261] transition-all duration-300"
    >
      {/* Visual Carrier */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0A2F1D]/10">
        <img
          src={property.heroImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
        
        {/* Unboxed Subtle Status Badge */}
        <div className="absolute top-4 left-4 bg-[#0A2F1D]/85 backdrop-blur-md px-3 py-1 text-[11px] uppercase tracking-wider text-[#FDFBF7] font-medium">
          {getStatusLabel(property.status)}
        </div>

        {property.featured && (
          <div className="absolute top-4 right-4 bg-[#C8A261] text-[#0A2F1D] px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest">
            Exclusiva
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Location Kicker */}
          <div className="text-xs text-[#C8A261] font-semibold uppercase tracking-wider mb-1.5">
            {property.zone} · {property.location}
          </div>

          <h3 className="text-xl font-serif text-[#0A2F1D] mb-3 leading-snug group-hover:text-[#16432B] transition-colors">
            {property.title}
          </h3>

          {/* Clean Unboxed Metadata with · separator */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#132E22]/70 mb-4 pb-4 border-b border-[#0A2F1D]/10 font-normal">
            <span>{property.builtAreaM2} m² construidos</span>
            <span aria-hidden="true">·</span>
            <span>{property.bedrooms} suites</span>
            <span aria-hidden="true">·</span>
            <span>{property.bathrooms} baños</span>
            {property.plotAreaM2 && (
              <>
                <span aria-hidden="true">·</span>
                <span>{property.plotAreaM2} m² parcela</span>
              </>
            )}
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#132E22]/50 font-semibold">
              Valoración
            </div>
            <div className="text-2xl font-serif font-semibold text-[#0A2F1D] tabular-nums">
              {RealEstateStore.formatPrice(property.price, property.currency)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsApp}
              title="Consultar por WhatsApp oficial"
              className="p-2.5 bg-[#F5F2EA] hover:bg-[#25D366] text-[#0A2F1D] hover:text-white transition-colors border border-[#0A2F1D]/15"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSelectedProperty(property)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7] bg-[#0A2F1D] hover:bg-[#16432B] transition-colors"
            >
              <span>Ficha</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#C8A261]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
