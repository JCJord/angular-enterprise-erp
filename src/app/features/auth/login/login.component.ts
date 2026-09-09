import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth';
import { ButtonComponent, TextInputComponent } from '../../../shared/components';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroShieldCheckSolid,
  heroLockClosedSolid,
  heroEnvelopeSolid,
  heroArrowRightEndOnRectangleSolid,
  heroExclamationTriangleSolid
} from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    TextInputComponent,
    NgIconComponent
  ],
  providers: [
    provideIcons({
      heroShieldCheckSolid,
      heroLockClosedSolid,
      heroEnvelopeSolid,
      heroArrowRightEndOnRectangleSolid,
      heroExclamationTriangleSolid
    })
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || 'Falha na autenticação. Verifique suas credenciais.');
      }
    });
  }

  fillDemoCredentials(): void {
    this.loginForm.patchValue({
      email: 'admin@enterprise.com',
      password: 'admin123'
    });
  }
}
