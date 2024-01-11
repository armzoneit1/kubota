import { useEffect } from "react"
import { useRouter } from "next/router"

const Index = () => {
  const router = useRouter()
  useEffect(() => {
    router.push("/admin/busLines/create/morning")
  }, [router])

  return null
}

export default Index
