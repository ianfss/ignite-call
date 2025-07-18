import { type NextRequest, NextResponse } from 'next/server'
import z from 'zod'
import { auth } from '@/lib/auth/auth-config'
import { prisma } from '@/lib/prisma'

const timeIntervalsBodySchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number(),
        timeStartInMinutes: z.number(),
        timeEndInMinutes: z.number(),
      })
    )
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.timeEndInMinutes - 60 >= interval.timeStartInMinutes
        )
      },
      {
        message:
          'The end time must be at least one hour later than the start time.',
      }
    ),
})

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session) {
    return new NextResponse(null, { status: 401 })
  }

  const result = await request.json()

  const { intervals } = timeIntervalsBodySchema.parse(result)

  await prisma.userTimeInterval.createMany({
    data: intervals.map((interval) => ({
      userId: session.user.id,
      weekDay: interval.weekDay,
      timeStartInMinutes: interval.timeStartInMinutes,
      timeEndInMinutes: interval.timeEndInMinutes,
    })),
  })

  return new NextResponse(null, { status: 201 })
}
