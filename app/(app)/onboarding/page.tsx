import { CreateOrgForm } from "@/features/organizations"

export default function OnboardingPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md">
        <div className="rounded-xl border bg-card p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Crea tu organización</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Las finanzas y transacciones se organizan dentro de una organización. Puedes invitar miembros después.
            </p>
          </div>
          <CreateOrgForm />
        </div>
      </div>
    </div>
  )
}
