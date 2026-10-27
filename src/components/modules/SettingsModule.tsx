import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Settings, 
  Palette, 
  Building2, 
  Mail, 
  Phone, 
  Sparkles, 
  Sliders, 
  Save, 
  ShieldCheck, 
  ShieldAlert,
  RotateCcw
} from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const { organization, updateOrganization, showToast } = useCrm();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  const [name, setName] = useState(organization.name);
  const [logoLettermark, setLogoLettermark] = useState(organization.logoLettermark);
  const [primaryColor, setPrimaryColor] = useState(organization.primaryColor);
  const [accentColor, setAccentColor] = useState(organization.accentColor);
  const [contactEmail, setContactEmail] = useState(organization.contactEmail);
  const [contactPhone, setContactPhone] = useState(organization.contactPhone);
  const [currencySymbol, setCurrencySymbol] = useState(organization.currencySymbol);

  // Scoring weights
  const [budgetWeight, setBudgetWeight] = useState(organization.scoringWeights?.budgetMinWeight ?? 30);
  const [paymentWeight, setPaymentWeight] = useState(organization.scoringWeights?.paymentMethodWeight ?? 30);
  const [activityWeight, setActivityWeight] = useState(organization.scoringWeights?.activityWeight ?? 40);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('Acceso denegado: Solo administradores pueden guardar ajustes corporativos.');
      return;
    }

    updateOrganization({
      name,
      logoLettermark,
      primaryColor,
      accentColor,
      contactEmail,
      contactPhone,
      currencySymbol,
      scoringWeights: {
        budgetMinWeight: Number(budgetWeight),
        paymentMethodWeight: Number(paymentWeight),
        activityWeight: Number(activityWeight),
      },
      updatedAt: new Date().toISOString(),
    });

    showToast('Configuración institucional guardada exitosamente.');
  };

  const resetDefaults = () => {
    setName('Áurea Luxury Real Estate');
    setLogoLettermark('ÁUREA');
    setPrimaryColor('#0A2F1D');
    setAccentColor('#C8A261');
    setCurrencySymbol('USD');
    setBudgetWeight(30);
    setPaymentWeight(30);
    setActivityWeight(40);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#0A2F1D]/10 text-[#0A2F1D]">
              <Settings className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
              Configuración & Marca
            </h1>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Personalización de marca blanca, reglas de puntuación algorítmica y parámetros del CRM.
          </p>
        </div>

        <button
          onClick={resetDefaults}
          disabled={!isAdmin}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-200 bg-white text-stone-700 text-xs font-medium hover:bg-stone-50 disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restablecer Valores
        </button>
      </div>

      {!isAdmin && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-xs text-amber-800">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            Solo los administradores del sistema pueden modificar y guardar la configuración institucional.
          </span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identidad de Marca */}
        <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Building2 className="w-4 h-4 text-[#0A2F1D]" />
            <h2 className="font-serif font-bold text-base text-gray-900">Identidad Corporativa</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Nombre Comercial de la Empresa</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isAdmin}
                className="w-full p-2.5 rounded-lg border border-stone-200 focus:ring-1 focus:ring-[#0A2F1D] disabled:bg-stone-50 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Logotipo / Letra Marca (Editorial)</label>
              <input
                type="text"
                value={logoLettermark}
                onChange={(e) => setLogoLettermark(e.target.value)}
                disabled={!isAdmin}
                className="w-full p-2.5 rounded-lg border border-stone-200 focus:ring-1 focus:ring-[#0A2F1D] disabled:bg-stone-50 font-serif tracking-widest font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Correo Electrónico de Contacto</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                disabled={!isAdmin}
                className="w-full p-2.5 rounded-lg border border-stone-200 focus:ring-1 focus:ring-[#0A2F1D] disabled:bg-stone-50"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">WhatsApp / Teléfono de Concierge</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                disabled={!isAdmin}
                className="w-full p-2.5 rounded-lg border border-stone-200 focus:ring-1 focus:ring-[#0A2F1D] disabled:bg-stone-50"
                required
              />
            </div>
          </div>
        </div>

        {/* Paleta y Visuales */}
        <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Palette className="w-4 h-4 text-[#0A2F1D]" />
            <h2 className="font-serif font-bold text-base text-gray-900">Paleta de Colores & Moneda</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Color Primario (Verde Bosque)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  disabled={!isAdmin}
                  className="w-9 h-9 p-0.5 rounded border border-stone-200 cursor-pointer disabled:cursor-not-allowed"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  disabled={!isAdmin}
                  className="w-full p-2 rounded-lg border border-stone-200 font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Color Acento (Champagne Gold)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  disabled={!isAdmin}
                  className="w-9 h-9 p-0.5 rounded border border-stone-200 cursor-pointer disabled:cursor-not-allowed"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  disabled={!isAdmin}
                  className="w-full p-2 rounded-lg border border-stone-200 font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Símbolo de Moneda</label>
              <select
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                disabled={!isAdmin}
                className="w-full p-2 rounded-lg border border-stone-200 text-xs focus:ring-1 focus:ring-[#0A2F1D]"
              >
                <option value="USD">USD ($ - Dólar Estadounidense)</option>
                <option value="MXN">MXN ($ - Peso Mexicano)</option>
                <option value="COP">COP ($ - Peso Colombiano)</option>
                <option value="EUR">EUR (€ - Euro)</option>
              </select>
            </div>
          </div>

          {/* Live Preview Preview */}
          <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl text-white font-serif font-bold text-sm flex items-center justify-center shadow-xs"
                style={{ backgroundColor: primaryColor }}
              >
                {logoLettermark.slice(0, 2)}
              </div>
              <div>
                <div className="font-serif font-bold text-sm text-gray-900">{name}</div>
                <div className="text-xs text-gray-500">Vista previa en tiempo real de identidad corporativa</div>
              </div>
            </div>
            <div 
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-xs"
              style={{ backgroundColor: accentColor }}
            >
              Acento Champagne
            </div>
          </div>
        </div>

        {/* Parámetros de Calificación Algorítmica */}
        <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C8A261]" />
              <h2 className="font-serif font-bold text-base text-gray-900">
                Puntuación Algorítmica de Prospectos (0 - 100 pts)
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full">
              Suma Total: {Number(budgetWeight) + Number(paymentWeight) + Number(activityWeight)} / 100
            </span>
          </div>

          <p className="text-xs text-gray-500">
            Ajusta la ponderación matemática para calcular el puntaje de calificación de cada lead automáticamente según su capacidad de inversión, viabilidad de pago y nivel de interacción reciente.
          </p>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-gray-800 mb-1">
                <span>Ponderación Presupuesto &gt; $300,000</span>
                <span className="font-mono text-[#0A2F1D]">{budgetWeight} pts</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={budgetWeight}
                onChange={(e) => setBudgetWeight(Number(e.target.value))}
                disabled={!isAdmin}
                className="w-full accent-[#0A2F1D]"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-gray-800 mb-1">
                <span>Ponderación Forma de Pago (Contado / Fondos Propios)</span>
                <span className="font-mono text-[#0A2F1D]">{paymentWeight} pts</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={paymentWeight}
                onChange={(e) => setPaymentWeight(Number(e.target.value))}
                disabled={!isAdmin}
                className="w-full accent-[#0A2F1D]"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-gray-800 mb-1">
                <span>Ponderación Actividad Reciente (&lt; 7 días)</span>
                <span className="font-mono text-[#0A2F1D]">{activityWeight} pts</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={activityWeight}
                onChange={(e) => setActivityWeight(Number(e.target.value))}
                disabled={!isAdmin}
                className="w-full accent-[#0A2F1D]"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        {isAdmin && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0A2F1D] text-white hover:bg-[#071E13] font-medium text-sm shadow-sm transition"
            >
              <Save className="w-4 h-4" />
              Guardar Configuración
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
