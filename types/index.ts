/* eslint-disable @typescript-eslint/no-explicit-any */
// types/index.ts

// ============== User & Auth ==============
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// ============== Blog ==============
export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  tags?: string[];
  published: boolean;
  authorId: string;
  author?: User;
  createdAt: string;
  updatedAt: string;
  views?: number;
}

export interface BlogFormData {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  tags?: string[];
  published: boolean;
}

export interface BlogsResponse {
  success: boolean;
  message: string;
  data: {
    blogs: Blog[];
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface SingleBlogResponse {
  success: boolean;
  message: string;
  data: {
    blog: Blog;
  };
}

// ============== Project ==============
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  projectUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  technologies: string[];
  features: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  thumbnail: string;
  projectUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  technologies: string[];
  features: string[];
  published: boolean;
}

export interface ProjectsResponse {
  success: boolean;
  message: string;
  data: {
    projects: Project[];
  };
}

// ============== About Me ==============
export interface AboutMe {
  id: string;
  name: string;
  bio: string;
  email: string;
  phone?: string;
  location?: string;
  profileImage?: string;
  resume?: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
  workExperience: WorkExperience[];
  skills: Skill[];
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
  location?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'other';
  proficiency?: number; // 0-100
}

export interface AboutResponse {
  success: boolean;
  message: string;
  data: {
    about: AboutMe;
  };
}

// ============== API Response ==============
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
}

export interface ApiError {
  message: string;
  status: number;
  data?: any;
}

// ============== Form Validation ==============
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  isSubmitting: boolean;
  errors: ValidationError[];
  touched: Record<string, boolean>;
}

// ============== Pagination ==============
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============== Filter & Search ==============
export interface BlogFilters {
  search?: string;
  tags?: string[];
  published?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'views';
  sortOrder?: 'asc' | 'desc';
}

// ============== Dashboard Stats ==============
export interface DashboardStats {
  totalBlogs: number;
  totalProjects: number;
  totalViews: number;
  recentBlogs: Blog[];
  recentProjects: Project[];
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: {
    stats: DashboardStats;
  };
}