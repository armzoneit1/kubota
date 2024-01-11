import { useEffect } from "react"
import { useRouter } from "next/router"

const Index = () => {
  const router = useRouter()
  const id = router?.query?.id
  useEffect(() => {
    router.push(`/admin/plannings/${id}/morning`)
  }, [id])
  return <></>
}

export default Index
