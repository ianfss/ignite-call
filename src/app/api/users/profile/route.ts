import { type NextRequest, NextResponse } from 'next/server'
import z from 'zod'
import { auth } from '@/lib/auth/auth-config'
import { prisma } from '@/lib/prisma'

const updateProfileBodySchema = z.object({
  bio: z.string(),
})

export async function PUT(request: NextRequest) {
  const session = await auth()

  if (!session) {
    return Response.json(null, { status: 401 })
  }

  const result = await request.json()

  const { bio } = updateProfileBodySchema.parse(result)

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      bio,
    },
  })

  return new NextResponse(null, { status: 204 })
}
