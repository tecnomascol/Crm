import React from 'react';
import { useRealEstate } from '../../context/RealEstateContext';
import { 
  LayoutDashboard, 
  KanbanSquare, 
  Users, 
  Building, 
  CheckSquare, 
  Palette, 
  Database,
  LucideIcon 
} from 'lucide-react';

interface TabItem {
  id: 'dashboard' | 'kanban' | 'leads' | 'inventory' | 'tasks' | 'brand' | 'firebase';
  label: string;
  icon: LucideIcon;
  badge?: string | number;
}

export const CrmTabsNav: React.FC = () => {
  const { crmTab, setCrmTab, leads, tasks, properties } = useRealEstate();

  const newLeadsCount = leads.filter((l) => l.status === 'nuevo').length;
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  const tabs: TabItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kanban', label: 'Embudo Kanban', icon: KanbanSquare, badge: leads.length },
    { id: 'leads', label: 'Prospectos', icon: Users, badge: newLeadsCount > 0 ? `${newLeadsCount} nuevos` : undefined },
    { id: 'inventory', label: 'Inventario', icon: Building, badge: properties.length },
    { id: 'tasks', label: 'Tareas & Visitas', icon: CheckSquare, badge: pendingTasksCount > 0 ? pendingTasksCount : undefined },
    { id: 'brand', label: 'Marca & Logotipo', icon: Palette },
    { id: 'firebase', label: 'Estado Firebase', icon: Database },
  ];

  return (
    <div className="bg-[#0A2F1D] border-b border-[#C8A261]/20 overflow-x-auto">
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-1 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = crmTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCrmTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#C8A261] text-[#0A2F1D] shadow-sm'
                  : 'text-[#FDFBF7]/70 hover:text-[#FDFBF7] hover:bg-[#16432B]/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 font-mono ${
                    isActive ? 'bg-[#0A2F1D] text-[#C8A261]' : 'bg-[#071E13] text-[#C8A261]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
