import { useEffect } from "react"
import { useRouter } from "next/router"

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    if (router.asPath === "/admin") router.push("/admin/users")
    else router.push(router.asPath)
  }, [router])
  return null
}
