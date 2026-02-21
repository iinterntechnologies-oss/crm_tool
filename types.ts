
export type PageType = 'dashboard' | 'leads' | 'saved-leads' | 'clients' | 'goals' | 'customers' | 'tasks' | 'analytics';

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
  title: string;
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

export interface Activity {
  id: string;
  activityType: string;
  entityType: string;
  entityId: string;
  entityName: string;
  description: string;
  activityMetadata: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  relatedTo: string;
  relatedId: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface Note {
  id: string;
  content: string;
  relatedTo: string;
  relatedId: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}
