import { Suspense } from 'react';
import { cookies } from 'next/headers';
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
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const params = await searchParams;

  // Busca a lista de médicos cadastrados no banco de dados
  const { data: medicos } = await supabase
    .from('medicos')
    .select('id, nome, especialidade')
    .order('nome');

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
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

      <form action={agendarConsulta} className="space-y-4">
        {/* Nome do Paciente */}
        <div>
          <label htmlFor="paciente_nome" className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo do Paciente
          </label>
          <input
            type="text"
            id="paciente_nome"
            name="paciente_nome"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Ex: Maria Silva"
          />
        </div>

        {/* Seleção do Médico */}
        <div>
          <label htmlFor="medico_id" className="block text-sm font-medium text-gray-700 mb-1">
            Selecione o Médico
          </label>
          <select
            id="medico_id"
            name="medico_id"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
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
          <label htmlFor="data_hora_inicio" className="block text-sm font-medium text-gray-700 mb-1">
            Data e Horário de Início
          </label>
          <input
            type="datetime-local"
            id="data_hora_inicio"
            name="data_hora_inicio"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Data e Hora de Fim */}
        <div>
          <label htmlFor="data_hora_fim" className="block text-sm font-medium text-gray-700 mb-1">
            Data e Horário de Término
          </label>
          <input
            type="datetime-local"
            id="data_hora_fim"
            name="data_hora_fim"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Botão de Envio */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow transition-colors duration-200"
        >
          Confirmar Agendamento
        </button>
      </form>
    </div>
  );
}