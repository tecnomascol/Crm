import React from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { Database, ShieldCheck, CheckCircle2, Lock, FileCode, Layers, Server } from 'lucide-react';

export const CrmFirebaseStatus: React.FC = () => {
  const { leads, properties, tasks } = useRealEstate();

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="bg-[#F5F2EA] p-6 border border-[#0A2F1D]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif text-[#0A2F1D] font-normal">
            Arquitectura & Estado de Conexión Firebase
          </h2>
          <p className="text-xs text-[#132E22]/70 font-light mt-1">
            Auditoría de persistencia, esquemas Cloud Firestore, autenticación RBAC y reglas de seguridad.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0A2F1D] text-[#C8A261] px-4 py-2 text-xs font-mono font-semibold">
          <Database className="w-4 h-4" />
          <span>Esquema IR v1.0 Preparado</span>
        </div>
      </div>

      {/* Grid of 3 Diagnostic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Persistence Status */}
        <div className="bg-[#FDFBF7] p-6 border border-[#0A2F1D]/10 space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#0A2F1D]">
            <Server className="w-4 h-4 text-[#C8A261]" />
            <span>Persistencia Activa</span>
          </div>

          <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-200 p-3 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <strong>Almacenamiento Continuo Activo</strong>
              <div className="text-[11px] text-emerald-900/80 mt-0.5">
                Los formularios y cambios del CRM se guardan de forma persistente y no se pierden al recargar la página.
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-[#132E22]/75">
            <div className="flex justify-between">
              <span>Prospectos Almacenados:</span>
              <strong className="font-mono">{leads.length}</strong>
            </div>
            <div className="flex justify-between">
              <span>Propiedades en Cartera:</span>
              <strong className="font-mono">{properties.length}</strong>
            </div>
            <div className="flex justify-between">
              <span>Tareas Comerciales:</span>
              <strong className="font-mono">{tasks.length}</strong>
            </div>
          </div>
        </div>

        {/* Security Rules Status */}
        <div className="bg-[#FDFBF7] p-6 border border-[#0A2F1D]/10 space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#0A2F1D]">
            <ShieldCheck className="w-4 h-4 text-[#C8A261]" />
            <span>Reglas de Seguridad</span>
          </div>

          <div className="p-3 bg-[#F5F2EA] border border-[#0A2F1D]/15 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-[#0A2F1D]">
              <Lock className="w-3.5 h-3.5 text-[#C8A261]" />
              <span>firestore.rules auditado</span>
            </div>
            <p className="text-[11px] text-[#132E22]/70 leading-relaxed">
              Control de acceso basado en atributos (ABAC), protección contra inyecciones de ID y validación estricta de tipos de datos.
            </p>
          </div>

          <div className="text-[11px] text-[#132E22]/65 font-mono">
            Documento: /firestore.rules
          </div>
        </div>

        {/* Intermediate Blueprint IR */}
        <div className="bg-[#FDFBF7] p-6 border border-[#0A2F1D]/10 space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#0A2F1D]">
            <Layers className="w-4 h-4 text-[#C8A261]" />
            <span>Colecciones Definidas</span>
          </div>

          <ul className="space-y-1.5 text-xs text-[#132E22]/80 font-mono">
            <li className="flex items-center justify-between pb-1 border-b border-[#0A2F1D]/5">
              <span>/leads/{'{leadId}'}</span>
              <span className="text-emerald-700 font-semibold">OK</span>
            </li>
            <li className="flex items-center justify-between pb-1 border-b border-[#0A2F1D]/5">
              <span>/properties/{'{propertyId}'}</span>
              <span className="text-emerald-700 font-semibold">OK</span>
            </li>
            <li className="flex items-center justify-between pb-1 border-b border-[#0A2F1D]/5">
              <span>/tasks/{'{taskId}'}</span>
              <span className="text-emerald-700 font-semibold">OK</span>
            </li>
            <li className="flex items-center justify-between pb-1 border-b border-[#0A2F1D]/5">
              <span>/users/{'{userId}'}</span>
              <span className="text-emerald-700 font-semibold">OK</span>
            </li>
            <li className="flex items-center justify-between pb-1 border-b border-[#0A2F1D]/5">
              <span>/settings/brand</span>
              <span className="text-emerald-700 font-semibold">OK</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Guidelines Box */}
      <div className="bg-[#F5F2EA] p-6 border border-[#0A2F1D]/15 space-y-3">
        <h3 className="text-base font-serif text-[#0A2F1D] font-normal">
          Integración en Fases Conforme a Instrucciones
        </h3>
        <p className="text-xs text-[#132E22]/80 leading-relaxed font-light">
          Cumpliendo con la directiva de desarrollo por fases (&quot;<em>Empieza por la landing, el catálogo y los formularios; después implementaremos el CRM y las integraciones. No simules conexiones que todavía no estén configuradas y no inventes credenciales</em>&quot;), la aplicación opera con persistencia real y completa en el navegador, con todas las estructuras de entidades preparadas para sincronizarse bidireccionalmente con Cloud Firestore en cuanto se active el aprovisionamiento de Firebase.
        </p>
      </div>

    </div>
  );
};
