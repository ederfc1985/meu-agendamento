import Link from 'next/link';
import { sairComoAdmin } from './admin-actions';

export function AdminNavigation() {
  return (
    <header className="mb-8 flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Link href="/admin" className="text-xl font-bold tracking-tight text-emerald-950">
          Doctor Franco
        </Link>
        <p className="mt-1 text-sm text-slate-500">Cuidado organizado, perto de você.</p>
      </div>
      <nav className="flex flex-wrap items-center gap-2" aria-label="Navegação principal">
        <Link className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800" href="/admin">
          Painel
        </Link>
        <Link className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800" href="/medicos">
          Médicos
        </Link>
        <Link className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800" href="/pacientes">
          Pacientes
        </Link>
        <Link className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800" href="/banco-de-dados">
          Dados da Clínica
        </Link>
        <form action={sairComoAdmin}>
          <button className="rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-50" type="submit">
            Sair
          </button>
        </form>
      </nav>
    </header>
  );
}
