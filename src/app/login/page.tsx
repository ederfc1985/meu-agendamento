import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { connection } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { entrarComoAdmin } from '../admin-actions';

export default function LoginPage(props: {
  searchParams: Promise<{ erro?: string }>;
}) {
  return (
    <Suspense fallback={<main className="min-h-screen bg-emerald-50" role="status">Carregando acesso...</main>}>
      <LoginContent searchParams={props.searchParams} />
    </Suspense>
  );
}

async function LoginContent({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  await connection();
  const { erro } = await searchParams;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  const sessionCheckFailed = Boolean(
    authError && authError.name !== 'AuthSessionMissingError',
  );
  if (authError && authError.name !== 'AuthSessionMissingError') {
    console.error('Falha ao verificar sessão na tela de login:', authError.message);
  }
  if (user?.app_metadata.role === 'admin') {
    redirect('/admin');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-emerald-50 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-emerald-100 bg-white p-8 shadow-xl shadow-emerald-950/5">
        <div className="mb-8">
          <p className="mb-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
            Acesso administrativo
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-emerald-950">
            Bem-vindo de volta
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Entre com a conta administrativa cadastrada no Supabase.
          </p>
        </div>

        {erro === 'invalido' && (
          <p className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
            E-mail ou senha inválidos para acesso administrativo.
          </p>
        )}
        {erro === 'config' && (
          <p className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900" role="alert">
            Informe e-mail e senha para continuar.
          </p>
        )}
        {erro === 'acesso' && (
          <p className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900" role="alert">
            Esta área é exclusiva para administradores.
          </p>
        )}
        {(erro === 'servico' || sessionCheckFailed) && (
          <p className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
            Não foi possível verificar o acesso agora. Tente novamente em instantes.
          </p>
        )}

        <form action={entrarComoAdmin} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="email">
              E-mail
            </label>
            <input autoComplete="username" className="w-full rounded-lg border border-slate-300 px-3.5 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" id="email" name="email" required type="email" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="password">
              Senha
            </label>
            <input autoComplete="current-password" className="w-full rounded-lg border border-slate-300 px-3.5 py-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" id="password" name="password" required type="password" />
          </div>
          <button className="w-full rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2" type="submit">
            Entrar
          </button>
        </form>
        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          Acesso restrito à equipe autorizada.
        </p>
      </section>
    </main>
  );
}
