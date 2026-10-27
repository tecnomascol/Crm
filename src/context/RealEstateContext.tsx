import React, { createContext, useContext, useState } from 'react';
import { Property, ArchitecturalProject, Lead, CrmTask, UserProfile, BrandConfig, UserRole, PropertyStatus, LeadStatus } from '../types';
import { RealEstateStore } from '../services/store';
import { INITIAL_USERS } from '../data/mockData';

interface RealEstateContextType {
  brand: BrandConfig;
  updateBrand: (updates: Partial<BrandConfig>) => void;
  properties: Property[];
  projects: ArchitecturalProject[];
  leads: Lead[];
  tasks: CrmTask[];
  users: UserProfile[];
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserProfile;
  currentView: 'public' | 'crm';
  setCurrentView: (view: 'public' | 'crm') => void;
  crmTab: 'dashboard' | 'kanban' | 'leads' | 'inventory' | 'tasks' | 'brand' | 'firebase';
  setCrmTab: (tab: 'dashboard' | 'kanban' | 'leads' | 'inventory' | 'tasks' | 'brand' | 'firebase') => void;
  selectedProperty: Property | null;
  setSelectedProperty: (prop: Property | null) => void;
  inquiryProperty: Property | null;
  setInquiryProperty: (prop: Property | null) => void;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Lead;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  updateLeadNotes: (id: string, notes: string) => void;
  assignLeadAdvisor: (leadId: string, advisorId: string, advisorName: string) => void;
  deleteLead: (id: string) => void;
  saveProperty: (prop: Property) => void;
  updatePropertyStatus: (id: string, status: PropertyStatus) => void;
  toggleTask: (id: string) => void;
  addTask: (task: Omit<CrmTask, 'id' | 'createdAt'>) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  filterLocation: string;
  setFilterLocation: (loc: string) => void;
  filterMaxPrice: number;
  setFilterMaxPrice: (price: number) => void;
}

const RealEstateContext = createContext<RealEstateContextType | undefined>(undefined);

export const RealEstateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brand, setBrandState] = useState<BrandConfig>(RealEstateStore.getBrand());
  const [properties, setPropertiesState] = useState<Property[]>(RealEstateStore.getProperties());
  const [projects] = useState<ArchitecturalProject[]>(RealEstateStore.getProjects());
  const [leads, setLeadsState] = useState<Lead[]>(RealEstateStore.getLeads());
  const [tasks, setTasksState] = useState<CrmTask[]>(RealEstateStore.getTasks());
  const [currentRole, setCurrentRoleState] = useState<UserRole>(RealEstateStore.getCurrentRole());
  const [currentView, setCurrentView] = useState<'public' | 'crm'>('public');
  const [crmTab, setCrmTab] = useState<'dashboard' | 'kanban' | 'leads' | 'inventory' | 'tasks' | 'brand' | 'firebase'>('dashboard');
  
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [inquiryProperty, setInquiryProperty] = useState<Property | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters for public catalog
  const [filterType, setFilterType] = useState<string>('todos');
  const [filterLocation, setFilterLocation] = useState<string>('todas');
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(10000000);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const updateBrand = (updates: Partial<BrandConfig>) => {
    const updated = RealEstateStore.updateBrand(updates);
    setBrandState(updated);
    showToast('Identidad de marca actualizada con éxito');
  };

  const setRole = (role: UserRole) => {
    RealEstateStore.setCurrentRole(role);
    setCurrentRoleState(role);
    showToast(`Sesión activa cambiada al rol: ${role.replace('_', ' ').toUpperCase()}`);
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLead = RealEstateStore.addLead(leadData);
    setLeadsState(RealEstateStore.getLeads());
    showToast('Su solicitud de consultoría ha sido registrada correctamente');
    return newLead;
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    const updated = RealEstateStore.updateLeadStatus(id, status);
    setLeadsState(updated);
    showToast(`Estado del prospecto actualizado a: ${status.replace('_', ' ')}`);
  };

  const updateLeadNotes = (id: string, notes: string) => {
    const updated = RealEstateStore.updateLeadNotes(id, notes);
    setLeadsState(updated);
    showToast('Notas de seguimiento actualizadas');
  };

  const assignLeadAdvisor = (leadId: string, advisorId: string, advisorName: string) => {
    const updated = RealEstateStore.assignLeadAdvisor(leadId, advisorId, advisorName);
    setLeadsState(updated);
    showToast(`Prospecto asignado a ${advisorName}`);
  };

  const deleteLead = (id: string) => {
    const updated = RealEstateStore.deleteLead(id);
    setLeadsState(updated);
    showToast('Prospecto archivado');
  };

  const saveProperty = (prop: Property) => {
    const updated = RealEstateStore.saveProperty(prop);
    setPropertiesState(updated);
    showToast('Propiedad guardada en el catálogo');
  };

  const updatePropertyStatus = (id: string, status: PropertyStatus) => {
    const updated = RealEstateStore.updatePropertyStatus(id, status);
    setPropertiesState(updated);
    showToast(`Estado de propiedad cambiado a: ${status}`);
  };

  const toggleTask = (id: string) => {
    const updated = RealEstateStore.toggleTask(id);
    setTasksState(updated);
  };

  const addTask = (task: Omit<CrmTask, 'id' | 'createdAt'>) => {
    const newTask = RealEstateStore.addTask(task);
    setTasksState(RealEstateStore.getTasks());
    showToast('Nueva tarea comercial programada');
  };

  const currentUser = RealEstateStore.getCurrentUser();

  return (
    <RealEstateContext.Provider
      value={{
        brand,
        updateBrand,
        properties,
        projects,
        leads,
        tasks,
        users: INITIAL_USERS,
        currentRole,
        setRole,
        currentUser,
        currentView,
        setCurrentView,
        crmTab,
        setCrmTab,
        selectedProperty,
        setSelectedProperty,
        inquiryProperty,
        setInquiryProperty,
        addLead,
        updateLeadStatus,
        updateLeadNotes,
        assignLeadAdvisor,
        deleteLead,
        saveProperty,
        updatePropertyStatus,
        toggleTask,
        addTask,
        toastMessage,
        showToast,
        filterType,
        setFilterType,
        filterLocation,
        setFilterLocation,
        filterMaxPrice,
        setFilterMaxPrice,
      }}
    >
      {children}
    </RealEstateContext.Provider>
  );
};

export const useRealEstate = () => {
  const context = useContext(RealEstateContext);
  if (!context) {
    throw new Error('useRealEstate must be used within RealEstateProvider');
  }
  return context;
};
