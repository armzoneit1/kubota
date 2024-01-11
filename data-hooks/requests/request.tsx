/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { RequestDataTypes } from "./types"
import { useRouter } from "next/router"

export const useRequest = () => {
  const axios = useAxios()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation(
    async (data: RequestDataTypes) => axios.post("/requests", data),
    {
      onSuccess: (data) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        } else if (!data.data.error) {
          router.push("/employee/requests")
        }
      },
    }
  )
}
