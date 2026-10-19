import Link from 'next/link';
import { Suspense } from 'react';
import { AdminNavigation } from '../admin-navigation';
import { cadastrarPaciente } from '../admin-actions';
import { requireAdmin } from '@/utils/supabase/admin';

type PacientesPageProps = {
  searchParams: Promise<{ erro?: string; sucesso?: string }>;
};

export default function PacientesPage(props: PacientesPageProps) {
  return (
    <Suspense fallback={<main className="p-8 text-slate-500" role="status">Carregando pacientes...</main>}>
      <PacientesContent searchParams={props.searchParams} />
    </Suspense>
  );
}

async function PacientesContent({ searchParams }: PacientesPageProps) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;
  const { data: pacientes, error } = await supabase
    .from('pacientes')
    .select('id, nome, telefone, email, created_at')
    .order('nome');

  return (
    <main className="min-h-screen bg-emerald-50/60 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <AdminNavigation />
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
            <div className="border-b border-emerald-50 px-6 py-5">
              <h1 className="text-xl font-bold text-emerald-950">Pacientes</h1>
              <p className="mt-1 text-sm text-slate-500">Abra um cadastro para consultar o histórico de atendimentos.</p>
            </div>
            {error ? (
              <p className="p-5 text-sm text-red-700" role="alert">Erro ao carregar pacientes: {error.message}. Confirme se a migração do banco foi executada.</p>
            ) : !pacientes?.length ? (
              <p className="p-8 text-center text-slate-500">Nenhum paciente cadastrado.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {pacientes.map((paciente) => (
                  <li key={paciente.id}>
                    <Link className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-emerald-50/60" href={`/pacientes/${paciente.id}`}>
                      <span>
                        <span className="block font-semibold text-slate-900">{paciente.nome}</span>
                        <span className="mt-0.5 block text-sm text-slate-500">{paciente.telefone}{paciente.email ? ` · ${paciente.email}` : ''}</span>
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-emerald-700">Histórico →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-emerald-950">Cadastrar paciente</h2>
            <p className="mt-1 text-sm text-slate-500">Cadastre somente os dados necessários ao atendimento.</p>
            {params.erro && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800" role="alert">{params.erro}</p>}
            {params.sucesso && <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800" role="status">{params.sucesso}</p>}
            <form action={cadastrarPaciente} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="nome">Nome completo</label>
                <input autoComplete="name" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" id="nome" maxLength={150} name="nome" required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="telefone">Telefone</label>
                <input autoComplete="tel" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" id="telefone" maxLength={40} name="telefone" required type="tel" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="email">E-mail <span className="font-normal text-slate-400">(opcional)</span></label>
                <input autoComplete="email" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" id="email" maxLength={254} name="email" type="email" />
              </div>
              <button className="w-full rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800" type="submit">Salvar paciente</button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
