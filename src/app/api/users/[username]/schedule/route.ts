import { isBefore, startOfHour } from 'date-fns'
import { type NextRequest, NextResponse } from 'next/server'
import z from 'zod'
import { prisma } from '@/lib/prisma'

const whitespaceRegex = /\s+/

export async function POST(
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

  const createSchedulingBody = z.object({
    name: z
      .string()
      .min(3)
      .refine((val) => val.trim().split(whitespaceRegex).length >= 2),
    email: z.email({ message: 'Digite um e-mail válido.' }),
    observations: z.string().optional(),
    date: z.iso.datetime(),
  })

  const { name, email, observations, date } = createSchedulingBody.parse(
    await request.json()
  )

  const schedulingDate = startOfHour(date)

  if (isBefore(schedulingDate, new Date())) {
    return new NextResponse(null, { status: 400 })
  }

  const conflictScheduling = await prisma.scheduling.findFirst({
    where: {
      userId: user.id,
      date: schedulingDate,
    },
  })

  if (conflictScheduling) {
    return new NextResponse(null, { status: 400 })
  }

  await prisma.scheduling.create({
    data: {
      name,
      email,
      date,
      observations,
      userId: user.id,
    },
  })

  return new NextResponse(null, { status: 201 })
}
