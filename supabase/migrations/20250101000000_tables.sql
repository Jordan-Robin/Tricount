-- Profil métier (relation 1-1 avec auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Projets
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Personnes participants à un projet (table de relation users - projects)
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted');
CREATE TABLE public.project_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  pseudo TEXT NOT NULL,
  status invitation_status NOT NULL DEFAULT 'pending',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, project_id)
);
ALTER TABLE public.project_participants ENABLE ROW LEVEL SECURITY;

-- Dépenses au sein d'un projet
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  paid_by UUID NOT NULL REFERENCES auth.users(id),
  expense_date DATE NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Personnes comptabilisées dans une dépense
CREATE TABLE public.expense_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES public.expenses(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (expense_id, user_id)
);
ALTER TABLE public.expense_participants ENABLE ROW LEVEL SECURITY;

-- Remboursements
CREATE TABLE public.reimbursements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id),
  from_user_id UUID NOT NULL REFERENCES auth.users(id),
  to_user_id UUID NOT NULL REFERENCES auth.users(id),
  amount NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);
ALTER TABLE public.reimbursements ENABLE ROW LEVEL SECURITY;

------ Index ------
-- profiles
CREATE INDEX ON public.profiles(user_id);

-- project_participants
CREATE INDEX ON public.project_participants(project_id);
CREATE INDEX ON public.project_participants(user_id);

-- expenses
CREATE INDEX ON public.expenses(project_id);
CREATE INDEX ON public.expenses(paid_by);
CREATE INDEX ON public.expenses(created_by);

-- expense_participants
CREATE INDEX ON public.expense_participants(expense_id);
CREATE INDEX ON public.expense_participants(user_id);

-- reimbursements
CREATE INDEX ON public.reimbursements(project_id);
CREATE INDEX ON public.reimbursements(from_user_id);
CREATE INDEX ON public.reimbursements(to_user_id);
