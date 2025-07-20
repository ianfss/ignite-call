'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, Clock } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface ConfirmStepProps {
  schedulingDate: Date
  onCancelConfirmation: () => void
}

const whitespaceRegex = /\s+/

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Nome deve ter pelo menos 3 caracteres.' })
    .refine((val) => val.trim().split(whitespaceRegex).length >= 2, {
      message: 'Informe nome e sobrenome.',
    }),
  email: z.email({ message: 'Digite um e-mail válido.' }),
  observations: z.string().optional(),
})

export function ConfirmStep({
  schedulingDate,
  onCancelConfirmation,
}: ConfirmStepProps) {
  const params = useParams<{ username: string }>()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch(`/api/users/${params.username}/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        observations: values.observations,
        date: schedulingDate,
      }),
    })

    if (response.ok) {
      toast.success('Sucesso.')

      onCancelConfirmation()
    } else {
      toast.error('Erro.')
    }
  }

  const describedDate = format(schedulingDate, "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  })

  const describedTime = format(schedulingDate, 'hh:mm', {
    locale: ptBR,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-4 border-b pb-6 font-normal">
          <p className="flex items-center gap-2">
            <Calendar className="size-5 text-muted-foreground" />
            {describedDate}
          </p>
          <p className="flex items-center gap-2">
            <Clock className="size-5 text-muted-foreground" />
            {describedTime}
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@exemplo.com"
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                disabled={form.formState.isSubmitting}
                onClick={onCancelConfirmation}
                type="button"
                variant="ghost"
              >
                Cancelar
              </Button>
              <Button disabled={form.formState.isSubmitting} type="submit">
                Confirmar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
