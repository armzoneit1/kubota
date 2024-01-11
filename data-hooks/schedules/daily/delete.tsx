/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { useRouter } from "next/router"

type Delete = {
  scheduleIds: number[]
  day: "workday" | "saturdayWorkday" | "publicHoliday" | "other" | "weekend"
}

export const useDelete = () => {
  const axios = useAxios()
  const queryClient = useQueryClient()

  return useMutation(
    async (data: Delete) =>
      axios.delete(`/schedules/${data.day}`, {
        data: { scheduleIds: data.scheduleIds },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("schedules")
      },
    }
  )
}

export const useDeleteOne = () => {
  const axios = useAxios()
  const router = useRouter()

  return useMutation(
    async (data: Delete) =>
      axios.delete(`/schedules/${data.day}`, {
        data: { scheduleIds: data.scheduleIds },
      }),
    {
      onSuccess: (data, onDelete) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        } else if (!data.data.error) {
          router.push(`/admin/schedules/${onDelete?.day}`)
        }
      },
    }
  )
}
