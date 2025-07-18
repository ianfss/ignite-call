'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Multistep } from '@/components/ui/multistep'
import { convertTimeStringToMinutes } from '@/utils/convert-time-string-to-minutes'
import { getWeekDays } from '@/utils/get-week-days'

const formSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: 'Você precisa selecionar pelo menos um dia da semana.',
    })
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          timeStartInMinutes: convertTimeStringToMinutes(interval.startTime),
          timeEndInMinutes: convertTimeStringToMinutes(interval.endTime),
        }
      })
    })
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.timeEndInMinutes - 60 >= interval.timeStartInMinutes
        )
      },
      {
        message:
          'O horário de término deve ser pelo menos 1h distante do início',
      }
    ),
})

type FormSchemaIn = z.input<typeof formSchema>
type FormSchemaOut = z.output<typeof formSchema>

export default function TimeIntervals() {
  const router = useRouter()

  const form = useForm<FormSchemaIn, unknown, FormSchemaOut>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
      ],
    },
  })

  const weekDays = getWeekDays()

  const { fields } = useFieldArray({
    control: form.control,
    name: 'intervals',
  })

  const intervals = form.watch('intervals')

  async function onSubmit(values: unknown) {
    // biome-ignore lint/nursery/noShadow: <>
    const { intervals } = values as unknown as FormSchemaOut

    const response = await fetch('/api/users/time-intervals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ intervals }),
    })

    if (response.ok) {
      router.push('/register/update-profile')
    } else {
      toast.error('Erro.')
    }
  }

  return (
    <div className="mx-auto mt-20 max-w-[572px] py-4">
      <div className="space-y-6 px-6 ">
        <strong className="text-2xl">Defina sua disponibilidade</strong>
        <p className="text-neutral-200">
          Defina o intervalo de horários que você está disponível em cada dia da
          semana.
        </p>
        <Multistep currentStep={3} size={4} />
      </div>
      <Card className="mt-6">
        <CardContent>
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="rounded-md border">
                {fields.map((it, index) => {
                  return (
                    <div
                      className="flex items-center justify-between not-first:border-t px-3 py-4"
                      key={it.weekDay}
                    >
                      <div className="flex items-center gap-3">
                        <FormField
                          name={`intervals.${index}.enabled`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked === true)
                                    form.trigger('intervals')
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormLabel>{weekDays[it.weekDay]}</FormLabel>
                      </div>
                      <div className="flex items-center gap-2">
                        <FormField
                          name={`intervals.${index}.startTime`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  step={60}
                                  type="time"
                                  {...field}
                                  disabled={intervals[index].enabled === false}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          name={`intervals.${index}.endTime`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  step={60}
                                  type="time"
                                  {...field}
                                  disabled={intervals[index].enabled === false}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              <FormMessage>
                {form.formState.errors.intervals?.root?.message}
              </FormMessage>

              <Button disabled={form.formState.isSubmitting} type="submit">
                Próximo passo <ArrowRight />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
