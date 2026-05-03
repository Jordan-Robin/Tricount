CREATE OR REPLACE FUNCTION public.add_project(
  p_name TEXT,
  p_pseudo TEXT,
  p_participants TEXT[],
  p_description TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
  DECLARE
    v_project_id UUID;
  BEGIN
    INSERT INTO public.projects(name, description, created_by)
    VALUES (p_name, p_description, auth.uid())
    RETURNING id INTO v_project_id;

    INSERT INTO public.project_participants(project_id, user_id, pseudo, status)
    VALUES (v_project_id, auth.uid(), p_pseudo, 'accepted');

    PERFORM public.add_project_participants(
      p_participants,
      v_project_id
    );

    RETURN v_project_id;
  END
$$;

CREATE OR REPLACE FUNCTION public.add_project_participants(
  p_participants TEXT[],
  p_project_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public AS $$
  DECLARE
    v_user_id UUID;
    v_element TEXT;
  BEGIN
    FOREACH v_element IN ARRAY p_participants LOOP
      v_user_id = NULL;

      SELECT id INTO v_user_id
      FROM auth.users
      WHERE email = v_element;

      IF v_user_id != auth.uid() AND v_user_id IS NOT null THEN
        INSERT INTO public.project_participants(project_id, user_id, pseudo)
        VALUES(p_project_id, v_user_id, '')
        ON CONFLICT (project_id, user_id) DO NOTHING;
      END IF;
    END LOOP;
  END
$$;

-- Appelée par project_participants_select, afin de contourner le RLS et éviter une boucle récursive
CREATE OR REPLACE FUNCTION public.is_project_member(p_project_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.project_participants
    WHERE project_id = p_project_id
    AND user_id = auth.uid()
  );
$$;
