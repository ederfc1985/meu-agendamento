import Link from 'next/link';
import Image from 'next/image';

const specialties = [
  {
    name: 'Cardiologia',
    image: '/images/especialidades/cardiologia.svg',
    alt: 'Ilustração de um coração com traçado de eletrocardiograma',
  },
  {
    name: 'Clínica Geral',
    image: '/images/especialidades/clinica-geral.svg',
    alt: 'Ilustração de profissional de saúde com estetoscópio',
  },
  {
    name: 'Dermatologia',
    image: '/images/especialidades/dermatologia.svg',
    alt: 'Ilustração de rosto e cuidados com a pele',
  },
  {
    name: 'Ortopedia',
    image: '/images/especialidades/ortopedia.svg',
    alt: 'Ilustração de um osso, representando a saúde ortopédica',
  },
  {
    name: 'Pediatria',
    image: '/images/especialidades/pediatria.svg',
    alt: 'Ilustração alegre voltada ao cuidado infantil',
  },
];

const steps = [
  {
    number: '01',
    title: 'Escolha o profissional',
    description: 'Consulte as especialidades disponíveis e encontre a opção adequada para você.',
  },
  {
    number: '02',
    title: 'Selecione um horário',
    description: 'Informe seus dados e escolha a data e o horário desejados.',
  },
  {
    number: '03',
    title: 'Confirme seu agendamento',
    description: 'Revise as informações e envie sua solicitação de consulta.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <header className="border-b border-emerald-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="text-2xl font-bold tracking-tight text-emerald-950">
            Doctor <span className="text-emerald-700">Franco</span>
          </Link>
          <nav className="flex items-center gap-3 sm:gap-6" aria-label="Navegação principal">
            <a className="text-sm font-medium text-slate-600 hover:text-emerald-800" href="#especialidades">
              Especialidades
            </a>
            <a className="text-sm font-medium text-slate-600 hover:text-emerald-800" href="#como-agendar">
              Como agendar
            </a>
            <Link
              className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
              href="/consultas/novo"
            >
              Agendar consulta
            </Link>
          </nav>
        </div>
      </header>

      <section className="overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">
              Cuidado perto de você
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Agende sua consulta na Doctor Franco
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-emerald-50">
              Consulte as especialidades disponíveis e solicite seu horário de forma simples e online.
            </p>
            <Link
              className="mt-8 inline-flex rounded-lg bg-white px-6 py-3.5 font-semibold text-emerald-900 shadow-sm transition hover:bg-emerald-50"
              href="/consultas/novo"
            >
              Agendar uma consulta
            </Link>
            <p className="mt-4 text-sm text-emerald-100">
              Atendimento em Santo André, São Paulo.
            </p>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-white/15 text-2xl" aria-hidden="true">
              +
            </div>
            <h2 className="mt-5 text-xl font-bold text-white">Sua saúde em primeiro lugar</h2>
            <p className="mt-2 leading-7 text-emerald-50">
              Veja os profissionais cadastrados e escolha a especialidade para iniciar seu agendamento.
            </p>
            <a className="mt-5 inline-flex font-semibold text-white underline decoration-emerald-300 underline-offset-4 hover:text-emerald-100" href="#especialidades">
              Explorar especialidades
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20" id="especialidades">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">Atendimento médico</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-emerald-950">Especialidades</h2>
          <p className="mt-3 leading-7 text-slate-600">
            Confira algumas áreas de atendimento da clínica. A disponibilidade dos profissionais e horários aparece no formulário de agendamento.
          </p>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {specialties.map((specialty) => (
            <li className="overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/50" key={specialty.name}>
              <Image
                alt={specialty.alt}
                className="h-44 w-full object-cover"
                height={320}
                src={specialty.image}
                width={600}
              />
              <div className="p-5">
                <h3 className="font-semibold text-emerald-950">{specialty.name}</h3>
              </div>
            </li>
          ))}
        </ul>
        <Link
          className="mt-7 inline-flex rounded-lg border border-emerald-700 px-5 py-3 font-semibold text-emerald-800 transition hover:bg-emerald-50"
          href="/consultas/novo"
        >
          Agendar uma consulta
        </Link>
      </section>

      <section className="bg-emerald-50/70" id="como-agendar">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">Agendamento online</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-emerald-950">Como marcar sua consulta</h2>
          </div>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <li className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm" key={step.number}>
                <span className="text-sm font-bold tracking-wider text-emerald-700">{step.number}</span>
                <h3 className="mt-3 text-lg font-bold text-emerald-950">{step.title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">Onde estamos</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-emerald-950">Doctor Franco</h2>
          <address className="mt-3 not-italic leading-7 text-slate-600">
            Rua Acre, 85<br />
            Santo André, SP
          </address>
        </div>
        <Link
          className="inline-flex w-fit rounded-lg bg-emerald-700 px-6 py-3.5 font-semibold text-white transition hover:bg-emerald-800"
          href="/consultas/novo"
        >
          Agendar consulta
        </Link>
      </section>

      <footer className="border-t border-emerald-100 bg-emerald-950">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-emerald-100 sm:px-8">
          <p className="font-semibold text-white">Doctor Franco</p>
          <p>Rua Acre, 85 — Santo André, SP</p>
          <Link className="text-emerald-100 underline underline-offset-4 hover:text-white" href="/login">
            Acesso da equipe
          </Link>
        </div>
      </footer>
    </main>
  );
}
