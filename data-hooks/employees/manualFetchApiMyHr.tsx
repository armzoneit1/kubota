/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { useRouter } from "next/router"

export const useManualFetchApiMyHr = () => {
  const axios = useAxios()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation(async () => axios.post(`/admin/manualFetchApiMyHr`), {
    onSuccess: (data) => {
      if (data.data.error) {
        throw Error(data.data.error.message)
      } else if (!data.data.error) {
        queryClient.invalidateQueries("employees")
      }
    },
  })
}
