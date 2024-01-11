import { useEffect } from "react"
import { useRouter } from "next/router"

export default function Home() {
  const router = useRouter()
  console.log(router.asPath);
  
  useEffect(() => {
    if (router.asPath === "/employee2/") router.push("/employee2/rentcaralldaydriver")
    else router.push(router.asPath)
  }, [router])
  return null
}
