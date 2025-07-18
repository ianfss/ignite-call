'use client'

import { useQuery } from '@tanstack/react-query'
import { format, getMonth, getYear } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'

interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

interface BlockedDates {
  blockedWeekDays: number[]
  blockedDates: number[]
}

export function CalendarStep() {
  const params = useParams<{ username: string }>()

  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [date, setDate] = useState<Date | undefined>(undefined)

  const dateWithoutTime = date ? format(date, 'yyyy-MM-dd') : null

  const weekDay = date ? format(date, 'EEEE', { locale: ptBR }) : null

  const describedDate = date
    ? format(date, "dd 'de' MMMM", { locale: ptBR })
    : null

  const { data: availability } = useQuery<Availability>({
    queryKey: ['availability', dateWithoutTime],
    queryFn: async () => {
      const response = await fetch(
        `/api/users/${params.username}/availability?date=${dateWithoutTime}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      return response.json()
    },
    enabled: !!date,
  })

  const { data: blockedDates } = useQuery<BlockedDates>({
    queryKey: ['blocked-dates', getYear(currentDate), getMonth(currentDate)],
    queryFn: async () => {
      const response = await fetch(
        `/api/users/${params.username}/blocked-dates?year=${getYear(currentDate)}&month=${(String(getMonth(currentDate) + 1)).padStart(2, '0')}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      return response.json()
    },
  })

  return (
    <Card
      className={`relative mx-auto grid ${date ? 'grid-cols-[1fr_280px]' : 'w-[540px] grid-cols-1'}`}
    >
      <CardContent>
        {blockedDates && (
          <Calendar
            className="w-[492px]"
            locale={ptBR}
            mode="single"
            modifiers={{
              disabled: [
                { before: new Date() },
                { dayOfWeek: blockedDates?.blockedWeekDays || [] },
                ...(blockedDates?.blockedDates || []).map(
                  (day) =>
                    new Date(getYear(currentDate), getMonth(currentDate), day)
                ),
              ],
            }}
            month={currentDate}
            onMonthChange={setCurrentDate}
            onSelect={setDate}
            selected={date}
          />
        )}
      </CardContent>
      {date && (
        <div className="absolute top-0 right-0 bottom-0 w-[280px] overflow-y-scroll border-l px-6 pt-6">
          <div className="font-medium">
            {weekDay},
            <span className="text-muted-foreground"> {describedDate}</span>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2">
            {availability?.possibleTimes.map((hour) => {
              return (
                <Button
                  className=""
                  disabled={!availability.availableTimes.includes(hour)}
                  key={hour}
                  size="sm"
                  variant="secondary"
                >
                  {String(hour).padStart(2, '0')}:00
                </Button>
              )
            })}
          </div>
        </div>
      )}
    </Card>
  )
}
