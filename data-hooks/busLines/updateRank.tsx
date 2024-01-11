/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"

type Update = {
  data: any[]
}

export const useUpdateRank = () => {
  const axios = useAxios()
  const queryClient = useQueryClient()

  return useMutation(
    async (data: Update) => {
      const updated = data.data.map((update, index) => ({
        busLineId: update.id,
        rank: index + 1,
      }))

      return axios.put(`/busLines/updateRanks`, updated)
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("busLines")
      },
    }
  )
}
