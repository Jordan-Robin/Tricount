------ public.profiles ------
CREATE POLICY "profiles_select" ON public.profiles
FOR SELECT TO authenticated
USING ((select auth.uid()) = user_id);

CREATE POLICY "profiles_update" ON public.profiles
FOR UPDATE TO authenticated
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);

------ public.projects ------
CREATE POLICY "projects_insert" ON public.projects
FOR INSERT TO authenticated
WITH CHECK ((select auth.uid()) = created_by);

CREATE POLICY "projects_select" ON public.projects
FOR SELECT TO authenticated
USING (
  EXISTS(
    SELECT 1 FROM public.project_participants AS pp
    WHERE pp.project_id = projects.id
    AND pp.user_id = (select auth.uid())
  )
);

CREATE POLICY "projects_update" ON public.projects
FOR UPDATE TO authenticated
USING ((select auth.uid()) = created_by)
WITH CHECK ((select auth.uid()) = created_by);

------ public.project_participants ------
CREATE POLICY "project_participants_create" ON public.project_participants
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects AS p
    WHERE p.id = project_participants.project_id
    AND p.created_by = (select auth.uid())
  )
);

-- is_project_member bypass le RLS, afin d'éviter une boucle récursive
CREATE POLICY "project_participants_select" ON public.project_participants
FOR SELECT TO authenticated
USING (public.is_project_member(project_id));

CREATE POLICY "project_participants_update" ON public.project_participants
FOR UPDATE TO authenticated
USING (
  user_id = (select auth.uid())
  OR EXISTS (
    SELECT 1 FROM public.projects AS p
    WHERE p.id = project_participants.project_id
    AND p.created_by = (select auth.uid())
  )
);

------ public.expenses ------
CREATE POLICY "expenses_select" ON public.expenses
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.project_participants AS pp
    WHERE pp.project_id = expenses.project_id
    AND pp.user_id = (select auth.uid())
    AND pp.status = 'accepted'
  )
);

CREATE POLICY "expenses_insert" ON public.expenses
FOR INSERT TO authenticated
WITH CHECK (
  (select auth.uid()) = created_by
  AND EXISTS (
    SELECT 1 FROM public.project_participants AS pp
    WHERE pp.project_id = expenses.project_id
    AND pp.user_id = (select auth.uid())
    AND pp.status = 'accepted'
  )
);

CREATE POLICY "expenses_update" ON public.expenses
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.project_participants AS pp
    WHERE pp.project_id = expenses.project_id
    AND pp.user_id = (select auth.uid())
    AND pp.status = 'accepted'
  )
);

CREATE POLICY "expenses_delete" ON public.expenses
FOR DELETE TO authenticated
USING ((select auth.uid()) = created_by);

------ public.expense_participants ------
CREATE POLICY "expense_participants_select" ON public.expense_participants
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.expenses AS e
    JOIN public.project_participants AS pp ON pp.project_id = e.project_id
    WHERE e.id = expense_participants.expense_id
    AND pp.user_id = (select auth.uid())
    AND pp.status = 'accepted'
  )
);

CREATE POLICY "expense_participants_insert" ON public.expense_participants
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.expenses AS e
    JOIN public.project_participants AS pp ON pp.project_id = e.project_id
    WHERE e.id = expense_participants.expense_id
    AND pp.user_id = (select auth.uid())
    AND pp.status = 'accepted'
  )
);

CREATE POLICY "expense_participants_update" ON public.expense_participants
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.expenses AS e
    JOIN public.project_participants AS pp ON pp.project_id = e.project_id
    WHERE e.id = expense_participants.expense_id
    AND pp.user_id = (select auth.uid())
    AND pp.status = 'accepted'
  )
);

CREATE POLICY "expense_participants_delete" ON public.expense_participants
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.expenses AS e
    WHERE e.id = expense_participants.expense_id
    AND e.created_by = (select auth.uid())
  )
);

------ public.reimbursements ------
CREATE POLICY "reimbursements_select" ON public.reimbursements
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.project_participants AS pp
    WHERE pp.project_id = reimbursements.project_id
    AND pp.user_id = (select auth.uid())
    AND pp.status = 'accepted'
  )
);

CREATE POLICY "reimbursements_insert" ON public.reimbursements
FOR INSERT TO authenticated
WITH CHECK (
  (select auth.uid()) = from_user_id
  AND EXISTS (
    SELECT 1 FROM public.project_participants AS pp
    WHERE pp.project_id = reimbursements.project_id
    AND pp.user_id = (select auth.uid())
    AND pp.status = 'accepted'
  )
);

CREATE POLICY "reimbursements_update" ON public.reimbursements
FOR UPDATE TO authenticated
USING ((select auth.uid()) = from_user_id);

CREATE POLICY "reimbursements_delete" ON public.reimbursements
FOR DELETE TO authenticated
USING ((select auth.uid()) = from_user_id);
