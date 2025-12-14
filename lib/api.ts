/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api.ts
import axios, { AxiosError, AxiosInstance } from 'axios';
import { 
  AuthResponse, 
  LoginCredentials, 
  BlogsResponse, 
  SingleBlogResponse,
  BlogFormData,
  ProjectsResponse,
  AboutResponse,
  DashboardResponse,
  ApiError 
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This will send cookies with requests
  timeout: 10000,
});

// Request interceptor - No need to add token header since we're using cookies
apiClient.interceptors.request.use(
  (config) => {
    // Token is sent via HTTP-only cookie by the backend
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: 'An error occurred',
      status: error.response?.status || 500,
      data: error.response?.data,
    };

    if (error.response) {
      const data: any = error.response.data;
      apiError.message = data?.message || error.message;
      
      // Handle 401 - Unauthorized
      if (error.response.status === 401) {
        // Clear user cookie (if it exists) and redirect to login
        document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/login';
      }
    } else if (error.request) {
      apiError.message = 'No response from server. Please check your connection.';
    }

    return Promise.reject(apiError);
  }
);

// ============== Auth API ==============
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    // Clear user cookie (if it exists)
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  },

  getProfile: async (): Promise<AuthResponse> => {
    const response = await apiClient.get<AuthResponse>('/auth/profile');
    return response.data;
  },
};

// ============== Blog API ==============
export const blogAPI = {
  // Get all blogs (Public)
  getAll: async (params?: { 
    page?: number; 
    limit?: number;
    search?: string;
    tags?: string[];
  }): Promise<BlogsResponse> => {
    const response = await apiClient.get<BlogsResponse>('/blogs', { params });
    return response.data;
  },

  // Get single blog by ID or slug (Public)
  getById: async (id: string): Promise<SingleBlogResponse> => {
    const response = await apiClient.get<SingleBlogResponse>(`/blogs/${id}`);
    return response.data;
  },

  // Create blog (Protected)
  create: async (data: BlogFormData): Promise<SingleBlogResponse> => {
    const response = await apiClient.post<SingleBlogResponse>('/blogs', data);
    return response.data;
  },

  // Update blog (Protected)
  update: async (id: string, data: Partial<BlogFormData>): Promise<SingleBlogResponse> => {
    const response = await apiClient.put<SingleBlogResponse>(`/blogs/${id}`, data);
    return response.data;
  },

  // Delete blog (Protected)
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/blogs/${id}`);
    return response.data;
  },

  // Get all slugs for static generation
  getAllSlugs: async (): Promise<string[]> => {
    const response = await apiClient.get<{ data: { slugs: string[] } }>('/blogs/slugs');
    return response.data.data.slugs;
  },
};

// ============== Project API ==============
export const projectAPI = {
  // Get all projects (Public)
  getAll: async (): Promise<ProjectsResponse> => {
    const response = await apiClient.get('/projects');
    return response.data;
  },

  // Get single project by ID (Public)
  getById: async (id: string): Promise<{ success: boolean; data: { project: any } }> => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  // Update project (Protected)
  update: async (id: string, data: any): Promise<{ success: boolean; message?: string }> => {
    const response = await apiClient.put(`/projects/${id}`, data);
    return response.data;
  },
};

// ============== About API ==============
export const aboutAPI = {
  // Get about me data (Public)
  get: async (): Promise<AboutResponse> => {
    const response = await apiClient.get<AboutResponse>('/about');
    return response.data;
  },
};

// ============== Dashboard API ==============
export const dashboardAPI = {
  // Get dashboard stats (Protected)
  getStats: async (): Promise<DashboardResponse> => {
    const response = await apiClient.get<DashboardResponse>('/dashboard/stats');
    return response.data;
  },
};

// ============== Helper Functions ==============
export const handleApiError = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as ApiError).message;
  }
  return 'An unexpected error occurred';
};

export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error
  );
};

export default apiClient;