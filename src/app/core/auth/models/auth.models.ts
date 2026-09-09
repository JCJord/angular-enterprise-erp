export type UserRole = 'ADMINISTRADOR' | 'OPERADOR' | 'INSPETOR';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
}

export interface AuthResponseDto {
  token: string;
  user: User;
}
