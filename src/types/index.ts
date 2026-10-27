export type UserRole = 'administrador' | 'director_comercial' | 'asesor';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  phone: string;
  avatarUrl?: string;
}

export type PropertyType = 'villa' | 'atico' | 'mansion' | 'residencia_forestal' | 'finca';
export type PropertyStatus = 'disponible' | 'reservado' | 'vendido' | 'proximamente';

export interface Property {
  id: string;
  title: string;
  slug: string;
  location: string;
  zone: string;
  price: number;
  currency: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  builtAreaM2: number;
  plotAreaM2?: number;
  featured: boolean;
  heroImage: string;
  galleryImages: string[];
  description: string;
  architecturalHighlights: string[];
  amenities: string[];
  yearBuilt: number;
  energyRating: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArchitecturalProject {
  id: string;
  name: string;
  location: string;
  tagline: string;
  completionDate: string;
  totalUnits: number;
  availableUnits: number;
  startingPrice: number;
  heroImage: string;
  status: 'preventa' | 'en_construccion' | 'fase_final';
  progressPercentage: number;
  description: string;
}

export type LeadStatus = 'nuevo' | 'contactado' | 'visita_agendada' | 'negociacion' | 'cerrado_ganado' | 'archivado';
export type LeadSource = 'web_landing' | 'ficha_propiedad' | 'whatsapp_direct' | 'referido' | 'campana';
export type InterestType = 'compra' | 'inversion' | 'visita_privada' | 'tasacion' | 'general';

export interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  interestType: InterestType;
  propertyId?: string;
  propertyName?: string;
  budgetRange: string;
  message?: string;
  status: LeadStatus;
  source: LeadSource;
  assignedAdvisorId?: string;
  assignedAdvisorName?: string;
  estimatedValue?: number;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CrmTask {
  id: string;
  title: string;
  leadId?: string;
  leadName?: string;
  assignedTo: string;
  assignedName: string;
  dueDate: string;
  priority: 'alta' | 'media' | 'baja';
  completed: boolean;
  type: 'llamada' | 'visita_presencial' | 'envio_dossier' | 'preparar_oferta' | 'firma_arras';
  createdAt: string;
}

export interface BrandConfig {
  brandName: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  canvasColor: string;
  whatsappNumber: string;
  contactEmail: string;
  officeAddress: string;
  currencySymbol: string;
  logoLettermark: string;
  updatedAt: string;
}
