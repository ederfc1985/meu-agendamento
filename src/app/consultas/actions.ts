'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

function getTextField(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === 'string' ? value.trim() : '';
}

function isDateTimeLocal(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return false;
  }

  return Number.isFinite(new Date(value).getTime());
}

function redirectWithMessage(type: 'erro' | 'sucesso', message: string): never {
  const params = new URLSearchParams({ [type]: message });
  redirect(`/consultas/novo?${params.toString()}`);
}

export async function agendarConsulta(formData: FormData) {
  const pacienteNome = getTextField(formData, 'paciente_nome');
  const medicoId = getTextField(formData, 'medico_id');
  const dataHoraInicio = getTextField(formData, 'data_hora_inicio');
  const dataHoraFim = getTextField(formData, 'data_hora_fim');

  if (
    !pacienteNome ||
    pacienteNome.length > 150 ||
    !medicoId ||
    !isDateTimeLocal(dataHoraInicio) ||
    !isDateTimeLocal(dataHoraFim)
  ) {
    redirectWithMessage('erro', 'Preencha todos os campos com valores válidos.');
  }

  const inicio = new Date(dataHoraInicio);
  const fim = new Date(dataHoraFim);

  if (fim <= inicio) {
    redirectWithMessage(
      'erro',
      'O horário de término deve ser posterior ao horário de início.',
    );
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.from('consultas').insert({
    paciente_nome: pacienteNome,
    medico_id: medicoId,
    data_hora_inicio: inicio.toISOString(),
    data_hora_fim: fim.toISOString(),
  });

  if (error) {
    console.error('Falha ao agendar consulta:', error);
    redirectWithMessage(
      'erro',
      'Não foi possível agendar a consulta. Verifique os dados e tente novamente.',
    );
  }

  redirectWithMessage('sucesso', 'Consulta agendada com sucesso!');
}
