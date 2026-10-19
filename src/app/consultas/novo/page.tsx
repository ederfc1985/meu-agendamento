import { Suspense } from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { connection } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { agendarConsulta } from '../actions';

type NovaConsultaPageProps = {
  searchParams: Promise<{ erro?: string; sucesso?: string }>;
};

export default function NovaConsultaPage(props: NovaConsultaPageProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto my-10 max-w-2xl p-6">
          <p role="status">Carregando formulário...</p>
        </main>
      }
    >
      <NovaConsultaConteudo searchParams={props.searchParams} />
    </Suspense>
  );
}

async function NovaConsultaConteudo({
  searchParams,
}: NovaConsultaPageProps) {
  await connection();
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const params = await searchParams;
  const { data: medicos, error: medicosError } = await supabase
    .from('medicos')
    .select('id, nome, especialidade')
    .order('nome');

  return (
    <main className="min-h-screen bg-emerald-50/60 px-4 py-10">
    <div className="mx-auto my-4 max-w-2xl rounded-2xl border border-emerald-100 bg-white p-6 shadow-lg shadow-emerald-950/5 sm:p-8">
      <Link href="/" className="text-sm font-semibold text-emerald-800 hover:text-emerald-950">Doctor Franco</Link>
      <h1 className="mb-6 mt-3 text-2xl font-bold text-emerald-950">
        Agendar Nova Consulta
      </h1>

      {/* Mensagens de Feedback */}
      {params?.erro && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
          ⚠️ {params.erro}
        </div>
      )}

      {params?.sucesso && (
        <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg border border-green-200">
          ✅ Consulta agendada com sucesso!
        </div>
      )}

      {medicosError && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
          Erro ao carregar médicos: {medicosError.message}
        </p>
      )}
      <form action={agendarConsulta} className="space-y-4">
        {/* Nome do Paciente */}
        <div>
          <label htmlFor="paciente_nome" className="mb-1 block text-sm font-medium text-slate-700">
            Nome Completo do Paciente
          </label>
          <input
            type="text"
            id="paciente_nome"
            name="paciente_nome"
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            placeholder="Ex: Maria Silva"
          />
        </div>

        {/* Seleção do Médico */}
        <div>
          <label htmlFor="medico_id" className="mb-1 block text-sm font-medium text-slate-700">
            Selecione o Médico
          </label>
          <select
            id="medico_id"
            name="medico_id"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">Selecione um profissional...</option>
            {medicos?.map((medico) => (
              <option key={medico.id} value={medico.id}>
                {medico.nome} ({medico.especialidade})
              </option>
            ))}
          </select>
        </div>

        {/* Data e Hora de Início */}
        <div>
          <label htmlFor="data_hora_inicio" className="mb-1 block text-sm font-medium text-slate-700">
            Data e Horário de Início
          </label>
          <input
            type="datetime-local"
            id="data_hora_inicio"
            name="data_hora_inicio"
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Data e Hora de Fim */}
        <div>
          <label htmlFor="data_hora_fim" className="mb-1 block text-sm font-medium text-slate-700">
            Data e Horário de Término
          </label>
          <input
            type="datetime-local"
            id="data_hora_fim"
            name="data_hora_fim"
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Botão de Envio */}
        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800"
        >
          Confirmar Agendamento
        </button>
      </form>
    </div>
    </main>
  );
}