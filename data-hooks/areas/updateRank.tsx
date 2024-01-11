/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { AreaDataTypes } from "./types"
import { useRouter } from "next/router"

type Update = {
  data: any[]
}

export const useUpdateRank = () => {
  const axios = useAxios()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation(
    async (data: Update) => {
      const updated = data.data.map((update, index) => ({
        areaId: update.id,
        rank: index + 1,
      }))

      return axios.put(`/areas/updateRanks`, updated)
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("areas")
      },
    }
  )
}
