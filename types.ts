
export type PageType = 'dashboard' | 'leads' | 'saved-leads' | 'clients' | 'goals' | 'customers';

export interface Lead {
  id: string;
  businessName: string;
  contact: string;
  comment: string;
  status: 'new' | 'saved';
}

export interface Client {
  id: string;
  businessName: string;
  businessType: string;
  contact: string;
  onboarding: string;
  deadline: string;
  delivery: string;
  paymentCollected: number;
  isCompleted: boolean;
}

export interface Customer {
  id: string;
  businessName: string;
  completedDate: string;
  totalPaid: number;
}

export interface Goal {
  id: string;
  targetAmount: number;
  deadline: string;
  dateStarted: string;
  dateAchieved?: string;
  isAchieved: boolean;
}

export interface Stats {
  totalLeads: number;
  activeProjects: number;
  revenue: number;
  deadlines: number;
}
