import { useEffect } from "react"
import { useRouter } from "next/router"

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    if (router.asPath === "/employee") router.push("/employee/requests")
    else router.push(router.asPath)
  }, [router])
  return null
}
