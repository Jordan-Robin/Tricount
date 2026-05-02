import { Enums, Tables } from 'src/types/database.types';
import { Expense } from './expense.models';

export type Project = Tables<'projects'>;

export type ProjectParticipant = Tables<'project_participants'>;

export type InvitationStatus = Enums<'invitation_status'>;

export const INVITATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
} as const;

export type ProjectCreation = {
  name: string;
  description: string | null;
  creatorPseudo: string;
  participantsEmail: string[];
};

export type ProjectDetail = Project & {
  participants: ProjectParticipant[];
  expenses: Expense[];
};
