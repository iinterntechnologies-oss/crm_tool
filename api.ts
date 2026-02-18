import { Lead, Client, Customer, Goal } from './types';

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
  is_completed: client.isCompleted ?? false
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
  isCompleted: client.is_completed ?? false
});

const toApiCustomer = (customer: Partial<Customer>) => ({
  business_name: customer.businessName,
  completed_date: customer.completedDate,
  total_paid: customer.totalPaid ?? 0
});

const fromApiCustomer = (customer: any): Customer => ({
  id: customer.id,
  businessName: customer.business_name,
  completedDate: customer.completed_date,
  totalPaid: customer.total_paid ?? 0
});

const toApiGoal = (goal: Partial<Goal>) => ({
  target_amount: goal.targetAmount,
  deadline: goal.deadline,
  date_started: goal.dateStarted,
  date_achieved: goal.dateAchieved ?? null,
  is_achieved: goal.isAchieved ?? false
});

const fromApiGoal = (goal: any): Goal => ({
  id: goal.id,
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
