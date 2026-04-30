import { Component, inject, signal } from '@angular/core';
import { FormArray, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from '@core/services/layout.service';
import { ProjectService } from '@core/services/project.service';
import { PATHS } from 'src/app/routes.constants';

@Component({
  selector: 'app-add-project',
  imports: [ReactiveFormsModule],
  templateUrl: './add-project.html',
})
export class AddProject {
  private fb = inject(NonNullableFormBuilder);
  private layoutService = inject(LayoutService);
  private projectService = inject(ProjectService);
  private router = inject(Router);

  protected form = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    creatorPseudo: ['', [Validators.required]],
    participantsEmail: this.fb.array<string>([]),
  });
  protected errorMessages = signal<string | null>(null);
  protected readonly PATHS = PATHS;

  constructor() {
    this.layoutService.pageTitle.set('Nouveau projet');
  }

  protected get participantsEmail() {
    return this.form.get('participantsEmail') as FormArray;
  }

  protected addParticipant() {
    this.participantsEmail.push(this.fb.control('', [Validators.required, Validators.email]));
  }

  protected removeParticipant(index: number) {
    this.participantsEmail.removeAt(index);
  }

  async submit() {
    this.errorMessages.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.getRawValue();
    const { error } = await this.projectService.createProject({
      ...formData,
      description: formData.description || null,
    });

    if (error) {
      this.errorMessages.set(error);
      return;
    }
    this.layoutService.setNotification({ message: 'Projet créé avec succès.', type: 'success' });
    this.router.navigate([PATHS.PROJECTS]);
  }
}
