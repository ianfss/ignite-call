'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Deve ter no mínimo 3 caracteres.' })
    .regex(/^[a-z-]+$/i, { message: 'Deve ter apenas letras e hifens.' })
    .refine((username) => !username.startsWith('-'), {
      message: 'Não pode começar com hífen.',
    })
    .refine((username) => !username.endsWith('-'), {
      message: 'Não pode terminar com hífen.',
    })
    .transform((username) => username.toLowerCase()),
})

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  })

  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { username } = values

    await router.push(`/register?username=${username}`)
  }

  return (
    <div className="mx-auto mt-20 max-w-[572px] py-4">
      <div className="mx-auto max-w-[480px]">
        <h1 className="font-extrabold text-6xl">Agendamento descomplicado</h1>
        <p className="mt-4 mb-8 text-neutral-200 text-xl">
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre.
        </p>
        <Card>
          <CardContent>
            <Form {...form}>
              <form
                className="grid gap-2 md:grid-cols-[1fr_auto]"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="seu-usuario"
                          prefix="ianfss.com/"
                          {...field}
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={form.formState.isSubmitting} type="submit">
                  Reservar <ArrowRight />
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
