import React, { useState } from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { RealEstateStore } from '../../services/store';
import { X, Check, MessageCircle, Calendar, Download, ShieldCheck, MapPin } from 'lucide-react';

export const PropertyDetailModal: React.FC = () => {
  const { selectedProperty, setSelectedProperty, brand, setInquiryProperty, showToast } = useRealEstate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!selectedProperty) return null;

  const handleWhatsApp = () => {
    const text = `Hola ${brand.brandName}, deseo agendar una visita privada y consultar documentación para la propiedad: "${selectedProperty.title}" (${RealEstateStore.formatPrice(selectedProperty.price)}). Ref: ${selectedProperty.id}.`;
    const url = RealEstateStore.buildWhatsAppUrl(brand.whatsappNumber, text);
    window.open(url, '_blank');
  };

  const handleScheduleVisit = () => {
    setInquiryProperty(selectedProperty);
    setSelectedProperty(null);
    const contactElem = document.getElementById('contacto');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownloadDossier = () => {
    showToast(`Generando dossier confidencial en alta resolución para "${selectedProperty.title}"... Descarga iniciada.`);
  };

  const gallery = selectedProperty.galleryImages.length > 0
    ? selectedProperty.galleryImages
    : [selectedProperty.heroImage];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#071E13]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-fade-in">
      <div 
        className="relative bg-[#FDFBF7] text-[#0A2F1D] max-w-5xl w-full border border-[#C8A261]/40 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-[#F5F2EA] border-b border-[#0A2F1D]/10 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-[#C8A261] font-semibold">
              Ref: {selectedProperty.id}
            </span>
            <span className="text-xs text-[#0A2F1D]/40">·</span>
            <span className="text-xs text-[#0A2F1D]/70 font-medium">
              {selectedProperty.zone}, {selectedProperty.location}
            </span>
          </div>

          <button
            onClick={() => setSelectedProperty(null)}
            className="p-1.5 text-[#0A2F1D] hover:text-[#C8A261] hover:bg-[#0A2F1D]/5 transition-colors"
            aria-label="Cerrar ficha"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 flex-1">
          
          {/* Title & Price Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#0A2F1D]/10 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#C8A261] uppercase tracking-wider font-semibold mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{selectedProperty.location}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#0A2F1D] font-normal leading-tight">
                {selectedProperty.title}
              </h2>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <div className="text-[10px] uppercase tracking-wider text-[#132E22]/50 font-semibold">
                Precio de Venta
              </div>
              <div className="text-3xl font-serif font-bold text-[#0A2F1D] tabular-nums">
                {RealEstateStore.formatPrice(selectedProperty.price, selectedProperty.currency)}
              </div>
            </div>
          </div>

          {/* Media Showcase & Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] overflow-hidden bg-[#0A2F1D]/10">
              <img
                src={gallery[activeImageIndex] || selectedProperty.heroImage}
                alt={selectedProperty.title}
                className="w-full h-full object-cover transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 right-4 bg-[#071E13]/80 backdrop-blur-md px-3 py-1 text-xs text-[#FDFBF7]">
                Fotografía {activeImageIndex + 1} de {gallery.length}
              </div>
            </div>

            {/* Thumbnail Row */}
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {gallery.map((imgUrl: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 shrink-0 overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx ? 'border-[#C8A261] opacity-100' : 'border-transparent opacity-60 hover:opacity-90'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Metrics Strip (Tabular numbers) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#F5F2EA] border border-[#0A2F1D]/10">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#132E22]/60 font-semibold">Superficie</div>
              <div className="text-xl font-serif font-semibold text-[#0A2F1D] tabular-nums">
                {selectedProperty.builtAreaM2} m²
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#132E22]/60 font-semibold">Dormitorios</div>
              <div className="text-xl font-serif font-semibold text-[#0A2F1D] tabular-nums">
                {selectedProperty.bedrooms} Suites
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#132E22]/60 font-semibold">Baños</div>
              <div className="text-xl font-serif font-semibold text-[#0A2F1D] tabular-nums">
                {selectedProperty.bathrooms} Completos
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#132E22]/60 font-semibold">Eficiencia</div>
              <div className="text-xl font-serif font-semibold text-[#0A2F1D] tabular-nums">
                {selectedProperty.energyRating}
              </div>
            </div>
          </div>

          {/* Architectural Description */}
          <div>
            <h3 className="text-lg font-serif text-[#0A2F1D] mb-3 font-normal border-b border-[#0A2F1D]/10 pb-2">
              Memoria Arquitectónica & Entorno
            </h3>
            <p className="text-sm text-[#132E22]/80 leading-relaxed font-light">
              {selectedProperty.description}
            </p>
          </div>

          {/* Architectural Highlights */}
          {selectedProperty.architecturalHighlights && (
            <div>
              <h3 className="text-lg font-serif text-[#0A2F1D] mb-4 font-normal border-b border-[#0A2F1D]/10 pb-2">
                Especificaciones Singulares
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#132E22]/85">
                {selectedProperty.architecturalHighlights.map((hl: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#C8A261] shrink-0 mt-0.5" />
                    <span className="leading-snug">{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Amenities */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#132E22]/60 font-semibold mb-3">
              Equipamiento & Amenidades
            </h3>
            <div className="flex flex-wrap gap-2 text-xs text-[#132E22]/80">
              {selectedProperty.amenities.map((am: string, i: number) => (
                <span key={i} className="px-3 py-1.5 bg-[#F5F2EA] border border-[#0A2F1D]/10">
                  {am}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Fixed Footer Actions */}
        <div className="p-4 sm:p-6 bg-[#F5F2EA] border-t border-[#0A2F1D]/10 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#132E22]/70">
            <ShieldCheck className="w-4 h-4 text-[#C8A261]" />
            <span>Gestión confidencial bajo NDA notarial.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleDownloadDossier}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0A2F1D] bg-[#FDFBF7] hover:bg-[#EAE4D7] border border-[#0A2F1D]/20 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#C8A261]" />
              <span>Dossier PDF</span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#25D366] hover:bg-[#20ba59] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Directo</span>
            </button>

            <button
              onClick={handleScheduleVisit}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FDFBF7] bg-[#0A2F1D] hover:bg-[#16432B] transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C8A261]" />
              <span>Solicitar Visita Privada</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
