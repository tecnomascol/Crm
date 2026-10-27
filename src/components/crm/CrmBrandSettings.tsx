import React, { useState } from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { Palette, Check, RotateCcw, Building, Phone, Mail, MapPin } from 'lucide-react';
import { DEFAULT_BRAND } from '../../data/mockData';

export const CrmBrandSettings: React.FC = () => {
  const { brand, updateBrand, currentRole, showToast } = useRealEstate();

  const [brandName, setBrandName] = useState(brand.brandName);
  const [tagline, setTagline] = useState(brand.tagline);
  const [whatsappNumber, setWhatsappNumber] = useState(brand.whatsappNumber);
  const [contactEmail, setContactEmail] = useState(brand.contactEmail);
  const [officeAddress, setOfficeAddress] = useState(brand.officeAddress);
  const [primaryColor, setPrimaryColor] = useState(brand.primaryColor);
  const [accentColor, setAccentColor] = useState(brand.accentColor);
  const [currencySymbol, setCurrencySymbol] = useState(brand.currencySymbol);

  const isAdmin = currentRole === 'administrador';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('Solo los usuarios con rol Administrador pueden modificar la identidad corporativa');
      return;
    }

    updateBrand({
      brandName: brandName.trim(),
      tagline: tagline.trim(),
      whatsappNumber: whatsappNumber.trim(),
      contactEmail: contactEmail.trim(),
      officeAddress: officeAddress.trim(),
      primaryColor,
      accentColor,
      currencySymbol,
    });
  };

  const handleReset = () => {
    setBrandName(DEFAULT_BRAND.brandName);
    setTagline(DEFAULT_BRAND.tagline);
    setWhatsappNumber(DEFAULT_BRAND.whatsappNumber);
    setContactEmail(DEFAULT_BRAND.contactEmail);
    setOfficeAddress(DEFAULT_BRAND.officeAddress);
    setPrimaryColor(DEFAULT_BRAND.primaryColor);
    setAccentColor(DEFAULT_BRAND.accentColor);
    setCurrencySymbol(DEFAULT_BRAND.currencySymbol);
    updateBrand(DEFAULT_BRAND);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F5F2EA] p-6 border border-[#0A2F1D]/10">
        <div>
          <h2 className="text-2xl font-serif text-[#0A2F1D] font-normal">
            Personalización de Marca & Identidad Visual
          </h2>
          <p className="text-xs text-[#132E22]/70 font-light mt-1">
            Configure el nombre de su agencia, números oficiales de WhatsApp, paleta cromática y datos de contacto.
          </p>
        </div>

        {!isAdmin && (
          <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5">
            Vista en solo lectura. Cambie a rol <strong>Administrador</strong> para editar.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Box */}
        <div className="lg:col-span-7 bg-[#FDFBF7] p-6 sm:p-8 border border-[#0A2F1D]/10">
          <form onSubmit={handleSave} className="space-y-6 text-xs">
            
            <div>
              <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">
                Nombre de la Inmobiliaria / Marca
              </label>
              <input
                type="text"
                disabled={!isAdmin}
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5 text-xs text-[#0A2F1D] focus:outline-none focus:border-[#C8A261] disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">
                Lema / Tagline Editorial
              </label>
              <textarea
                rows={2}
                disabled={!isAdmin}
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5 text-xs text-[#0A2F1D] focus:outline-none focus:border-[#C8A261] disabled:opacity-60"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">
                  WhatsApp Oficial (Para Botones Directos)
                </label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5 text-xs text-[#0A2F1D] focus:outline-none focus:border-[#C8A261] disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">
                  Email de Atención Exclusiva
                </label>
                <input
                  type="email"
                  disabled={!isAdmin}
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5 text-xs text-[#0A2F1D] focus:outline-none focus:border-[#C8A261] disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">
                Dirección de Oficinas Principales
              </label>
              <input
                type="text"
                disabled={!isAdmin}
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
                className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2.5 text-xs text-[#0A2F1D] focus:outline-none focus:border-[#C8A261] disabled:opacity-60"
              />
            </div>

            {/* Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#0A2F1D]/10">
              <div>
                <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">
                  Verde Bosque (Primario)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    disabled={!isAdmin}
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-9 h-9 border border-[#0A2F1D]/20 cursor-pointer disabled:opacity-60"
                  />
                  <span className="font-mono text-xs">{primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">
                  Acento Champagne
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    disabled={!isAdmin}
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-9 h-9 border border-[#0A2F1D]/20 cursor-pointer disabled:opacity-60"
                  />
                  <span className="font-mono text-xs">{accentColor}</span>
                </div>
              </div>

              <div>
                <label className="block uppercase font-semibold text-[#0A2F1D] mb-1">
                  Divisa Principal
                </label>
                <select
                  disabled={!isAdmin}
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/20 p-2 text-xs"
                >
                  <option value="€">EUR (€)</option>
                  <option value="$">USD ($)</option>
                  <option value="£">GBP (£)</option>
                </select>
              </div>
            </div>

            {isAdmin && (
              <div className="flex items-center justify-between pt-6 border-t border-[#0A2F1D]/10">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#0A2F1D]/20 text-xs text-[#0A2F1D] hover:bg-[#F5F2EA]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Valores Originales</span>
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#0A2F1D] text-[#FDFBF7] hover:bg-[#16432B]"
                >
                  <Check className="w-4 h-4 text-[#C8A261]" />
                  <span>Aplicar Cambios de Marca</span>
                </button>
              </div>
            )}

          </form>
        </div>

        {/* Live Preview Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs uppercase tracking-wider font-semibold text-[#0A2F1D]">
            Vista Previa de Marca en Tiempo Real
          </div>

          <div
            className="p-8 text-[#FDFBF7] shadow-xl border border-[#C8A261]/30 transition-colors"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="text-xs uppercase tracking-widest font-semibold mb-6" style={{ color: accentColor }}>
              Sello Corporativo
            </div>

            <div className="text-3xl font-brand font-bold tracking-widest uppercase mb-3">
              {brandName}
            </div>

            <p className="text-xs text-[#FDFBF7]/80 font-light leading-relaxed mb-8">
              {tagline}
            </p>

            <div className="space-y-3 pt-6 border-t border-[#FDFBF7]/15 text-xs text-[#FDFBF7]/85">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" style={{ color: accentColor }} />
                <span>{whatsappNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" style={{ color: accentColor }} />
                <span>{contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" style={{ color: accentColor }} />
                <span className="line-clamp-1">{officeAddress}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
