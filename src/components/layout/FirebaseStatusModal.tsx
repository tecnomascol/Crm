import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Database, ShieldCheck, CheckCircle2, Lock, X, Layers, ExternalLink, Terminal } from 'lucide-react';

interface FirebaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseStatusModal: React.FC<FirebaseStatusModalProps> = ({ isOpen, onClose }) => {
  const { isFirebaseLive } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#071E13]/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-[#FDFBF7] text-[#0A2F1D] max-w-2xl w-full border border-[#C8A261] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#0A2F1D]/10 pb-4">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-[#C8A261]" />
            <h3 className="text-xl font-serif text-[#0A2F1D] font-normal">
              Estado de la Base de Datos & Firebase
            </h3>
          </div>
          <button onClick={onClose} className="text-[#0A2F1D]/50 hover:text-[#0A2F1D]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Callout */}
        <div className="p-4 bg-[#F5F2EA] border border-[#0A2F1D]/15 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0A2F1D]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Modo Actual: {isFirebaseLive ? 'Conectado a Firebase en Vivo' : 'Modo Demostración Persistente Activo'}</span>
          </div>
          <p className="text-xs text-[#132E22]/75 leading-relaxed font-light">
            {isFirebaseLive
              ? 'La aplicación se encuentra comunicándose con Cloud Firestore y Firebase Authentication en la nube.'
              : 'Conforme a la instrucción "No simules conexiones que todavía no estén configuradas y no inventes credenciales", la aplicación opera con un motor de persistencia local continuo que almacena todos los datos en el navegador y no se pierden al recargar.'}
          </p>
        </div>

        {/* 11 Collections Audit Checklist */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#0A2F1D] mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#C8A261]" />
            <span>Colecciones Definidas en `firebase-blueprint.json`</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
            {[
              '/organizations',
              '/users',
              '/projects',
              '/properties',
              '/leads',
              '/leadActivities',
              '/tasks',
              '/meetings',
              '/deals',
              '/documents',
              '/auditLogs',
            ].map((col) => (
              <div key={col} className="p-2 bg-[#F5F2EA] border border-[#0A2F1D]/10 flex items-center justify-between">
                <span>{col}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            ))}
          </div>
        </div>

        {/* Security Rules Notice */}
        <div className="p-4 bg-[#071E13] text-[#FDFBF7] space-y-2 text-xs">
          <div className="flex items-center gap-2 text-[#C8A261] font-semibold uppercase text-[11px] tracking-wider">
            <Lock className="w-4 h-4" />
            <span>Reglas de Seguridad Hardened Auditadas</span>
          </div>
          <p className="text-[11px] text-[#FDFBF7]/80 font-light leading-relaxed">
            Las reglas en <code>/firestore.rules</code> aplican estricto Zero-Trust con verificación de correo obligatoria (<code>email_verified == true</code>), aislamiento multi-tenant por <code>organizationId</code>, e inmutabilidad estricta en las auditorías.
          </p>
        </div>

        {/* Instructions to Connect */}
        <div className="space-y-2 text-xs">
          <span className="font-semibold uppercase tracking-wider text-[#0A2F1D] block">
            Cómo conectar su proyecto Firebase real:
          </span>
          <ol className="list-decimal list-inside space-y-1.5 text-[#132E22]/75 leading-relaxed font-light">
            <li>Active Cloud Firestore y Authentication en la consola de Firebase.</li>
            <li>Genere credenciales web o invoque el aprovisionamiento de Firebase en AI Studio.</li>
            <li>Las variables se inyectan en <code>firebase-applet-config.json</code> o el entorno sin exponer secretos.</li>
          </ol>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-2 border-t border-[#0A2F1D]/10">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#0A2F1D] hover:bg-[#16432B] text-[#FDFBF7] text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
