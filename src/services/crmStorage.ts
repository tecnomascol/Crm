import { 
  CRMUser, 
  Lead, 
  LeadActivity, 
  Project, 
  PropertyItem, 
  Task, 
  Deal, 
  AuditLog, 
  OrganizationConfig, 
  LeadStage,
  UserRole
} from '../types/crm';

const STORAGE_KEYS = {
  CURRENT_USER: 'aurea_crm_current_user_v2',
  USERS: 'aurea_crm_users_v2',
  ORGANIZATION: 'aurea_crm_org_v2',
  PROJECTS: 'aurea_crm_projects_v2',
  PROPERTIES: 'aurea_crm_properties_v2',
  LEADS: 'aurea_crm_leads_v2',
  ACTIVITIES: 'aurea_crm_activities_v2',
  TASKS: 'aurea_crm_tasks_v2',
  DEALS: 'aurea_crm_deals_v2',
  AUDIT_LOGS: 'aurea_crm_audit_v2',
  PENDING_VERIFICATION_EMAIL: 'aurea_crm_pending_verify_v2',
};

const DEFAULT_ORG: OrganizationConfig = {
  id: 'org_aurea_main',
  name: 'AUREA Luxury Real Estate',
  logoLettermark: 'AUREA',
  primaryColor: '#0A2F1D',
  accentColor: '#C8A261',
  contactEmail: 'direccion@aureahabitat.com',
  contactPhone: '+34 910 882 340',
  currencySymbol: '€',
  scoringWeights: {
    budgetMinWeight: 40,
    paymentMethodWeight: 30,
    activityWeight: 30,
  },
  updatedAt: new Date().toISOString(),
};

const SEED_USERS: CRMUser[] = [
  {
    uid: 'usr_admin_01',
    organizationId: 'org_aurea_main',
    displayName: 'Carlos Mendoza',
    email: 'marioalberto2031@gmail.com',
    emailVerified: true,
    role: 'admin',
    phone: '+34 600 123 456',
    status: 'active',
    createdAt: '2026-01-01T08:00:00Z',
    lastLoginAt: new Date().toISOString(),
  },
  {
    uid: 'usr_director_02',
    organizationId: 'org_aurea_main',
    displayName: 'Elena Valdés',
    email: 'elena.valdes@aureahabitat.com',
    emailVerified: true,
    role: 'sales_director',
    phone: '+34 611 234 567',
    status: 'active',
    createdAt: '2026-01-05T09:00:00Z',
    lastLoginAt: '2026-02-25T14:30:00Z',
  },
  {
    uid: 'usr_advisor_03',
    organizationId: 'org_aurea_main',
    displayName: 'Mateo Rivas',
    email: 'mateo.rivas@aureahabitat.com',
    emailVerified: true,
    role: 'advisor',
    phone: '+34 622 345 678',
    status: 'active',
    createdAt: '2026-01-10T10:00:00Z',
    lastLoginAt: '2026-02-26T11:15:00Z',
  },
];

const SEED_PROJECTS: Project[] = [
  {
    id: 'proj_reserva_costa',
    organizationId: 'org_aurea_main',
    name: 'Reserva de la Costa',
    description: 'Promoción boutique de 6 villas privadas sobre acantilados protegidos en S’Agaró Vell con acceso directo a cala marina.',
    location: 'Costa Brava, Girona',
    type: 'villas',
    areaM2: 680,
    priceFrom: 4200000,
    priceTo: 6500000,
    status: 'en_construccion',
    galleryUrls: ['/src/assets/images/hero_luxury_villa_1793066039194.jpg'],
    totalUnits: 6,
    availableUnits: 2,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-02-20T12:00:00Z',
  },
  {
    id: 'proj_torre_bellas_artes',
    organizationId: 'org_aurea_main',
    name: 'Torre Bellas Artes',
    description: 'Áticos dúplex con doble altura y terrazas panorámicas en edificio palaciego restaurado en Barrio de Salamanca.',
    location: 'Barrio de Salamanca, Madrid',
    type: 'vertical',
    areaM2: 420,
    priceFrom: 2850000,
    priceTo: 5100000,
    status: 'preventa',
    galleryUrls: ['/src/assets/images/property_penthouse_skyline_1793066039582.jpg'],
    totalUnits: 12,
    availableUnits: 5,
    createdAt: '2026-01-20T11:00:00Z',
    updatedAt: '2026-02-22T15:00:00Z',
  },
  {
    id: 'proj_forest_sanctuary',
    organizationId: 'org_aurea_main',
    name: 'Forest Sanctuary Residences',
    description: 'Pabellones residenciales bioclimáticos de madera y piedra negra en Baqueira / Naut Aran.',
    location: 'Valle de Arán, Pirineos',
    type: 'residencial_lujo',
    areaM2: 390,
    priceFrom: 2400000,
    priceTo: 3800000,
    status: 'preventa',
    galleryUrls: ['/src/assets/images/property_forest_residence_1793066040437.jpg'],
    totalUnits: 8,
    availableUnits: 4,
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-02-24T18:00:00Z',
  },
];

