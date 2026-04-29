import { Component, inject, OnInit, signal } from '@angular/core';
import { LayoutService } from '@core/services/layout.service';
import { ProfileService } from '@core/services/profile.service';
import { ProjectService } from '@core/services/project.service';
import { Profile } from '@shared/models/profile.models';
import { Project } from '@shared/models/project.models';

@Component({
  selector: 'app-display-profile',
  imports: [],
  templateUrl: './display-profile.html',
})
export class DisplayProfile implements OnInit {
  private profileService = inject(ProfileService);
  private projectService = inject(ProjectService);
  private layoutService = inject(LayoutService);

  protected profile = signal<Profile | null>(null);
  protected projectsList = signal<Project[]>([]);
  protected errorMessages = signal<string[]>([]);
  protected isLoading = signal<boolean>(false);

  async ngOnInit() {
    this.layoutService.pageTitle.set('Mes informations et projets en attente de validation');
    this.isLoading.set(true);

    try {
      // Récupération des données utilisateurs (nom, prénom)
      const { data: profileData, error: profileError } =
        await this.profileService.getCurrentUserProfile();
      if (profileData) this.profile.set(profileData);
      else this.errorMessages.set(['Récupération de vos informations : ' + profileError]);

      // Récupération des projets en attente de validation
      const { data: projectsData, error: projectsError } =
        await this.projectService.getPendingUserProjects();
      if (projectsData) this.projectsList.set(projectsData);
      else
        this.errorMessages.update((errors) => [
          ...errors,
          'Récupération de vos projets en attente : ' + projectsError!,
        ]);
    } finally {
      this.isLoading.set(false);
    }
  }
}
