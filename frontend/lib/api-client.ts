import { API_CONFIG } from './config';

const API_URL = API_CONFIG.BASE_URL;

export interface SignupData {
  email: string;
  password: string;
  full_name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface DiagnosisRequest {
  patient_name: string;
  patient_email: string;
  patient_age: number;
  patient_gender: string;
  symptoms: string;
  medical_history?: string;
}

class APIClient {
  private getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getHeaders() {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async signup(data: SignupData) {
    const res = await fetch(`/api/proxy?path=/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Signup failed');
    return res.json();
  }

  async verifyOtp(email: string, otp: string) {
    const res = await fetch(`/api/proxy?path=/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    if (!res.ok) throw new Error('OTP verification failed');
    const data = await res.json();
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    return data;
  }

  async verifyEmail(token: string) {
    const res = await fetch(`/api/proxy?path=/auth/verify-email?token=${token}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Email verification failed');
    return res.json();
  }

  async login(data: LoginData) {
    const res = await fetch('/api/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Invalid credentials');
    const result = await res.json();
    localStorage.setItem('access_token', result.access_token);
    localStorage.setItem('refresh_token', result.refresh_token);
    return result;
  }

  async logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return { success: true };
  }

  async getCurrentUser() {
    const res = await fetch(`/api/proxy?path=/auth/me`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  }

  async createDiagnosis(data: DiagnosisRequest) {
    const res = await fetch(`/api/proxy?path=/api/v1/diagnosis/start`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json();
  }

  async getUserDiagnoses() {
    const res = await fetch(`/api/proxy?path=/api/v1/diagnosis`, {
      headers: this.getHeaders(),
    });
    if (res.status === 401) throw new Error('Not authenticated');
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json();
  }

  async getDiagnosis(id: string) {
    const res = await fetch(`/api/proxy?path=/api/v1/diagnosis/${id}`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json();
  }

  async chatWithDiagnosis(diagnosisId: string, message: string) {
    const res = await fetch(`/api/proxy?path=/api/v1/diagnosis/${diagnosisId}/chat`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json();
  }

  async getDiagnosisStatus(id: string) {
    const res = await fetch(`/api/proxy?path=/api/v1/diagnosis/${id}/status`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json();
  }

  async healthCheck() {
    const res = await fetch(`/api/proxy?path=/health`);
    return res.json();
  }

  // Admin-only API key management
  async updateApiKey(provider: string, apiKey: string) {
    const res = await fetch(`/api/proxy?path=/admin/api-keys`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ provider, api_key: apiKey }),
    });
    if (!res.ok) throw new Error('Failed to update API key');
    return res.json();
  }

  async getApiKeyStatus() {
    const res = await fetch(`/api/proxy?path=/admin/api-keys/status`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to get API key status');
    return res.json();
  }
}

export const api = new APIClient();
