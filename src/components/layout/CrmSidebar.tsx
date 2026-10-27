import React from 'react';
import { useCrm, CrmModule } from '../../context/CrmContext';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  KanbanSquare, 
  Building2, 
  Home, 
  CheckSquare, 
  Briefcase, 
  ShieldCheck, 
  FileText, 
  Settings, 
  Database,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface CrmSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenFirebaseModal: () => void;
}

export const CrmSidebar: React.FC<CrmSidebarProps> = ({ 
  collapsed, 
  onToggleCollapse, 
  onOpenFirebaseModal 
}) => {
  const { activeModule, setActiveModule, leads, tasks, organization } = useCrm();
  const { currentUser, isFirebaseLive } = useAuth();

  const newLeadsCount = leads.filter((l) => l.stage === 'lead_nuevo').length;
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  const menuItems = [
    { id: 'dashboard' as CrmModule, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads' as CrmModule, label: 'Prospectos', icon: Users, badge: newLeadsCount > 0 ? `${newLeadsCount}` : undefined },
    { id: 'kanban' as CrmModule, label: 'Embudo Kanban', icon: KanbanSquare, badge: `${leads.length}` },
    { id: 'projects' as CrmModule, label: 'Proyectos', icon: Building2 },
    { id: 'inventory' as CrmModule, label: 'Inventario', icon: Home },
    { id: 'tasks' as CrmModule, label: 'Tareas & Citas', icon: CheckSquare, badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : undefined },
    { id: 'deals' as CrmModule, label: 'Negocios & Cierres', icon: Briefcase },
    { id: 'users' as CrmModule, label: 'Equipo & Roles', icon: ShieldCheck },
    { id: 'audit' as CrmModule, label: 'Auditoría', icon: FileText },
    { id: 'settings' as CrmModule, label: 'Configuración', icon: Settings },
  ];

  return (
    <aside
      className={`bg-[#071E13] text-[#FDFBF7] border-r border-[#C8A261]/25 flex flex-col justify-between transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Brand Section */}
      <div>
        <div className="h-20 px-4 flex items-center justify-between border-b border-[#C8A261]/20">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <span className="text-xl font-brand font-bold tracking-widest text-[#FDFBF7] uppercase">
                {organization.logoLettermark || 'AUREA'}
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-[#0A2F1D] border border-[#C8A261]/40 text-[#C8A261]">
                CRM
              </span>
            </div>
          ) : (
            <div className="w-full text-center font-brand font-bold text-lg text-[#C8A261]">
              A
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="p-1.5 text-[#FDFBF7]/60 hover:text-[#C8A261] hover:bg-[#0A2F1D] transition-colors"
            title={collapsed ? 'Expandir barra lateral' : 'Contraer barra lateral'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-[#C8A261] text-[#071E13] shadow-sm font-bold'
                    : 'text-[#FDFBF7]/75 hover:text-[#FDFBF7] hover:bg-[#0A2F1D]'
                } ${collapsed ? 'justify-center' : 'justify-between'}`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 font-mono ${
                      isActive ? 'bg-[#071E13] text-[#C8A261]' : 'bg-[#0A2F1D] text-[#C8A261]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status & Diagnostic Link */}
      <div className="p-3 border-t border-[#C8A261]/20">
        <button
          onClick={onOpenFirebaseModal}
          className={`w-full p-2.5 bg-[#0A2F1D] hover:bg-[#132E22] border border-[#C8A261]/30 transition-colors flex items-center gap-2 text-left ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}
          title="Ver estado de conexión a Cloud Firestore"
        >
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#C8A261] shrink-0" />
            {!collapsed && (
              <div className="text-[10px] leading-tight">
                <div className="text-[#C8A261] font-semibold uppercase">
                  {isFirebaseLive ? 'Firebase En Vivo' : 'Modo Demostración'}
                </div>
                <div className="text-[#FDFBF7]/60">Esquema v2.0 Listo</div>
              </div>
            )}
          </div>
          {!collapsed && <ExternalLink className="w-3 h-3 text-[#FDFBF7]/40" />}
        </button>
      </div>
    </aside>
  );
};