const SEED_PROPERTIES: PropertyItem[] = [
  {
    id: 'prop_01',
    organizationId: 'org_aurea_main',
    code: 'VILLA-MIRA-01',
    projectId: 'proj_reserva_costa',
    projectName: 'Reserva de la Costa',
    areaM2: 680,
    bedrooms: 5,
    bathrooms: 6,
    price: 4850000,
    status: 'disponible',
    observations: 'Piscina infinita voladiza, helisuperficie y cava en roca natural.',
    createdAt: '2026-01-16T10:00:00Z',
    updatedAt: '2026-02-20T12:00:00Z',
  },
  {
    id: 'prop_02',
    organizationId: 'org_aurea_main',
    code: 'VILLA-MIRA-02',
    projectId: 'proj_reserva_costa',
    projectName: 'Reserva de la Costa',
    areaM2: 720,
    bedrooms: 6,
    bathrooms: 7,
    price: 5400000,
    status: 'reservado',
    observations: 'En trámite de contrato de arras con family office suizo.',
    createdAt: '2026-01-16T11:00:00Z',
    updatedAt: '2026-02-23T16:00:00Z',
  },
  {
    id: 'prop_03',
    organizationId: 'org_aurea_main',
    code: 'ATICO-SKY-4B',
    projectId: 'proj_torre_bellas_artes',
    projectName: 'Torre Bellas Artes',
    areaM2: 420,
    bedrooms: 4,
    bathrooms: 5,
    price: 3900000,
    status: 'disponible',
    observations: 'Doble altura de 6 metros, chimenea Marquina y terraza 85 m².',
    createdAt: '2026-01-21T09:00:00Z',
    updatedAt: '2026-02-22T10:00:00Z',
  },
  {
    id: 'prop_04',
    organizationId: 'org_aurea_main',
    code: 'REFUGIO-ALP-01',
    projectId: 'proj_forest_sanctuary',
    projectName: 'Forest Sanctuary Residences',
    areaM2: 390,
    bedrooms: 4,
    bathrooms: 4,
    price: 2750000,
    status: 'disponible',
    observations: 'Certificación Passivhaus Plus con spa y sauna interior.',
    createdAt: '2026-02-02T10:00:00Z',
    updatedAt: '2026-02-24T11:00:00Z',
  },
  {
    id: 'prop_05',
    organizationId: 'org_aurea_main',
    code: 'FINCA-ANDR-01',
    projectId: 'proj_reserva_costa',
    projectName: 'Finca Caló des Monjo (Mallorca)',
    areaM2: 850,
    bedrooms: 6,
    bathrooms: 7,
    price: 6200000,
    status: 'vendido',
    observations: 'Escritura notarial completada en Palma de Mallorca.',
    createdAt: '2026-01-10T12:00:00Z',
    updatedAt: '2026-02-18T17:00:00Z',
  },
];

