import { Multistep } from '@/components/ui/multistep'
import { RegisterForm } from './register-form'

export default function Register() {
  return (
    <div className="mx-auto mt-20 max-w-[572px] py-4">
      <div className="space-y-6 px-6">
        <strong className="text-2xl">Bem-vindo ao Ignite Call!</strong>
        <p className="text-neutral-200">
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </p>
        <Multistep currentStep={1} size={4} />
      </div>
      <RegisterForm />
    </div>
  )
}
