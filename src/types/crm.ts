export type UserRole = 'admin' | 'sales_director' | 'advisor';

export type LeadStage =
  | 'lead_nuevo'
  | 'contacto_calificacion'
  | 'videollamada_agendada'
  | 'videollamada_realizada'
  | 'negociacion'
  | 'separacion'
  | 'promesa_compraventa'
  | 'ganado'
  | 'compra_aplazada'
  | 'perdido';

export interface LeadStageConfig {
  id: LeadStage;
  label: string;
  order: number;
  color: string;
  isTerminal?: boolean;
}

export const LEAD_STAGES: LeadStageConfig[] = [
  { id: 'lead_nuevo', label: '1. Lead Nuevo', order: 1, color: '#3B82F6' },
  { id: 'contacto_calificacion', label: '2. Contacto & Calificación', order: 2, color: '#F59E0B' },
  { id: 'videollamada_agendada', label: '3. Videollamada Agendada', order: 3, color: '#8B5CF6' },
  { id: 'videollamada_realizada', label: '4. Videollamada Realizada', order: 4, color: '#6366F1' },
  { id: 'negociacion', label: '5. Negociación', order: 5, color: '#EC4899' },
  { id: 'separacion', label: '6. Separación', order: 6, color: '#10B981' },
  { id: 'promesa_compraventa', label: '7. Promesa Compraventa', order: 7, color: '#059669' },
  { id: 'ganado', label: '8. Ganado (Cerrado)', order: 8, color: '#C8A261', isTerminal: true },
  { id: 'compra_aplazada', label: '9. Compra Aplazada', order: 9, color: '#64748B', isTerminal: true },
  { id: 'perdido', label: '10. Perdido', order: 10, color: '#EF4444', isTerminal: true },
];

export interface CRMUser {
  uid: string;
  organizationId: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  role: UserRole;
  phone?: string;
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  lastLoginAt?: string;
}

export type PaymentMethod = 'contado' | 'credito_hipotecario' | 'fondos_propios' | 'mixto';

export type LeadChannel =
  | 'meta_ads'
  | 'google'
  | 'referido'
  | 'portal_inmobiliario'
  | 'evento'
  | 'directo';

export interface Lead {
  id: string;
  organizationId: string;
  fullName: string;
  phone: string;
  email: string;
  projectId?: string;
  projectName?: string;
  budget: number;
  paymentMethod: PaymentMethod;
  channel: LeadChannel;
  advisorId: string;
  advisorName: string;
  stage: LeadStage;
  qualificationScore: number; // 0 to 100
  notes?: string;
  lastContactAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadActivity {
  id: string;
  organizationId: string;
  leadId: string;
  type: 'cambio_etapa' | 'nota' | 'llamada' | 'reunion' | 'whatsapp' | 'documento';
  title: string;
  description: string;
  performedBy: string;
  performedByName: string;
  createdAt: string;
}

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  location: string;
  type: 'residencial_lujo' | 'villas' | 'vertical' | 'lotes_campestres' | 'mixto';
  areaM2: number;
  priceFrom: number;
  priceTo?: number;
  status: 'preventa' | 'en_construccion' | 'entrega_inmediata' | 'agotado';
  galleryUrls: string[];
  totalUnits: number;
  availableUnits: number;
  createdAt: string;
  updatedAt: string;
}

export type PropertyStatus = 'disponible' | 'reservado' | 'vendido' | 'inactivo';

export interface PropertyItem {
  id: string;
  organizationId: string;
  code: string;
  projectId: string;
  projectName: string;
  areaM2: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  status: PropertyStatus;
  observations?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  organizationId: string;
  title: string;
  description?: string;
  leadId?: string;
  leadName?: string;
  dealId?: string;
  assignedTo: string;
  assignedName: string;
  dueDate: string;
  priority: 'alta' | 'media' | 'baja';
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface Meeting {
  id: string;
  organizationId: string;
  leadId: string;
  leadName: string;
  title: string;
  scheduledAt: string;
  durationMinutes: number;
  link?: string;
  status: 'agendada' | 'realizada' | 'cancelada' | 'no_asistio';
  notes?: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  organizationId: string;
  leadId: string;
  leadName: string;
  projectId?: string;
  projectName?: string;
  propertyId?: string;
  propertyCode?: string;
  estimatedValue: number;
  stage: LeadStage;
  advisorId: string;
  advisorName: string;
  expectedCloseDate: string;
  outcome: 'en_proceso' | 'ganado' | 'perdido';
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface OrganizationConfig {
  id: string;
  name: string;
  logoLettermark: string;
  primaryColor: string;
  accentColor: string;
  contactEmail: string;
  contactPhone: string;
  currencySymbol: string;
  scoringWeights: {
    budgetMinWeight: number;
    paymentMethodWeight: number;
    activityWeight: number;
  };
  updatedAt: string;
}