const SEED_LEADS: Lead[] = [
  {
    id: 'lead_001',
    organizationId: 'org_aurea_main',
    fullName: 'Alfonso de Borbón y Vega',
    phone: '+34 619 888 123',
    email: 'alfonso.borbon@inversionesbv.es',
    projectId: 'proj_reserva_costa',
    projectName: 'Reserva de la Costa',
    budget: 5000000,
    paymentMethod: 'fondos_propios',
    channel: 'referido',
    advisorId: 'usr_director_02',
    advisorName: 'Elena Valdés',
    stage: 'videollamada_agendada',
    qualificationScore: 92,
    notes: 'Inversor calificado. Desea coordinar visita privada este fin de semana.',
    lastContactAt: '2026-02-25T16:00:00Z',
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-25T16:00:00Z',
  },
  {
    id: 'lead_002',
    organizationId: 'org_aurea_main',
    fullName: 'Sophie Laurent-Meyer',
    phone: '+41 79 342 9011',
    email: 'sophie.meyer@luxuryliving.ch',
    projectId: 'proj_torre_bellas_artes',
    projectName: 'Torre Bellas Artes',
    budget: 4200000,
    paymentMethod: 'contado',
    channel: 'meta_ads',
    advisorId: 'usr_advisor_03',
    advisorName: 'Mateo Rivas',
    stage: 'negociacion',
    qualificationScore: 88,
    notes: 'Segunda videollamada realizada. Borrador de oferta enviado para revisión fiscal.',
    lastContactAt: '2026-02-26T11:30:00Z',
    createdAt: '2026-02-15T09:15:00Z',
    updatedAt: '2026-02-26T11:30:00Z',
  },
  {
    id: 'lead_003',
    organizationId: 'org_aurea_main',
    fullName: 'Dr. Guillermo San Martín',
    phone: '+34 650 443 219',
    email: 'gsanmartin@clinicasanmartin.com',
    projectId: 'proj_forest_sanctuary',
    projectName: 'Forest Sanctuary Residences',
    budget: 2800000,
    paymentMethod: 'mixto',
    channel: 'portal_inmobiliario',
    advisorId: 'usr_advisor_03',
    advisorName: 'Mateo Rivas',
    stage: 'contacto_calificacion',
    qualificationScore: 78,
    notes: 'Cualificación telefónica completada. Enviado dossier ampliado con planos de planta.',
    lastContactAt: '2026-02-24T17:00:00Z',
    createdAt: '2026-02-22T14:00:00Z',
    updatedAt: '2026-02-24T17:00:00Z',
  },
  {
    id: 'lead_004',
    organizationId: 'org_aurea_main',
    fullName: 'Marcus Vance',
    phone: '+44 7700 900142',
    email: 'mvance@vanceholding.co.uk',
    projectId: 'proj_reserva_costa',
    projectName: 'Reserva de la Costa',
    budget: 6500000,
    paymentMethod: 'contado',
    channel: 'google',
    advisorId: 'usr_director_02',
    advisorName: 'Elena Valdés',
    stage: 'lead_nuevo',
    qualificationScore: 85,
    notes: 'Registro entrante. Solicita información confidencial sobre rentabilidad turística.',
    lastContactAt: '2026-02-26T08:00:00Z',
    createdAt: '2026-02-26T08:00:00Z',
    updatedAt: '2026-02-26T08:00:00Z',
  },
  {
    id: 'lead_005',
    organizationId: 'org_aurea_main',
    fullName: 'Beatriz Larrea & Juan Cruz',
    phone: '+34 670 112 900',
    email: 'blarrea@larreagroup.com',
    projectId: 'proj_reserva_costa',
    projectName: 'Reserva de la Costa',
    budget: 5200000,
    paymentMethod: 'fondos_propios',
    channel: 'referido',
    advisorId: 'usr_admin_01',
    advisorName: 'Carlos Mendoza',
    stage: 'ganado',
    qualificationScore: 98,
    notes: 'Operación cerrada ante notario en Barcelona. Firma de arras completada.',
    lastContactAt: '2026-02-22T12:00:00Z',
    createdAt: '2026-01-10T11:00:00Z',
    updatedAt: '2026-02-22T12:00:00Z',
  },
  {
    id: 'lead_006',
    organizationId: 'org_aurea_main',
    fullName: 'Henrik Lindqvist',
    phone: '+46 8 123 4567',
    email: 'henrik@nordicasset.se',
    projectId: 'proj_forest_sanctuary',
    projectName: 'Forest Sanctuary Residences',
    budget: 3200000,
    paymentMethod: 'contado',
    channel: 'evento',
    advisorId: 'usr_advisor_03',
    advisorName: 'Mateo Rivas',
    stage: 'separacion',
    qualificationScore: 90,
    notes: 'Depósito de separación de €50.000 abonado en cuenta fiduciaria escrow.',
    lastContactAt: '2026-02-25T18:00:00Z',
    createdAt: '2026-02-05T10:00:00Z',
    updatedAt: '2026-02-25T18:00:00Z',
  },
  {
    id: 'lead_007',
    organizationId: 'org_aurea_main',
    fullName: 'Victoria Gómez de la Serna',
    phone: '+34 688 221 009',
    email: 'vgomez@gomezdelaserna.es',
    projectId: 'proj_torre_bellas_artes',
    projectName: 'Torre Bellas Artes',
    budget: 3500000,
    paymentMethod: 'credito_hipotecario',
    channel: 'directo',
    advisorId: 'usr_director_02',
    advisorName: 'Elena Valdés',
    stage: 'videollamada_realizada',
    qualificationScore: 82,
    notes: 'Videollamada realizada el 24 de febrero. Interesada en la unidad 4B.',
    lastContactAt: '2026-02-24T19:00:00Z',
    createdAt: '2026-02-12T16:00:00Z',
    updatedAt: '2026-02-24T19:00:00Z',
  },
  {
    id: 'lead_008',
    organizationId: 'org_aurea_main',
    fullName: 'Robert Sterling',
    phone: '+1 212 555 0198',
    email: 'rsterling@sterlingventures.com',
    projectId: 'proj_reserva_costa',
    projectName: 'Reserva de la Costa',
    budget: 4500000,
    paymentMethod: 'fondos_propios',
    channel: 'meta_ads',
    advisorId: 'usr_advisor_03',
    advisorName: 'Mateo Rivas',
    stage: 'compra_aplazada',
    qualificationScore: 65,
    notes: 'Pospone compra hasta Q4 2026 por motivos de residencia fiscal.',
    lastContactAt: '2026-02-20T14:00:00Z',
    createdAt: '2026-01-25T15:00:00Z',
    updatedAt: '2026-02-20T14:00:00Z',
  },
];

