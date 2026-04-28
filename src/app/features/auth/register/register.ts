import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthCredentials } from '@shared/models/auth.models';
import { AuthService } from '@core/services/auth.service';
import { PATHS } from 'src/app/routes.constants';
import { LayoutService } from '@core/services/layout.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  protected layoutService = inject(LayoutService);

  protected form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  protected errorMessage = signal<string | null>(null);
  protected loading = signal(false);
  protected readonly PATHS = PATHS;

  constructor() {
    this.layoutService.pageTitle.set("S'inscrire");
  }

  async submit() {
    try {
      this.loading.set(true);
      this.errorMessage.set(null);

      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }

      const formData: AuthCredentials = this.form.getRawValue();
      const { error } = await this.authService.signUp(formData);

      if (error) this.errorMessage.set(error);
      else this.router.navigate([PATHS.LOGIN]);
    } catch {
      this.errorMessage.set(
        'Une erreur est survenue, merci de rééssayer, ou contactez votre administrateur.',
      );
    } finally {
      this.loading.set(false);
    }
  }
}
