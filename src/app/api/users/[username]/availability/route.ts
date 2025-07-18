import { endOfDay, getDay, isBefore, parseISO, setHours } from 'date-fns'
import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return new NextResponse(null, { status: 400 })
  }

  const searchParams = request.nextUrl.searchParams

  const dateParam = searchParams.get('date')

  if (!dateParam) {
    return new NextResponse(null, { status: 400 })
  }

  const date = parseISO(dateParam)

  const isPastDate = isBefore(endOfDay(date), new Date())

  if (isPastDate) {
    return NextResponse.json({ possibleTimes: [], availableTimes: [] })
  }

  const weekDay = getDay(date)

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      userId: user.id,
      weekDay,
    },
  })

  if (!userAvailability) {
    return NextResponse.json({ possibleTimes: [], availableTimes: [] })
  }

  const { timeStartInMinutes, timeEndInMinutes } = userAvailability

  const startHour = timeStartInMinutes / 60
  const endHour = timeEndInMinutes / 60

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i
    }
  )

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      userId: user.id,
      date: {
        gte: setHours(date, startHour),
        lte: setHours(date, endHour),
      },
    },
  })

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = blockedTimes.some((blockedTime) => {
      return blockedTime.date.getHours() === time
    })

    const isTimeInPast = isBefore(setHours(date, time), new Date())

    return !(isTimeBlocked || isTimeInPast)
  })

  return NextResponse.json({ possibleTimes, availableTimes })
}
