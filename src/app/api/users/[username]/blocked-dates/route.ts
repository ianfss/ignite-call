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

  const year = searchParams.get('year')
  const month = searchParams.get('month')

  if (!(year || month)) {
    return new NextResponse(null, { status: 400 })
  }

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      weekDay: true,
    },
    where: {
      userId: user.id,
    },
  })

  const blockedWeekDays = Array.from(new Array(7).keys()).filter((weekDay) => {
    return !availableWeekDays.some(
      (availableWeekDay) => availableWeekDay.weekDay === weekDay
    )
  })

  const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`
    SELECT
      EXTRACT(DAY FROM S.date) AS date,
      COUNT(S.date) AS amount,
      ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60) AS size

    FROM schedulings S

    LEFT JOIN user_time_intervals UTI
      ON UTI.week_day = EXTRACT(DOW FROM S.date)

    WHERE S.user_id = ${user.id}
      AND TO_CHAR(S.date, 'YYYY-MM') = ${`${year}-${month}`}
      AND UTI.time_start_in_minutes IS NOT NULL

    GROUP BY EXTRACT(DAY FROM S.date),
      ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)

    HAVING COUNT(S.date) >= ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)
  `

  const blockedDates = blockedDatesRaw.map((item) => item.date)

  return NextResponse.json({ blockedWeekDays, blockedDates })
}
