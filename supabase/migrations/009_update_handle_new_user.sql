-- Adiciona coluna phone na tabela profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Atualiza a função handle_new_user para incluir todos os campos
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  meta_first_name text;
  meta_last_name text;
  meta_full_name text;
BEGIN
  -- Extrai dados dos metadados
  meta_first_name := new.raw_user_meta_data ->> 'first_name';
  meta_last_name := new.raw_user_meta_data ->> 'last_name';
  
  -- Gera full_name se não vier nos metadados
  IF meta_first_name IS NOT NULL AND meta_last_name IS NOT NULL THEN
    meta_full_name := meta_first_name || ' ' || meta_last_name;
  ELSE
    meta_full_name := COALESCE(new.raw_user_meta_data ->> 'full_name', '');
  END IF;

  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    full_name,
    phone,
    currency,
    avatar_url
  )
  VALUES (
    new.id, 
    meta_first_name, 
    meta_last_name,
    meta_full_name,
    new.raw_user_meta_data ->> 'phone',
    COALESCE(new.raw_user_meta_data ->> 'currency', 'BRL'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN new;
END;
$function$;
