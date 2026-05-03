import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';

import { DisplayProfile } from './display-profile';
import { ProfileService } from '@core/services/profile.service';
import { ProjectService } from '@core/services/project.service';

const profileStub = {
  getCurrentUserProfile: vi.fn(),
} as unknown as Mocked<ProfileService>;

const projectStub = {
  getPendingUserProjects: vi.fn(),
  acceptProject: vi.fn(),
} as unknown as Mocked<ProjectService>;

describe('DisplayProfile', () => {
  let component: DisplayProfile;
  let fixture: ComponentFixture<DisplayProfile>;

  beforeEach(async () => {
    vi.clearAllMocks();
    profileStub.getCurrentUserProfile.mockResolvedValue({ data: null, error: 'no' });
    projectStub.getPendingUserProjects.mockResolvedValue({ data: [], error: null });

    await TestBed.configureTestingModule({
      imports: [DisplayProfile],
      providers: [
        { provide: ProfileService, useValue: profileStub },
        { provide: ProjectService, useValue: projectStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayProfile);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the profile and pending projects on init', async () => {
    const profile = { id: 'p1', user_id: 'u1', first_name: 'Jo' };
    const pending = [{ id: 'pj1' }];
    profileStub.getCurrentUserProfile.mockResolvedValue({ data: profile, error: null } as never);
    projectStub.getPendingUserProjects.mockResolvedValue({ data: pending, error: null } as never);

    await component.ngOnInit();

    expect(component['profile']()).toEqual(profile);
    expect(component['projectsList']()).toEqual(pending);
  });

  it('acceptProject removes the project from the list on success', async () => {
    projectStub.acceptProject.mockResolvedValue(null);
    component['projectsList'].set([{ id: 'pj1' }, { id: 'pj2' }] as never);

    await component.acceptProject('pj1');

    expect(component['projectsList']().map((p) => p.id)).toEqual(['pj2']);
  });
});
