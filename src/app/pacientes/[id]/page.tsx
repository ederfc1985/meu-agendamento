import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { AdminNavigation } from '../../admin-navigation';
import { requireAdmin } from '@/utils/supabase/admin';

type PacienteDetalheProps = {
  params: Promise<{ id: string }>;
};

export default function PacienteDetalhePage(props: PacienteDetalheProps) {
  return (
    <Suspense fallback={<main className="p-8 text-slate-500" role="status">Carregando histórico...</main>}>
      <PacienteDetalheContent params={props.params} />
    </Suspense>
  );
}

async function PacienteDetalheContent({ params }: PacienteDetalheProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data: paciente, error: pacienteError } = await supabase
    .from('pacientes')
    .select('id, nome, telefone, email, created_at')
    .eq('id', id)
    .maybeSingle();

  if (!paciente && !pacienteError) notFound();

  const [linkedResult, nameMatchResult] = paciente
    ? await Promise.all([
        supabase
          .from('consultas')
          .select('id, paciente_nome, data_hora_inicio, data_hora_fim, status, observacoes, medicos(nome, especialidade)')
          .eq('paciente_cadastro_id', paciente.id)
          .order('data_hora_inicio', { ascending: false }),
        supabase
          .from('consultas')
          .select('id, paciente_nome, data_hora_inicio, data_hora_fim, status, observacoes, medicos(nome, especialidade)')
          .is('paciente_cadastro_id', null)
          .eq('paciente_nome', paciente.nome)
          .order('data_hora_inicio', { ascending: false }),
      ])
    : [null, null];

  const consultasVinculadas = linkedResult?.data ?? [];
  const consultasPorNome = (nameMatchResult?.data ?? []).filter(
    (consulta) => !consultasVinculadas.some((linked) => linked.id === consulta.id),
  );

  return (
    <main className="min-h-screen bg-emerald-50/60 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <AdminNavigation />
        <Link className="mb-5 inline-flex text-sm font-semibold text-emerald-800 hover:text-emerald-950" href="/pacientes">
          ← Voltar aos pacientes
        </Link>
        <section className="mb-6 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          {pacienteError ? (
            <p className="text-sm text-red-700" role="alert">Erro ao carregar paciente: {pacienteError.message}</p>
          ) : paciente ? (
            <>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Cadastro do paciente</p>
              <h1 className="mt-2 text-2xl font-bold text-emerald-950">{paciente.nome}</h1>
              <p className="mt-2 text-sm text-slate-600">{paciente.telefone}{paciente.email ? ` · ${paciente.email}` : ''}</p>
            </>
          ) : null}
        </section>

        {linkedResult?.error || nameMatchResult?.error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800" role="alert">
            Erro ao carregar histórico: {linkedResult?.error?.message ?? nameMatchResult?.error?.message}
          </p>
        ) : (
          <div className="space-y-6">
            <ConsultasSection
              title="Consultas vinculadas"
              description="Atendimentos associados ao cadastro deste paciente."
              consultas={consultasVinculadas}
            />
            {consultasPorNome.length > 0 && (
              <ConsultasSection
                title="Agendamentos sem vínculo"
                description="Agendamentos públicos com o mesmo nome. Confirme a identidade antes de tratá-los como parte do histórico."
                consultas={consultasPorNome}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}

type Consulta = {
  id: string;
  paciente_nome: string | null;
  data_hora_inicio: string;
  data_hora_fim: string;
  status: string | null;
  observacoes: string | null;
  medicos: { nome: string; especialidade: string }[] | null;
};

function ConsultasSection({
  title,
  description,
  consultas,
}: {
  title: string;
  description: string;
  consultas: Consulta[];
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
      <div className="border-b border-emerald-50 px-6 py-5">
        <h2 className="text-lg font-bold text-emerald-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      {!consultas.length ? (
        <p className="p-8 text-center text-slate-500">Nenhuma consulta encontrada.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {consultas.map((consulta) => (
            <li className="grid gap-2 px-6 py-4 sm:grid-cols-[1fr_auto] sm:items-center" key={consulta.id}>
              <div>
                <p className="font-semibold text-slate-900">{consulta.medicos?.[0]?.nome ?? 'Médico não informado'}</p>
                <p className="text-sm text-slate-500">{consulta.medicos?.[0]?.especialidade ?? ''}</p>
                {consulta.observacoes && <p className="mt-2 text-sm text-slate-600">Observações: {consulta.observacoes}</p>}
              </div>
              <div className="sm:text-right">
                <p className="text-sm font-medium text-slate-800">
                  {new Date(consulta.data_hora_inicio).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                </p>
                <p className="mt-1 text-xs text-emerald-800">{consulta.status ?? 'Agendada'}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
