import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LayoutService } from '@core/services/layout.service';
import { ProjectService } from '@core/services/project.service';
import { Project } from '@shared/models/project.models';

@Component({
  selector: 'app-project-list',
  imports: [RouterLink],
  templateUrl: './project-list.html',
})
export class ProjectList implements OnInit {
  private layoutService = inject(LayoutService);
  private projectService = inject(ProjectService);

  protected projectList = signal<Project[]>([]);
  protected errorMessage = signal<string | null>(null);
  protected isLoading = signal(false);

  async ngOnInit() {
    this.layoutService.pageTitle.set('Mes Tricounts');

    try {
      this.isLoading.set(true);

      const { data, error } = await this.projectService.getAll();
      if (data) this.projectList.set(data);
      else this.errorMessage.set(error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
