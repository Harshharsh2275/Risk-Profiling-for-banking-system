import { url } from "@/env";
import { redirect } from "react-router-dom";

const API_URL = url;

export interface RegisterParams {
  name: string;
  address: string;
  macAddresses: string;
  mobileNumber: string;
  email: string;
  password: string;
}

export interface LoginParams {
  email: string;
  password: string;
  token?: string;
}

export interface ProfileUpdateParams {
  name?: string;
  address?: string;
  mobile?: string;
  email?: string;
}

export interface AuthResponse {
  access_token: string;
  user: any;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

const handleApiResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();

  if (!response.ok) {
    const error: ApiError = {
      message: data.message || 'An error occurred',
      errors: data.errors
    };
    throw error;
  }

  return data as T;
};

export const api = {
  register: async (params: RegisterParams): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  const data = await handleApiResponse<AuthResponse>(response);

  if (data) {
    redirect("/login"); // Redirect after successful registration
  }

  return data;
  },

  login: async (params: LoginParams): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    return handleApiResponse<AuthResponse>(response);
  },

  updateProfile: async (params: ProfileUpdateParams, token: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/profile/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(params)
    });

    return handleApiResponse<AuthResponse>(response);
  },

  getProfile: async (token: string): Promise<AuthResponse> => {
    const userId = JSON.parse(localStorage.getItem("user") || '""');
    const response = await fetch(`${API_URL}/auth/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return handleApiResponse<AuthResponse>(response);
  },

  getAllUsers: async (token: string): Promise<AuthResponse[]> => {
    const userId = JSON.parse(localStorage.getItem("user") || '""');
    const response = await fetch(`${API_URL}/auth/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return handleApiResponse<AuthResponse[]>(response);
  }
};
