import { Enums, Tables } from 'src/types/database.types';

export type Project = Tables<'projects'>;

export type InvitationStatus = Enums<'invitation_status'>;

export const INVITATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
} as const;
