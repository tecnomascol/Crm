import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { useAuth } from '../../context/AuthContext';
import { AuditLog } from '../../types/crm';
import { 
  FileText, 
  Search, 
  ShieldAlert, 
  Download, 
  Lock, 
  Clock, 
  User, 
  Filter,
  CheckCircle2
} from 'lucide-react';

export const AuditModule: React.FC = () => {
  const { auditLogs } = useCrm();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEntity, setFilterEntity] = useState<string>('all');

  const filteredLogs = auditLogs.filter((log: AuditLog) => {
    if (filterEntity !== 'all' && log.entityType !== filterEntity) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.userName.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.entityId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Fecha/Hora', 'Usuario', 'Rol', 'Acción', 'Entidad', 'Entidad ID', 'Detalles'];
    const rows = filteredLogs.map((l: AuditLog) => [
      l.id,
      l.timestamp,
      `"${l.userName}"`,
      l.userRole,
      `"${l.action}"`,
      l.entityType,
      l.entityId,
      `"${l.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bitacora_auditoria_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#0A2F1D]/10 text-[#0A2F1D]">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
              Bitácora de Auditoría
            </h1>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Registro cronológico inmutable de todas las mutaciones y eventos ejecutados en la plataforma.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-stone-200 bg-white text-stone-700 text-xs font-medium hover:bg-stone-50 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar Bitácora CSV
          </button>
        </div>
      </div>

      {/* Security badge info */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-stone-200/60 rounded-lg text-stone-700">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 flex items-center gap-1.5">
              <span>Registro Inmutable (Append-Only)</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                Protegido por Reglas de Firestore
              </span>
            </div>
            <p className="text-gray-500 mt-0.5">
              Ningún usuario, incluyendo administradores, puede modificar o eliminar eventos de la colección <code className="font-mono bg-stone-200/70 px-1 py-0.5 rounded">/auditLogs</code>.
            </p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <span className="font-mono text-sm font-bold text-gray-800">{auditLogs.length}</span>
          <span className="text-gray-400 text-xs ml-1">eventos grabados</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por acción, usuario o detalles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#0A2F1D]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-gray-400 mr-1" />
          {(['all', 'lead', 'deal', 'task', 'user', 'property', 'organization'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterEntity(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition whitespace-nowrap ${
                filterEntity === tab
                  ? 'bg-[#0A2F1D] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-stone-100'
              }`}
            >
              {tab === 'all' ? 'Todas' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-xs">
            No hay registros de auditoría que coincidan con la búsqueda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Fecha y Hora</th>
                  <th className="py-3 px-4">Usuario / Rol</th>
                  <th className="py-3 px-4">Acción</th>
                  <th className="py-3 px-4">Entidad</th>
                  <th className="py-3 px-4">Detalles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {filteredLogs.map((log: AuditLog) => (
                  <tr key={log.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-3 px-4 whitespace-nowrap text-gray-600 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{new Date(log.timestamp).toLocaleString('es-MX')}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        {log.userName}
                      </div>
                      <span className="text-[10px] text-gray-600 font-mono">
                        rol: {log.userRole}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded font-mono font-semibold bg-stone-100 text-stone-800 text-[11px]">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-medium text-gray-700 capitalize">
                        {log.entityType}
                      </div>
                      <div className="text-[10px] text-gray-600 font-mono">
                        {log.entityId.slice(0, 8)}...
                      </div>
                    </td>

                    <td className="py-3 px-4 text-gray-700">
                      <p className="max-w-xl truncate">{log.details}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
