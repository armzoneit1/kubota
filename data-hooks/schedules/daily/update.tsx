/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useMutation } from "react-query"
import { useRouter } from "next/router"

export type UpdateDataType = {
  detail: string | null
  timeTableMorningId: number
  timeTableEveningId: number
}

type Update = {
  id: number
  day: "workday" | "saturdayWorkday" | "publicHoliday" | "other" | "weekend"
  data: UpdateDataType
}

export const useUpdate = () => {
  const axios = useAxios()
  const router = useRouter()

  return useMutation(
    async (data: Update) =>
      axios.put(`/schedules/${data.day}/${data.id}`, data.data),
    {
      onSuccess: (data, update) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        } else if (!data.data.error) {
          router.push(`/admin/schedules/${update.day}`)
        }
      },
    }
  )
}
