-- Champ updated_at de chaque table

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.expenses
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.reimbursements
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- Création d'un profil lorsque l'utilisateur a validé son email

CREATE OR REPLACE FUNCTION public.handle_email_confirmed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    INSERT INTO public.profiles (user_id)
    VALUES (NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_email_confirmed
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_email_confirmed();


-- Fonction générique de protection des champs immuables
CREATE OR REPLACE FUNCTION public.handle_immutable_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- profiles
  IF TG_TABLE_NAME = 'profiles' THEN
    IF NEW.id != OLD.id OR
       NEW.user_id != OLD.user_id OR
       NEW.created_at != OLD.created_at THEN
      RAISE EXCEPTION 'Cannot modify immutable fields on profiles';
    END IF;
  END IF;

  -- projects
  IF TG_TABLE_NAME = 'projects' THEN
    IF NEW.id != OLD.id OR
       NEW.created_by != OLD.created_by OR
       NEW.created_at != OLD.created_at THEN
      RAISE EXCEPTION 'Cannot modify immutable fields on projects';
    END IF;
  END IF;

  -- project_participants
  IF TG_TABLE_NAME = 'project_participants' THEN
    IF NEW.id != OLD.id OR
       NEW.project_id != OLD.project_id OR
       NEW.user_id != OLD.user_id OR
       NEW.joined_at != OLD.joined_at THEN
      RAISE EXCEPTION 'Cannot modify immutable fields on project_participants';
    END IF;
  END IF;

  -- expenses
  IF TG_TABLE_NAME = 'expenses' THEN
    IF NEW.id != OLD.id OR
       NEW.project_id != OLD.project_id OR
       NEW.created_by != OLD.created_by OR
       NEW.created_at != OLD.created_at THEN
      RAISE EXCEPTION 'Cannot modify immutable fields on expenses';
    END IF;
  END IF;

  -- reimbursements
  IF TG_TABLE_NAME = 'reimbursements' THEN
    IF NEW.id != OLD.id OR
       NEW.project_id != OLD.project_id OR
       NEW.created_at != OLD.created_at THEN
      RAISE EXCEPTION 'Cannot modify immutable fields on reimbursements';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER check_immutable_fields
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_immutable_fields();

CREATE TRIGGER check_immutable_fields
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.handle_immutable_fields();

CREATE TRIGGER check_immutable_fields
BEFORE UPDATE ON public.project_participants
FOR EACH ROW EXECUTE FUNCTION public.handle_immutable_fields();

CREATE TRIGGER check_immutable_fields
BEFORE UPDATE ON public.expenses
FOR EACH ROW EXECUTE FUNCTION public.handle_immutable_fields();

CREATE TRIGGER check_immutable_fields
BEFORE UPDATE ON public.reimbursements
FOR EACH ROW EXECUTE FUNCTION public.handle_immutable_fields();
