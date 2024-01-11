/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"

export const useDelete = () => {
  const axios = useAxios()
  const queryClient = useQueryClient()

  return useMutation(async (id: number) => axios.delete(`/timeTables/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries("timeTables")
    },
  })
}
