import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthCredentials } from '@shared/models/auth.models';
import { AuthService } from '@core/services/auth.service';
import { PATHS } from 'src/app/routes.constants';
import { LayoutService } from '@core/services/layout.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  protected layoutService = inject(LayoutService);

  protected form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  protected errorMessage = signal<string | null>(null);
  protected loading = signal(false);
  protected readonly PATHS = PATHS;

  constructor() {
    this.layoutService.pageTitle.set('Connexion');
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
      const { error } = await this.authService.signIn(formData);

      if (error) this.errorMessage.set(error);
      else this.router.navigate([PATHS.PROJECTS]);
    } catch (error) {
      this.errorMessage.set(
        'Une erreur est survenue, merci de rééssayer, ou contactez votre administrateur.',
      );
    } finally {
      this.loading.set(false);
    }
  }
}
