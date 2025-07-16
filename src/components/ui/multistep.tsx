interface MultistepProps {
  size: number
  currentStep: number
}

function Multistep({ size, currentStep }: MultistepProps) {
  return (
    <div>
      <p className="text-neutral-300 text-sm">
        Passo {currentStep} de {size}
      </p>

      <div
        className="mt-2 grid gap-2"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {Array.from({ length: size }, (_, i) => i + 1).map((step) => {
          return (
            <div
              className={`h-1 rounded-xs ${
                currentStep >= step ? 'bg-neutral-100' : 'bg-neutral-600'
              }`}
              key={step}
            />
          )
        })}
      </div>
    </div>
  )
}

export { Multistep }
