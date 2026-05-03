import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { provideRouter } from '@angular/router';

import { ProjectList } from './project-list';
import { ProjectService } from '@core/services/project.service';

const projectStub = {
  getAll: vi.fn(),
} as unknown as Mocked<ProjectService>;

describe('ProjectList', () => {
  let component: ProjectList;
  let fixture: ComponentFixture<ProjectList>;

  beforeEach(async () => {
    vi.clearAllMocks();
    projectStub.getAll.mockResolvedValue({ data: [], error: null });

    await TestBed.configureTestingModule({
      imports: [ProjectList],
      providers: [provideRouter([]), { provide: ProjectService, useValue: projectStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the projects on init', async () => {
    const fakeProjects = [{ id: 'p1', name: 'Test' }];
    projectStub.getAll.mockResolvedValue({ data: fakeProjects, error: null } as never);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(projectStub.getAll).toHaveBeenCalled();
    expect(component['projectList']()).toEqual(fakeProjects);
  });

  it('stores the error message when getAll fails', async () => {
    projectStub.getAll.mockResolvedValue({ data: null, error: 'Boom' });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component['errorMessage']()).toBe('Boom');
  });
});
