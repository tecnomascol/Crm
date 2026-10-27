import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { useAuth } from '../../context/AuthContext';
import { CRMUser, UserRole } from '../../types/crm';
import { 
  Users, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Info,
  UserPlus
} from 'lucide-react';

export const UsersModule: React.FC = () => {
  const { users, updateUserRole, showToast } = useCrm();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  const [search, setSearch] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'all' | UserRole>('all');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [tempRole, setTempRole] = useState<UserRole>('advisor');
  const [showBootstrapGuide, setShowBootstrapGuide] = useState(false);

  const filteredUsers = users.filter((u: CRMUser) => {
    if (selectedRoleFilter !== 'all' && u.role !== selectedRoleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return u.displayName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  const handleStartRoleChange = (u: CRMUser) => {
    if (!isAdmin) {
      showToast('Acceso denegado: Solo administradores pueden modificar roles.');
      return;
    }
    if (u.uid === currentUser?.uid) {
      showToast('Por seguridad, no puedes alterar tu propio rol de administrador.');
      return;
    }
    setEditingUserId(u.uid);
    setTempRole(u.role);
  };

  const handleSaveRole = (userId: string) => {
    updateUserRole(userId, tempRole);
    setEditingUserId(null);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0A2F1D]/10 text-[#0A2F1D] border border-[#0A2F1D]/20">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0A2F1D]" />
            Administrador
          </span>
        );
      case 'sales_director':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            Director Comercial
          </span>
        );
      case 'advisor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
            <Users className="w-3.5 h-3.5 text-stone-500" />
            Asesor Inmobiliario
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#0A2F1D]/10 text-[#0A2F1D]">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
              Equipo y Roles de Acceso
            </h1>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Control de usuarios con verificación obligatoria de correo y validación estricta de permisos RBAC.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBootstrapGuide(!showBootstrapGuide)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-200 bg-white text-stone-700 text-xs font-medium hover:bg-stone-50"
          >
            <Info className="w-3.5 h-3.5 text-stone-500" />
            Guía de Primer Admin
          </button>
        </div>
      </div>

      {/* RBAC Notice if not admin */}
      {!isAdmin && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-800">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-amber-900">Modo de Consulta de Usuarios</div>
            <p className="mt-0.5">
              Tu rol actual es <strong>{currentUser?.role}</strong>. Solo los usuarios con rol <strong>admin</strong> tienen privilegios para asignar permisos o degradar roles en Cloud Firestore.
            </p>
          </div>
        </div>
      )}

      {/* Bootstrap Admin Guide collapsible */}
      {showBootstrapGuide && (
        <div className="bg-stone-900 text-stone-200 rounded-xl p-5 border border-stone-700 text-xs space-y-3">
          <div className="flex items-center justify-between text-white font-semibold">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Procedimiento Seguro: Creación del Primer Administrador</span>
            </div>
            <button 
              onClick={() => setShowBootstrapGuide(false)}
              className="text-stone-400 hover:text-white"
            >
              Cerrar
            </button>
          </div>
          <p className="text-stone-300">
            Siguiendo las mejores prácticas de seguridad, el primer administrador no se registra con credenciales públicas ni contraseñas en texto plano:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-stone-300">
            <li>El usuario registra su cuenta con correo corporativo y verifica su enlace por email.</li>
            <li>El propietario de la infraestructura ejecuta la CLI de Firebase o Firebase Admin SDK en backend:</li>
          </ol>
          <pre className="bg-black/60 p-3 rounded-lg text-emerald-300 font-mono text-[11px] overflow-x-auto">
{`// Script seguro de bootstrap en backend autenticado
const admin = require('firebase-admin');
admin.initializeApp();
const auth = admin.auth();
const db = admin.firestore();

// 1. Asignar custom claim inmutable en Firebase Auth
await auth.setCustomUserClaims(uid, { role: 'admin', orgId: 'org_aurea_corp' });

// 2. Sincronizar documento en Firestore
await db.collection('users').doc(uid).set({
  role: 'admin',
  status: 'active',
  emailVerified: true,
  updatedAt: new Date().toISOString()
}, { merge: true });`}
          </pre>
        </div>
      )}

      {/* Role summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0A2F1D]" />
              Administradores
            </span>
            <span className="text-xs bg-stone-100 px-2 py-0.5 rounded font-mono font-bold">
              {users.filter(u => u.role === 'admin').length}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Control de usuarios, configuración corporativa, reglas de Firestore y bitácora inmutable de auditoría.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-600" />
              Directores Comerciales
            </span>
            <span className="text-xs bg-stone-100 px-2 py-0.5 rounded font-mono font-bold">
              {users.filter(u => u.role === 'sales_director').length}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Gestión de inventario de lotes/unidades, catálogo de proyectos, reportes y métricas de conversión comercial.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-stone-600" />
              Asesores Inmobiliarios
            </span>
            <span className="text-xs bg-stone-100 px-2 py-0.5 rounded font-mono font-bold">
              {users.filter(u => u.role === 'advisor').length}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Atención y calificación de prospectos, agenda de videollamadas, tareas de seguimiento y notas de clientes.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Buscar colaborador por nombre o correo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#0A2F1D]"
        />

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['all', 'admin', 'sales_director', 'advisor'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedRoleFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                selectedRoleFilter === tab
                  ? 'bg-[#0A2F1D] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-stone-100'
              }`}
            >
              {tab === 'all' ? 'Todos' : tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">Correo & Verificación</th>
                <th className="py-3 px-4">Rol Asignado</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Registro</th>
                <th className="py-3 px-4 text-right">Gestión de Rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {filteredUsers.map((u: CRMUser) => {
                const isEditing = editingUserId === u.uid;
                const isSelf = u.uid === currentUser?.uid;

                return (
                  <tr key={u.uid} className="hover:bg-stone-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0A2F1D] text-white font-serif font-bold flex items-center justify-center text-xs shadow-xs">
                          {u.displayName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            {u.displayName}
                            {isSelf && (
                              <span className="text-[10px] bg-stone-100 text-stone-600 font-normal px-1.5 py-0.5 rounded">
                                Tú
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 font-mono">UID: {u.uid.slice(0, 10)}...</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-800">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {u.email}
                      </div>
                      <div className="mt-1">
                        {u.emailVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Email verificado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                            <XCircle className="w-3 h-3 text-amber-500" />
                            Pendiente verificación
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={tempRole}
                            onChange={(e) => setTempRole(e.target.value as UserRole)}
                            className="text-xs p-1.5 rounded border border-stone-300 focus:ring-1 focus:ring-[#0A2F1D]"
                          >
                            <option value="advisor">Asesor Inmobiliario</option>
                            <option value="sales_director">Director Comercial</option>
                            <option value="admin">Administrador</option>
                          </select>
                          <button
                            onClick={() => handleSaveRole(u.uid)}
                            className="px-2 py-1 bg-[#0A2F1D] text-white rounded text-xs font-medium hover:bg-[#071E13]"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="text-xs text-stone-500 hover:text-stone-700"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        getRoleBadge(u.role)
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {u.status === 'active' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                          Activo
                        </span>
                      )}
                      {u.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700">
                          Pendiente
                        </span>
                      )}
                      {u.status === 'suspended' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-700">
                          Suspendido
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-gray-700">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {u.createdAt.split('T')[0]}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isAdmin ? (
                        isSelf ? (
                          <span className="text-[11px] text-gray-600 italic">No auto-modificable</span>
                        ) : !isEditing ? (
                          <button
                            onClick={() => handleStartRoleChange(u)}
                            className="text-xs text-[#0A2F1D] hover:underline font-medium"
                          >
                            Cambiar rol
                          </button>
                        ) : null
                      ) : (
                        <span className="text-[11px] text-gray-600 flex items-center justify-end gap-1">
                          <Lock className="w-3 h-3" /> Solo Admin
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