const SEED_ACTIVITIES: LeadActivity[] = [
  {
    id: 'act_001',
    organizationId: 'org_aurea_main',
    leadId: 'lead_001',
    type: 'reunion',
    title: 'Videollamada privada agendada',
    description: 'Coordinada videollamada para el viernes con el asesor fiscal del cliente.',
    performedBy: 'usr_director_02',
    performedByName: 'Elena Valdés',
    createdAt: '2026-02-25T16:00:00Z',
  },
  {
    id: 'act_002',
    organizationId: 'org_aurea_main',
    leadId: 'lead_002',
    type: 'cambio_etapa',
    title: 'Avanzado a fase de Negociación',
    description: 'Etapa cambiada de "Videollamada realizada" a "Negociación". Oferta formal presentada.',
    performedBy: 'usr_advisor_03',
    performedByName: 'Mateo Rivas',
    createdAt: '2026-02-26T11:30:00Z',
  },
  {
    id: 'act_003',
    organizationId: 'org_aurea_main',
    leadId: 'lead_006',
    type: 'whatsapp',
    title: 'Comprobante de depósito de separación recibido',
    description: 'Verificado ingreso de €50.000 para reservar unidad REFUGIO-ALP-01.',
    performedBy: 'usr_advisor_03',
    performedByName: 'Mateo Rivas',
    createdAt: '2026-02-25T18:00:00Z',
  },
];

const SEED_TASKS: Task[] = [
  {
    id: 'task_001',
    organizationId: 'org_aurea_main',
    title: 'Enviar borrador de contrato de arras a Alfonso de Borbón',
    description: 'Revisar con despacho notarial antes de las 12:00.',
    leadId: 'lead_001',
    leadName: 'Alfonso de Borbón y Vega',
    assignedTo: 'usr_director_02',
    assignedName: 'Elena Valdés',
    dueDate: '2026-02-28T12:00:00Z',
    priority: 'alta',
    completed: false,
    createdAt: '2026-02-25T10:00:00Z',
  },
  {
    id: 'task_002',
    organizationId: 'org_aurea_main',
    title: 'Coordinar visita privada a Baqueira con Henrik Lindqvist',
    description: 'Verificar estado de nieve y preparar acceso al refugio alpino.',
    leadId: 'lead_006',
    leadName: 'Henrik Lindqvist',
    assignedTo: 'usr_advisor_03',
    assignedName: 'Mateo Rivas',
    dueDate: '2026-03-02T15:00:00Z',
    priority: 'media',
    completed: false,
    createdAt: '2026-02-24T14:00:00Z',
  },
  {
    id: 'task_003',
    organizationId: 'org_aurea_main',
    title: 'Llamada de seguimiento con Dr. Guillermo San Martín',
    description: 'Consultar dudas respecto a la climatización geotérmica.',
    leadId: 'lead_003',
    leadName: 'Dr. Guillermo San Martín',
    assignedTo: 'usr_advisor_03',
    assignedName: 'Mateo Rivas',
    dueDate: '2026-02-27T17:30:00Z',
    priority: 'alta',
    completed: false,
    createdAt: '2026-02-24T11:00:00Z',
  },
  {
    id: 'task_004',
    organizationId: 'org_aurea_main',
    title: 'Revisión final de poderes notariales de Beatriz Larrea',
    description: 'Comprobar ratificación notarial para archivo de escrituras.',
    leadId: 'lead_005',
    leadName: 'Beatriz Larrea',
    assignedTo: 'usr_admin_01',
    assignedName: 'Carlos Mendoza',
    dueDate: '2026-02-26T18:00:00Z',
    priority: 'baja',
    completed: true,
    completedAt: '2026-02-26T17:00:00Z',
    createdAt: '2026-02-22T09:00:00Z',
  },
];

