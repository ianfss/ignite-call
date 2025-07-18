'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Upload, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

interface UpdateProfileFormProps {
  avatarUrl?: string
  username?: string
  name?: string
}

const formSchema = z.object({
  bio: z.string(),
})

export function UpdateProfileForm({
  avatarUrl,
  username,
  name,
}: UpdateProfileFormProps) {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { bio } = values

    const response = await fetch('/api/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bio }),
    })

    if (response.ok) {
      router.push(`/schedule/${username}`)
    } else {
      toast.error('Erro.')
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormItem>
          <FormLabel>Foto de perfil</FormLabel>
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage alt={name} src={avatarUrl} />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <Button disabled variant="secondary">
              Selecionar foto <Upload />
            </Button>
          </div>
        </FormItem>
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sobre você</FormLabel>
              <FormControl>
                <Textarea
                  className="h-[120px]"
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Fale um pouco sobre você. Isto será exibido em sua página
                pessoal.
              </FormDescription>
            </FormItem>
          )}
        />
        <Button disabled={form.formState.isSubmitting} type="submit">
          Finalizar <ArrowRight />
        </Button>
      </form>
    </Form>
  )
}
