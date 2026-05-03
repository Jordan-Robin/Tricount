import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { provideRouter, Router } from '@angular/router';

import { AddProject } from './add-project';
import { ProjectService } from '@core/services/project.service';

const projectStub = {
  createProject: vi.fn(),
} as unknown as Mocked<ProjectService>;

describe('AddProject', () => {
  let component: AddProject;
  let fixture: ComponentFixture<AddProject>;

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [AddProject],
      providers: [provideRouter([]), { provide: ProjectService, useValue: projectStub }],
    }).compileComponents();

    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(AddProject);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form is invalid when name and creatorPseudo are empty', () => {
    expect(component['form'].invalid).toBe(true);
  });

  it('addParticipant pushes a new email control', () => {
    expect(component['participantsEmail'].length).toBe(0);
    component['addParticipant']();
    expect(component['participantsEmail'].length).toBe(1);
  });

  it('removeParticipant removes the control at the given index', () => {
    component['addParticipant']();
    component['addParticipant']();
    component['removeParticipant'](0);
    expect(component['participantsEmail'].length).toBe(1);
  });

  it('submit calls createProject with the form payload', async () => {
    projectStub.createProject.mockResolvedValue({ data: 'new-id', error: null });
    component['form'].patchValue({ name: 'Voyage', creatorPseudo: 'Jordan', description: '' });

    await component.submit();

    expect(projectStub.createProject).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Voyage',
        creatorPseudo: 'Jordan',
        description: null,
        participantsEmail: [],
      }),
    );
  });
});
