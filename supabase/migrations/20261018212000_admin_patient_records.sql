ALTER TABLE public.consultas
  ADD COLUMN IF NOT EXISTS paciente_nome text;

ALTER TABLE public.consultas
  ALTER COLUMN paciente_id DROP NOT NULL;

CREATE TABLE IF NOT EXISTS public.pacientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  telefone text NOT NULL,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.consultas
  ADD COLUMN IF NOT EXISTS paciente_cadastro_id uuid
  REFERENCES public.pacientes(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS consultas_paciente_cadastro_id_idx
  ON public.consultas (paciente_cadastro_id)
  WHERE paciente_cadastro_id IS NOT NULL;

ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultas ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.pacientes TO authenticated;
GRANT INSERT, UPDATE, DELETE
  ON public.medicos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.consultas TO authenticated;
GRANT INSERT ON public.consultas TO anon, authenticated;

DROP POLICY IF EXISTS "Admins can manage patients"
  ON public.pacientes;
CREATE POLICY "Admins can manage patients"
  ON public.pacientes
  FOR ALL
  TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins can manage doctors"
  ON public.medicos;
CREATE POLICY "Admins can manage doctors"
  ON public.medicos
  FOR ALL
  TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins can manage consultations"
  ON public.consultas;
CREATE POLICY "Admins can manage consultations"
  ON public.consultas
  FOR ALL
  TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Pacientes podem agendar consultas"
  ON public.consultas;
CREATE POLICY "Pacientes podem agendar consultas"
  ON public.consultas
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (
      (SELECT auth.uid()) IS NULL
      AND paciente_id IS NULL
    )
    OR (
      (SELECT auth.uid()) IS NOT NULL
      AND paciente_id = (SELECT auth.uid())
    )
  );

NOTIFY pgrst, 'reload schema';
