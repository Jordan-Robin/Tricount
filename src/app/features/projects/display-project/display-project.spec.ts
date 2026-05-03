import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { DisplayProject } from './display-project';
import { ProjectService } from '@core/services/project.service';

const projectStub = {
  getProjectDetail: vi.fn(),
} as unknown as Mocked<ProjectService>;

describe('DisplayProject', () => {
  let component: DisplayProject;
  let fixture: ComponentFixture<DisplayProject>;

  beforeEach(async () => {
    vi.clearAllMocks();
    projectStub.getProjectDetail.mockResolvedValue({ data: null, error: 'no' });

    await TestBed.configureTestingModule({
      imports: [DisplayProject],
      providers: [
        provideRouter([]),
        { provide: ProjectService, useValue: projectStub },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: 'p1' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayProject);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the project detail using the route id', async () => {
    const detail = { id: 'p1', name: 'Voyage', participants: [], expenses: [] };
    projectStub.getProjectDetail.mockResolvedValue({ data: detail, error: null } as never);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(projectStub.getProjectDetail).toHaveBeenCalledWith('p1');
    expect(component['project']).toEqual(detail);
  });

  it('toggles showExpenses', () => {
    expect(component['showExpenses']()).toBe(false);
    component['showExpenses'].set(true);
    expect(component['showExpenses']()).toBe(true);
  });
});
