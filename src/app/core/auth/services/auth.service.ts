import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AuthResponseDto,
  LoginRequestDto,
  RegisterRequestDto,
  User,
  UserRole
} from '../models/auth.models';

const TOKEN_STORAGE_KEY = 'enterprise_auth_token';
const USER_STORAGE_KEY = 'enterprise_auth_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  readonly currentUser = signal<User | null>(this.getStoredUser());
  readonly token = signal<string | null>(this.getStoredToken());

  readonly isAuthenticated = computed<boolean>(() => !!this.token() && !!this.currentUser());
  readonly userRole = computed<UserRole>(() => this.currentUser()?.role ?? 'OPERADOR');
  readonly userName = computed<string>(() => this.currentUser()?.fullName ?? 'Operador');

  login(dto: LoginRequestDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${this.apiUrl}/login`, dto).pipe(
      tap(response => {
        this.setSession(response);
      })
    );
  }

  register(dto: RegisterRequestDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${this.apiUrl}/register`, dto).pipe(
      tap(response => {
        this.setSession(response);
      })
    );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        this.currentUser.set(user);
        this.persistUser(user);
      })
    );
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  private setSession(authData: AuthResponseDto): void {
    this.token.set(authData.token);
    this.currentUser.set(authData.user);

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(TOKEN_STORAGE_KEY, authData.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authData.user));
    }
  }

  private clearSession(): void {
    this.token.set(null);
    this.currentUser.set(null);

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }

  private getStoredToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    }
    return null;
  }

  private getStoredUser(): User | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userJson = localStorage.getItem(USER_STORAGE_KEY);
      if (userJson) {
        try {
          return JSON.parse(userJson) as User;
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  private persistUser(user: User): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
  }
}