const SEED_DEALS: Deal[] = [
  {
    id: 'deal_001',
    organizationId: 'org_aurea_main',
    leadId: 'lead_001',
    leadName: 'Alfonso de Borbón y Vega',
    projectId: 'proj_reserva_costa',
    projectName: 'Reserva de la Costa',
    propertyCode: 'VILLA-MIRA-01',
    estimatedValue: 4850000,
    stage: 'videollamada_agendada',
    advisorId: 'usr_director_02',
    advisorName: 'Elena Valdés',
    expectedCloseDate: '2026-03-25T00:00:00Z',
    outcome: 'en_proceso',
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-25T16:00:00Z',
  },
  {
    id: 'deal_002',
    organizationId: 'org_aurea_main',
    leadId: 'lead_002',
    leadName: 'Sophie Laurent-Meyer',
    projectId: 'proj_torre_bellas_artes',
    projectName: 'Torre Bellas Artes',
    propertyCode: 'ATICO-SKY-4B',
    estimatedValue: 3900000,
    stage: 'negociacion',
    advisorId: 'usr_advisor_03',
    advisorName: 'Mateo Rivas',
    expectedCloseDate: '2026-03-15T00:00:00Z',
    outcome: 'en_proceso',
    createdAt: '2026-02-15T09:15:00Z',
    updatedAt: '2026-02-26T11:30:00Z',
  },
  {
    id: 'deal_003',
    organizationId: 'org_aurea_main',
    leadId: 'lead_005',
    leadName: 'Beatriz Larrea & Juan Cruz',
    projectId: 'proj_reserva_costa',
    projectName: 'Reserva de la Costa',
    propertyCode: 'VILLA-MIRA-02',
    estimatedValue: 5200000,
    stage: 'ganado',
    advisorId: 'usr_admin_01',
    advisorName: 'Carlos Mendoza',
    expectedCloseDate: '2026-02-22T00:00:00Z',
    outcome: 'ganado',
    createdAt: '2026-01-10T11:00:00Z',
    updatedAt: '2026-02-22T12:00:00Z',
  },
  {
    id: 'deal_004',
    organizationId: 'org_aurea_main',
    leadId: 'lead_006',
    leadName: 'Henrik Lindqvist',
    projectId: 'proj_forest_sanctuary',
    projectName: 'Forest Sanctuary Residences',
    propertyCode: 'REFUGIO-ALP-01',
    estimatedValue: 2750000,
    stage: 'separacion',
    advisorId: 'usr_advisor_03',
    advisorName: 'Mateo Rivas',
    expectedCloseDate: '2026-03-10T00:00:00Z',
    outcome: 'en_proceso',
    createdAt: '2026-02-05T10:00:00Z',
    updatedAt: '2026-02-25T18:00:00Z',
  },
];

const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit_001',
    organizationId: 'org_aurea_main',
    userId: 'usr_admin_01',
    userName: 'Carlos Mendoza',
    userRole: 'admin',
    action: 'INIT_SYSTEM',
    entityType: 'Organization',
    entityId: 'org_aurea_main',
    details: 'Inicialización de la plataforma inmobiliaria y configuración de seguridad RBAC.',
    timestamp: '2026-01-01T08:00:00Z',
  },
  {
    id: 'audit_002',
    organizationId: 'org_aurea_main',
    userId: 'usr_admin_01',
    userName: 'Carlos Mendoza',
    userRole: 'admin',
    action: 'PROVISION_ROLE',
    entityType: 'User',
    entityId: 'usr_director_02',
    details: 'Asignación de rol "sales_director" a Elena Valdés con permisos de gestión de embudo.',
    timestamp: '2026-01-05T09:00:00Z',
  },
  {
    id: 'audit_003',
    organizationId: 'org_aurea_main',
    userId: 'usr_director_02',
    userName: 'Elena Valdés',
    userRole: 'sales_director',
    action: 'STAGE_ADVANCED',
    entityType: 'Lead',
    entityId: 'lead_002',
    details: 'Avance de etapa a "Negociación" con valor estimado de €3.900.000.',
    timestamp: '2026-02-26T11:30:00Z',
  },
];

// Helper safe storage read/write
function readStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Storage read error for ${key}:`, e);
    return fallback;
  }
}

function writeStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Storage write error for ${key}:`, e);
  }
}

export class CRMStorage {
  // 1. Organization
  static getOrganization(): OrganizationConfig {
    return readStorage<OrganizationConfig>(STORAGE_KEYS.ORGANIZATION, DEFAULT_ORG);
  }

  static updateOrganization(updates: Partial<OrganizationConfig>, user: CRMUser): OrganizationConfig {
    const current = this.getOrganization();
    const updated: OrganizationConfig = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    writeStorage(STORAGE_KEYS.ORGANIZATION, updated);
    this.addAuditLog({
      organizationId: current.id,
      userId: user.uid,
      userName: user.displayName,
      userRole: user.role,
      action: 'UPDATE_ORGANIZATION_SETTINGS',
      entityType: 'Organization',
      entityId: current.id,
      details: `Configuración actualizada por ${user.displayName}.`,
    });
    return updated;
  }

