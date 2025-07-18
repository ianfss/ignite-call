import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const { username, name } = await request.json()

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (userExists) {
    return new NextResponse(null, { status: 409 })
  }

  const user = await prisma.user.create({
    data: {
      username,
      name,
    },
  })

  const cookieStore = await cookies()

  cookieStore.set('@ignitecall:userId', user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return new NextResponse(null, { status: 201 })
}
