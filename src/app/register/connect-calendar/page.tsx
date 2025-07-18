'use client'

import { ArrowRight, Calendar, Check } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Multistep } from '@/components/ui/multistep'

export default function ConnectCalendar() {
  const session = useSession()
  const params = useSearchParams()
  const router = useRouter()

  const hasAuthError = !!params.get('error')

  const isSignedIn = session.status === 'authenticated'

  async function handleConnectCalendar() {
    await signIn('google')
  }

  async function handleNavigateToNextStep() {
    await router.push('/register/time-intervals')
  }

  return (
    <div className="mx-auto mt-20 max-w-[572px] py-4">
      <div className="space-y-6 px-6 ">
        <strong className="text-2xl">Conecte sua agenda!</strong>
        <p className="text-neutral-200">
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </p>
        <Multistep currentStep={2} size={4} />
      </div>
      <Card className="mt-6">
        <CardContent className="flex flex-col gap-4">
          {isSignedIn ? (
            <Button disabled variant="ghost">
              Conectado com sucesso <Check />
            </Button>
          ) : (
            <Button onClick={handleConnectCalendar} variant="outline">
              Conectar Google Calendar <Calendar />
            </Button>
          )}

          {hasAuthError && !isSignedIn && (
            <p className="text-destructive text-sm">
              Falha ao se conectar ao Google, verifique se você habilitou as
              permissões de acesso ao Google Calendar.
            </p>
          )}

          <Button
            disabled={!isSignedIn}
            onClick={handleNavigateToNextStep}
            type="submit"
          >
            Próximo passo <ArrowRight />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
