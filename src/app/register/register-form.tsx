'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const whitespaceRegex = /\s+/

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
  name: z
    .string()
    .min(3, { message: 'Nome deve ter pelo menos 3 caracteres.' })
    .refine((val) => val.trim().split(whitespaceRegex).length >= 2, {
      message: 'Informe nome e sobrenome.',
    }),
})

export function RegisterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      name: '',
    },
  })

  const params = useSearchParams()

  useEffect(() => {
    const username = params.get('username')

    if (username) {
      form.setValue('username', username)
    }
  }, [params, form.setValue])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: values.username,
        name: values.name,
      }),
    })

    if (!response.ok) {
      const { message } = await response.json()

      toast.error(message)
    }
  }

  return (
    <Card className="mt-6">
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome de usuário</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting}
                      placeholder="seu-usuario"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting}
                      placeholder="Seu nome"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={form.formState.isSubmitting} type="submit">
              Próximo passo <ArrowRight />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