  // 2. Users & Session
  static getUsers(): CRMUser[] {
    return readStorage<CRMUser[]>(STORAGE_KEYS.USERS, SEED_USERS);
  }

  static getUserById(uid: string): CRMUser | undefined {
    return this.getUsers().find((u) => u.uid === uid);
  }

  static getUserByEmail(email: string): CRMUser | undefined {
    return this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  static getCurrentUser(): CRMUser | null {
    const stored = readStorage<CRMUser | null>(STORAGE_KEYS.CURRENT_USER, null);
    // If none stored yet, initialize with default admin
    if (!stored) {
      writeStorage(STORAGE_KEYS.CURRENT_USER, SEED_USERS[0]);
      return SEED_USERS[0];
    }
    return stored;
  }

  static setCurrentUser(user: CRMUser | null): void {
    writeStorage(STORAGE_KEYS.CURRENT_USER, user);
  }

  static registerUser(displayName: string, email: string): { user: CRMUser; requiresVerification: boolean } {
    const users = this.getUsers();
    const existing = this.getUserByEmail(email);
    if (existing) {
      throw new Error('El correo electrónico ya se encuentra registrado en el sistema.');
    }

    const newUser: CRMUser = {
      uid: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      organizationId: 'org_aurea_main',
      displayName: displayName.trim(),
      email: email.trim().toLowerCase(),
      emailVerified: false, // Strict requirement: unverified upon signup!
      role: 'advisor', // Defaults to advisor, cannot self-assign admin!
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    const updated = [...users, newUser];
    writeStorage(STORAGE_KEYS.USERS, updated);
    writeStorage(STORAGE_KEYS.PENDING_VERIFICATION_EMAIL, email.trim().toLowerCase());

    this.addAuditLog({
      organizationId: 'org_aurea_main',
      userId: newUser.uid,
      userName: newUser.displayName,
      userRole: newUser.role,
      action: 'USER_REGISTERED',
      entityType: 'User',
      entityId: newUser.uid,
      details: `Nuevo usuario registrado. Verificación de correo pendiente: ${newUser.email}`,
    });

    return { user: newUser, requiresVerification: true };
  }

  static verifyUserEmail(email: string): CRMUser {
    const users = this.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('Usuario no encontrado.');
    }

    const updatedUser: CRMUser = {
      ...user,
      emailVerified: true,
      lastLoginAt: new Date().toISOString(),
    };

    const updatedUsers = users.map((u) => (u.uid === user.uid ? updatedUser : u));
    writeStorage(STORAGE_KEYS.USERS, updatedUsers);
    writeStorage(STORAGE_KEYS.CURRENT_USER, updatedUser);

    this.addAuditLog({
      organizationId: user.organizationId,
      userId: user.uid,
      userName: user.displayName,
      userRole: user.role,
      action: 'EMAIL_VERIFIED',
      entityType: 'User',
      entityId: user.uid,
      details: `Correo verificado exitosamente para ${user.email}. Acceso al CRM concedido.`,
    });

    return updatedUser;
  }

  static updateUserRole(targetUserId: string, newRole: UserRole, adminUser: CRMUser): CRMUser[] {
    if (adminUser.role !== 'admin') {
      throw new Error('Solo los administradores autorizados pueden gestionar roles y permisos.');
    }

    const users = this.getUsers();
    const target = users.find((u) => u.uid === targetUserId);
    if (!target) throw new Error('Usuario no encontrado.');

    const updatedUsers = users.map((u) => (u.uid === targetUserId ? { ...u, role: newRole } : u));
    writeStorage(STORAGE_KEYS.USERS, updatedUsers);

    // If active user is the updated user, update session
    const currentUser = this.getCurrentUser();
    if (currentUser?.uid === targetUserId) {
      this.setCurrentUser({ ...currentUser, role: newRole });
    }

    this.addAuditLog({
      organizationId: adminUser.organizationId,
      userId: adminUser.uid,
      userName: adminUser.displayName,
      userRole: adminUser.role,
      action: 'ROLE_CHANGED',
      entityType: 'User',
      entityId: targetUserId,
      details: `Rol de ${target.displayName} (${target.email}) modificado a "${newRole}".`,
    });

    return updatedUsers;
  }

  // 3. Leads (Prospectos)
  static getLeads(): Lead[] {
    return readStorage<Lead[]>(STORAGE_KEYS.LEADS, SEED_LEADS);
  }

  static findDuplicates(phone: string, email: string, excludeId?: string): Lead[] {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const cleanEmail = email.trim().toLowerCase();
    const leads = this.getLeads();

    return leads.filter((l) => {
      if (excludeId && l.id === excludeId) return false;
      const lPhone = l.phone.replace(/[^0-9]/g, '');
      const lEmail = l.email.toLowerCase();
      return (cleanPhone && lPhone && lPhone === cleanPhone) || (cleanEmail && lEmail && lEmail === cleanEmail);
    });
  }

  static addLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>, actor: CRMUser): Lead {
    const leads = this.getLeads();
    const newLead: Lead = {
      ...leadData,
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastContactAt: new Date().toISOString(),
    };

    const updated = [newLead, ...leads];
    writeStorage(STORAGE_KEYS.LEADS, updated);

    // Add initial activity
    this.addActivity({
      organizationId: leadData.organizationId,
      leadId: newLead.id,
      type: 'nota',
      title: 'Prospecto creado en el CRM',
      description: `Canal de captación: ${leadData.channel}. Presupuesto estimado: ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(leadData.budget)}.`,
      performedBy: actor.uid,
      performedByName: actor.displayName,
    });

    this.addAuditLog({
      organizationId: leadData.organizationId,
      userId: actor.uid,
      userName: actor.displayName,
      userRole: actor.role,
      action: 'LEAD_CREATED',
      entityType: 'Lead',
      entityId: newLead.id,
      details: `Prospecto "${newLead.fullName}" registrado por ${actor.displayName}.`,
    });

    return newLead;
  }

