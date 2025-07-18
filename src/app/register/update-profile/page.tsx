'use server'

import { Card, CardContent } from '@/components/ui/card'
import { Multistep } from '@/components/ui/multistep'
import { auth } from '@/lib/auth/auth-config'
import { UpdateProfileForm } from './update-profile-form'

export default async function UpdateProfile() {
  const session = await auth()

  return (
    <div className="mx-auto mt-20 max-w-[572px] py-4">
      <div className="space-y-6 px-6 ">
        <strong className="text-2xl">Quase lá</strong>
        <p className="text-neutral-200">
          Por último, uma breve descrição e uma foto de perfil.
        </p>
        <Multistep currentStep={4} size={4} />
      </div>
      <Card className="mt-6">
        <CardContent className="flex flex-col gap-4">
          <UpdateProfileForm {...session?.user} />
        </CardContent>
      </Card>
    </div>
  )
}
