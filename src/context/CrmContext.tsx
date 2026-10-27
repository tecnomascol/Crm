import React, { createContext, useContext, useState } from 'react';
import { 
  Lead, 
  LeadActivity,
  Project, 
  PropertyItem, 
  Task, 
  Deal, 
  AuditLog, 
  OrganizationConfig, 
  CRMUser, 
  UserRole, 
  LeadStage,
  PropertyStatus
} from '../types/crm';
import { CRMStorage } from '../services/crmStorage';
import { useAuth } from './AuthContext';

export type CrmModule = 
  | 'dashboard'
  | 'leads'
  | 'kanban'
  | 'projects'
  | 'inventory'
  | 'tasks'
  | 'deals'
  | 'users'
  | 'audit'
  | 'settings';

interface CrmContextType {
  organization: OrganizationConfig;
  updateOrganization: (updates: Partial<OrganizationConfig>) => void;
  leads: Lead[];
  projects: Project[];
  properties: PropertyItem[];
  tasks: Task[];
  deals: Deal[];
  users: CRMUser[];
  auditLogs: AuditLog[];
  activeModule: CrmModule;
  setActiveModule: (m: CrmModule) => void;
  selectedLead: Lead | null;
  setSelectedLead: (l: Lead | null) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  // CRUD actions
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  updateLeadStage: (id: string, stage: LeadStage) => void;
  addLeadActivity: (leadId: string, title: string, desc: string, type?: LeadActivity['type']) => void;
  saveProject: (project: Project) => void;
  saveProperty: (prop: PropertyItem) => void;
  updatePropertyStatus: (id: string, status: PropertyStatus) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  toggleTask: (id: string) => void;
  saveDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDealOutcome: (id: string, outcome: Deal['outcome']) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  checkDuplicates: (phone: string, email: string, excludeId?: string) => Lead[];
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

export const CrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [organization, setOrgState] = useState<OrganizationConfig>(CRMStorage.getOrganization());
  const [leads, setLeadsState] = useState<Lead[]>(CRMStorage.getLeads());
  const [projects, setProjectsState] = useState<Project[]>(CRMStorage.getProjects());
  const [properties, setPropertiesState] = useState<PropertyItem[]>(CRMStorage.getProperties());
  const [tasks, setTasksState] = useState<Task[]>(CRMStorage.getTasks());
  const [deals, setDealsState] = useState<Deal[]>(CRMStorage.getDeals());
  const [users, setUsersState] = useState<CRMUser[]>(CRMStorage.getUsers());
  const [auditLogs, setAuditLogsState] = useState<AuditLog[]>(CRMStorage.getAuditLogs());

