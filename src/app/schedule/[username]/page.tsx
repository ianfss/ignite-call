import { User } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { prisma } from '@/lib/prisma'

interface Props {
  params: {
    username: string
  }
}

export const revalidate = 60 * 60 * 24 // 24 hours

export default async function Schedule({ params }: Props) {
  const { username } = params

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="mx-auto mt-20 mb-4 max-w-[852px]">
      <div className="flex flex-col items-center gap-2">
        <Avatar className="size-16">
          {/** biome-ignore lint/style/noNonNullAssertion: <> */}
          <AvatarImage alt={user.name} src={user.avatarUrl!} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-2xl">{user.name}</h1>
          <p className="text-muted-foreground">{user.bio}</p>
        </div>
      </div>
    </div>
  )
}
