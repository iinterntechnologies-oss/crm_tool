import { Lead, Client, Customer, Goal, Activity, Task, Note } from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export type AuthToken = string;

const toApiLead = (lead: Partial<Lead>) => ({
  business_name: lead.businessName,
  contact: lead.contact,
  comment: lead.comment ?? '',
  status: lead.status ?? 'new'
});

const fromApiLead = (lead: any): Lead => ({
  id: lead.id,
  businessName: lead.business_name,
  contact: lead.contact,
  comment: lead.comment ?? '',
  status: lead.status
});

const toApiClient = (client: Partial<Client>) => ({
  business_name: client.businessName,
  business_type: client.businessType,
  contact: client.contact,
  onboarding: client.onboarding,
  deadline: client.deadline,
  delivery: client.delivery,
  payment_collected: client.paymentCollected ?? 0,
  is_completed: client.isCompleted ?? false,
  domain_name: client.domainName ?? null,
  hosting_provider: client.hostingProvider ?? null,
  cms_type: client.cmsType ?? null,
  project_stage: client.projectStage ?? 'Discovery',
  maintenance_plan: client.maintenancePlan ?? false,
  renewal_date: client.renewalDate ?? null
});

const fromApiClient = (client: any): Client => ({
  id: client.id,
  businessName: client.business_name,
  businessType: client.business_type,
  contact: client.contact,
  onboarding: client.onboarding,
  deadline: client.deadline,
  delivery: client.delivery,
  paymentCollected: client.payment_collected ?? 0,
  isCompleted: client.is_completed ?? false,
  domainName: client.domain_name ?? undefined,
  hostingProvider: client.hosting_provider ?? undefined,
  cmsType: client.cms_type ?? undefined,
  projectStage: client.project_stage ?? 'Discovery',
  maintenancePlan: client.maintenance_plan ?? false,
  renewalDate: client.renewal_date ?? undefined
});

const toApiCustomer = (customer: Partial<Customer>) => ({
  business_name: customer.businessName,
  completed_date: customer.completedDate,
  total_paid: customer.totalPaid ?? 0,
  domain_name: customer.domainName ?? null,
  hosting_provider: customer.hostingProvider ?? null,
  cms_type: customer.cmsType ?? null,
  maintenance_plan: customer.maintenancePlan ?? false,
  renewal_date: customer.renewalDate ?? null
});

const fromApiCustomer = (customer: any): Customer => ({
  id: customer.id,
  businessName: customer.business_name,
  completedDate: customer.completed_date,
  totalPaid: customer.total_paid ?? 0,
  domainName: customer.domain_name ?? undefined,
  hostingProvider: customer.hosting_provider ?? undefined,
  cmsType: customer.cms_type ?? undefined,
  maintenancePlan: customer.maintenance_plan ?? false,
  renewalDate: customer.renewal_date ?? undefined
});

const toApiGoal = (goal: Partial<Goal>) => ({
  title: goal.title ?? 'Revenue Goal',
  target_amount: goal.targetAmount,
  deadline: goal.deadline,
  date_started: goal.dateStarted,
  date_achieved: goal.dateAchieved ?? null,
  is_achieved: goal.isAchieved ?? false
});

const fromApiGoal = (goal: any): Goal => ({
  id: goal.id,
  title: goal.title ?? 'Revenue Goal',
  targetAmount: goal.target_amount,
  deadline: goal.deadline,
  dateStarted: goal.date_started,
  dateAchieved: goal.date_achieved ?? undefined,
  isAchieved: goal.is_achieved ?? false
});

const request = async <T>(path: string, options: RequestInit = {}, token?: AuthToken): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined)
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const message = await response.text();
    console.error(`API Error ${response.status}:`, message);
    throw new Error(message || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const authApi = {
  register: (email: string, password: string) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  login: async (email: string, password: string): Promise<AuthToken> => {
    const form = new URLSearchParams();
    form.append('username', email);
    form.append('password', password);
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString()
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || 'Login failed');
    }
    const data = await response.json();
    return data.access_token as string;
  }
};

export const leadsApi = {
  list: async (token: AuthToken) => (await request<any[]>('/leads', {}, token)).map(fromApiLead),
  create: async (lead: Partial<Lead>, token: AuthToken) => {
    console.log('Creating lead:', lead);
    const response = fromApiLead(await request('/leads', {
      method: 'POST',
      body: JSON.stringify(toApiLead(lead))
    }, token));
    console.log('Created lead:', response);
    return response;
  },
  update: async (id: string, lead: Partial<Lead>, token: AuthToken) => fromApiLead(await request(`/leads/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(toApiLead(lead))
  }, token)),
  remove: (id: string, token: AuthToken) => request(`/leads/${id}`, { method: 'DELETE' }, token)
};

export const clientsApi = {
  list: async (token: AuthToken) => (await request<any[]>('/clients', {}, token)).map(fromApiClient),
  create: async (client: Partial<Client>, token: AuthToken) => fromApiClient(await request('/clients', {
    method: 'POST',
    body: JSON.stringify(toApiClient(client))
  }, token)),
  update: async (id: string, client: Partial<Client>, token: AuthToken) => fromApiClient(await request(`/clients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(toApiClient(client))
  }, token)),
  updatePayment: async (id: string, paymentCollected: number, token: AuthToken) => fromApiClient(await request(`/clients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ payment_collected: paymentCollected })
  }, token)),
  remove: (id: string, token: AuthToken) => request(`/clients/${id}`, { method: 'DELETE' }, token)
};

export const customersApi = {
  list: async (token: AuthToken) => (await request<any[]>('/customers', {}, token)).map(fromApiCustomer),
  create: async (customer: Partial<Customer>, token: AuthToken) => fromApiCustomer(await request('/customers', {
    method: 'POST',
    body: JSON.stringify(toApiCustomer(customer))
  }, token)),
  update: async (id: string, customer: Partial<Customer>, token: AuthToken) => fromApiCustomer(await request(`/customers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(toApiCustomer(customer))
  }, token)),
  remove: (id: string, token: AuthToken) => request(`/customers/${id}`, { method: 'DELETE' }, token)
};

