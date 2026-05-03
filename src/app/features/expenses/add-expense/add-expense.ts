import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '@core/services/expense.service';
import { LayoutService } from '@core/services/layout.service';
import { ProjectService } from '@core/services/project.service';
import { ProjectParticipant } from '@shared/models/project.models';

@Component({
  selector: 'app-add-expense',
  imports: [ReactiveFormsModule],
  templateUrl: './add-expense.html',
})
export class AddExpense implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private layoutService = inject(LayoutService);
  private projectService = inject(ProjectService);
  private expenseService = inject(ExpenseService);

  protected isLoading = signal(true);
  protected errorMessages = signal<string | null>(null);
  protected participants = signal<ProjectParticipant[]>([]);
  protected projectId = this.route.snapshot.params['id'] as string;

  protected form = this.fb.group({
    label: ['', [Validators.required]],
    amount: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.01)]),
    expense_date: [new Date().toISOString().slice(0, 10), [Validators.required]],
    paid_by: ['', [Validators.required]],
    beneficiaries: this.fb.array<boolean>([], [this.atLeastOneChecked]),
  });

  constructor() {
    this.layoutService.pageTitle.set('Nouvelle dépense');
  }

  async ngOnInit() {
    const { data, error } = await this.projectService.getAllParticipants(this.projectId);
    if (error) {
      this.layoutService.setNotification({ message: error, type: 'error' });
      this.router.navigate(['..'], { relativeTo: this.route });
      return;
    }
    this.participants.set(data!);
    data!.forEach(() => this.beneficiaries.push(this.fb.control(true)));
    this.isLoading.set(false);
  }

  protected get beneficiaries() {
    return this.form.get('beneficiaries') as FormArray;
  }

  private atLeastOneChecked(control: AbstractControl): ValidationErrors | null {
    const arr = control as FormArray;
    return arr.controls.some((c) => c.value) ? null : { required: true };
  }

  async submit() {
    this.errorMessages.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const beneficiaryUserIds = this.participants()
      .filter((_, i) => raw.beneficiaries[i])
      .map((p) => p.user_id);

    const { error } = await this.expenseService.createExpense({
      project_id: this.projectId,
      label: raw.label,
      amount: raw.amount!,
      expense_date: raw.expense_date,
      paid_by: raw.paid_by,
      participants: beneficiaryUserIds,
    });

    if (error) {
      this.errorMessages.set(error);
      return;
    }
    this.layoutService.setNotification({ message: 'Dépense créée avec succès.', type: 'success' });
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