  const [activeModule, setActiveModule] = useState<CrmModule>('dashboard');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const getActor = (): CRMUser => {
    return currentUser || CRMStorage.getCurrentUser() || {
      uid: 'system',
      organizationId: organization.id,
      displayName: 'Sistema',
      email: 'system@aurea.local',
      emailVerified: true,
      role: 'advisor',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
  };

  const updateOrganization = (updates: Partial<OrganizationConfig>) => {
    const updated = CRMStorage.updateOrganization(updates, getActor());
    setOrgState(updated);
    setAuditLogsState(CRMStorage.getAuditLogs());
    showToast('Configuración institucional actualizada con éxito.');
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const actor = getActor();
    const newLead = CRMStorage.addLead(leadData, actor);
    setLeadsState(CRMStorage.getLeads());
    setAuditLogsState(CRMStorage.getAuditLogs());
    showToast(`Prospecto "${newLead.fullName}" registrado exitosamente.`);
    return newLead;
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    const actor = getActor();
    const updated = CRMStorage.updateLead(id, updates, actor);
    setLeadsState(updated);
    setAuditLogsState(CRMStorage.getAuditLogs());
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, ...updates });
    }
    showToast('Ficha del prospecto actualizada.');
  };

  const updateLeadStage = (id: string, stage: LeadStage) => {
    const actor = getActor();
    const updated = CRMStorage.updateLead(id, { stage }, actor);
    setLeadsState(updated);
    setAuditLogsState(CRMStorage.getAuditLogs());
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, stage });
    }
    showToast(`Prospecto movido a etapa: ${stage.replace('_', ' ')}.`);
  };

  const deleteLead = (id: string) => {
    try {
      const actor = getActor();
      const updated = CRMStorage.deleteLead(id, actor);
      setLeadsState(updated);
      setAuditLogsState(CRMStorage.getAuditLogs());
      if (selectedLead?.id === id) setSelectedLead(null);
      showToast('Prospecto archivado.');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al eliminar.';
      showToast(msg);
    }
  };

  const addLeadActivity = (
    leadId: string, 
    title: string, 
    desc: string, 
    type: LeadActivity['type'] = 'nota'
  ) => {
    const actor = getActor();
    CRMStorage.addActivity({
      organizationId: organization.id,
      leadId,
      type,
      title,
      description: desc,
      performedBy: actor.uid,
      performedByName: actor.displayName,
    });
    showToast('Actividad registrada en el historial.');
  };

  const saveProject = (project: Project) => {
    try {
      const actor = getActor();
      const updated = CRMStorage.saveProject(project, actor);
      setProjectsState(updated);
      setAuditLogsState(CRMStorage.getAuditLogs());
      showToast('Proyecto inmobiliario guardado.');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error guardando proyecto.';
      showToast(msg);
    }
  };

  const saveProperty = (prop: PropertyItem) => {
    try {
      const actor = getActor();
      const updated = CRMStorage.saveProperty(prop, actor);
      setPropertiesState(updated);
      setAuditLogsState(CRMStorage.getAuditLogs());
      showToast('Unidad de inventario guardada.');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error guardando propiedad.';
      showToast(msg);
    }
  };

  const updatePropertyStatus = (id: string, status: PropertyStatus) => {
    try {
      const actor = getActor();
      const updated = CRMStorage.updatePropertyStatus(id, status, actor);
      setPropertiesState(updated);
      setAuditLogsState(CRMStorage.getAuditLogs());
      showToast(`Estado de inventario actualizado a "${status}".`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error actualizando estado.';
      showToast(msg);
    }
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask = CRMStorage.saveTask(taskData);
    setTasksState(CRMStorage.getTasks());
    showToast(`Tarea "${newTask.title}" programada.`);
  };

  const toggleTask = (id: string) => {
    const updated = CRMStorage.toggleTask(id);
    setTasksState(updated);
  };

  const saveDeal = (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const actor = getActor();
    const newDeal = CRMStorage.saveDeal(dealData, actor);
    setDealsState(CRMStorage.getDeals());
    setAuditLogsState(CRMStorage.getAuditLogs());
    showToast(`Negocio por valor de €${newDeal.estimatedValue} registrado.`);
  };

  const updateDealOutcome = (id: string, outcome: Deal['outcome']) => {
    const actor = getActor();
    const updated = CRMStorage.updateDealOutcome(id, outcome, actor);
    setDealsState(updated);
    showToast(`Resultado del negocio actualizado a "${outcome}".`);
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    try {
      const actor = getActor();
      const updated = CRMStorage.updateUserRole(userId, newRole, actor);
      setUsersState(updated);
      setAuditLogsState(CRMStorage.getAuditLogs());
      showToast(`Rol de usuario actualizado a "${newRole}".`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error modificando rol.';
      showToast(msg);
    }
  };

  const checkDuplicates = (phone: string, email: string, excludeId?: string) => {
    return CRMStorage.findDuplicates(phone, email, excludeId);
  };

  return (
    <CrmContext.Provider
      value={{
        organization,
        updateOrganization,
        leads,
        projects,
        properties,
        tasks,
        deals,
        users,
        auditLogs,
        activeModule,
        setActiveModule,
        selectedLead,
        setSelectedLead,
        globalSearch,
        setGlobalSearch,
        toastMessage,
        showToast,
        addLead,
        updateLead,
        deleteLead,
        updateLeadStage,
        addLeadActivity,
        saveProject,
        saveProperty,
        updatePropertyStatus,
        addTask,
        toggleTask,
        saveDeal,
        updateDealOutcome,
        updateUserRole,
        checkDuplicates,
      }}
    >
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};
