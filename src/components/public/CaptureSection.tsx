import React, { useState, useEffect } from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { RealEstateStore } from '../../services/store';
import { InterestType } from '../../types';
import { Shield, Send, CheckCircle2, MessageCircle, X } from 'lucide-react';

export const CaptureSection: React.FC = () => {
  const { brand, inquiryProperty, setInquiryProperty, addLead } = useRealEstate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interestType, setInterestType] = useState<InterestType>('compra');
  const [budgetRange, setBudgetRange] = useState('€3.5M - €5.0M');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (inquiryProperty) {
      setInterestType('visita_privada');
      setMessage(`Deseo coordinar una visita privada para la propiedad "${inquiryProperty.title}" (Ref: ${inquiryProperty.id}).`);
    }
  }, [inquiryProperty]);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = 'Por favor indique su nombre completo.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = 'Introduzca una dirección de correo válida.';
    }
    if (!phone.trim() || phone.trim().length < 7) {
      errs.phone = 'Indique un número de contacto con prefijo internacional.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      addLead({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        interestType: interestType,
        propertyId: inquiryProperty?.id,
        propertyName: inquiryProperty?.title,
        budgetRange: budgetRange,
        message: message.trim() || undefined,
        status: 'nuevo',
        source: inquiryProperty ? 'ficha_propiedad' : 'web_landing',
        estimatedValue: inquiryProperty?.price || 4000000,
        notes: inquiryProperty
          ? `Solicitud de información directa para "${inquiryProperty.title}".`
          : 'Lead captado a través del formulario principal de la landing.',
      });

      setSubmitted(true);
      // Reset form
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setInquiryProperty(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectWhatsApp = () => {
    const text = `Hola ${brand.brandName}, deseo contactar directamente con su dirección comercial para concertar una reunión privada.`;
    const url = RealEstateStore.buildWhatsAppUrl(brand.whatsappNumber, text);
    window.open(url, '_blank');
  };

  return (
    <section id="contacto" className="py-24 bg-[#FDFBF7] text-[#0A2F1D] border-b border-[#0A2F1D]/10">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Context & Editorial Presentation */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs uppercase tracking-[0.25em] text-[#C8A261] font-semibold">
              Contacto Privado & Consultoría
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-serif text-[#0A2F1D] font-normal tracking-tight">
              Inicie una Conversación Confidencial
            </h2>
            
            <p className="text-sm text-[#132E22]/75 leading-relaxed font-light">
              Toda comunicación es atendida directamente por nuestra dirección comercial bajo estrictos acuerdos de privacidad. Si lo prefiere, podemos reunirnos en nuestras oficinas de Barcelona, Madrid o coordinar una videollamada cifrada.
            </p>

            {/* Quick Contacts Box */}
            <div className="pt-6 border-t border-[#0A2F1D]/10 space-y-4 text-xs">
              <div>
                <span className="text-[#132E22]/50 uppercase tracking-wider block mb-1">Oficinas Principales</span>
                <span className="font-medium text-[#0A2F1D]">{brand.officeAddress}</span>
              </div>
              <div>
                <span className="text-[#132E22]/50 uppercase tracking-wider block mb-1">Correo Exclusivo</span>
                <span className="font-medium text-[#0A2F1D]">{brand.contactEmail}</span>
              </div>
              <div>
                <span className="text-[#132E22]/50 uppercase tracking-wider block mb-1">Línea Directa / Concierge</span>
                <span className="font-medium text-[#0A2F1D]">{brand.whatsappNumber}</span>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleDirectWhatsApp}
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Conversar por WhatsApp Oficial</span>
              </button>
            </div>
          </div>

          {/* Right Column: Form Box */}
          <div className="lg:col-span-7 bg-[#F5F2EA] p-6 sm:p-10 border border-[#0A2F1D]/15 shadow-sm">
            
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-fade-in">
                <CheckCircle2 className="w-12 h-12 text-[#0A2F1D] mx-auto" />
                <h3 className="text-2xl font-serif text-[#0A2F1D]">Solicitud Registrada con Éxito</h3>
                <p className="text-xs sm:text-sm text-[#132E22]/75 max-w-md mx-auto leading-relaxed">
                  Hemos transferido sus requerimientos a la dirección comercial de {brand.brandName}. Un asesor senior le contactará en un plazo máximo de 4 horas hábiles.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#0A2F1D] text-[#FDFBF7] hover:bg-[#16432B]"
                >
                  Enviar Otra Solicitud
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Property context banner if triggered from property */}
                {inquiryProperty && (
                  <div className="p-3 bg-[#FDFBF7] border border-[#C8A261] flex items-center justify-between text-xs">
                    <span className="text-[#0A2F1D] font-medium">
                      Consultando sobre: <strong>{inquiryProperty.title}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setInquiryProperty(null)}
                      className="text-[#0A2F1D]/50 hover:text-[#0A2F1D]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#0A2F1D] mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ej. Ignacio Fernández"
                      className={`w-full bg-[#FDFBF7] border px-3 py-2.5 text-xs text-[#0A2F1D] focus:outline-none ${
                        errors.fullName ? 'border-red-500' : 'border-[#0A2F1D]/20 focus:border-[#C8A261]'
                      }`}
                    />
                    {errors.fullName && (
                      <span className="text-[11px] text-red-600 mt-1 block">{errors.fullName}</span>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#0A2F1D] mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nombre@empresa.com"
                      className={`w-full bg-[#FDFBF7] border px-3 py-2.5 text-xs text-[#0A2F1D] focus:outline-none ${
                        errors.email ? 'border-red-500' : 'border-[#0A2F1D]/20 focus:border-[#C8A261]'
                      }`}
                    />
                    {errors.email && (
                      <span className="text-[11px] text-red-600 mt-1 block">{errors.email}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#0A2F1D] mb-1">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+34 600 000 000"
                      className={`w-full bg-[#FDFBF7] border px-3 py-2.5 text-xs text-[#0A2F1D] focus:outline-none ${
                        errors.phone ? 'border-red-500' : 'border-[#0A2F1D]/20 focus:border-[#C8A261]'
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-[11px] text-red-600 mt-1 block">{errors.phone}</span>
                    )}
                  </div>

                  {/* Interest Type */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#0A2F1D] mb-1">
                      Finalidad de la Consulta
                    </label>
                    <select
                      value={interestType}
                      onChange={(e) => setInterestType(e.target.value as InterestType)}
                      className="w-full bg-[#FDFBF7] border border-[#0A2F1D]/20 px-3 py-2.5 text-xs text-[#0A2F1D] focus:outline-none focus:border-[#C8A261]"
                    >
                      <option value="compra">Adquisición Residencial</option>
                      <option value="inversion">Inversión Patrimonial</option>
                      <option value="visita_privada">Solicitud de Visita Privada</option>
                      <option value="tasacion">Valoración / Venta de Inmueble</option>
                      <option value="general">Consulta General</option>
                    </select>
                  </div>
                </div>

                {/* Budget Range */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#0A2F1D] mb-1">
                    Rango Estimado de Inversión
                  </label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#0A2F1D]/20 px-3 py-2.5 text-xs text-[#0A2F1D] focus:outline-none focus:border-[#C8A261]"
                  >
                    <option value="€2.0M - €3.5M">€2.000.000 - €3.500.000</option>
                    <option value="€3.5M - €5.0M">€3.500.000 - €5.000.000</option>
                    <option value="€5.0M - €7.5M">€5.000.000 - €7.500.000</option>
                    <option value="€7.5M+">Superior a €7.500.000</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#0A2F1D] mb-1">
                    Requerimientos Específicos o Fechas Preferidas (Opcional)
                  </label>
                  <textarea
                    rows={3}
                    maxLength={1000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describa sus preferencias de localización, metros cuadrados o requerimientos de seguridad..."
                    className="w-full bg-[#FDFBF7] border border-[#0A2F1D]/20 p-3 text-xs text-[#0A2F1D] focus:outline-none focus:border-[#C8A261]"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 text-xs font-semibold uppercase tracking-wider bg-[#0A2F1D] text-[#FDFBF7] hover:bg-[#16432B] transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 text-[#C8A261]" />
                    <span>{isSubmitting ? 'Registrando Solicitud...' : 'Solicitar Asesoría Patrimonial'}</span>
                  </button>
                  <p className="text-[11px] text-[#132E22]/60 text-center mt-2">
                    Sus datos quedan protegidos conforme al RGPD y bajo secreto profesional.
                  </p>
                </div>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
