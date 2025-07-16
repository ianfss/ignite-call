'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form'
import { Input } from './ui/input'

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

export function ClaimUsernameForm() {
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
  )
}
