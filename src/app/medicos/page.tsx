import { Suspense } from 'react';
import { AdminNavigation } from '../admin-navigation';
import { cadastrarMedico } from '../admin-actions';
import { requireAdmin } from '@/utils/supabase/admin';

type MedicosPageProps = {
  searchParams: Promise<{ erro?: string; sucesso?: string }>;
};

export default function MedicosPage(props: MedicosPageProps) {
  return (
    <Suspense fallback={<main className="p-8 text-slate-500" role="status">Carregando médicos...</main>}>
      <MedicosContent searchParams={props.searchParams} />
    </Suspense>
  );
}

async function MedicosContent({ searchParams }: MedicosPageProps) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;
  const { data: medicos, error } = await supabase
    .from('medicos')
    .select('id, nome, especialidade')
    .order('nome');

  return (
    <main className="min-h-screen bg-emerald-50/60 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <AdminNavigation />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
            <div className="border-b border-emerald-50 px-6 py-5">
              <h1 className="text-xl font-bold text-emerald-950">Equipe médica</h1>
              <p className="mt-1 text-sm text-slate-500">Profissionais disponíveis para atendimento.</p>
            </div>
            {error ? (
              <p className="p-5 text-sm text-red-700" role="alert">Erro ao carregar médicos: {error.message}</p>
            ) : !medicos?.length ? (
              <p className="p-8 text-center text-slate-500">Nenhum médico cadastrado.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {medicos.map((medico) => (
                  <li className="flex items-center gap-4 px-6 py-4" key={medico.id}>
                    <span className="flex size-11 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-800" aria-hidden="true">
                      {medico.nome.slice(0, 1).toUpperCase()}
                    </span>
                    <span>
                      <span className="block font-semibold text-slate-900">{medico.nome}</span>
                      <span className="mt-0.5 block text-sm text-slate-500">{medico.especialidade}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="h-fit rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-emerald-950">Cadastrar médico</h2>
            <p className="mt-1 text-sm text-slate-500">Adicione um profissional à agenda.</p>
            {params.erro && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800" role="alert">{params.erro}</p>}
            {params.sucesso && <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800" role="status">{params.sucesso}</p>}
            <form action={cadastrarMedico} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="nome">Nome completo</label>
                <input className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" id="nome" maxLength={150} name="nome" required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="especialidade">Especialidade</label>
                <input className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" id="especialidade" maxLength={120} name="especialidade" required />
              </div>
              <button className="w-full rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800" type="submit">Salvar médico</button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
