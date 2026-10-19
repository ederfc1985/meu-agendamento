'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { requireAdmin } from '@/utils/supabase/admin';

function textField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

function redirectWithMessage(path: string, type: 'erro' | 'sucesso', message: string): never {
  redirect(`${path}?${new URLSearchParams({ [type]: message })}`);
}

export async function entrarComoAdmin(formData: FormData) {
  const email = textField(formData, 'email');
  const passwordValue = formData.get('password');
  const password = typeof passwordValue === 'string' ? passwordValue : '';

  if (!email || !password) {
    redirect('/login?erro=config');
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || data.user?.app_metadata.role !== 'admin') {
    await supabase.auth.signOut();
    redirect('/login?erro=invalido');
  }

  redirect('/admin');
}

export async function sairComoAdmin() {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Falha ao encerrar sessão administrativa:', error.message);
    redirectWithMessage('/admin', 'erro', 'Não foi possível encerrar a sessão. Tente novamente.');
  }

  redirect('/login');
}

export async function cadastrarMedico(formData: FormData) {
  const { supabase } = await requireAdmin();
  const nome = textField(formData, 'nome');
  const especialidade = textField(formData, 'especialidade');

  if (!nome || !especialidade || nome.length > 150 || especialidade.length > 120) {
    redirectWithMessage('/medicos', 'erro', 'Informe nome e especialidade válidos.');
  }

  const { error } = await supabase.from('medicos').insert({ nome, especialidade });

  if (error) {
    console.error('Falha ao cadastrar médico:', { code: error.code, message: error.message });
    redirectWithMessage('/medicos', 'erro', 'Não foi possível cadastrar o médico. Verifique as políticas do banco.');
  }

  redirectWithMessage('/medicos', 'sucesso', 'Médico cadastrado.');
}

export async function cadastrarPaciente(formData: FormData) {
  const { supabase } = await requireAdmin();
  const nome = textField(formData, 'nome');
  const telefone = textField(formData, 'telefone');
  const email = textField(formData, 'email');

  if (!nome || !telefone || nome.length > 150 || telefone.length > 40) {
    redirectWithMessage('/pacientes', 'erro', 'Informe nome e telefone válidos.');
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirectWithMessage('/pacientes', 'erro', 'Informe um e-mail válido ou deixe o campo vazio.');
  }

  const { error } = await supabase.from('pacientes').insert({
    nome,
    telefone,
    email: email || null,
  });

  if (error) {
    console.error('Falha ao cadastrar paciente:', { code: error.code, message: error.message });
    redirectWithMessage('/pacientes', 'erro', 'Não foi possível cadastrar o paciente. Confirme se a migração SQL foi aplicada.');
  }

  redirectWithMessage('/pacientes', 'sucesso', 'Paciente cadastrado.');
}
