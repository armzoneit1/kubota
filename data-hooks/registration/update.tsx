/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { UpdateDataTypes } from "./types"
import { useRouter } from "next/router"

export const useUpdate = () => {
  const axios = useAxios()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation(
    async (data: UpdateDataTypes) => axios.put("/bookingBusAccount/me", data),
    {
      onSuccess: (data) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        } else if (!data.data.error) {
          setTimeout(() => {
            queryClient.invalidateQueries("me_routeGuard", {
              refetchActive: true,
            })
            queryClient.invalidateQueries("me")
          }, 800)
        }
      },
    }
  )
}
