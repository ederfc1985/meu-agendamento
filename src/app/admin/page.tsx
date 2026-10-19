import { Suspense } from 'react';
import Link from 'next/link';
import { AdminNavigation } from '../admin-navigation';
import { requireAdmin } from '@/utils/supabase/admin';

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 p-6">
          <p className="mx-auto max-w-6xl text-gray-500" role="status">
            Carregando painel...
          </p>
        </main>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}

async function AdminDashboardContent() {
  const { supabase } = await requireAdmin();

  const [
    { data: consultas, error },
    { count: medicosCount, error: medicosError },
    { count: pacientesCount, error: pacientesError },
  ] = await Promise.all([
    supabase
      .from('consultas')
      .select(`
        id,
        paciente_nome,
        data_hora_inicio,
        data_hora_fim,
        status,
        medicos (
          nome,
          especialidade
        )
      `)
      .order('data_hora_inicio', { ascending: true }),
    supabase.from('medicos').select('*', { count: 'exact', head: true }),
    supabase.from('pacientes').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <main className="min-h-screen bg-emerald-50/60 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <AdminNavigation />
        <section className="mb-6 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-700 p-7 text-white shadow-lg shadow-emerald-950/10 sm:p-9">
          <p className="text-sm font-semibold text-emerald-100">PAINEL DE ATENDIMENTO</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Cuidado bem organizado.</h1>
          <p className="mt-3 max-w-xl text-emerald-50">Acompanhe a agenda e mantenha as informações da equipe e dos pacientes em um só lugar.</p>
          <Link className="mt-6 inline-flex rounded-lg bg-white px-4 py-2.5 font-semibold text-emerald-900 transition hover:bg-emerald-50" href="/consultas/novo">
            Agendar consulta
          </Link>
        </section>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <MetricCard title="Consultas" value={consultas?.length ?? 0} error={error?.message} />
          <MetricCard title="Médicos" value={medicosCount ?? 0} error={medicosError?.message} />
          <MetricCard title="Pacientes" value={pacientesCount ?? 0} error={pacientesError?.message} />
        </div>

        <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-50 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-emerald-950">Agenda de consultas</h2>
              <p className="mt-1 text-sm text-slate-500">Próximos horários e atendimentos cadastrados.</p>
            </div>
            <Link className="text-sm font-semibold text-emerald-700 hover:text-emerald-900" href="/banco-de-dados">Ver todas →</Link>
          </div>
          {error ? (
            <p className="p-5 text-sm text-red-700" role="alert">Erro ao carregar consultas: {error.message}</p>
          ) : !consultas?.length ? (
            <p className="p-8 text-center text-slate-500">Ainda não há consultas cadastradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-3">Paciente</th>
                    <th className="px-6 py-3">Profissional</th>
                    <th className="px-6 py-3">Data e horário</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {consultas.map((consulta) => (
                    <tr className="hover:bg-emerald-50/40" key={consulta.id}>
                      <td className="px-6 py-4 font-medium text-slate-900">{consulta.paciente_nome ?? 'Paciente não identificado'}</td>
                      <td className="px-6 py-4">{consulta.medicos?.[0]?.nome ?? 'Não atribuído'}<span className="block text-xs text-slate-500">{consulta.medicos?.[0]?.especialidade}</span></td>
                      <td className="whitespace-nowrap px-6 py-4">{new Date(consulta.data_hora_inicio).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</td>
                      <td className="px-6 py-4"><span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">{consulta.status ?? 'Agendada'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function MetricCard({ title, value, error }: { title: string; value: number; error?: string }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      {error ? <p className="mt-2 text-xs text-red-700">{error}</p> : <p className="mt-2 text-3xl font-bold text-emerald-900">{value}</p>}
    </div>
  );
}
