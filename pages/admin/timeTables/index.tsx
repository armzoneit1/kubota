import { useEffect } from "react"
import { useRouter } from "next/router"

const Index = () => {
  const router = useRouter()
  useEffect(() => {
    router.push(`/admin/timeTables/morning`)
  }, [])
  return <></>
}

export default Index
