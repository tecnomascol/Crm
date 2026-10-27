import { Property, ArchitecturalProject, Lead, CrmTask, UserProfile, BrandConfig, UserRole, PropertyStatus, LeadStatus } from '../types';
import { DEFAULT_BRAND, INITIAL_PROPERTIES, INITIAL_PROJECTS, INITIAL_LEADS, INITIAL_TASKS, INITIAL_USERS } from '../data/mockData';

const STORAGE_KEYS = {
  BRAND: 'aurea_brand_config_v1',
  PROPERTIES: 'aurea_properties_v1',
  PROJECTS: 'aurea_projects_v1',
  LEADS: 'aurea_leads_v1',
  TASKS: 'aurea_tasks_v1',
  CURRENT_USER_ROLE: 'aurea_user_role_v1',
};

// Safe storage helpers
function readStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function writeStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Error writing ${key} to storage:`, e);
  }
}

export class RealEstateStore {
  // Brand
  static getBrand(): BrandConfig {
    return readStorage<BrandConfig>(STORAGE_KEYS.BRAND, DEFAULT_BRAND);
  }

  static updateBrand(brand: Partial<BrandConfig>): BrandConfig {
    const current = this.getBrand();
    const updated = { ...current, ...brand, updatedAt: new Date().toISOString() };
    writeStorage(STORAGE_KEYS.BRAND, updated);
    return updated;
  }

  // Properties
  static getProperties(): Property[] {
    return readStorage<Property[]>(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
  }

  static getPropertyById(id: string): Property | undefined {
    return this.getProperties().find((p) => p.id === id);
  }

  static saveProperty(property: Property): Property[] {
    const properties = this.getProperties();
    const index = properties.findIndex((p) => p.id === property.id);
    let updated: Property[];
    if (index >= 0) {
      updated = [...properties];
      updated[index] = { ...property, updatedAt: new Date().toISOString() };
    } else {
      updated = [
        {
          ...property,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...properties,
      ];
    }
    writeStorage(STORAGE_KEYS.PROPERTIES, updated);
    return updated;
  }

  static updatePropertyStatus(id: string, status: PropertyStatus): Property[] {
    const properties = this.getProperties();
    const updated = properties.map((p) =>
      p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p
    );
    writeStorage(STORAGE_KEYS.PROPERTIES, updated);
    return updated;
  }

  // Projects
  static getProjects(): ArchitecturalProject[] {
    return readStorage<ArchitecturalProject[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  }

  // Leads
  static getLeads(): Lead[] {
    return readStorage<Lead[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS);
  }

  static addLead(newLead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Lead {
    const leads = this.getLeads();
    const lead: Lead = {
      ...newLead,
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [lead, ...leads];
    writeStorage(STORAGE_KEYS.LEADS, updated);
    return lead;
  }

  static updateLeadStatus(id: string, status: LeadStatus): Lead[] {
    const leads = this.getLeads();
    const updated = leads.map((l) =>
      l.id === id ? { ...l, status, updatedAt: new Date().toISOString() } : l
    );
    writeStorage(STORAGE_KEYS.LEADS, updated);
    return updated;
  }

  static updateLeadNotes(id: string, notes: string): Lead[] {
    const leads = this.getLeads();
    const updated = leads.map((l) =>
      l.id === id ? { ...l, notes, updatedAt: new Date().toISOString() } : l
    );
    writeStorage(STORAGE_KEYS.LEADS, updated);
    return updated;
  }

  static assignLeadAdvisor(leadId: string, advisorId: string, advisorName: string): Lead[] {
    const leads = this.getLeads();
    const updated = leads.map((l) =>
      l.id === leadId
        ? { ...l, assignedAdvisorId: advisorId, assignedAdvisorName: advisorName, updatedAt: new Date().toISOString() }
        : l
    );
    writeStorage(STORAGE_KEYS.LEADS, updated);
    return updated;
  }

  static deleteLead(id: string): Lead[] {
    const leads = this.getLeads();
    const updated = leads.filter((l) => l.id !== id);
    writeStorage(STORAGE_KEYS.LEADS, updated);
    return updated;
  }

  // Tasks
  static getTasks(): CrmTask[] {
    return readStorage<CrmTask[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
  }

  static addTask(task: Omit<CrmTask, 'id' | 'createdAt'>): CrmTask {
    const tasks = this.getTasks();
    const newTask: CrmTask = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newTask, ...tasks];
    writeStorage(STORAGE_KEYS.TASKS, updated);
    return newTask;
  }

  static toggleTask(id: string): CrmTask[] {
    const tasks = this.getTasks();
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    writeStorage(STORAGE_KEYS.TASKS, updated);
    return updated;
  }

  // Users & Roles
  static getUsers(): UserProfile[] {
    return INITIAL_USERS;
  }

  static getCurrentRole(): UserRole {
    return readStorage<UserRole>(STORAGE_KEYS.CURRENT_USER_ROLE, 'director_comercial');
  }

  static setCurrentRole(role: UserRole): void {
    writeStorage(STORAGE_KEYS.CURRENT_USER_ROLE, role);
  }

  static getCurrentUser(): UserProfile {
    const role = this.getCurrentRole();
    return INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
  }

  // Utilities
  static formatPrice(amount: number, currency = 'EUR'): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  static buildWhatsAppUrl(phone: string, text: string): string {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(text);
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
  }
}
