import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { PostgrestError } from '@supabase/supabase-js';

import { SupabaseService } from './supabase.service';

describe('SupabaseService', () => {
  let service: SupabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('mapPostgrestError returns French message for known code', () => {
    const error = { code: '23505' } as PostgrestError;
    expect(service.mapPostgrestError(error)).toBe('Cette entrée existe déjà.');
  });

  it('mapPostgrestError falls back to generic message for unknown code', () => {
    const error = { code: 'XYZ' } as PostgrestError;
    expect(service.mapPostgrestError(error)).toMatch(/Une erreur est survenue/);
  });
});
