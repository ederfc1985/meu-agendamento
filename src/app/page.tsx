import { Suspense } from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

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
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [
    { data: consultas, error },
    { data: todos, error: todosError },
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
    supabase.from('todos').select('id, name').order('name'),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho do Painel Admin */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Painel de Administração</h1>
            <p className="text-gray-500 text-sm mt-1">
              Gestão de consultas médicas e agendamentos
            </p>
          </div>
          <nav className="flex flex-wrap gap-3">
            <Link
              href="/banco-de-dados"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Ver banco de dados
            </Link>
            <Link
              href="/consultas/novo"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              + Nova Consulta
            </Link>
          </nav>
        </header>

        {/* Métrica / Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <span className="text-sm font-medium text-gray-500">Total de Consultas</span>
            <p className="text-3xl font-bold text-gray-900 mt-2">{consultas?.length || 0}</p>
          </div>
        </div>

        {/* Tabela de Agendamentos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Próximos Agendamentos</h2>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm">
              Erro ao carregar consultas: {error.message}
            </div>
          )}

          {!consultas || consultas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhuma consulta agendada até o momento.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Paciente</th>
                    <th className="px-6 py-3">Médico / Especialidade</th>
                    <th className="px-6 py-3">Data e Hora</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {consultas.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{c.paciente_nome}</td>
                      <td className="px-6 py-4">
                        <div>{c.medicos?.[0]?.nome || 'Não atribuído'}</div>
                        <div className="text-xs text-gray-500">
                          {c.medicos?.[0]?.especialidade}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(c.data_hora_inicio).toLocaleString('pt-BR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {c.status || 'Agendada'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <section className="mt-8 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800">Tarefas</h2>
          </div>

          {todosError ? (
            <p className="bg-red-50 p-4 text-sm text-red-700" role="alert">
              Erro ao carregar tarefas: {todosError.message}
            </p>
          ) : !todos?.length ? (
            <p className="p-8 text-center text-gray-500">
              Nenhuma tarefa cadastrada.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {todos.map((todo) => (
                <li key={todo.id} className="px-6 py-4 text-sm text-gray-700">
                  {todo.name}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