export const goalsApi = {
  list: async (token: AuthToken) => (await request<any[]>('/goals', {}, token)).map(fromApiGoal),
  create: async (goal: Partial<Goal>, token: AuthToken) => fromApiGoal(await request('/goals', {
    method: 'POST',
    body: JSON.stringify(toApiGoal(goal))
  }, token)),
  update: async (id: string, goal: Partial<Goal>, token: AuthToken) => fromApiGoal(await request(`/goals/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(toApiGoal(goal))
  }, token)),
  remove: (id: string, token: AuthToken) => request(`/goals/${id}`, { method: 'DELETE' }, token)
};

// Activity API
const fromApiActivity = (activity: any): Activity => ({
  id: activity.id,
  activityType: activity.activity_type,
  entityType: activity.entity_type,
  entityId: activity.entity_id,
  entityName: activity.entity_name,
  description: activity.description,
  activityMetadata: activity.activity_metadata ?? '{}',
  createdAt: activity.created_at
});

const toApiActivity = (activity: Partial<Activity>) => ({
  activity_type: activity.activityType,
  entity_type: activity.entityType,
  entity_id: activity.entityId,
  entity_name: activity.entityName,
  description: activity.description,
  activity_metadata: activity.activityMetadata ?? '{}'
});

export const activitiesApi = {
  list: async (token: AuthToken, limit: number = 50) => (await request<any[]>(`/activities?limit=${limit}`, {}, token)).map(fromApiActivity),
  create: async (activity: Partial<Activity>, token: AuthToken) => fromApiActivity(await request('/activities', {
    method: 'POST',
    body: JSON.stringify(toApiActivity(activity))
  }, token)),
  remove: (id: string, token: AuthToken) => request(`/activities/${id}`, { method: 'DELETE' }, token)
};

// Task API
const fromApiTask = (task: any): Task => ({
  id: task.id,
  title: task.title,
  description: task.description ?? '',
  relatedTo: task.related_to,
  relatedId: task.related_id ?? null,
  priority: task.priority,
  status: task.status,
  dueDate: task.due_date ?? null,
  completedAt: task.completed_at ?? null,
  createdAt: task.created_at,
  taskTemplate: task.task_template ?? undefined,
  serviceType: task.service_type ?? undefined,
  isTemplate: task.is_template ?? false
});

const toApiTask = (task: Partial<Task>) => ({
  title: task.title,
  description: task.description ?? '',
  related_to: task.relatedTo,
  related_id: task.relatedId ?? null,
  priority: task.priority ?? 'medium',
  status: task.status ?? 'pending',
  due_date: task.dueDate ?? null,
  task_template: task.taskTemplate ?? null,
  service_type: task.serviceType ?? null,
  is_template: task.isTemplate ?? false
});

export const tasksApi = {
  list: async (token: AuthToken) => (await request<any[]>('/tasks', {}, token)).map(fromApiTask),
  create: async (task: Partial<Task>, token: AuthToken) => fromApiTask(await request('/tasks', {
    method: 'POST',
    body: JSON.stringify(toApiTask(task))
  }, token)),
  update: async (id: string, task: Partial<Task>, token: AuthToken) => fromApiTask(await request(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(toApiTask(task))
  }, token)),
  remove: (id: string, token: AuthToken) => request(`/tasks/${id}`, { method: 'DELETE' }, token),
  generateOnboarding: async (clientId: string, serviceType: string = 'default', token: AuthToken) => (
    await request<any[]>(`/tasks/generate-onboarding/${clientId}?service_type=${serviceType}`, {
      method: 'POST'
    }, token)
  ).map(fromApiTask)
};

// Note API
const fromApiNote = (note: any): Note => ({
  id: note.id,
  content: note.content,
  relatedTo: note.related_to,
  relatedId: note.related_id,
  isPinned: note.is_pinned ?? false,
  createdAt: note.created_at,
  updatedAt: note.updated_at
});

const toApiNote = (note: Partial<Note>) => ({
  content: note.content,
  related_to: note.relatedTo,
  related_id: note.relatedId,
  is_pinned: note.isPinned ?? false
});

export const notesApi = {
  list: async (token: AuthToken, relatedTo?: string, relatedId?: string) => {
    let url = '/notes';
    const params = new URLSearchParams();
    if (relatedTo) params.append('related_to', relatedTo);
    if (relatedId) params.append('related_id', relatedId);
    if (params.toString()) url += `?${params.toString()}`;
    return (await request<any[]>(url, {}, token)).map(fromApiNote);
  },
  create: async (note: Partial<Note>, token: AuthToken) => fromApiNote(await request('/notes', {
    method: 'POST',
    body: JSON.stringify(toApiNote(note))
  }, token)),
  update: async (id: string, note: Partial<Note>, token: AuthToken) => fromApiNote(await request(`/notes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ content: note.content, is_pinned: note.isPinned })
  }, token)),
  remove: (id: string, token: AuthToken) => request(`/notes/${id}`, { method: 'DELETE' }, token)
};
