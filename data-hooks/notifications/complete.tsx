/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { useRouter } from "next/router"

export type UpdateDataType = {
  status: boolean
}

type Update = {
  notificationId: number
}

export const useUpdate = () => {
  const axios = useAxios()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation(
    async (data: Update) => axios.put(`/notifications/${data.notificationId}`),
    {
      onSuccess: (data) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        } else if (!data.data.error) {
          queryClient.invalidateQueries("notifications")
        }
      },
    }
  )
}
