import { useEffect } from "react"
import { useRouter } from "next/router"

const Index = () => {
  const router = useRouter()
  const id = router?.query?.providerId
  useEffect(() => {
    router.push(`/admin/transportationProviders/${id}/info`)
  }, [id])
  return <></>
}

export default Index
