import { ClaimUsernameForm } from '@/components/claim-username-form'

export default function Home() {
  return (
    <div className="mx-auto mt-20 max-w-[572px] py-4">
      <div className="mx-auto max-w-[480px]">
        <h1 className="font-extrabold text-6xl">Agendamento descomplicado</h1>
        <p className="mt-4 mb-8 text-neutral-200 text-xl">
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre.
        </p>
        <ClaimUsernameForm />
      </div>
    </div>
  )
}