  static updateLead(id: string, updates: Partial<Lead>, actor: CRMUser): Lead[] {
    const leads = this.getLeads();
    const existing = leads.find((l) => l.id === id);
    if (!existing) return leads;

    const isStageChange = updates.stage && updates.stage !== existing.stage;

    const updatedLead: Lead = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      lastContactAt: new Date().toISOString(),
    };

    const updated = leads.map((l) => (l.id === id ? updatedLead : l));
    writeStorage(STORAGE_KEYS.LEADS, updated);

    if (isStageChange) {
      this.addActivity({
        organizationId: existing.organizationId,
        leadId: id,
        type: 'cambio_etapa',
        title: `Etapa actualizada a: ${updates.stage?.replace('_', ' ')}`,
        description: `Transición realizada por ${actor.displayName} (${actor.role}).`,
        performedBy: actor.uid,
        performedByName: actor.displayName,
      });

      this.addAuditLog({
        organizationId: existing.organizationId,
        userId: actor.uid,
        userName: actor.displayName,
        userRole: actor.role,
        action: 'LEAD_STAGE_TRANSITION',
        entityType: 'Lead',
        entityId: id,
        details: `Prospecto "${existing.fullName}" movido de "${existing.stage}" a "${updates.stage}".`,
      });
    }

    return updated;
  }

  static deleteLead(id: string, actor: CRMUser): Lead[] {
    if (actor.role === 'advisor') {
      throw new Error('Los asesores no tienen permisos para eliminar prospectos del CRM.');
    }
    const leads = this.getLeads();
    const existing = leads.find((l) => l.id === id);
    const updated = leads.filter((l) => l.id !== id);
    writeStorage(STORAGE_KEYS.LEADS, updated);

    if (existing) {
      this.addAuditLog({
        organizationId: existing.organizationId,
        userId: actor.uid,
        userName: actor.displayName,
        userRole: actor.role,
        action: 'LEAD_DELETED',
        entityType: 'Lead',
        entityId: id,
        details: `Prospecto "${existing.fullName}" eliminado por ${actor.displayName}.`,
      });
    }
    return updated;
  }

  // 4. Activities
  static getActivities(leadId?: string): LeadActivity[] {
    const all = readStorage<LeadActivity[]>(STORAGE_KEYS.ACTIVITIES, SEED_ACTIVITIES);
    return leadId ? all.filter((a) => a.leadId === leadId) : all;
  }

  static addActivity(data: Omit<LeadActivity, 'id' | 'createdAt'>): LeadActivity {
    const all = this.getActivities();
    const newAct: LeadActivity = {
      ...data,
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newAct, ...all];
    writeStorage(STORAGE_KEYS.ACTIVITIES, updated);
    return newAct;
  }

  // 5. Projects
  static getProjects(): Project[] {
    return readStorage<Project[]>(STORAGE_KEYS.PROJECTS, SEED_PROJECTS);
  }

  static saveProject(project: Project, actor: CRMUser): Project[] {
    if (actor.role === 'advisor') {
      throw new Error('Solo directores comerciales y administradores pueden gestionar proyectos.');
    }
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.id === project.id);
    let updated: Project[];
    if (index >= 0) {
      updated = [...projects];
      updated[index] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      updated = [
        {
          ...project,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...projects,
      ];
    }
    writeStorage(STORAGE_KEYS.PROJECTS, updated);

    this.addAuditLog({
      organizationId: project.organizationId,
      userId: actor.uid,
      userName: actor.displayName,
      userRole: actor.role,
      action: index >= 0 ? 'PROJECT_UPDATED' : 'PROJECT_CREATED',
      entityType: 'Project',
      entityId: project.id,
      details: `Proyecto "${project.name}" guardado por ${actor.displayName}.`,
    });

    return updated;
  }

  // 6. Properties (Inventory)
  static getProperties(): PropertyItem[] {
    return readStorage<PropertyItem[]>(STORAGE_KEYS.PROPERTIES, SEED_PROPERTIES);
  }

  static saveProperty(item: PropertyItem, actor: CRMUser): PropertyItem[] {
    if (actor.role === 'advisor') {
      throw new Error('Solo directores comerciales y administradores pueden modificar inventario.');
    }
    const properties = this.getProperties();
    const index = properties.findIndex((p) => p.id === item.id);
    let updated: PropertyItem[];
    if (index >= 0) {
      updated = [...properties];
      updated[index] = { ...item, updatedAt: new Date().toISOString() };
    } else {
      updated = [
        {
          ...item,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...properties,
      ];
    }
    writeStorage(STORAGE_KEYS.PROPERTIES, updated);
    return updated;
  }

  static updatePropertyStatus(id: string, status: PropertyItem['status'], actor: CRMUser): PropertyItem[] {
    const properties = this.getProperties();
    const updated = properties.map((p) => (p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p));
    writeStorage(STORAGE_KEYS.PROPERTIES, updated);

    this.addAuditLog({
      organizationId: actor.organizationId,
      userId: actor.uid,
      userName: actor.displayName,
      userRole: actor.role,
      action: 'INVENTORY_STATUS_CHANGED',
      entityType: 'Property',
      entityId: id,
      details: `Estado del inmueble cambiado a "${status}".`,
    });

    return updated;
  }

  // 7. Tasks
  static getTasks(): Task[] {
    return readStorage<Task[]>(STORAGE_KEYS.TASKS, SEED_TASKS);
  }

  static saveTask(task: Omit<Task, 'id' | 'createdAt'>): Task {
    const tasks = this.getTasks();
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newTask, ...tasks];
    writeStorage(STORAGE_KEYS.TASKS, updated);
    return newTask;
  }

  static toggleTask(id: string): Task[] {
    const tasks = this.getTasks();
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const completed = !t.completed;
        return {
          ...t,
          completed,
          completedAt: completed ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });
    writeStorage(STORAGE_KEYS.TASKS, updated);
    return updated;
  }

  // 8. Deals (Negocios)
  static getDeals(): Deal[] {
    return readStorage<Deal[]>(STORAGE_KEYS.DEALS, SEED_DEALS);
  }

  static saveDeal(deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>, actor: CRMUser): Deal {
    const deals = this.getDeals();
    const newDeal: Deal = {
      ...deal,
      id: `deal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newDeal, ...deals];
    writeStorage(STORAGE_KEYS.DEALS, updated);

    this.addAuditLog({
      organizationId: actor.organizationId,
      userId: actor.uid,
      userName: actor.displayName,
      userRole: actor.role,
      action: 'DEAL_CREATED',
      entityType: 'Deal',
      entityId: newDeal.id,
      details: `Oportunidad creada para "${newDeal.leadName}" por valor de €${newDeal.estimatedValue}.`,
    });

    return newDeal;
  }

  static updateDealOutcome(id: string, outcome: Deal['outcome'], actor: CRMUser): Deal[] {
    const deals = this.getDeals();
    const updated = deals.map((d) => (d.id === id ? { ...d, outcome, updatedAt: new Date().toISOString() } : d));
    writeStorage(STORAGE_KEYS.DEALS, updated);
    return updated;
  }

  // 9. Audit Logs (Immutable)
  static getAuditLogs(): AuditLog[] {
    return readStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
  }

  static addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    writeStorage(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs]);
  }

  // Calculations
  static calculateLeadScore(lead: Partial<Lead>): number {
    let score = 30; // base score
    if (lead.budget && lead.budget >= 4000000) score += 30;
    else if (lead.budget && lead.budget >= 2500000) score += 20;
    else if (lead.budget && lead.budget >= 1500000) score += 10;

    if (lead.paymentMethod === 'contado' || lead.paymentMethod === 'fondos_propios') score += 25;
    else if (lead.paymentMethod === 'mixto') score += 15;
    else if (lead.paymentMethod === 'credito_hipotecario') score += 10;

    if (lead.channel === 'referido' || lead.channel === 'directo') score += 15;
    else if (lead.channel === 'evento') score += 10;

    return Math.min(100, score);
  }
}
