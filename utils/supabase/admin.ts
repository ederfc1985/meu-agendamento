import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { createClient } from './server';

export async function requireAdmin() {
  await connection();
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error && error.name !== 'AuthSessionMissingError') {
    console.error('Falha ao verificar sessão administrativa:', error.message);
    redirect('/login?erro=servico');
  }

  if (!user || user.app_metadata.role !== 'admin') {
    redirect('/login?erro=acesso');
  }

  return { supabase, user };
}
