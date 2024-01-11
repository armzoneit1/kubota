import { useMemo } from "react"
import Axios, { AxiosError } from "axios"
import { AxiosContext } from "../contexts/axios-context"
import { localStorageLoad } from "../utils/localStrorage"
import { useRouter } from "next/router"
import { authProvider } from "./auth-provider"

export default function AxiosProvider({
  children,
}: React.PropsWithChildren<unknown>) {
  const router = useRouter()

  const token =
    typeof window !== "undefined" ? localStorageLoad("token") : false

  const axios = useMemo(() => {
    const axios = Axios.create({
      baseURL: process.env.NEXT_PUBLIC_END_POINT,
      headers: { Accept: "application/json" },
    })

    axios.interceptors.request.use((config) => {
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        }
      }

      return config
    })

    axios.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status == 401 && authProvider.checkAuth()) {
          router.push("/login")
        }
        if (error.response && error.response?.data?.error?.message) {
          throw {
            message: error.response.data.error.message,
            status: error.response?.status,
            code: error.response?.data?.error?.code,
          }
        } else {
          throw `${error.response?.status} ${error.response?.statusText}`
        }
      }
    )

    return axios
  }, [token])

  return <AxiosContext.Provider value={axios}>{children}</AxiosContext.Provider>
}
