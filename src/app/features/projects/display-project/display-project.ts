import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LayoutService } from '@core/services/layout.service';
import { ProjectService } from '@core/services/project.service';
import { ProjectDetail } from '@shared/models/project.models';
import { PATHS } from 'src/app/routes.constants';

@Component({
  selector: 'app-display-project',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './display-project.html',
})
export class DisplayProject implements OnInit {
  private projectService = inject(ProjectService);
  private layoutService = inject(LayoutService);
  private activatedRoute = inject(ActivatedRoute);

  protected project: ProjectDetail | null = null;
  protected isLoading = signal(false);
  protected showExpenses = signal(false);
  protected readonly PATHS = PATHS;

  async ngOnInit() {
    this.isLoading.set(true);
    try {
      const { data, error } = await this.projectService.getProjectDetail(
        this.activatedRoute.snapshot.params['id'],
      );
      if (error) {
        this.layoutService.setNotification({ message: error, type: 'error' });
        return;
      }

      this.project = data!;
      this.layoutService.pageTitle.set(data!.name);
    } finally {
      this.isLoading.set(false);
    }
  }
}
