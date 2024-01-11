/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { useRouter } from "next/router"

type Update = {
  scheduleId: number
  periodOfDay: "morning" | "evening"
  data: {
    timeTableId: number
  }
}

export const useUpdateTimeTable = () => {
  const axios = useAxios()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation(
    async (data: Update) =>
      axios.put(
        `/busArrangements/updateTimeTable/${data.scheduleId}/${data.periodOfDay}`,
        data.data
      ),
    {
      onSuccess: (data, variables) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        } else if (!data.data.error) {
          router.push(
            `/admin/plannings/${variables.scheduleId}/${variables.periodOfDay}`
          )
        }
      },
    }
  )
}
