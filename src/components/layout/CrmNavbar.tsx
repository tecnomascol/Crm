import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/crm';
import { 
  Search, 
  Bell, 
  LogOut, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  X,
  Menu
} from 'lucide-react';

interface CrmNavbarProps {
  onToggleMobileSidebar: () => void;
}

export const CrmNavbar: React.FC<CrmNavbarProps> = ({ onToggleMobileSidebar }) => {
  const { globalSearch, setGlobalSearch, organization, tasks, setActiveModule, setSelectedLead, leads } = useCrm();
  const { currentUser, logout, switchUserRoleDemo } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const urgentTasks = tasks.filter((t) => !t.completed && t.priority === 'alta');

  const getRoleDisplayName = (role?: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'sales_director':
        return 'Directora Comercial';
      case 'advisor':
        return 'Asesor Senior';
      default:
        return 'Usuario';
    }
  };

  const getRoleBadgeColor = (role?: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-[#C8A261] text-[#071E13] font-bold';
      case 'sales_director':
        return 'bg-[#0A2F1D] text-[#C8A261] border border-[#C8A261]/40 font-semibold';
      case 'advisor':
        return 'bg-[#16432B] text-[#FDFBF7] font-medium';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  return (
    <header className="h-20 bg-[#FDFBF7] border-b border-[#0A2F1D]/10 px-6 flex items-center justify-between gap-6 sticky top-0 z-20 shadow-xs">
      
      {/* Left zone: Mobile toggle & Global Search */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 text-[#0A2F1D] hover:text-[#C8A261]"
          aria-label="Abrir navegación"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Box */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#0A2F1D]/40 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Búsqueda global (prospectos, teléfonos, proyectos, código)..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full bg-[#F5F2EA] border border-[#0A2F1D]/15 pl-9 pr-8 py-2 text-xs text-[#0A2F1D] focus:outline-none focus:border-[#C8A261] placeholder:text-[#132E22]/40"
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch('')}
              className="absolute right-2.5 top-2.5 text-[#0A2F1D]/40 hover:text-[#0A2F1D]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right zone: Notifications, Role Switcher & User Profile */}
      <div className="flex items-center gap-4 shrink-0">
        
        {/* Quick Role Switcher for RBAC verification */}
        <div className="hidden lg:flex items-center gap-2 bg-[#F5F2EA] px-3 py-1.5 border border-[#0A2F1D]/10 text-xs">
          <span className="text-[11px] text-[#132E22]/60 uppercase font-semibold">Simular Rol:</span>
          <select
            value={currentUser?.role || 'advisor'}
            onChange={(e) => switchUserRoleDemo(e.target.value as UserRole)}
            className="bg-transparent text-xs font-semibold text-[#0A2F1D] focus:outline-none cursor-pointer"
          >
            <option value="admin">Administrador (Carlos Mendoza)</option>
            <option value="sales_director">Directora Comercial (Elena Valdés)</option>
            <option value="advisor">Asesor Senior (Mateo Rivas)</option>
          </select>
        </div>

        {/* Urgent Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-[#0A2F1D] hover:text-[#C8A261] hover:bg-[#F5F2EA] relative transition-colors"
            title="Notificaciones de tareas urgentes"
          >
            <Bell className="w-5 h-5" />
            {urgentTasks.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full" />
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#FDFBF7] border border-[#C8A261]/40 shadow-2xl p-4 text-xs space-y-3 z-50 animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#0A2F1D]/10 pb-2">
                <span className="font-semibold uppercase tracking-wider text-[#0A2F1D]">
                  Tareas Prioritarias ({urgentTasks.length})
                </span>
                <button onClick={() => setShowNotifications(false)} className="text-[#0A2F1D]/40 hover:text-[#0A2F1D]">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {urgentTasks.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {urgentTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setActiveModule('tasks');
                        setShowNotifications(false);
                      }}
                      className="p-2.5 bg-[#F5F2EA] hover:bg-[#EAE4D7] border border-[#0A2F1D]/10 cursor-pointer transition-colors"
                    >
                      <div className="font-semibold text-[#0A2F1D]">{t.title}</div>
                      <div className="text-[10px] text-red-700 font-semibold mt-1">
                        Vence: {new Date(t.dueDate).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-[#132E22]/60 italic">
                  No hay alertas urgentes pendientes.
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Identity Lockup */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#0A2F1D]/10">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-[#0A2F1D] leading-tight">
              {currentUser?.displayName || 'Usuario CRM'}
            </div>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <span className={`text-[9px] uppercase px-1.5 py-0.2 tracking-wider ${getRoleBadgeColor(currentUser?.role)}`}>
                {getRoleDisplayName(currentUser?.role)}
              </span>
              {currentUser?.emailVerified && (
                <span title="Correo verificado">
                  <CheckCircle className="w-3 h-3 text-emerald-600 inline" />
                </span>
              )}
            </div>
          </div>

          {/* Logout Action */}
          <button
            onClick={logout}
            className="p-2 text-[#0A2F1D]/70 hover:text-red-700 hover:bg-red-50 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>

    </header>
  );
};
