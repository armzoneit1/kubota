/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { useRouter } from "next/router"

export const useDeleteSupervisor = () => {
  const axios = useAxios()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation(async () => axios.delete(`/account/me/supervisor`), {
    onSuccess: (data) => {
      if (data.data.error) {
        throw Error(data.data.error.message)
      } else if (!data.data.error) {
        queryClient.invalidateQueries("me")
      }
    },
  })
}
