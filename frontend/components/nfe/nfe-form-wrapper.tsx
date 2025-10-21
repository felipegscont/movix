"use client"

import { useRouter } from "next/navigation"
import { NfeForm } from "./nfe-form"
import { toast } from "sonner"

export function NfeFormWrapper() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/nfes")
  }

  return <NfeForm onSuccess={handleSuccess} />
}

