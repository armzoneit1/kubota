/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { useRouter } from "next/router"

type Copy = {
  day: "workday" | "saturdayWorkday" | "publicHoliday" | "other" | "weekend"
  currentYear: string
}

export const useCopy = () => {
  const axios = useAxios()
  const queryClient = useQueryClient()

  return useMutation(
    async (data: Copy) =>
      axios.put(
        `/schedules/copyFromPreviousYear/${data.currentYear}?dayType=${data.day}`
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("schedules")
      },
    }
  )
}
