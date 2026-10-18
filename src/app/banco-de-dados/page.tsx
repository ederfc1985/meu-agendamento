import Link from 'next/link';
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export default function BancoDeDadosPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 p-6">
          <p className="mx-auto max-w-6xl text-gray-500" role="status">
            Carregando dados do banco...
          </p>
        </main>
      }
    >
      <BancoDeDadosContent />
    </Suspense>
  );
}

async function BancoDeDadosContent() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const [medicosResult, consultasResult] = await Promise.all([
    supabase
      .from('medicos')
      .select('id, nome, especialidade')
      .order('nome'),
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
  ]);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dados do banco
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Registros de médicos e consultas cadastrados no sistema.
            </p>
          </div>
          <nav className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Voltar ao painel
            </Link>
            <Link
              href="/consultas/novo"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              + Nova consulta
            </Link>
          </nav>
        </header>

        <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Médicos ({medicosResult.data?.length ?? 0})
            </h2>
          </div>
          {medicosResult.error ? (
            <p className="bg-red-50 p-4 text-sm text-red-700" role="alert">
              Erro ao carregar médicos: {medicosResult.error.message}
            </p>
          ) : !medicosResult.data?.length ? (
            <p className="p-8 text-center text-gray-500">
              Nenhum médico cadastrado.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th scope="col" className="px-6 py-3">ID</th>
                    <th scope="col" className="px-6 py-3">Nome</th>
                    <th scope="col" className="px-6 py-3">Especialidade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {medicosResult.data.map((medico) => (
                    <tr key={medico.id} className="hover:bg-gray-50">
                      <td className="max-w-xs truncate px-6 py-4 font-mono text-xs">
                        {medico.id}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {medico.nome}
                      </td>
                      <td className="px-6 py-4">{medico.especialidade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Consultas ({consultasResult.data?.length ?? 0})
            </h2>
          </div>
          {consultasResult.error ? (
            <p className="bg-red-50 p-4 text-sm text-red-700" role="alert">
              Erro ao carregar consultas: {consultasResult.error.message}
            </p>
          ) : !consultasResult.data?.length ? (
            <p className="p-8 text-center text-gray-500">
              Nenhuma consulta cadastrada.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th scope="col" className="px-6 py-3">ID</th>
                    <th scope="col" className="px-6 py-3">Paciente</th>
                    <th scope="col" className="px-6 py-3">Médico</th>
                    <th scope="col" className="px-6 py-3">Início</th>
                    <th scope="col" className="px-6 py-3">Término</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {consultasResult.data.map((consulta) => (
                    <tr key={consulta.id} className="hover:bg-gray-50">
                      <td className="max-w-xs truncate px-6 py-4 font-mono text-xs">
                        {consulta.id}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {consulta.paciente_nome}
                      </td>
                      <td className="px-6 py-4">
                        {consulta.medicos?.[0]?.nome ?? 'Não atribuído'}
                        {consulta.medicos?.[0]?.especialidade && (
                          <span className="block text-xs text-gray-500">
                            {consulta.medicos[0].especialidade}
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {new Date(consulta.data_hora_inicio).toLocaleString(
                          'pt-BR',
                          { dateStyle: 'short', timeStyle: 'short' },
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {new Date(consulta.data_hora_fim).toLocaleString(
                          'pt-BR',
                          { dateStyle: 'short', timeStyle: 'short' },
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {consulta.status ?? 'Agendada'}
                      </td>
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
